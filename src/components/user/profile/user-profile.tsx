"use client";

import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function UserProfile() {
    const { useCurrentUser } = useAuth();
    const { data: user, isLoading } = useCurrentUser();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        bio: "",
    });

    // Initialize form data when user data loads
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
                bio: "", // Add bio field if needed in schema
            });
        }
    }, [user]);

    const handleSaveProfile = async () => {
        try {
            // TODO: Implement profile update API call
            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex h-96 items-center justify-center">
                    <Icons.Loader className="h-8 w-8 animate-spin" />
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Not Logged In</h1>
                    <p className="mt-2 text-muted-foreground">
                        Please log in to view your profile.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">My Profile</h1>
                <p className="mt-2 text-muted-foreground">
                    Manage your personal information and preferences
                </p>
            </div>

            <Tabs defaultValue="personal" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                    <TabsTrigger value="addresses">Addresses</TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>
                                        Update your personal details and profile
                                        picture
                                    </CardDescription>
                                </div>
                                <Button
                                    variant={isEditing ? "outline" : "default"}
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    {isEditing ? (
                                        <>
                                            <Icons.Minus className="mr-2 h-4 w-4" />
                                            Cancel
                                        </>
                                    ) : (
                                        <>
                                            <Icons.Edit className="mr-2 h-4 w-4" />
                                            Edit Profile
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Profile Picture Section */}
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage
                                        src={user.avatarUrl || ""}
                                        alt={user.firstName}
                                    />
                                    <AvatarFallback className="text-lg">
                                        {user.firstName?.[0]}
                                        {user.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-2">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {user.firstName} {user.lastName}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {user.email}
                                        </p>
                                        <Badge
                                            variant="secondary"
                                            className="mt-1"
                                        >
                                            {user.role}
                                        </Badge>
                                    </div>
                                    {isEditing && (
                                        <Button variant="outline" size="sm">
                                            <Icons.Instagram className="mr-2 h-4 w-4" />
                                            Change Photo
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">
                                        First Name
                                    </Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                firstName: e.target.value,
                                            }))
                                        }
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                lastName: e.target.value,
                                            }))
                                        }
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                email: e.target.value,
                                            }))
                                        }
                                        disabled={!isEditing}
                                    />
                                    {user.isEmailVerified ? (
                                        <p className="text-xs text-green-600">
                                            ✓ Email verified
                                        </p>
                                    ) : (
                                        <p className="text-xs text-yellow-600">
                                            ⚠ Email not verified
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                phone: e.target.value,
                                            }))
                                        }
                                        disabled={!isEditing}
                                    />
                                    {user.isPhoneVerified ? (
                                        <p className="text-xs text-green-600">
                                            ✓ Phone verified
                                        </p>
                                    ) : (
                                        <p className="text-xs text-yellow-600">
                                            ⚠ Phone not verified
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    placeholder="Tell us about yourself..."
                                    value={formData.bio}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            bio: e.target.value,
                                        }))
                                    }
                                    disabled={!isEditing}
                                    rows={3}
                                />
                            </div>

                            {isEditing && (
                                <div className="flex gap-2">
                                    <Button onClick={handleSaveProfile}>
                                        <Icons.Shield className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>
                                Manage your account security and authentication
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">
                                            Password
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Last changed 30 days ago
                                        </p>
                                    </div>
                                    <Button variant="outline">
                                        Change Password
                                    </Button>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">
                                            Two-Factor Authentication
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Add an extra layer of security
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">
                                            Login Sessions
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Manage your active sessions
                                        </p>
                                    </div>
                                    <Button variant="outline">
                                        View Sessions
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences">
                    <Card>
                        <CardHeader>
                            <CardTitle>Preferences</CardTitle>
                            <CardDescription>
                                Customize your experience and notifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">
                                            Email Notifications
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Receive order updates via email
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">
                                            Marketing Emails
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Receive promotional offers
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">
                                            SMS Notifications
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Receive updates via SMS
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Addresses Tab */}
                <TabsContent value="addresses">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Saved Addresses</CardTitle>
                                    <CardDescription>
                                        Manage your shipping and billing
                                        addresses
                                    </CardDescription>
                                </div>
                                <Button>
                                    <Icons.Plus className="mr-2 h-4 w-4" />
                                    Add Address
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {user.addresses && user.addresses.length > 0 ? (
                                <div className="grid gap-4">
                                    {user.addresses.map((address) => (
                                        <Card
                                            key={address.id}
                                            className="relative"
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-medium">
                                                                {address.alias}
                                                            </h4>
                                                            {address.isPrimary && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    Primary
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {address.fullName}
                                                        </p>
                                                        <p className="text-sm">
                                                            {address.street}
                                                        </p>
                                                        <p className="text-sm">
                                                            {address.city},{" "}
                                                            {address.state}{" "}
                                                            {address.zip}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {address.phone}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <Icons.Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Icons.Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <Icons.MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-medium">
                                        No addresses saved
                                    </h3>
                                    <p className="mt-2 text-muted-foreground">
                                        Add an address to make checkout faster
                                    </p>
                                    <Button className="mt-4">
                                        <Icons.Plus className="mr-2 h-4 w-4" />
                                        Add Your First Address
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
