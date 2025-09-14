"use client";

import { RoleChangeDetector } from "@/components/auth/role-change-detector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useState } from "react";

export function ClientProvider({ children }: LayoutProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5, // 5 minutes default
                        gcTime: 1000 * 60 * 10, // 10 minutes cache
                        refetchOnWindowFocus: false, // Don't refetch on window focus
                        refetchOnMount: false, // Don't always refetch on mount
                        refetchInterval: false, // No automatic polling
                        retry: 1, // Only retry once on failure
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <NuqsAdapter>
                <NextThemesProvider attribute="class" defaultTheme="light">
                    {children}
                    <RoleChangeDetector />
                </NextThemesProvider>
            </NuqsAdapter>

            <ReactQueryDevtools />
        </QueryClientProvider>
    );
}
