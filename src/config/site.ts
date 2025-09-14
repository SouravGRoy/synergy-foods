import { getAbsoluteURL } from "@/lib/utils";

export const siteConfig: SiteConfig = {
    name: "Synergy Food Trading",
    description:
        "A platform for buying and selling digital products and services.",
    longDescription:
        "Synergy Food Trading is a comprehensive platform designed to facilitate the buying and selling of digital products and services. Our marketplace connects freelancers with clients, providing a seamless experience for managing projects, payments, and communication.",
    keywords: [
        "Synergy Food Trading",
        "digital products",
        "digital services",
        "freelancers",
        "clients",
        "project management",
        "payment processing",
        "communication tools",
    ],
    category: "Marketplace",
    developer: {
        name: "kiwie",
        url: "https://www.linkedin.com/in/sourob-guha-roy-0a2ba621a/",
    },
    og: {
        url: getAbsoluteURL("/og.webp"),
        width: 1200,
        height: 630,
    },
    links: {
        Twitter: "https://x.com/itsdrvgo",
        Instagram: "https://www.instagram.com/itsdrvgo",
        Github: "https://github.com/itsdrvgo",
        Youtube: "https://youtube.com/@itsdrvgodev",
        Discord: "https://itsdrvgo.me/support",
    },
    contact: "contact@freveo.com",
    menu: [
        {
            name: "Shop",
            href: "/shop",
            icon: "Store",
        },
        {
            name: "Contact",
            href: "/support",
            icon: "LifeBuoy",
        },
    ],
    sidebar: [],
};
