import { handleClientError } from "@/lib/utils";
import { Banner, CreateBanner, UpdateBanner } from "@/lib/validations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

interface UseBannerPaginateParams {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    isPaginated?: boolean;
    enabled?: boolean;
    initialData?: {
        data: Banner[];
        items: number;
        pages: number;
    };
}

interface UseBannerParams {
    id: string;
    enabled?: boolean;
}

interface UseBannerScanParams {
    location?: string;
    enabled?: boolean;
}

export function useBanner() {
    const queryClient = useQueryClient();

    const invalidateQueries = (queryKey: any[]) => {
        if (queryClient) {
            queryClient.invalidateQueries({ queryKey });
        }
    };

    const usePaginate = ({
        page = 1,
        limit = 10,
        search,
        location,
        isPaginated = true,
        enabled = true,
        initialData,
    }: UseBannerPaginateParams = {}) => {
        return useQuery({
            queryKey: ["banners", "paginate", { page, limit, search, location, isPaginated }],
            queryFn: async () => {
                const params = new URLSearchParams();
                params.append("page", page.toString());
                params.append("limit", limit.toString());
                params.append("isPaginated", isPaginated.toString());
                
                if (search) params.append("search", search);
                if (location) params.append("location", location);

                const response = await axios.get(`/api/banners?${params.toString()}`);
                return response.data.data;
            },
            enabled,
            initialData,
            staleTime: 5 * 60 * 1000, // 5 minutes
        });
    };

    const useScan = ({ location, enabled = true }: UseBannerScanParams = {}) => {
        return useQuery({
            queryKey: ["banners", "scan", { location }],
            queryFn: async () => {
                const params = new URLSearchParams();
                params.append("isPaginated", "false");
                if (location) params.append("location", location);

                const response = await axios.get(`/api/banners?${params.toString()}`);
                return response.data.data as Banner[];
            },
            enabled,
            staleTime: 5 * 60 * 1000, // 5 minutes
        });
    };

    const useGet = ({ id, enabled = true }: UseBannerParams) => {
        return useQuery({
            queryKey: ["banners", "get", id],
            queryFn: async () => {
                const response = await axios.get(`/api/banners/${id}`);
                return response.data.data as Banner;
            },
            enabled: enabled && !!id,
            staleTime: 5 * 60 * 1000, // 5 minutes
        });
    };

    const useCreate = () => {
        return useMutation({
            mutationFn: async (values: CreateBanner & { imageUrl: string }) => {
                const response = await axios.post("/api/banners", values);
                return response.data.data as Banner;
            },
            onSuccess: () => {
                invalidateQueries(["banners"]);
                toast.success("Banner created successfully");
            },
            onError: (error) => {
                handleClientError(error);
            },
        });
    };

    const useUpdate = () => {
        return useMutation({
            mutationFn: async ({ id, values }: { id: string; values: UpdateBanner & { imageUrl?: string } }) => {
                const response = await axios.patch(`/api/banners/${id}`, values);
                return response.data.data as Banner;
            },
            onSuccess: () => {
                invalidateQueries(["banners"]);
                toast.success("Banner updated successfully");
            },
            onError: (error) => {
                handleClientError(error);
            },
        });
    };

    const useDelete = () => {
        return useMutation({
            mutationFn: async (id: string) => {
                await axios.delete(`/api/banners/${id}`);
            },
            onSuccess: () => {
                invalidateQueries(["banners"]);
                toast.success("Banner deleted successfully");
            },
            onError: (error) => {
                handleClientError(error);
            },
        });
    };

    return {
        usePaginate,
        useScan,
        useGet,
        useCreate,
        useUpdate,
        useDelete,
    };
}
