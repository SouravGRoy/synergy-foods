"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/react-query/auth";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import {
    BarChart3,
    Box,
    ChevronRight,
    FolderTree,
    Home,
    Image as ImageIcon,
    Megaphone,
    Package,
    Settings,
    ShoppingCart,
    Tag,
    Truck,
    UserCog,
    Users,
    Warehouse,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardSidebar() {
    const pathname = usePathname();
    const { user: clerkUser } = useUser();
    const { useCurrentUser } = useAuth();

    // Use the centralized user hook instead of creating a new query
    const { data: userData } = useCurrentUser();
    const userRole = userData?.role || "user";

    // Define navigation items with role requirements
    const allNavItems = [
        {
            name: "Overview",
            href: "/dashboard",
            icon: Home,
            description: "Dashboard overview and analytics",
            roles: ["mod", "admin"],
        },
        {
            name: "Products",
            href: "/dashboard/products",
            icon: Package,
            description: "Manage your product catalog",
            roles: ["mod", "admin"],
        },
        {
            name: "Categories",
            href: "/dashboard/categories",
            icon: FolderTree,
            description: "Manage categories and subcategories",
            roles: ["mod", "admin"],
        },
        {
            name: "Banners",
            href: "/dashboard/banners",
            icon: ImageIcon,
            description: "Manage homepage and promotional banners",
            roles: ["mod", "admin"],
        },
        {
            name: "Promotional Banners",
            href: "/dashboard/promotional-banners",
            icon: Megaphone,
            description: "Manage promotional banners with layout types",
            roles: ["mod", "admin"],
        },
        // {
        //     name: "Inventory",
        //     href: "/dashboard/inventory",
        //     icon: Warehouse,
        //     description: "Track stock and inventory",
        //     roles: ["mod", "admin"],
        // },
        {
            name: "Orders",
            href: "/dashboard/orders",
            icon: ShoppingCart,
            description: "View and manage orders",
            roles: ["admin"],
        },
        {
            name: "Delivery",
            href: "/dashboard/admin/delivery",
            icon: Truck,
            description: "Manage shipments and delivery tracking",
            roles: ["admin"],
        },
        // {
        //     name: "Customers",
        //     href: "/dashboard/customers",
        //     icon: Users,
        //     description: "Manage customer accounts",
        //     roles: ["admin"],
        // },
        {
            name: "User Management",
            href: "/dashboard/users",
            icon: UserCog,
            description: "Manage user roles and permissions",
            roles: ["admin"],
        },
        // {
        //     name: "Analytics",
        //     href: "/dashboard/analytics",
        //     icon: BarChart3,
        //     description: "Sales and performance metrics",
        //     roles: ["admin"],
        // },
        // {
        //     name: "Promotions",
        //     href: "/dashboard/promotions",
        //     icon: Tag,
        //     description: "Manage discounts and promotions",
        //     roles: ["admin"],
        // },
        {
            name: "Settings",
            href: "/dashboard/settings",
            icon: Settings,
            description: "Admin settings and configuration",
            roles: ["admin"],
        },
    ];

    // Filter navigation items based on user role
    const navigation = allNavItems.filter((item) =>
        item.roles.includes(userRole)
    );

    // Determine dashboard title and colors based on role
    const isAdmin = userRole === "admin";
    const dashboardTitle = isAdmin ? "Admin Panel" : "Moderator Panel";

    return (
        <div className="flex h-full w-72 flex-col border-r border-slate-200/60 bg-white/95 shadow-xl backdrop-blur-sm">
            {/* Logo/Brand */}
            <div className="border-b border-slate-200/60 p-6">
                <div className="flex items-center space-x-3">
                    <div
                        className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-xl shadow-lg ring-1",
                            isAdmin
                                ? "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 ring-blue-600/20"
                                : "bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-700 ring-emerald-600/20"
                        )}
                    >
                        <Box className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-slate-900">
                            {dashboardTitle}
                        </h1>
                        <p className="text-sm text-slate-500">Synergy Foods</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <nav className="space-y-2 pb-4">
                    {navigation.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/dashboard" &&
                                pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block"
                            >
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "group relative h-auto w-full justify-start rounded-xl p-4 text-left transition-all duration-200",
                                        isActive
                                            ? isAdmin
                                                ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm ring-1 ring-blue-200/50"
                                                : "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 shadow-sm ring-1 ring-emerald-200/50"
                                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    {/* Icon container */}
                                    <div
                                        className={cn(
                                            "mr-4 flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                                            isActive
                                                ? isAdmin
                                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25"
                                                    : "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-600/25"
                                                : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-semibold">
                                                {item.name}
                                            </div>
                                        </div>
                                        <div
                                            className={cn(
                                                "mt-1 truncate text-xs leading-tight",
                                                isActive
                                                    ? isAdmin
                                                        ? "text-blue-600"
                                                        : "text-emerald-600"
                                                    : "text-slate-500"
                                            )}
                                        >
                                            {item.description}
                                        </div>
                                    </div>

                                    {/* Active indicator */}
                                    {isActive && (
                                        <ChevronRight
                                            className={cn(
                                                "ml-2 h-4 w-4",
                                                isAdmin
                                                    ? "text-blue-600"
                                                    : "text-emerald-600"
                                            )}
                                        />
                                    )}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200/60 p-6">
                <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
                    <div
                        className={cn(
                            "h-2 w-2 rounded-full",
                            isAdmin ? "bg-blue-500" : "bg-emerald-500"
                        )}
                    ></div>
                    <span>{dashboardTitle} v1.0</span>
                </div>
            </div>
        </div>
    );
}
