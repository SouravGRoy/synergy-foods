"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/react-query/auth";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";

export function RoleDebugger() {
    const { user: clerkUser } = useUser();
    const queryClient = useQueryClient();
    const { useCurrentUser } = useAuth();

    const { data: userData, isLoading, error, refetch } = useCurrentUser();

    const handleRefresh = async () => {
        // Invalidate all user-related queries
        await queryClient.invalidateQueries({ queryKey: ["user"] });
        // Force refresh this specific query
        await refetch();
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>User Role Debug Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="text-sm font-medium">
                        Clerk User ID:
                    </label>
                    <p className="text-sm text-muted-foreground">
                        {clerkUser?.id || "Not loaded"}
                    </p>
                </div>

                <div>
                    <label className="text-sm font-medium">
                        API Loading State:
                    </label>
                    <Badge variant={isLoading ? "secondary" : "default"}>
                        {isLoading ? "Loading..." : "Loaded"}
                    </Badge>
                </div>

                {error && (
                    <div>
                        <label className="text-sm font-medium">
                            API Error:
                        </label>
                        <p className="text-sm text-red-600">{error.message}</p>
                    </div>
                )}

                <div>
                    <label className="text-sm font-medium">
                        Database User Role:
                    </label>
                    <Badge
                        variant={
                            userData?.role === "admin"
                                ? "default"
                                : userData?.role === "mod"
                                  ? "secondary"
                                  : userData?.role === "user"
                                    ? "outline"
                                    : "destructive"
                        }
                    >
                        {userData?.role || "Unknown"}
                    </Badge>
                </div>

                <div>
                    <label className="text-sm font-medium">User Email:</label>
                    <p className="text-sm text-muted-foreground">
                        {userData?.email || "Not available"}
                    </p>
                </div>

                <div>
                    <label className="text-sm font-medium">User Name:</label>
                    <p className="text-sm text-muted-foreground">
                        {userData?.firstName} {userData?.lastName}
                    </p>
                </div>

                <div>
                    <label className="text-sm font-medium">
                        Dashboard Access:
                    </label>
                    <Badge
                        variant={
                            userData?.role === "admin" ||
                            userData?.role === "mod"
                                ? "default"
                                : "destructive"
                        }
                    >
                        {userData?.role === "admin" || userData?.role === "mod"
                            ? "Allowed"
                            : "Denied"}
                    </Badge>
                </div>

                <Button
                    onClick={handleRefresh}
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                >
                    {isLoading ? "Refreshing..." : "Refresh User Data"}
                </Button>

                <details className="text-xs">
                    <summary className="cursor-pointer font-medium">
                        Raw API Response
                    </summary>
                    <pre className="mt-2 overflow-auto rounded bg-slate-100 p-2 text-xs">
                        {JSON.stringify(userData, null, 2)}
                    </pre>
                </details>
            </CardContent>
        </Card>
    );
}
