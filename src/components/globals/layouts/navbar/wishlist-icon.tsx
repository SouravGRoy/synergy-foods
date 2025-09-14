"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import Link from "next/link";

export function WishlistIcon() {
    const { itemCount, isLoading } = useWishlist();

    return (
        <Button variant="link" size="icon" className="relative p-0" asChild>
            <Link href="/wishlist">
                <Icons.Heart className="h-4 w-4 text-current transition-colors hover:text-green-400 md:h-5 md:w-5" />
                {!isLoading && itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground md:h-5 md:w-5">
                        {itemCount > 99 ? "99+" : itemCount}
                    </span>
                )}
                <span className="sr-only">Wishlist</span>
            </Link>
        </Button>
    );
}
