"use client";

import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: "admin" | "user";
    isActive: boolean;
    isEmailVerified: boolean;
    totalOrders: number;
    totalSpent: number;
    createdAt: Date;
    lastLoginAt?: Date;
}

interface UserManagerProps {
    users: User[];
    onUpdateUser: (id: string, data: Partial<User>) => Promise<void>;
    onDeleteUser: (id: string) => Promise<void>;
    onSendEmail: (
        userId: string,
        subject: string,
        message: string
    ) => Promise<void>;
}

export function UserManager({
    users,
    onUpdateUser,
    onDeleteUser,
    onSendEmail,
}: UserManagerProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [emailDialog, setEmailDialog] = useState<{
        isOpen: boolean;
        user: User | null;
    }>({
        isOpen: false,
        user: null,
    });
    const [emailForm, setEmailForm] = useState({ subject: "", message: "" });

    // Filter users
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && user.isActive) ||
            (statusFilter === "inactive" && !user.isActive) ||
            (statusFilter === "verified" && user.isEmailVerified) ||
            (statusFilter === "unverified" && !user.isEmailVerified);

        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleRoleChange = async (
        userId: string,
        newRole: "admin" | "user"
    ) => {
        await onUpdateUser(userId, { role: newRole });
    };

    const handleStatusToggle = async (userId: string, isActive: boolean) => {
        await onUpdateUser(userId, { isActive });
    };

    const handleSendEmail = async () => {
        if (emailDialog.user && emailForm.subject && emailForm.message) {
            await onSendEmail(
                emailDialog.user.id,
                emailForm.subject,
                emailForm.message
            );
            setEmailDialog({ isOpen: false, user: null });
            setEmailForm({ subject: "", message: "" });
        }
    };

    const openEmailDialog = (user: User) => {
        setEmailDialog({ isOpen: true, user });
        setEmailForm({ subject: "", message: "" });
    };

    const getUserInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    const getStatusBadge = (user: User) => {
        if (!user.isActive) {
            return <Badge variant="destructive">Inactive</Badge>;
        }
        if (!user.isEmailVerified) {
            return <Badge variant="secondary">Unverified</Badge>;
        }
        return <Badge variant="default">Active</Badge>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">User Management</h2>
                    <p className="text-muted-foreground">
                        Manage customer accounts and permissions
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline">
                        {filteredUsers.length} users
                    </Badge>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative max-w-sm flex-1">
                            <Icons.Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select
                            value={roleFilter}
                            onValueChange={setRoleFilter}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                    Inactive
                                </SelectItem>
                                <SelectItem value="verified">
                                    Verified
                                </SelectItem>
                                <SelectItem value="unverified">
                                    Unverified
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Users ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Orders</TableHead>
                                <TableHead>Total Spent</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Last Login</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={user.avatar}
                                                    alt={user.name}
                                                />
                                                <AvatarFallback>
                                                    {getUserInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={user.role}
                                            onValueChange={(
                                                value: "admin" | "user"
                                            ) =>
                                                handleRoleChange(user.id, value)
                                            }
                                        >
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="user">
                                                    User
                                                </SelectItem>
                                                <SelectItem value="admin">
                                                    Admin
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {getStatusBadge(user)}
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={user.isActive}
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        handleStatusToggle(
                                                            user.id,
                                                            checked
                                                        )
                                                    }
                                                />
                                                <span className="text-xs text-muted-foreground">
                                                    {user.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">
                                            {user.totalOrders}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">
                                            ${user.totalSpent.toLocaleString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {user.createdAt.toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {user.lastLoginAt
                                                ? user.lastLoginAt.toLocaleDateString()
                                                : "Never"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    openEmailDialog(user)
                                                }
                                            >
                                                <Icons.Mail className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setSelectedUser(user)
                                                }
                                            >
                                                <Icons.Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    if (
                                                        window.confirm(
                                                            `Delete user ${user.name}?`
                                                        )
                                                    ) {
                                                        onDeleteUser(user.id);
                                                    }
                                                }}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Icons.Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredUsers.length === 0 && (
                        <div className="py-8 text-center">
                            <Icons.User className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-2 text-sm font-semibold">
                                No users found
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                No users match your current filters.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Email Dialog */}
            <Dialog
                open={emailDialog.isOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setEmailDialog({ isOpen: false, user: null });
                        setEmailForm({ subject: "", message: "" });
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Email</DialogTitle>
                        <DialogDescription>
                            Send an email to {emailDialog.user?.name} (
                            {emailDialog.user?.email})
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                value={emailForm.subject}
                                onChange={(e) =>
                                    setEmailForm((prev) => ({
                                        ...prev,
                                        subject: e.target.value,
                                    }))
                                }
                                placeholder="Email subject"
                            />
                        </div>
                        <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                value={emailForm.message}
                                onChange={(e) =>
                                    setEmailForm((prev) => ({
                                        ...prev,
                                        message: e.target.value,
                                    }))
                                }
                                placeholder="Email message"
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setEmailDialog({ isOpen: false, user: null });
                                setEmailForm({ subject: "", message: "" });
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSendEmail}
                            disabled={!emailForm.subject || !emailForm.message}
                        >
                            Send Email
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* User Details Dialog */}
            <Dialog
                open={!!selectedUser}
                onOpenChange={(open) => !open && setSelectedUser(null)}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage
                                        src={selectedUser.avatar}
                                        alt={selectedUser.name}
                                    />
                                    <AvatarFallback className="text-lg">
                                        {getUserInitials(selectedUser.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-semibold">
                                        {selectedUser.name}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {selectedUser.email}
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Badge
                                            variant={
                                                selectedUser.role === "admin"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {selectedUser.role}
                                        </Badge>
                                        {getStatusBadge(selectedUser)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">
                                                {selectedUser.totalOrders}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Total Orders
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">
                                                $
                                                {selectedUser.totalSpent.toLocaleString()}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Total Spent
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Member Since:
                                    </span>
                                    <span>
                                        {selectedUser.createdAt.toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Last Login:
                                    </span>
                                    <span>
                                        {selectedUser.lastLoginAt
                                            ? selectedUser.lastLoginAt.toLocaleDateString()
                                            : "Never"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Email Verified:
                                    </span>
                                    <span>
                                        {selectedUser.isEmailVerified
                                            ? "Yes"
                                            : "No"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Account Status:
                                    </span>
                                    <span>
                                        {selectedUser.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
