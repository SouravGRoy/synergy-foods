import { GeneralShell } from "@/components/globals/layouts";
import { Features, Landing, Showcase, Testimonials } from "@/components/home";

export default function Page() {
    return (
        <>
            <Landing />
            <GeneralShell
                classNames={{
                    mainWrapper: "mt-20",
                    innerWrapper: "xl:max-w-[100rem]",
                }}
            >
                <Showcase />
            </GeneralShell>
            <GeneralShell
                classNames={{
                    mainWrapper: "mt-0",
                    innerWrapper: "xl:max-w-[100rem]",
                }}
            >
                <Features />
            </GeneralShell>
            <GeneralShell
                classNames={{
                    mainWrapper: "mt-0",
                    innerWrapper: "xl:max-w-[100rem]",
                }}
            >
                <Testimonials />
            </GeneralShell>
        </>
    );
}
