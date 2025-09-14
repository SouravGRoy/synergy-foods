"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
    Bell,
    CreditCard,
    Globe,
    Mail,
    Package,
    Save,
    Settings,
    Shield,
    Store,
    Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface StoreSettings {
    storeName: string;
    storeDescription: string;
    storeEmail: string;
    storePhone: string;
    storeAddress: string;
    currency: string;
    timezone: string;
    language: string;
}

interface NotificationSettings {
    emailNotifications: boolean;
    orderNotifications: boolean;
    inventoryAlerts: boolean;
    customerMessages: boolean;
    marketingEmails: boolean;
}

interface SecuritySettings {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    ipWhitelist: string;
    passwordPolicy: string;
}

interface PaymentSettings {
    stripeEnabled: boolean;
    paypalEnabled: boolean;
    taxRate: number;
    shippingRate: number;
    freeShippingThreshold: number;
}

export function AdminSettingsManagement() {
    const [loading, setLoading] = useState(false);
    const [storeSettings, setStoreSettings] = useState<StoreSettings>({
        storeName: "B2C Marketplace",
        storeDescription: "Your one-stop shop for quality products",
        storeEmail: "admin@marketplace.com",
        storePhone: "+971 (50) 123-4567", // UAE phone format
        storeAddress: "Business Bay, Dubai, UAE",
        currency: "AED",
        timezone: "UTC+4", // UAE timezone
        language: "en",
    });

    const [notificationSettings, setNotificationSettings] =
        useState<NotificationSettings>({
            emailNotifications: true,
            orderNotifications: true,
            inventoryAlerts: true,
            customerMessages: false,
            marketingEmails: false,
        });

    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
        twoFactorAuth: false,
        sessionTimeout: 60,
        ipWhitelist: "",
        passwordPolicy: "strong",
    });

    const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
        stripeEnabled: true,
        paypalEnabled: false,
        taxRate: 8.5,
        shippingRate: 15.0,
        freeShippingThreshold: 100.0,
    });

    const handleSaveStoreSettings = async () => {
        setLoading(true);
        try {
            // In a real app, this would be an API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success("Store settings saved successfully");
        } catch (error) {
            console.error("Error saving store settings:", error);
            toast.error("Failed to save store settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNotificationSettings = async () => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success("Notification settings saved successfully");
        } catch (error) {
            console.error("Error saving notification settings:", error);
            toast.error("Failed to save notification settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSecuritySettings = async () => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success("Security settings saved successfully");
        } catch (error) {
            console.error("Error saving security settings:", error);
            toast.error("Failed to save security settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSavePaymentSettings = async () => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success("Payment settings saved successfully");
        } catch (error) {
            console.error("Error saving payment settings:", error);
            toast.error("Failed to save payment settings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Settings
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Manage your store configuration and preferences
                    </p>
                </div>
            </div>

            <Tabs defaultValue="store" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger
                        value="store"
                        className="flex items-center space-x-2"
                    >
                        <Store className="h-4 w-4" />
                        <span>Store</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="notifications"
                        className="flex items-center space-x-2"
                    >
                        <Bell className="h-4 w-4" />
                        <span>Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="security"
                        className="flex items-center space-x-2"
                    >
                        <Shield className="h-4 w-4" />
                        <span>Security</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="payments"
                        className="flex items-center space-x-2"
                    >
                        <CreditCard className="h-4 w-4" />
                        <span>Payments</span>
                    </TabsTrigger>
                </TabsList>

                {/* Store Settings */}
                <TabsContent value="store">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Store className="mr-2 h-5 w-5" />
                                Store Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="storeName">
                                        Store Name
                                    </Label>
                                    <Input
                                        id="storeName"
                                        value={storeSettings.storeName}
                                        onChange={(e) =>
                                            setStoreSettings((prev) => ({
                                                ...prev,
                                                storeName: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="storeEmail">
                                        Store Email
                                    </Label>
                                    <Input
                                        id="storeEmail"
                                        type="email"
                                        value={storeSettings.storeEmail}
                                        onChange={(e) =>
                                            setStoreSettings((prev) => ({
                                                ...prev,
                                                storeEmail: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="storePhone">
                                        Store Phone
                                    </Label>
                                    <Input
                                        id="storePhone"
                                        value={storeSettings.storePhone}
                                        onChange={(e) =>
                                            setStoreSettings((prev) => ({
                                                ...prev,
                                                storePhone: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <Input
                                        id="currency"
                                        value={storeSettings.currency}
                                        onChange={(e) =>
                                            setStoreSettings((prev) => ({
                                                ...prev,
                                                currency: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="storeDescription">
                                    Store Description
                                </Label>
                                <Textarea
                                    id="storeDescription"
                                    value={storeSettings.storeDescription}
                                    onChange={(e) =>
                                        setStoreSettings((prev) => ({
                                            ...prev,
                                            storeDescription: e.target.value,
                                        }))
                                    }
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="storeAddress">
                                    Store Address
                                </Label>
                                <Textarea
                                    id="storeAddress"
                                    value={storeSettings.storeAddress}
                                    onChange={(e) =>
                                        setStoreSettings((prev) => ({
                                            ...prev,
                                            storeAddress: e.target.value,
                                        }))
                                    }
                                    rows={2}
                                />
                            </div>

                            <Button
                                onClick={handleSaveStoreSettings}
                                disabled={loading}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Save Store Settings
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notification Settings */}
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Bell className="mr-2 h-5 w-5" />
                                Notification Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Email Notifications</Label>
                                        <p className="text-sm text-gray-500">
                                            Receive general email notifications
                                        </p>
                                    </div>
                                    <Switch
                                        checked={
                                            notificationSettings.emailNotifications
                                        }
                                        onCheckedChange={(checked) =>
                                            setNotificationSettings((prev) => ({
                                                ...prev,
                                                emailNotifications: checked,
                                            }))
                                        }
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Order Notifications</Label>
                                        <p className="text-sm text-gray-500">
                                            Get notified about new orders and
                                            status changes
                                        </p>
                                    </div>
                                    <Switch
                                        checked={
                                            notificationSettings.orderNotifications
                                        }
                                        onCheckedChange={(checked) =>
                                            setNotificationSettings((prev) => ({
                                                ...prev,
                                                orderNotifications: checked,
                                            }))
                                        }
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Inventory Alerts</Label>
                                        <p className="text-sm text-gray-500">
                                            Receive alerts for low stock and
                                            inventory issues
                                        </p>
                                    </div>
                                    <Switch
                                        checked={
                                            notificationSettings.inventoryAlerts
                                        }
                                        onCheckedChange={(checked) =>
                                            setNotificationSettings((prev) => ({
                                                ...prev,
                                                inventoryAlerts: checked,
                                            }))
                                        }
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Customer Messages</Label>
                                        <p className="text-sm text-gray-500">
                                            Get notified about customer
                                            inquiries and support tickets
                                        </p>
                                    </div>
                                    <Switch
                                        checked={
                                            notificationSettings.customerMessages
                                        }
                                        onCheckedChange={(checked) =>
                                            setNotificationSettings((prev) => ({
                                                ...prev,
                                                customerMessages: checked,
                                            }))
                                        }
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Marketing Emails</Label>
                                        <p className="text-sm text-gray-500">
                                            Receive updates about new features
                                            and promotions
                                        </p>
                                    </div>
                                    <Switch
                                        checked={
                                            notificationSettings.marketingEmails
                                        }
                                        onCheckedChange={(checked) =>
                                            setNotificationSettings((prev) => ({
                                                ...prev,
                                                marketingEmails: checked,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleSaveNotificationSettings}
                                disabled={loading}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Save Notification Settings
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Shield className="mr-2 h-5 w-5" />
                                Security & Access
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Two-Factor Authentication</Label>
                                        <p className="text-sm text-gray-500">
                                            Add an extra layer of security to
                                            your account
                                        </p>
                                    </div>
                                    <Switch
                                        checked={securitySettings.twoFactorAuth}
                                        onCheckedChange={(checked) =>
                                            setSecuritySettings((prev) => ({
                                                ...prev,
                                                twoFactorAuth: checked,
                                            }))
                                        }
                                    />
                                </div>

                                <Separator />

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="sessionTimeout">
                                            Session Timeout (minutes)
                                        </Label>
                                        <Input
                                            id="sessionTimeout"
                                            type="number"
                                            value={
                                                securitySettings.sessionTimeout
                                            }
                                            onChange={(e) =>
                                                setSecuritySettings((prev) => ({
                                                    ...prev,
                                                    sessionTimeout:
                                                        parseInt(
                                                            e.target.value
                                                        ) || 60,
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="passwordPolicy">
                                            Password Policy
                                        </Label>
                                        <Input
                                            id="passwordPolicy"
                                            value={
                                                securitySettings.passwordPolicy
                                            }
                                            onChange={(e) =>
                                                setSecuritySettings((prev) => ({
                                                    ...prev,
                                                    passwordPolicy:
                                                        e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ipWhitelist">
                                        IP Whitelist
                                    </Label>
                                    <Textarea
                                        id="ipWhitelist"
                                        placeholder="Enter IP addresses (one per line)"
                                        value={securitySettings.ipWhitelist}
                                        onChange={(e) =>
                                            setSecuritySettings((prev) => ({
                                                ...prev,
                                                ipWhitelist: e.target.value,
                                            }))
                                        }
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleSaveSecuritySettings}
                                disabled={loading}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Save Security Settings
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Payment Settings */}
                <TabsContent value="payments">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <CreditCard className="mr-2 h-5 w-5" />
                                Payment Configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Stripe Payments</Label>
                                        <p className="text-sm text-gray-500">
                                            Enable Stripe payment processing
                                        </p>
                                    </div>
                                    <Switch
                                        checked={paymentSettings.stripeEnabled}
                                        onCheckedChange={(checked) =>
                                            setPaymentSettings((prev) => ({
                                                ...prev,
                                                stripeEnabled: checked,
                                            }))
                                        }
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>PayPal Payments</Label>
                                        <p className="text-sm text-gray-500">
                                            Enable PayPal payment processing
                                        </p>
                                    </div>
                                    <Switch
                                        checked={paymentSettings.paypalEnabled}
                                        onCheckedChange={(checked) =>
                                            setPaymentSettings((prev) => ({
                                                ...prev,
                                                paypalEnabled: checked,
                                            }))
                                        }
                                    />
                                </div>

                                <Separator />

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="taxRate">
                                            Tax Rate (%)
                                        </Label>
                                        <Input
                                            id="taxRate"
                                            type="number"
                                            step="0.1"
                                            value={paymentSettings.taxRate}
                                            onChange={(e) =>
                                                setPaymentSettings((prev) => ({
                                                    ...prev,
                                                    taxRate:
                                                        parseFloat(
                                                            e.target.value
                                                        ) || 0,
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="shippingRate">
                                            Shipping Rate ($)
                                        </Label>
                                        <Input
                                            id="shippingRate"
                                            type="number"
                                            step="0.01"
                                            value={paymentSettings.shippingRate}
                                            onChange={(e) =>
                                                setPaymentSettings((prev) => ({
                                                    ...prev,
                                                    shippingRate:
                                                        parseFloat(
                                                            e.target.value
                                                        ) || 0,
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="freeShippingThreshold">
                                            Free Shipping Threshold ($)
                                        </Label>
                                        <Input
                                            id="freeShippingThreshold"
                                            type="number"
                                            step="0.01"
                                            value={
                                                paymentSettings.freeShippingThreshold
                                            }
                                            onChange={(e) =>
                                                setPaymentSettings((prev) => ({
                                                    ...prev,
                                                    freeShippingThreshold:
                                                        parseFloat(
                                                            e.target.value
                                                        ) || 0,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleSavePaymentSettings}
                                disabled={loading}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Save Payment Settings
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
