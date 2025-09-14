"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { axios } from "../axios";
import { handleClientError } from "../utils";
import {
    CreateProduct,
    FullProduct,
    Product,
    ResponseData,
    UpdateProduct,
} from "../validations";

export function useProduct() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const usePaginate = <
        T extends {
            data: FullProduct[];
            items: number;
            pages: number;
        },
    >(input: {
        limit?: number;
        page?: number;
        search?: string;
        minPrice?: number;
        maxPrice?: number;
        categoryId?: string;
        subcategoryId?: string;
        productTypeId?: string;
        isActive?: boolean;
        isAvailable?: boolean;
        isPublished?: boolean;
        isDeleted?: boolean;
        verificationStatus?: Product["verificationStatus"];
        sortBy?: "price" | "createdAt";
        sortOrder?: "asc" | "desc";
        initialData?: T;
        enabled?: boolean;
    }) => {
        const {
            limit,
            page,
            search,
            minPrice,
            maxPrice,
            categoryId,
            subcategoryId,
            productTypeId,
            isActive,
            isAvailable,
            isPublished,
            isDeleted,
            verificationStatus,
            sortBy,
            sortOrder,
            ...rest
        } = input;

        return useQuery({
            queryKey: [
                "products",
                limit,
                page,
                search,
                minPrice,
                maxPrice,
                categoryId,
                subcategoryId,
                productTypeId,
                isActive,
                isAvailable,
                isPublished,
                isDeleted,
                verificationStatus,
                sortBy,
                sortOrder,
            ],
            queryFn: async () => {
                const response = await axios.get<ResponseData<T>>("/api/products", {
                    params: {
                        limit,
                        page,
                        search,
                        minPrice,
                        maxPrice,
                        categoryId,
                        subcategoryId,
                        productTypeId,
                        isActive,
                        isAvailable,
                        isPublished,
                        isDeleted,
                        verificationStatus,
                        sortBy,
                        sortOrder,
                    },
                });
                if (!response.data.success)
                    throw new Error(response.data.longMessage);
                
                // Transform data to match ProductListing interface
                const responseData = response.data.data;
                if (!responseData) {
                    return { data: [], items: 0, pages: 0 } as unknown as T;
                }
                
                const transformedData = {
                    ...responseData,
                    data: responseData.data?.map((product: any) => ({
                        ...product,
                        name: product.title, // Map title to name for UI consistency
                        images:
                            product.media
                                ?.map((m: any) => m.mediaItem?.url)
                                .filter((url: string) => Boolean(url)) || [],
                    })) || []
                } as unknown as T;
                
                return transformedData;
            },
            staleTime: 1000,
            refetchOnWindowFocus: false,
            retry: 1,
            ...rest,
        });
    };

    const useCreate = () => {
        return useMutation({
            onMutate: () => {
                const toastId = toast.loading("Adding new product...");
                return { toastId };
            },
            mutationFn: async (values: CreateProduct[]) => {
                const response = await axios.post<ResponseData<Product[]>>(
                    "/api/products",
                    values
                );
                if (!response.data.success)
                    throw new Error(response.data.longMessage);
                return response.data.data;
            },
            onSuccess: (_, __, { toastId }) => {
                toast.success("Product added!", { id: toastId });
                // Invalidate all product-related queries including new arrivals
                queryClient.invalidateQueries({ queryKey: ["products"] });
                // Force refetch new arrivals since new products should appear there
                queryClient.refetchQueries({ queryKey: ["products", "new-arrivals"] });
                router.refresh();
            },
            onError: (err, _, ctx) => {
                return handleClientError(err, ctx?.toastId);
            },
        });
    };

    const useUpdate = () => {
        return useMutation({
            onMutate: () => {
                const toastId = toast.loading("Updating product...");
                return { toastId };
            },
            mutationFn: async ({
                id,
                values,
            }: {
                id: string;
                values: UpdateProduct;
            }) => {
                console.log("Updating product with ID:", id);
                console.log("Update values:", values);
                console.log("PATCH URL:", `/api/products/${id}`);
                
                const response = await axios.patch<ResponseData<Product>>(
                    `/api/products/${id}`,
                    values
                );
                
                console.log("Update response:", response);
                if (!response.data.success)
                    throw new Error(response.data.longMessage);
                return response.data.data;
            },
            onSuccess: (_, __, { toastId }) => {
                toast.success("Product updated!", { id: toastId });
                // Invalidate all product-related queries including new arrivals
                queryClient.invalidateQueries({ queryKey: ["products"] });
                // Force refetch new arrivals immediately
                queryClient.refetchQueries({ queryKey: ["products", "new-arrivals"] });
                router.refresh();
            },
            onError: (err, _, ctx) => {
                return handleClientError(err, ctx?.toastId);
            },
        });
    };

    const useNewArrivals = <
        T extends {
            data: FullProduct[];
            items: number;
            pages: number;
        },
    >(input: {
        limit?: number;
        categoryId?: string;
        subcategoryId?: string;
        productTypeId?: string;
        enabled?: boolean;
        initialData?: T;
    } = {}) => {
        const {
            limit = 10,
            categoryId,
            subcategoryId,
            productTypeId,
            enabled = true,
            ...rest
        } = input;

        return useQuery({
            queryKey: [
                "products",
                "new-arrivals", 
                limit,
                categoryId,
                subcategoryId,
                productTypeId,
            ],
            queryFn: async () => {
                const response = await axios.get<ResponseData<T>>("/api/products/new-arrivals", {
                    params: {
                        limit,
                        categoryId,
                        subcategoryId,
                        productTypeId,
                    },
                });
                if (!response.data.success)
                    throw new Error(response.data.longMessage);
                return response.data.data;
            },
            staleTime: 1000 * 60 * 5, // 5 minutes cache
            refetchOnWindowFocus: false, // Don't refetch on window focus
            refetchOnMount: false, // Don't always refetch when component mounts
            retry: 1, // Reduce retries
            enabled,
            ...rest,
        });
    };

    const useMarketedProducts = <
        T extends {
            data: FullProduct[];
            items: number;
            pages: number;
        },
    >(input: {
        limit?: number;
        categoryId?: string;
        subcategoryId?: string;
        productTypeId?: string;
        enabled?: boolean;
        initialData?: T;
    } = {}) => {
        const {
            limit = 10,
            categoryId,
            subcategoryId,
            productTypeId,
            enabled = true,
            ...rest
        } = input;

        return useQuery({
            queryKey: [
                "products",
                "marketed", 
                limit,
                categoryId,
                subcategoryId,
                productTypeId,
            ],
            queryFn: async () => {
                const response = await axios.get<ResponseData<T>>("/api/products/marketed", {
                    params: {
                        limit: Math.min(limit, 10), // Max 10 as per business rule
                        categoryId,
                        subcategoryId,
                        productTypeId,
                    },
                });
                if (!response.data.success)
                    throw new Error(response.data.longMessage);
                return response.data.data;
            },
            staleTime: 1000 * 60 * 5, // 5 minutes cache
            refetchOnWindowFocus: false, // Don't refetch on window focus
            refetchOnMount: false, // Don't always refetch when component mounts
            retry: 1, // Reduce retries
            enabled,
            ...rest,
        });
    };

    const useUpdateMarketingStatus = () => {
        return useMutation({
            onMutate: () => {
                const toastId = toast.loading("Updating marketing status...");
                return { toastId };
            },
            mutationFn: async ({ id, isMarketed }: { id: string; isMarketed: boolean }) => {
                const response = await axios.patch<ResponseData<Product>>(
                    `/api/products/${id}/marketing`,
                    { isMarketed }
                );
                if (!response.data.success)
                    throw new Error(response.data.longMessage);
                return response.data.data;
            },
            onSuccess: (data, variables, { toastId }) => {
                const action = variables.isMarketed ? "marketed" : "unmarked";
                toast.success(`Product ${action} successfully!`, { id: toastId });
                // Invalidate all product-related queries
                queryClient.invalidateQueries({ queryKey: ["products"] });
                // Force refetch marketed products
                queryClient.refetchQueries({ queryKey: ["products", "marketed"] });
                // Force refetch new arrivals since marketing auto-publishes
                queryClient.refetchQueries({ queryKey: ["products", "new-arrivals"] });
                router.refresh();
            },
            onError: (err, _, ctx) => {
                return handleClientError(err, ctx?.toastId);
            },
        });
    };

    const useDelete = () => {
        return useMutation({
            onMutate: () => {
                const toastId = toast.loading("Deleting product...");
                return { toastId };
            },
            mutationFn: async (id: string) => {
                const response = await axios.delete<ResponseData<Product>>(
                    `/api/products/${id}`
                );
                if (!response.data.success)
                    throw new Error(response.data.longMessage);
                return response.data.data;
            },
            onSuccess: (_, __, { toastId }) => {
                toast.success("Product deleted!", { id: toastId });
                // Invalidate all product-related queries
                queryClient.invalidateQueries({ queryKey: ["products"] });
                // Force refetch new arrivals since deleted products should be removed
                queryClient.refetchQueries({ queryKey: ["products", "new-arrivals"] });
                router.refresh();
            },
            onError: (err, _, ctx) => {
                return handleClientError(err, ctx?.toastId);
            },
        });
    };

    const useClearCache = () => {
        return () => {
            queryClient.clear();
            toast.success("Cache cleared!");
        };
    };

    return { 
        usePaginate, 
        useCreate, 
        useUpdate, 
        useDelete, 
        useNewArrivals, 
        useMarketedProducts,
        useUpdateMarketingStatus,
        useClearCache 
    };
}
