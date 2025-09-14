"use client";

import { WishlistItem } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// API functions
const fetchWishlistItems = async (userId: string): Promise<WishlistItem[]> => {
    const response = await fetch(`/api/wishlists?userId=${userId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch wishlist items");
    }
    const data = await response.json();
    return data.data || [];
};

const removeWishlistItem = async (itemId: string, userId: string) => {
    const response = await fetch('/api/wishlists', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId,
            ids: [itemId],
        }),
    });
    
    if (!response.ok) {
        throw new Error('Failed to remove wishlist item');
    }
    
    return response.json();
};

const moveToCart = async (itemId: string, userId: string, productId: string) => {
    const response = await fetch('/api/wishlists', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId,
            productId,
            quantity: 1, // Default quantity when moving to cart
            action: 'moveToCart',
        }),
    });
    
    if (!response.ok) {
        throw new Error('Failed to move item to cart');
    }
    
    return response.json();
};

// Custom hook for wishlist management
export function useWishlist() {
    const { userId } = useAuth();
    const queryClient = useQueryClient();

    // Fetch wishlist items
    const {
        data: items = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ['wishlist', userId],
        queryFn: () => fetchWishlistItems(userId!),
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Remove item mutation
    const removeItemMutation = useMutation({
        mutationFn: (itemId: string) => removeWishlistItem(itemId, userId!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
        },
        onError: (error) => {
            toast.error('Failed to remove item from wishlist');
            console.error('Remove wishlist item error:', error);
        },
    });

    // Move to cart mutation
    const moveToCartMutation = useMutation({
        mutationFn: ({ itemId, productId }: { itemId: string; productId: string }) =>
            moveToCart(itemId, userId!, productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
            queryClient.invalidateQueries({ queryKey: ['cart', userId] });
        },
        onError: (error) => {
            toast.error('Failed to move item to cart');
            console.error('Move to cart error:', error);
        },
    });

    return {
        items,
        itemCount: items.length,
        isLoading,
        error,
        removeItem: removeItemMutation.mutateAsync,
        moveToCart: moveToCartMutation.mutateAsync,
        isUpdating: removeItemMutation.isPending || moveToCartMutation.isPending,
    };
}
