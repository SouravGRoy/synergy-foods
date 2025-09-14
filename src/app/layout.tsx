import { Metadata, Viewport } from "next";
import "./globals.css";
import { ClientProvider, ServerProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import { cn, getAbsoluteURL } from "@/lib/utils";
import {
    dmsans,
    inter,
    lato,
    merriweather,
    montserrat,
    openSans,
    playfairDisplay,
    poppins,
    roboto,
    rubik,
} from "./font";

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
    colorScheme: "light",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: "%s - " + siteConfig.name,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [siteConfig.developer],
    publisher: `${siteConfig.name} Team`,
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    referrer: "origin-when-cross-origin",
    category: siteConfig.category,
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: siteConfig.name,
    },
    creator: siteConfig.name,
    openGraph: {
        title: siteConfig.name,
        description: siteConfig.description,
        url: getAbsoluteURL(),
        siteName: siteConfig.name,
        images: [
            {
                ...siteConfig.og,
                alt: siteConfig.name,
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        images: [siteConfig.og.url],
        creator: "@itsdrvgo",
    },
    icons: {
        icon: [
            {
                url: "/favicon.ico",
                sizes: "32x32",
                type: "image/x-icon",
            },
            {
                url: "/",
                sizes: "96x96",
                type: "image/png",
            },
        ],
        apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    metadataBase: new URL(getAbsoluteURL()),
};

export default function RootLayout({ children }: LayoutProps) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={cn(
                dmsans.variable,
                rubik.variable,
                inter.variable,
                roboto.variable,
                openSans.variable,
                lato.variable,
                montserrat.variable,
                poppins.variable,
                playfairDisplay.variable,
                merriweather.variable
            )}
        >
            <ServerProvider>
                <body
                    className={cn("min-h-screen overflow-x-hidden antialiased")}
                >
                    <ClientProvider>
                        {children}
                        <Toaster />
                    </ClientProvider>
                </body>
            </ServerProvider>
        </html>
    );
}
