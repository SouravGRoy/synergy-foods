"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/react-query/auth";
import { useUser } from "@clerk/nextjs";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: ("user" | "mod" | "admin")[];
    fallbackPath?: string;
    loadingMessage?: string;
}

export function RoleGuard({
    children,
    allowedRoles,
    fallbackPath = "/",
    loadingMessage = "Verifying permissions...",
}: RoleGuardProps) {
    const { user: clerkUser, isLoaded } = useUser();
    const router = useRouter();
    const { useCurrentUser } = useAuth();

    const { data: userData, isLoading, error, refetch } = useCurrentUser();

    const userRole = userData?.role;

    // Listen for role change events (only when necessary)
    useEffect(() => {
        const handleRoleChange = () => {
            refetch();
        };

        // Check for role change flag on mount
        if (localStorage.getItem("role-changed")) {
            localStorage.removeItem("role-changed");
            refetch();
        }

        // Listen for localStorage changes (only for role updates)
        window.addEventListener("storage", handleRoleChange);
        return () => window.removeEventListener("storage", handleRoleChange);
    }, [refetch]);

    useEffect(() => {
        // If Clerk is loaded and user is not authenticated, redirect to sign in
        if (isLoaded && !clerkUser) {
            router.push("/auth/signin");
            return;
        }

        // If we have user data and role is not allowed, redirect
        if (userData && userRole && !allowedRoles.includes(userRole)) {
            router.push(fallbackPath);
            return;
        }
    }, [
        isLoaded,
        clerkUser,
        userData,
        userRole,
        allowedRoles,
        fallbackPath,
        router,
    ]);

    // Still loading Clerk or user data
    if (!isLoaded || isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center">Loading</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-4 flex-1" />
                        </div>
                        <Skeleton className="h-4 w-3/4" />
                        <p className="text-center text-sm text-muted-foreground">
                            {loadingMessage}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Error loading user data
    if (error) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-red-600">
                            Access Error
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                        <p className="text-sm">
                            Unable to verify your permissions. Please try
                            refreshing the page.
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Error: {error.message}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // User not authenticated
    if (!clerkUser) {
        return null; // This will redirect via useEffect
    }

    // User role not allowed
    if (userRole && !allowedRoles.includes(userRole)) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-orange-600">
                            Access Denied
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-orange-500" />
                        <p className="text-sm">
                            You don't have permission to access this area.
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Current role:{" "}
                            <span className="font-mono">{userRole}</span>
                            <br />
                            Required roles:{" "}
                            <span className="font-mono">
                                {allowedRoles.join(", ")}
                            </span>
                        </p>
                        <button
                            onClick={() => {
                                localStorage.removeItem("role-changed");
                                refetch();
                            }}
                            className="rounded bg-blue-600 px-4 py-2 text-sm text-white"
                        >
                            Refresh Permissions
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="ml-2 rounded bg-gray-600 px-4 py-2 text-sm text-white"
                        >
                            Hard Refresh
                        </button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // User has required role, render children
    return <>{children}</>;
}
