"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Bell, Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";

export function DashboardHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <header className="border-b border-slate-200/60 bg-white/95 px-6 py-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between">
                {/* Left side - Mobile menu button and search */}
                <div className="flex flex-1 items-center space-x-6">
                    {/* Mobile menu button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Search bar */}
                    <div className="relative max-w-lg flex-1">
                        <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                        <Input
                            placeholder="Search products, orders, customers..."
                            className="w-full border-slate-200 bg-slate-50/50 pr-4 pl-12 focus:bg-white focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Right side - Notifications and user menu */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="relative hover:bg-slate-100"
                            >
                                <Bell className="h-5 w-5 text-slate-600" />
                                {/* Notification badge */}
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 text-xs font-medium text-white shadow-lg">
                                    3
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-80 border-slate-200"
                        >
                            <DropdownMenuLabel className="text-slate-900">
                                Notifications
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-200" />
                            <DropdownMenuItem className="p-4 hover:bg-slate-50">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-semibold text-slate-900">
                                        New order received
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Order #1234 - $299.99
                                    </p>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="p-4 hover:bg-slate-50">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-semibold text-slate-900">
                                        Low stock alert
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        iPhone 15 Pro - 5 units left
                                    </p>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="p-4 hover:bg-slate-50">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-semibold text-slate-900">
                                        Customer inquiry
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        New message from John Doe
                                    </p>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User menu */}
                    {isMounted ? (
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox:
                                        "h-9 w-9 ring-2 ring-slate-200 hover:ring-blue-300 transition-all",
                                },
                            }}
                        />
                    ) : (
                        <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
                    )}
                </div>
            </div>
        </header>
    );
}
