import { IncomingHttpHeaders } from "http";
import { LocalIcon } from "@/components/icons";
import { HTMLAttributes, ReactNode } from "react";
import { WebhookRequiredHeaders } from "svix";

// Re-export category types for easier importing
export type {
    Category,
    Subcategory,
    ProductType,
    CategoryRequest,
    CreateCategory,
    CreateSubcategory,
    CreateProductType,
    CreateCategoryRequest,
    UpdateCategory,
    UpdateSubcategory,
    UpdateProductType,
    UpdateCategoryRequest,
    CachedCategory,
    CachedSubcategory,
    CachedProductType,
} from "@/lib/validations/category";

// Cart and wishlist types
export interface CartItem {
    id: string;
    userId: string;
    productId: string;
    variantId?: string | null;
    quantity: number;
    status: "active" | "saved_for_later";
    product: {
        id: string;
        name: string;
        slug: string;
        price: number | null;
        compareAtPrice?: number | null;
        quantity?: number | null;
        images?: string[];
        isAvailable: boolean;
        isActive: boolean;
        isDeleted: boolean;
        verificationStatus: string;
        isPublished: boolean;
    };
    variant?: {
        id: string;
        price: number;
        quantity: number;
        combination: Record<string, string>;
        isDeleted: boolean;
    } | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface WishlistItem {
    id: string;
    userId: string;
    productId: string;
    product: {
        id: string;
        name: string;
        slug: string;
        price: number | null;
        compareAtPrice?: number | null;
        quantity?: number | null;
        images?: string[];
        isAvailable: boolean;
        isActive: boolean;
        isDeleted: boolean;
        verificationStatus: string;
        isPublished: boolean;
    };
    createdAt: Date;
}

declare global {
    type GenericProps = HTMLAttributes<HTMLElement>;
    type LayoutProps = {
        children: ReactNode;
    };

    type SvixHeaders = IncomingHttpHeaders & WebhookRequiredHeaders;

    type SiteConfig = {
        name: string;
        description: string;
        longDescription?: string;
        category: string;
        og: {
            url: string;
            width: number;
            height: number;
        };
        developer: {
            name: string;
            url: string;
        };
        keywords: string[];
        links?: Partial<Record<LocalIcon, string>>;
        contact: string;
        menu: {
            name: string;
            href: string;
            icon: LocalIcon;
            isExternal?: boolean;
            isDisabled?: boolean;
        }[];
        sidebar: {
            title: string;
            url: string;
            icon: LocalIcon;
            items: {
                title: string;
                url: string;
                isDisabled?: boolean;
            }[];
        }[];
    };
}
