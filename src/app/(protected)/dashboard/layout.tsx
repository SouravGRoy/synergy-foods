import { RoleGuard } from "@/components/auth/role-guard";
import {
    DashboardHeader,
    DashboardSidebar,
} from "@/components/dashboard/layout";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <RoleGuard allowedRoles={["mod", "admin"]} fallbackPath="/">
            <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
                {/* Sidebar */}
                <DashboardSidebar />

                {/* Main Content Area */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Header */}
                    <DashboardHeader />

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                        <div className="mx-auto max-w-7xl">{children}</div>
                    </main>
                </div>
            </div>
        </RoleGuard>
    );
}
