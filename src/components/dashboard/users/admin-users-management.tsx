"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import {
    Ban,
    Crown,
    Edit,
    Mail,
    MoreHorizontal,
    Phone,
    Search,
    UserCheck,
    Users,
    UserX,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    role: "user" | "admin" | "mod";
    createdAt: string;
    updatedAt: string;
}

interface UsersResponse {
    data: User[];
    items: number;
    pages: number;
}

interface ApiResponse {
    success: boolean;
    longMessage?: string;
    data: any; // Make this more flexible for now
}

export function AdminUsersManagement() {
    const queryClient = useQueryClient();
    const { user: currentUser } = useUser();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [stats, setStats] = useState({
        total: 0,
        verified: 0,
        admins: 0,
        moderators: 0,
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: "10",
                ...(searchTerm && { search: searchTerm }),
                ...(roleFilter !== "all" && { role: roleFilter }),
            });

            const response = await fetch(`/api/users?${params}`);
            if (!response.ok) throw new Error("Failed to fetch users");

            const apiResponse: ApiResponse = await response.json();

            // The response structure is: { success, longMessage, data }
            // where data contains the pagination info: { data: User[], items: number, pages: number }
            const result = apiResponse.data;

            const users = Array.isArray(result.data) ? result.data : [];
            const items = result.items || 0;
            const pages = result.pages || 1;

            setUsers(users);
            setTotalItems(items);
            setTotalPages(pages);

            // Calculate stats
            setStats({
                total: items,
                verified:
                    users.filter((u: any) => u?.isEmailVerified).length || 0,
                admins:
                    users.filter((u: any) => u?.role === "admin").length || 0,
                moderators:
                    users.filter((u: any) => u?.role === "mod").length || 0,
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm, roleFilter]);

    const handleUpdateUserRole = async (userId: string, newRole: string) => {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `Failed to update user role: ${response.status} - ${errorText}`
                );
            }

            toast.success("User role updated successfully");

            // Invalidate React Query cache for the updated user
            await queryClient.invalidateQueries({ queryKey: ["user", userId] });
            await queryClient.invalidateQueries({ queryKey: ["user"] });

            // If the user being changed is the current user, trigger force refresh
            if (currentUser?.id === userId) {
                // Set localStorage flag to trigger role change detector
                localStorage.setItem("role-changed", "true");
                toast.warning(
                    "Your role has changed. Please refresh the page or logout to see the changes.",
                    {
                        duration: 8000,
                    }
                );

                // Trigger a page refresh after a short delay
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                // Show additional instructions for role changes
                if (newRole === "user") {
                    toast.info(
                        "User has been demoted. They need to logout and login again to lose access.",
                        {
                            duration: 8000,
                        }
                    );
                }
            }

            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error("Error updating user role:", error);
            toast.error("Failed to update user role");
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "admin":
                return (
                    <Badge className="bg-purple-100 text-purple-800">
                        Admin
                    </Badge>
                );
            case "mod":
                return (
                    <Badge className="bg-blue-100 text-blue-800">
                        Moderator
                    </Badge>
                );
            default:
                return <Badge variant="secondary">User</Badge>;
        }
    };

    const getVerificationStatus = (user: User) => {
        if (user.isEmailVerified && user.isPhoneVerified) {
            return (
                <Badge className="bg-green-100 text-green-800">
                    Fully Verified
                </Badge>
            );
        } else if (user.isEmailVerified) {
            return (
                <Badge className="bg-yellow-100 text-yellow-800">
                    Email Verified
                </Badge>
            );
        } else {
            return (
                <Badge className="bg-red-100 text-red-800">Unverified</Badge>
            );
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Users Management
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Manage user accounts, roles, and permissions
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                            <Users className="mr-2 h-4 w-4" />
                            Total Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-gray-500">
                            Registered users
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                            <UserCheck className="mr-2 h-4 w-4" />
                            Verified Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {stats.verified}
                        </div>
                        <p className="text-xs text-green-600">Email verified</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                            <Crown className="mr-2 h-4 w-4" />
                            Admins
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                            {stats.admins}
                        </div>
                        <p className="text-xs text-purple-600">
                            Admin accounts
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                            <UserX className="mr-2 h-4 w-4" />
                            Moderators
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {stats.moderators}
                        </div>
                        <p className="text-xs text-blue-600">
                            Moderator accounts
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>User Accounts</CardTitle>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    placeholder="Search users..."
                                    className="w-64 pl-10"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>

                            <Select
                                value={roleFilter}
                                onValueChange={setRoleFilter}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Roles
                                    </SelectItem>
                                    <SelectItem value="user">Users</SelectItem>
                                    <SelectItem value="mod">
                                        Moderators
                                    </SelectItem>
                                    <SelectItem value="admin">
                                        Admins
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex h-32 items-center justify-center">
                            <div className="text-gray-500">
                                Loading users...
                            </div>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Verification</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                {user.avatarUrl ? (
                                                    <Image
                                                        src={user.avatarUrl}
                                                        alt={`${user.firstName} ${user.lastName}`}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                                                        <Users className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium">
                                                        {user.firstName}{" "}
                                                        {user.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID:{" "}
                                                        {user.id.slice(0, 8)}...
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center text-sm">
                                                    <Mail className="mr-1 h-3 w-3 text-gray-400" />
                                                    {user.email}
                                                </div>
                                                {user.phone && (
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Phone className="mr-1 h-3 w-3 text-gray-400" />
                                                        {user.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getRoleBadge(user.role)}
                                        </TableCell>
                                        <TableCell>
                                            {getVerificationStatus(user)}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                user.createdAt
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        View Profile
                                                    </DropdownMenuItem>
                                                    {user.role !== "admin" && (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleUpdateUserRole(
                                                                    user.id,
                                                                    "admin"
                                                                )
                                                            }
                                                        >
                                                            <Crown className="mr-2 h-4 w-4" />
                                                            Make Admin
                                                        </DropdownMenuItem>
                                                    )}
                                                    {user.role !== "mod" && (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleUpdateUserRole(
                                                                    user.id,
                                                                    "mod"
                                                                )
                                                            }
                                                        >
                                                            <UserCheck className="mr-2 h-4 w-4" />
                                                            Make Moderator
                                                        </DropdownMenuItem>
                                                    )}
                                                    {user.role !== "user" && (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleUpdateUserRole(
                                                                    user.id,
                                                                    "user"
                                                                )
                                                            }
                                                        >
                                                            <Users className="mr-2 h-4 w-4" />
                                                            Make User
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem className="text-red-600">
                                                        <Ban className="mr-2 h-4 w-4" />
                                                        Suspend User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Showing {(currentPage - 1) * 10 + 1} to{" "}
                                {Math.min(currentPage * 10, totalItems)} of{" "}
                                {totalItems} users
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(1, prev - 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(totalPages, prev + 1)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
