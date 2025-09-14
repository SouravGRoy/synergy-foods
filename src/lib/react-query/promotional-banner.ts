import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axios } from "@/lib/axios";
import {
    CreatePromotionalBanner,
    PromotionalBanner,
    UpdatePromotionalBanner,
} from "@/lib/validations/promotional-banner";

interface PaginatedResponse<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

interface UsePromotionalBannerPaginateProps {
    page: number;
    limit: number;
    search?: string;
    location?: string;
    type?: "carousel" | "type1" | "type2" | "type3" | "type4";
    initialData?: PaginatedResponse<PromotionalBanner>;
}

const PROMOTIONAL_BANNER_QUERY_KEY = "promotional-banners";

export const usePromotionalBanner = () => {
    const queryClient = useQueryClient();

    const usePaginate = ({
        page,
        limit,
        search,
        location,
        type,
        initialData,
    }: UsePromotionalBannerPaginateProps) => {
        return useQuery({
            queryKey: [PROMOTIONAL_BANNER_QUERY_KEY, { page, limit, search, location, type }],
            queryFn: async (): Promise<PaginatedResponse<PromotionalBanner>> => {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                });

                if (search) params.append("search", search);
                if (location) params.append("location", location);
                if (type) params.append("type", type);

                const response = await axios.get(`/api/promotional-banners?${params}`);
                return response.data;
            },
            initialData,
        });
    };

    const useGet = (id: string) => {
        return useQuery({
            queryKey: [PROMOTIONAL_BANNER_QUERY_KEY, id],
            queryFn: async (): Promise<PromotionalBanner> => {
                const response = await axios.get(`/api/promotional-banners/${id}`);
                return response.data;
            },
            enabled: !!id,
        });
    };

    const useCreate = () => {
        return useMutation({
            mutationFn: async (data: CreatePromotionalBanner): Promise<PromotionalBanner> => {
                const response = await axios.post("/api/promotional-banners", data);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [PROMOTIONAL_BANNER_QUERY_KEY] });
                toast.success("Promotional banner created successfully");
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.error || "Failed to create promotional banner";
                toast.error(errorMessage);
            },
        });
    };

    const useUpdate = () => {
        return useMutation({
            mutationFn: async ({ id, data }: { id: string; data: UpdatePromotionalBanner }): Promise<PromotionalBanner> => {
                const response = await axios.patch(`/api/promotional-banners/${id}`, data);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [PROMOTIONAL_BANNER_QUERY_KEY] });
                toast.success("Promotional banner updated successfully");
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.error || "Failed to update promotional banner";
                toast.error(errorMessage);
            },
        });
    };

    const useDelete = () => {
        return useMutation({
            mutationFn: async (id: string): Promise<void> => {
                await axios.delete(`/api/promotional-banners/${id}`);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [PROMOTIONAL_BANNER_QUERY_KEY] });
                toast.success("Promotional banner deleted successfully");
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.error || "Failed to delete promotional banner";
                toast.error(errorMessage);
            },
        });
    };

    // Specific hooks for each banner type
    const useGetByType = (type: "carousel" | "type1" | "type2" | "type3" | "type4", location?: string) => {
        return useQuery({
            queryKey: [PROMOTIONAL_BANNER_QUERY_KEY, "by-type", type, location],
            queryFn: async (): Promise<PromotionalBanner[]> => {
                const params = new URLSearchParams({
                    type,
                    limit: "100", // Get all banners of this type
                });
                
                if (location) params.append("location", location);

                const response = await axios.get(`/api/promotional-banners?${params}`);
                return response.data.data; // Extract data array from paginated response
            },
        });
    };

    const useGetCarouselBanners = (location?: string) => {
        return useGetByType("carousel", location);
    };

    const useGetType1Banners = (location?: string) => {
        return useGetByType("type1", location);
    };

    const useGetType2Banners = (location?: string) => {
        return useGetByType("type2", location);
    };

    const useGetType3Banners = (location?: string) => {
        return useGetByType("type3", location);
    };

    const useGetType4Banners = (location?: string) => {
        return useGetByType("type4", location);
    };

    return {
        usePaginate,
        useGet,
        useCreate,
        useUpdate,
        useDelete,
        useGetByType,
        useGetCarouselBanners,
        useGetType1Banners,
        useGetType2Banners,
        useGetType3Banners,
        useGetType4Banners,
    };
};
