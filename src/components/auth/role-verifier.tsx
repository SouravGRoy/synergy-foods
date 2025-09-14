"use client";

import { useAuth } from "@/lib/react-query/auth";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

interface UserData {
    id: string;
    role: "user" | "admin" | "mod";
    firstName: string;
    lastName: string;
    email: string;
}

export function RoleVerifier({
    requiredRoles,
    redirectTo = "/",
    children,
}: {
    requiredRoles: ("user" | "admin" | "mod")[];
    redirectTo?: string;
    children: React.ReactNode;
}) {
    const { user: clerkUser } = useUser();
    const router = useRouter();
    const { useCurrentUser } = useAuth();

    // Use centralized user hook
    const { data: userData, isLoading, error } = useCurrentUser();

    useEffect(() => {
        if (!isLoading && userData && !requiredRoles.includes(userData.role)) {
            toast.error(
                `Access denied. This page requires ${requiredRoles.join(" or ")} role. You have ${userData.role} role.`
            );
            router.push(redirectTo);
        }
    }, [userData, isLoading, requiredRoles, router, redirectTo]);

    // Show loading while checking
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">
                        Error verifying access permissions
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Don't render children if user doesn't have required role
    if (!userData || !requiredRoles.includes(userData.role)) {
        return null;
    }

    return <>{children}</>;
}
