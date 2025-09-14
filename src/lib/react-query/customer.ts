import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";

export const useCustomer = () => {
    const queryClient = useQueryClient();

    // Get customer orders
    const useOrders = (options: {
        limit?: number;
        page?: number;
        status?: string;
    } = {}) => {
        return useQuery({
            queryKey: ["customer", "orders", options],
            queryFn: async () => {
                const params = new URLSearchParams();
                if (options.limit) params.append("limit", options.limit.toString());
                if (options.page) params.append("page", options.page.toString());
                if (options.status) params.append("status", options.status);

                const response = await axios.get(`/api/orders/customer?${params}`);
                return response.data;
            },
        });
    };

    // Get customer stats
    const useStats = () => {
        return useQuery({
            queryKey: ["customer", "stats"],
            queryFn: async () => {
                const response = await axios.get("/api/customer/stats");
                return response.data;
            },
        });
    };

    // Get customer profile
    const useProfile = () => {
        return useQuery({
            queryKey: ["customer", "profile"],
            queryFn: async () => {
                const response = await axios.get("/api/customer/profile");
                return response.data;
            },
        });
    };

    // Get customer addresses
    const useAddresses = () => {
        return useQuery({
            queryKey: ["customer", "addresses"],
            queryFn: async () => {
                const response = await axios.get("/api/customer/addresses");
                return response.data;
            },
        });
    };

    // Create address mutation
    const useCreateAddress = () => {
        return useMutation({
            mutationFn: async (data: any) => {
                const response = await axios.post("/api/customer/addresses", data);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["customer", "addresses"] });
            },
        });
    };

    // Update address mutation
    const useUpdateAddress = () => {
        return useMutation({
            mutationFn: async ({ id, data }: { id: string; data: any }) => {
                const response = await axios.put(`/api/customer/addresses/${id}`, data);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["customer", "addresses"] });
            },
        });
    };

    // Delete address mutation
    const useDeleteAddress = () => {
        return useMutation({
            mutationFn: async (id: string) => {
                const response = await axios.delete(`/api/customer/addresses/${id}`);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["customer", "addresses"] });
            },
        });
    };

    return {
        useOrders,
        useStats,
        useProfile,
        useAddresses,
        useCreateAddress,
        useUpdateAddress,
        useDeleteAddress,
    };
};
