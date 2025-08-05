import { Category, Subcategory, ProductType } from "@/lib/validations";

export interface BreadcrumbItem {
    label: string;
    href: string;
}

/**
 * Generate breadcrumb items for category navigation
 */
export function generateCategoryBreadcrumbs(
    category?: Category,
    subcategory?: Subcategory,
    productType?: ProductType
): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: "Home", href: "/" },
        { label: "Shop", href: "/shop" },
    ];

    if (category) {
        breadcrumbs.push({
            label: category.name,
            href: `/shop/categories/${category.slug}`,
        });
    }

    if (subcategory) {
        breadcrumbs.push({
            label: subcategory.name,
            href: `/shop/categories/${category?.slug}/${subcategory.slug}`,
        });
    }

    if (productType) {
        breadcrumbs.push({
            label: productType.name,
            href: `/shop/categories/${category?.slug}/${subcategory?.slug}/${productType.slug}`,
        });
    }

    return breadcrumbs;
}

/**
 * Convert category type to display label
 */
export function getCategoryTypeLabel(type: "category" | "subcategory" | "product_type"): string {
    switch (type) {
        case "category":
            return "Category";
        case "subcategory":
            return "Subcategory";
        case "product_type":
            return "Product Type";
        default:
            return "Unknown";
    }
}

/**
 * Convert status to display label
 */
export function getStatusLabel(status: "pending" | "approved" | "rejected"): string {
    switch (status) {
        case "pending":
            return "Pending";
        case "approved":
            return "Approved";
        case "rejected":
            return "Rejected";
        default:
            return "Unknown";
    }
}

/**
 * Get status color variant for badges
 */
export function getStatusVariant(status: "pending" | "approved" | "rejected"): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case "pending":
            return "outline";
        case "approved":
            return "default";
        case "rejected":
            return "destructive";
        default:
            return "secondary";
    }
}

/**
 * Format commission rate for display
 */
export function formatCommissionRate(commissionRate: number): string {
    return `${(commissionRate / 100).toFixed(1)}%`;
}

/**
 * Generate SEO-friendly meta description for categories
 */
export function generateCategoryMetaDescription(
    category: Category,
    subcategory?: Subcategory,
    productType?: ProductType
): string {
    let description = `Shop ${category.name}`;
    
    if (subcategory) {
        description += ` - ${subcategory.name}`;
    }
    
    if (productType) {
        description += ` - ${productType.name}`;
    }
    
    description += " at Synergy Foods. Find the best products with competitive prices and fast delivery.";
    
    return description;
}

/**
 * Generate category hierarchy path for display
 */
export function getCategoryPath(
    category?: Category,
    subcategory?: Subcategory,
    productType?: ProductType
): string {
    const parts = [];
    
    if (category) parts.push(category.name);
    if (subcategory) parts.push(subcategory.name);
    if (productType) parts.push(productType.name);
    
    return parts.join(" > ");
}