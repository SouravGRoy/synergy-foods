"use client";

import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/lib/react-query";
import { useNavbarStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CartIcon } from "./cart-icon";
import { CategoryNavigation } from "./category-navigation";
import { WishlistIcon } from "./wishlist-icon";

export function NavbarHome() {
    const pathname = usePathname();
    const [isMenuHidden, setIsMenuHidden] = useState(false);

    const isMenuOpen = useNavbarStore((s) => s.isOpen);
    const setIsMenuOpen = useNavbarStore((s) => s.setIsOpen);

    const { scrollY } = useScroll();
    useMotionValueEvent(scrollY, "change", (latest) => {
        const prev = scrollY.getPrevious() ?? 0;
        setIsMenuHidden(latest > prev && latest > 150);
    });

    const { useCurrentUser, useLogout } = useAuth();
    const { data: user } = useCurrentUser();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();

    const linkCls = (href: string) =>
        cn(
            "px-3 py-2 text-[15px] font-semibold transition-colors",
            pathname === href
                ? "text-green-600"
                : "text-black hover:text-green-700"
        );

    return (
        <motion.header
            variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
            animate={isMenuHidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="sticky inset-x-0 top-0 z-50 bg-white shadow-sm"
            data-menu-open={isMenuOpen}
        >
            <nav
                className={cn(
                    // Responsive grid layout
                    "mx-auto flex w-full max-w-[1380px] items-center justify-between gap-3 px-4 py-4 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4 md:px-6 md:py-3",
                    isMenuOpen && "border-b"
                )}
            >
                {/* LEFT: LOGO */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/kiweM.png"
                            alt={siteConfig.name}
                            width={120}
                            height={120}
                            className="h-12 w-[100px] sm:h-14 sm:w-[120px] md:h-16 md:w-[140px]"
                        />
                    </Link>
                </div>

                {/* CENTER: LINKS (Desktop only) */}
                <ul className="hidden items-center justify-center gap-5 md:flex">
                    {/* Home */}
                    <li>
                        <Link href="/" className={linkCls("/")}>
                            Home
                        </Link>
                    </li>

                    {/* Shop via CategoryNavigation (kept) */}
                    <li className="relative">
                        <CategoryNavigation />
                    </li>
                    <li>
                        <Link
                            className="text-15px px-2 font-semibold text-black hover:text-green-700"
                            href="/shop"
                        >
                            Shop
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="text-15px px-2 font-semibold text-black hover:text-green-700"
                            href="/blog"
                        >
                            Blog
                        </Link>
                    </li>
                    {/* Other menu items except 'Shop' to avoid duplication */}
                    {siteConfig.menu
                        .filter((item) => item.name !== "Shop")
                        .map((item) => (
                            <li key={item.href}>
                                <Link
                                    className={linkCls(item.href)}
                                    href={item.href}
                                    target={
                                        item.isExternal ? "_blank" : undefined
                                    }
                                    referrerPolicy={
                                        item.isExternal
                                            ? "no-referrer"
                                            : undefined
                                    }
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                </ul>

                {/* RIGHT: ACTION ICONS */}
                <div className="flex items-center gap-3 md:ml-auto md:gap-4">
                    {/* Search (Hidden on mobile) */}
                    <button
                        aria-label="Search"
                        className="hidden h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 md:inline-flex md:h-12 md:w-12"
                    >
                        <Icons.Search className="h-4 w-4 md:h-5 md:w-5" />
                    </button>

                    {/* Account (Desktop only) */}
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="hidden h-8 w-8 items-center justify-center rounded-full bg-teal-50 hover:bg-teal-100 md:inline-flex md:h-12 md:w-12">
                                    <Avatar className="h-6 w-6 md:h-8 md:w-8">
                                        <AvatarImage
                                            src={user.avatarUrl ?? ""}
                                            alt={user.firstName}
                                        />
                                        <AvatarFallback>
                                            {user.firstName?.[0] ?? "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="min-w-56"
                            >
                                <DropdownMenuLabel className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={user.avatarUrl ?? ""}
                                            alt={user.firstName}
                                        />
                                        <AvatarFallback>
                                            {user.firstName?.[0] ?? "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>
                                        Hello,{" "}
                                        <span className="font-semibold">
                                            {user.firstName}
                                        </span>
                                    </span>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    {user.role !== "user" && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard">
                                                <Icons.LayoutDashboard className="h-4 w-4" />
                                                <span>Dashboard</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem asChild>
                                        <Link href="/account">
                                            <Icons.User className="h-4 w-4" />
                                            <span>My Account</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">
                                            <Icons.User2 className="h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/contact">
                                            <Icons.LifeBuoy className="h-4 w-4" />
                                            <span>Contact Us</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    disabled={isLoggingOut}
                                    onClick={() => logout()}
                                >
                                    <Icons.LogOut className="h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link
                            href="/auth/signin"
                            className="hidden h-8 w-8 items-center justify-center rounded-full bg-teal-50 hover:bg-teal-100 md:inline-flex md:h-11 md:w-11"
                            aria-label="Login"
                        >
                            <Icons.User className="h-4 w-4 md:h-5 md:w-5" />
                        </Link>
                    )}

                    {/* Wishlist */}
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 hover:bg-yellow-200 md:h-12 md:w-12">
                        <WishlistIcon />
                    </div>

                    {/* Cart */}
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 hover:bg-orange-200 md:h-12 md:w-12">
                        <CartIcon />
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        aria-label="Mobile Menu"
                        aria-pressed={isMenuOpen}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <Icons.X className="h-5 w-5" />
                        ) : (
                            <Icons.Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="border-t bg-white md:hidden">
                    <div className="mx-auto max-w-[1380px] px-4 py-4">
                        {/* Mobile Search */}
                        <div className="mb-4">
                            <button
                                aria-label="Search"
                                className="flex w-full items-center gap-3 rounded-lg bg-gray-50 p-3 text-left hover:bg-gray-100"
                            >
                                <Icons.Search className="h-5 w-5 text-gray-500" />
                                <span className="text-gray-500">
                                    Search products...
                                </span>
                            </button>
                        </div>

                        {/* Mobile Navigation Links */}
                        <div className="space-y-2">
                            <Link
                                href="/"
                                className={cn(
                                    "block rounded-lg px-3 py-2 text-base font-medium transition-colors",
                                    pathname === "/"
                                        ? "bg-green-50 text-green-600"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                                )}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/shop"
                                className={cn(
                                    "block rounded-lg px-3 py-2 text-base font-medium transition-colors",
                                    pathname === "/shop"
                                        ? "bg-green-50 text-green-600"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                                )}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Shop
                            </Link>
                            <Link
                                href="/blog"
                                className={cn(
                                    "block rounded-lg px-3 py-2 text-base font-medium transition-colors",
                                    pathname === "/blog"
                                        ? "bg-green-50 text-green-600"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                                )}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Blog
                            </Link>
                            {siteConfig.menu
                                .filter((item) => item.name !== "Shop")
                                .map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "block rounded-lg px-3 py-2 text-base font-medium transition-colors",
                                            pathname === item.href
                                                ? "bg-green-50 text-green-600"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                                        )}
                                        target={
                                            item.isExternal
                                                ? "_blank"
                                                : undefined
                                        }
                                        referrerPolicy={
                                            item.isExternal
                                                ? "no-referrer"
                                                : undefined
                                        }
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                        </div>

                        {/* Mobile User Section */}
                        {user ? (
                            <div className="mt-4 space-y-2 border-t pt-4">
                                <div className="flex items-center gap-3 px-3 py-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={user.avatarUrl ?? ""}
                                            alt={user.firstName}
                                        />
                                        <AvatarFallback>
                                            {user.firstName?.[0] ?? "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                                {user.role !== "user" && (
                                    <Link
                                        href="/dashboard"
                                        className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <Link
                                    href="/account"
                                    className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Account
                                </Link>
                                <button
                                    className="block w-full rounded-lg px-3 py-2 text-left text-base font-medium text-red-600 hover:bg-red-50"
                                    onClick={() => {
                                        logout();
                                        setIsMenuOpen(false);
                                    }}
                                    disabled={isLoggingOut}
                                >
                                    {isLoggingOut
                                        ? "Logging out..."
                                        : "Sign out"}
                                </button>
                            </div>
                        ) : (
                            <div className="mt-4 border-t pt-4">
                                <Link
                                    href="/auth/signin"
                                    className="block w-full rounded-lg bg-green-600 px-4 py-3 text-center text-base font-medium text-white hover:bg-green-700"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </motion.header>
    );
}
