"use client";

import { ERROR_MESSAGES } from "@/config/const";
import { siteConfig } from "@/config/site";
import {
    useAuth as useClerkAuth,
    useSignIn as useClerkSignIn,
    useSignUp as useClerkSignUp,
} from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { axios } from "../axios";
import { handleClientError, wait } from "../utils";
import { CachedUser, ResponseData, SignIn, SignUp } from "../validations";

// Global cache to prevent multiple API calls
const globalUserCache: { [userId: string]: CachedUser } = {};
const globalUserPromises: { [userId: string]: Promise<CachedUser> } = {};

export function useAuth() {
    const router = useRouter();

    const { isLoaded: isSignUpLoaded, signUp } = useClerkSignUp();
    const { isLoaded: isSignInLoaded, signIn, setActive } = useClerkSignIn();

    const useCurrentUser = ({
        initialData,
    }: { initialData?: CachedUser } = {}) => {
        const { userId } = useClerkAuth();
        return useQuery({
            queryKey: ["user", userId], // Use same pattern as other components
            queryFn: async () => {
                if (!userId) throw new Error("No user ID");
                
                // Return cached data immediately if available
                if (globalUserCache[userId]) {
                    console.log("🔍 RETURNING CACHED USER DATA - UserId:", userId);
                    return globalUserCache[userId];
                }
                
                // If there's already a pending request, wait for it
                if (userId in globalUserPromises) {
                    console.log("🔍 WAITING FOR EXISTING REQUEST - UserId:", userId);
                    return globalUserPromises[userId];
                }
                
                console.log("🔍 MAKING NEW API REQUEST - UserId:", userId, "Stack:", new Error().stack?.split('\n')[2]);
                
                // Create and cache the promise
                globalUserPromises[userId] = (async () => {
                    try {
                        const response = await axios.get<ResponseData<CachedUser>>("/api/users/me");
                        if (!response.data.success)
                            throw new Error(response.data.longMessage);
                        if (!response.data.data)
                            throw new Error(ERROR_MESSAGES.NOT_FOUND);
                        
                        // Cache the result
                        globalUserCache[userId] = response.data.data;
                        return response.data.data;
                    } finally {
                        // Clean up the promise
                        delete globalUserPromises[userId];
                    }
                })();
                
                return globalUserPromises[userId];
            },
            initialData: initialData || (userId ? globalUserCache[userId] : undefined),
            initialDataUpdatedAt: (initialData || (userId && globalUserCache[userId])) ? Date.now() : undefined,
            enabled: !!userId, // Only run when userId is available
            staleTime: Infinity, // Never consider data stale - only refetch manually
            gcTime: 1000 * 60 * 60, // 1 hour cache time
            refetchOnWindowFocus: false, // Don't refetch on every focus
            refetchInterval: false, // No automatic polling
            refetchOnMount: false, // Don't always refetch on mount
            refetchOnReconnect: false, // Don't refetch on network reconnect
            retry: false, // Don't retry failed requests automatically
            networkMode: 'always', // Always use cache when available
        });
    };

    const useSignUp = () => {
        return useMutation({
            onMutate: () => {
                const toastId = toast.loading("Creating your account...");
                return { toastId };
            },
            mutationFn: async (values: SignUp) => {
                if (!isSignUpLoaded) throw new Error(ERROR_MESSAGES.GENERIC);

                await signUp.create({
                    emailAddress: values.email,
                    password: values.password,
                    firstName: values.firstName,
                    lastName: values.lastName,
                });

                await signUp.prepareEmailAddressVerification({
                    strategy: "email_code",
                });
            },
            onSuccess: (_, __, { toastId }) => {
                toast.success("Account created, please verify your email", {
                    id: toastId,
                });
                router.push("/auth/verify");
            },
            onError: (err, __, ctx) => {
                return isClerkAPIResponseError(err)
                    ? toast.error(err.errors.map((e) => e.message).join(", "), {
                          id: ctx?.toastId,
                      })
                    : handleClientError(err, ctx?.toastId);
            },
        });
    };

    const useSignIn = () => {
        return useMutation({
            onMutate: () => {
                const toastId = toast.loading("Signing in...");
                return { toastId };
            },
            mutationFn: async (values: SignIn) => {
                if (!isSignInLoaded) throw new Error(ERROR_MESSAGES.GENERIC);

                const signInAttempt = await signIn.create({
                    identifier: values.email,
                    password: values.password,
                });

                // Handle different sign-in statuses
                if (signInAttempt.status === "complete") {
                    return { signInAttempt };
                }

                // If needs first factor (email verification, 2FA, etc.)
                if (signInAttempt.status === "needs_first_factor") {
                    // Attempt to complete with email code strategy if available
                    const emailCodeFactor = signInAttempt.supportedFirstFactors?.find(
                        (factor) => factor.strategy === "email_code"
                    );
                    
                    if (emailCodeFactor && "emailAddressId" in emailCodeFactor) {
                        await signInAttempt.prepareFirstFactor({
                            strategy: "email_code",
                            emailAddressId: emailCodeFactor.emailAddressId,
                        });
                        toast.info("Verification code sent to your email");
                        throw new Error("EMAIL_VERIFICATION_REQUIRED");
                    }
                }

                // If needs second factor (2FA)
                if (signInAttempt.status === "needs_second_factor") {
                    toast.info("Two-factor authentication required");
                    throw new Error("2FA_REQUIRED");
                }

                throw new Error("Unable to complete sign in. Please try again.");
            },
            onSuccess: async ({ signInAttempt }, _, { toastId }) => {
                await setActive?.({
                    session: signInAttempt.createdSessionId,
                });
                toast.success("Welcome back!", {
                    id: toastId,
                });
                router.push("/");
            },
            onError: (err, __, ctx) => {
                return isClerkAPIResponseError(err)
                    ? toast.error(err.errors.map((e) => e.message).join(", "), {
                          id: ctx?.toastId,
                      })
                    : handleClientError(err, ctx?.toastId);
            },
        });
    };

    const useEmailVerify = () => {
        const { isLoaded, signUp, setActive } = useClerkSignUp();

        return useMutation({
            onMutate: () => {
                const toastId = toast.loading("Verifying your email...");
                return { toastId };
            },
            mutationFn: async (values: { otp: string }) => {
                if (!isLoaded) throw new Error(ERROR_MESSAGES.GENERIC);

                const signUpAttempt =
                    await signUp.attemptEmailAddressVerification({
                        code: values.otp,
                    });

                if (signUpAttempt.status !== "complete")
                    throw new Error(
                        "Missing requirements or verification aborted"
                    );

                return { signUpAttempt };
            },
            onSuccess: async ({ signUpAttempt }, _, { toastId }) => {
                await setActive?.({
                    session: signUpAttempt.createdSessionId,
                });
                toast.success(
                    `Hey ${signUpAttempt.firstName}, Welcome to ${siteConfig.name}!`,
                    { id: toastId }
                );
                router.push("/");
            },
            onError: (err, __, ctx) => {
                return isClerkAPIResponseError(err)
                    ? toast.error(err.errors.map((e) => e.message).join(", "), {
                          id: ctx?.toastId,
                      })
                    : handleClientError(err, ctx?.toastId);
            },
        });
    };

    const useLogout = () => {
        const { signOut } = useClerkAuth();

        return useMutation({
            onMutate: () => {
                const toastId = toast.loading("Signing out...");
                return { toastId };
            },
            mutationFn: async () => {
                await signOut({
                    redirectUrl: "/",
                });
            },
            onSuccess: async (_, __, { toastId }) => {
                toast.success("See you soon!", { id: toastId });
                await wait(500);
                window.location.reload();
            },
            onError: (err, __, ctx) => {
                return isClerkAPIResponseError(err)
                    ? toast.error(err.errors.map((e) => e.message).join(", "), {
                          id: ctx?.toastId,
                      })
                    : handleClientError(err, ctx?.toastId);
            },
        });
    };

    return {
        useCurrentUser,
        useSignUp,
        useSignIn,
        useEmailVerify,
        useLogout,
    };
}
