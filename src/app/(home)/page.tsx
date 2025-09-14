import { GeneralShell } from "@/components/globals/layouts";
import {
    Features,
    Landing,
    MarketedProducts,
    NewArrivals,
} from "@/components/home";
import { BannerSections } from "@/components/home/banner-sections";
import { queries } from "@/lib/db/queries";
import dynamic from "next/dynamic";

// Lazy load components that aren't immediately visible
const BestSelling = dynamic(
    () =>
        import("@/components/home/best-selling").then((mod) => ({
            default: mod.BestSelling,
        })),
    {
        loading: () => (
            <div className="h-96 animate-pulse rounded-lg bg-gray-100" />
        ),
    }
);

const Testimonials = dynamic(
    () =>
        import("@/components/home").then((mod) => ({
            default: mod.Testimonials,
        })),
    {
        loading: () => (
            <div className="h-64 animate-pulse rounded-lg bg-gray-100" />
        ),
    }
);

const ShowCase = dynamic(() => import("@/components/home/showcase"), {
    loading: () => (
        <div className="h-96 animate-pulse rounded-lg bg-gray-100" />
    ),
});

export default async function Page() {
    // Only fetch essential above-the-fold data during SSR
    // This reduces server response time significantly
    const marketedProductsData = await queries.product.getMarketedProducts({
        limit: 10,
    });

    return (
        <>
            <Landing />

            <GeneralShell
                classNames={{
                    mainWrapper: "mt-6 md:mt-10",
                    innerWrapper: "xl:max-w-[100rem]",
                }}
            >
                <NewArrivals limit={3} />
            </GeneralShell>

            {/* Load banner sections client-side for faster initial load */}
            <BannerSections />

            {/* Marketed Products Section - Featured Products Carousel */}
            <MarketedProducts initialData={marketedProductsData} />

            <GeneralShell
                classNames={{
                    mainWrapper: "mt-10",
                    innerWrapper: "xl:max-w-[100rem]",
                }}
            >
                <BestSelling limit={3} />
            </GeneralShell>

            <GeneralShell
                classNames={{
                    mainWrapper: "mt-0",
                    innerWrapper: "xl:max-w-[100rem]",
                }}
            >
                <Testimonials />
            </GeneralShell>

            <ShowCase />
        </>
    );
}
