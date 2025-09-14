"use client";

import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/lib/react-query";
import { useNavbarStore } from "@/lib/store";
import { cn, convertValueToLabel } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { CategoryMobileNavigation } from "./category-mobile-navigation";

export function NavbarMob({ className, ...props }: GenericProps) {
    const isMenuOpen = useNavbarStore((state) => state.isOpen);
    const setIsMenuOpen = useNavbarStore((state) => state.setIsOpen);

    const navContainerRef = useRef<HTMLDivElement | null>(null);
    const navListRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (typeof document === "undefined") return;

        if (isMenuOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }, [isMenuOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                navContainerRef.current?.contains(event.target as Node) &&
                !navListRef.current?.contains(event.target as Node)
            )
                setIsMenuOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setIsMenuOpen]);

    const { useCurrentUser, useLogout } = useAuth();
    const { data: user } = useCurrentUser();
    const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();

    return (
        <div
            aria-label="Mobile Menu"
            data-menu-open={isMenuOpen}
            className={cn(
                "fixed inset-x-0 z-50",
                "overflow-hidden p-4",
                "transition-all duration-300 ease-in-out",
                "h-0 data-[menu-open=true]:h-screen",
                "top-0 opacity-0 data-[menu-open=true]:opacity-100",
                "pointer-events-none data-[menu-open=true]:pointer-events-auto",
                "md:hidden",
                className
            )}
            ref={navContainerRef}
            {...props}
        >
            <div
                className="relative mt-20 h-full max-h-[calc(100vh-6rem)] scale-95 transform space-y-4 overflow-y-auto rounded-2xl bg-card p-4 py-6 drop-shadow-md backdrop-blur-sm transition-transform duration-300 ease-in-out data-[menu-open=true]:scale-100"
                ref={navListRef}
                data-menu-open={isMenuOpen}
            >
                {!!user && (
                    <>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="size-9">
                                    <AvatarImage
                                        src={user.avatarUrl || ""}
                                        alt={user.firstName || "User"}
                                    />
                                    <AvatarFallback>
                                        {user.firstName?.[0] ||
                                            user.email?.[0] ||
                                            "U"}
                                    </AvatarFallback>
                                </Avatar>

                                <p className="text-sm">
                                    {user.firstName || user.email}{" "}
                                    {user.lastName || ""}
                                </p>
                            </div>

                            <Button
                                size="icon"
                                variant="ghost"
                                disabled={isLoggingOut}
                                onClick={() => logout()}
                            >
                                <Icons.LogOut />
                                <span className="sr-only">Logout</span>
                            </Button>
                        </div>

                        <Separator className="bg-foreground/20" />

                        <div
                            className="flex items-center gap-2 overflow-scroll"
                            style={{
                                scrollbarWidth: "none",
                            }}
                        >
                            {["profile", "dashboard"].map((x, i) => (
                                <Link
                                    key={i}
                                    href={`/${x}`}
                                    className="flex items-center gap-0.5 rounded-full border bg-muted px-3 py-1 text-sm"
                                >
                                    {convertValueToLabel(x)}
                                    <Icons.ChevronRight className="size-4" />
                                </Link>
                            ))}
                        </div>

                        <Separator className="bg-foreground/20" />
                    </>
                )}

                <ul>
                    <CategoryMobileNavigation
                        onLinkClick={() => setIsMenuOpen(false)}
                    />

                    {siteConfig.menu
                        .filter((item) => item.name !== "Shop") // Remove static Shop link since we have CategoryMobileNavigation
                        .map((item, index, filteredArr) => {
                            const Icon = Icons[item.icon];

                            return (
                                <li key={index} aria-label="Mobile Menu Item">
                                    <Link
                                        href={item.href}
                                        className="flex items-center justify-between gap-2 text-foreground"
                                        target={
                                            item.isExternal ? "_blank" : "_self"
                                        }
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span>{item.name}</span>
                                        <Icon className="size-5" />
                                    </Link>

                                    {(user
                                        ? index !== filteredArr.length - 1
                                        : true) && (
                                        <div className="py-4">
                                            <Separator />
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                </ul>

                {user ? (
                    <></>
                ) : (
                    <Button
                        className="w-full bg-foreground text-sm shadow-[inset_1px_1px_10px_2px_rgba(0,0,0,0.2),inset_2px_0_0_0_rgba(255,255,255,0.2)]"
                        asChild
                    >
                        <Link href="/auth/signin">Login</Link>
                    </Button>
                )}
            </div>
        </div>
    );
}
