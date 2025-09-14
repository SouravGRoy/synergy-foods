import { QuickBannerCreate } from "@/components/dashboard/banners/quick-banner-create";
import { BannerManagementTable } from "@/components/dashboard/banners/simple-banner-table";
import { queries } from "@/lib/db/queries";
import { cache } from "@/lib/redis/methods";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function BannersPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/auth/sign-in");
    }

    const user = await cache.user.get(userId);

    if (!user || user.role === "user") {
        redirect("/");
    }

    // Fetch initial banners data
    let initialData;
    try {
        const bannersData = await queries.banner.paginate({
            page: 1,
            limit: 10,
        });
        initialData = bannersData;
    } catch (error) {
        console.error("Failed to fetch banners:", error);
        initialData = {
            data: [],
            items: 0,
            pages: 0,
        };
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Banner Management</h1>
                <p className="mt-2 text-gray-600">
                    Create and manage banners for your marketplace
                </p>
            </div>

            <QuickBannerCreate />
            <BannerManagementTable initialData={initialData} />
        </div>
    );
}
