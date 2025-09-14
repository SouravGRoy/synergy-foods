"use client";

import { AdminDeliveryPanel } from "@/components/admin/delivery-panel";
import {
    AdminOverview,
    CategoryManager,
    OrderManager,
    UserManager,
} from "@/components/dashboard/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    useAddTrackingNumber,
    useAdminCategories,
    useAdminOrders,
    useAdminStats,
    useAdminUsers,
    useCreateCategory,
    useDeleteCategory,
    useDeleteUser,
    useRefundOrder,
    useSendUserEmail,
    useUpdateCategory,
    useUpdateOrderStatus,
    useUpdateUser,
} from "@/hooks/use-admin";
import { useState } from "react";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");

    // Data queries
    const { data: stats } = useAdminStats();
    const { data: categories = [] } = useAdminCategories();
    const { data: users = [] } = useAdminUsers();
    const { data: orders = [] } = useAdminOrders();

    // Category mutations
    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory();
    const deleteCategory = useDeleteCategory();

    // User mutations
    const updateUser = useUpdateUser();
    const deleteUser = useDeleteUser();
    const sendEmail = useSendUserEmail();

    // Order mutations
    const updateOrderStatus = useUpdateOrderStatus();
    const addTrackingNumber = useAddTrackingNumber();
    const refundOrder = useRefundOrder();

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage your marketplace from this central hub
                </p>
            </div>

            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
            >
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="delivery">Delivery</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {stats && <AdminOverview stats={stats} />}
                </TabsContent>

                <TabsContent value="orders" className="space-y-6">
                    <OrderManager
                        orders={orders}
                        onUpdateOrderStatus={async (orderId, status, notes) => {
                            await updateOrderStatus.mutateAsync({
                                orderId,
                                status,
                                notes,
                            });
                        }}
                        onAddTrackingNumber={async (
                            orderId,
                            trackingNumber
                        ) => {
                            await addTrackingNumber.mutateAsync({
                                orderId,
                                trackingNumber,
                            });
                        }}
                        onRefundOrder={async (orderId, amount, reason) => {
                            await refundOrder.mutateAsync({
                                orderId,
                                amount,
                                reason,
                            });
                        }}
                    />
                </TabsContent>

                <TabsContent value="delivery" className="space-y-6">
                    <AdminDeliveryPanel />
                </TabsContent>

                <TabsContent value="categories" className="space-y-6">
                    <CategoryManager
                        categories={categories}
                        onCreateCategory={async (data) => {
                            await createCategory.mutateAsync(data);
                        }}
                        onUpdateCategory={async (id, data) => {
                            await updateCategory.mutateAsync({ id, data });
                        }}
                        onDeleteCategory={async (id) => {
                            await deleteCategory.mutateAsync(id);
                        }}
                    />
                </TabsContent>

                <TabsContent value="users" className="space-y-6">
                    <UserManager
                        users={users}
                        onUpdateUser={async (id, data) => {
                            await updateUser.mutateAsync({ id, data });
                        }}
                        onDeleteUser={async (id) => {
                            await deleteUser.mutateAsync(id);
                        }}
                        onSendEmail={async (userId, subject, message) => {
                            await sendEmail.mutateAsync({
                                userId,
                                subject,
                                message,
                            });
                        }}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
