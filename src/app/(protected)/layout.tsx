import { Footer, NavbarHome } from "@/components/globals/layouts";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: siteConfig.description + " - " + siteConfig.name,
        template: "%s - " + siteConfig.name,
    },
};

interface LayoutProps {
    children: React.ReactNode;
}

export default function ProtectedLayout({ children }: LayoutProps) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <NavbarHome />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
        </div>
    );
}
