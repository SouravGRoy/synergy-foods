"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export function RoleChangeDetector() {
    const { signOut } = useAuth();
    const [showForceRefresh, setShowForceRefresh] = useState(false);

    useEffect(() => {
        // Check if there's a role change flag in localStorage
        const roleChangeFlag = localStorage.getItem("role-changed");
        if (roleChangeFlag) {
            setShowForceRefresh(true);
        }
    }, []);

    const handleForceLogout = async () => {
        try {
            // Clear all local storage
            localStorage.clear();
            // Sign out the user
            await signOut();
            // Redirect to home
            window.location.href = "/";
        } catch (error) {
            console.error("Force logout error:", error);
            // Fallback: hard refresh
            window.location.reload();
        }
    };

    const handleRefresh = () => {
        // Clear the flag and hard refresh
        localStorage.removeItem("role-changed");
        window.location.reload();
    };

    if (!showForceRefresh) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-600">
                        <AlertTriangle className="size-5" />
                        Access Rights Changed
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Your account access rights have been updated by an
                        administrator. You need to refresh your session to see
                        the changes.
                    </p>

                    <div className="flex gap-2">
                        <Button
                            onClick={handleRefresh}
                            variant="outline"
                            className="flex-1"
                        >
                            <RefreshCw className="mr-2 size-4" />
                            Refresh Page
                        </Button>

                        <Button onClick={handleForceLogout} className="flex-1">
                            Logout & Re-login
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
