"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password";
import { useAuth } from "@/lib/react-query";
import { SignIn, signInSchema } from "@/lib/validations";
import { useSignIn as useClerkSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function SignInForm() {
    const [isMounted, setIsMounted] = useState(false);
    const [needsVerification, setNeedsVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const { signIn, isLoaded } = useClerkSignIn();

    const form = useForm<SignIn>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { useSignIn } = useAuth();
    const { mutateAsync, isPending } = useSignIn();

    const onSubmit = async (values: SignIn) => {
        try {
            await mutateAsync(values);
            form.reset();
        } catch (error: any) {
            if (error?.message === "EMAIL_VERIFICATION_REQUIRED") {
                setNeedsVerification(true);
            }
        }
    };

    const handleVerificationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded || !signIn) return;

        try {
            const signInAttempt = await signIn.attemptFirstFactor({
                strategy: "email_code",
                code: verificationCode,
            });

            if (signInAttempt.status === "complete") {
                await (window as any).Clerk?.setActive({
                    session: signInAttempt.createdSessionId,
                });
                toast.success("Successfully signed in!");
                setNeedsVerification(false);
                form.reset();
                setVerificationCode("");
            }
        } catch (error: any) {
            toast.error(error?.errors?.[0]?.message || "Invalid code");
        }
    };

    // Prevent hydration mismatch by not rendering interactive elements until mounted
    if (!isMounted) {
        return (
            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="text-sm leading-none font-medium">
                            Email
                        </div>
                        <div className="h-10 w-full rounded-lg border border-input bg-background"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm leading-none font-medium">
                            Password
                        </div>
                        <div className="h-10 w-full rounded-lg border border-input bg-background"></div>
                    </div>
                </div>
                <div className="h-10 w-full rounded-lg bg-primary"></div>
                <div className="text-center text-sm">
                    <span className="text-muted-foreground">
                        Don&apos;t have an account?{" "}
                    </span>
                    <Link
                        href="/auth/signup"
                        className="font-medium text-primary hover:underline"
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        );
    }

    // Show verification form if email code is required
    if (needsVerification) {
        return (
            <div className="space-y-6">
                <div className="space-y-2 text-center">
                    <h3 className="text-xl font-semibold">Check your email</h3>
                    <p className="text-sm text-muted-foreground">
                        We sent a verification code to your email address
                    </p>
                </div>

                <form onSubmit={handleVerificationSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm leading-none font-medium">
                            Verification code
                        </label>
                        <Input
                            type="text"
                            placeholder="Enter 6-digit code"
                            className="h-11 text-center text-lg tracking-widest"
                            value={verificationCode}
                            onChange={(e) =>
                                setVerificationCode(e.target.value)
                            }
                            maxLength={6}
                            autoFocus
                        />
                    </div>

                    <Button type="submit" className="h-11 w-full text-base">
                        Verify & Sign in
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        className="h-11 w-full text-base"
                        onClick={() => {
                            setNeedsVerification(false);
                            setVerificationCode("");
                        }}
                    >
                        Back to sign in
                    </Button>
                </form>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email address</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        className="h-11"
                                        disabled={isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between">
                                    <FormLabel>Password</FormLabel>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <FormControl>
                                    <PasswordInput
                                        placeholder="Enter your password"
                                        className="h-11"
                                        disabled={isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    className="h-11 w-full text-base"
                    disabled={isPending}
                >
                    {isPending ? "Signing in..." : "Sign in"}
                </Button>

                <div className="text-center text-sm">
                    <span className="text-muted-foreground">
                        Don&apos;t have an account?{" "}
                    </span>
                    <Link
                        href="/auth/signup"
                        className="font-medium text-primary hover:underline"
                    >
                        Sign up
                    </Link>
                </div>
            </form>
        </Form>
    );
}
