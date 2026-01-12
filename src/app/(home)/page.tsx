import { GeneralShell } from "@/components/globals/layouts";
import {
    Features,
    HeroBannerSection,
    Landing,
    MarketedProducts,
    NewArrivals,
    Type1BannerSection,
    Type2BannerSection,
    Type3BannerSection,
    Type4BannerSection,
} from "@/components/home";
import { queries } from "@/lib/db/queries";
import dynamic from "next/dynamic";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

            {/* Hero banners right after the landing section */}
            <HeroBannerSection />

            <GeneralShell
                classNames={{
                    mainWrapper: "mt-6 md:mt-10",
                    innerWrapper: "xl:max-w-[100rem]",
                }}
            >
                <NewArrivals limit={3} />
            </GeneralShell>

            {/* Type 1 banners after new arrivals */}
            <Type1BannerSection />

            {/* Marketed Products Section - Featured Products Carousel */}
            <MarketedProducts initialData={marketedProductsData} />

            {/* Type 2 banners after marketed products */}
            <Type2BannerSection />

            <GeneralShell
                classNames={{
                    mainWrapper: "mt-10",
                    innerWrapper: "xl:max-w-[100rem]",
                }}
            >
                <BestSelling limit={3} />
            </GeneralShell>

            {/* Type 3 banners after best selling */}
            <Type3BannerSection />

            <GeneralShell
                classNames={{
                    mainWrapper: "mt-0",
                    innerWrapper: "xl:max-w-[100rem]",
                }}
            >
                <Testimonials />
            </GeneralShell>

            {/* Type 4 banners before the showcase */}
            <Type4BannerSection />

            <ShowCase />
        </>
    );
}
