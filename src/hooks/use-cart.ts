"use client";

import { CartItem } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// API functions
const fetchCartItems = async (userId: string): Promise<CartItem[]> => {
    const response = await fetch(`/api/carts?userId=${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch cart items');
    }
    const data = await response.json();
    return data.data || [];
};

const updateCartItem = async (itemId: string, quantity: number, userId: string) => {
    const response = await fetch('/api/carts', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId,
            productId: itemId, // This needs to be mapped correctly based on your API
            quantity,
        }),
    });
    
    if (!response.ok) {
        throw new Error('Failed to update cart item');
    }
    
    return response.json();
};

const removeCartItem = async (itemId: string, userId: string) => {
    const response = await fetch('/api/carts', {
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
        throw new Error('Failed to remove cart item');
    }
    
    return response.json();
};

const moveToWishlist = async (itemId: string, userId: string, productId: string) => {
    const response = await fetch('/api/carts', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId,
            productId,
            action: 'moveToWishlist',
        }),
    });
    
    if (!response.ok) {
        throw new Error('Failed to move item to wishlist');
    }
    
    return response.json();
};

// Custom hook for cart management
export function useCart() {
    const { userId } = useAuth();
    const queryClient = useQueryClient();

    // Fetch cart items
    const {
        data: items = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ['cart', userId],
        queryFn: () => fetchCartItems(userId!),
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Update quantity mutation
    const updateQuantityMutation = useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
            updateCartItem(itemId, quantity, userId!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart', userId] });
        },
        onError: (error) => {
            toast.error('Failed to update cart item');
            console.error('Update cart error:', error);
        },
    });

    // Remove item mutation
    const removeItemMutation = useMutation({
        mutationFn: (itemId: string) => removeCartItem(itemId, userId!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart', userId] });
        },
        onError: (error) => {
            toast.error('Failed to remove item from cart');
            console.error('Remove cart item error:', error);
        },
    });

    // Move to wishlist mutation
    const moveToWishlistMutation = useMutation({
        mutationFn: ({ itemId, productId }: { itemId: string; productId: string }) =>
            moveToWishlist(itemId, userId!, productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart', userId] });
            queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
        },
        onError: (error) => {
            toast.error('Failed to move item to wishlist');
            console.error('Move to wishlist error:', error);
        },
    });

    // Calculated values
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => {
        const price = item.variant?.price || item.product.price;
        return total + ((price ?? 0) * item.quantity);
    }, 0);

    return {
        items,
        itemCount,
        subtotal,
        isLoading,
        error,
        updateQuantity: updateQuantityMutation.mutateAsync,
        removeItem: removeItemMutation.mutateAsync,
        moveToWishlist: moveToWishlistMutation.mutateAsync,
        isUpdating: updateQuantityMutation.isPending || 
                   removeItemMutation.isPending || 
                   moveToWishlistMutation.isPending,
    };
}
