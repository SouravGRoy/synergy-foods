/**
 * Utility function to get the proper image URL for display
 * Handles UploadThing URLs and fallback for placeholder images
 */
export function getImageUrl(url: string | null | undefined): string {
    if (!url) {
        return "/images/fallbacks/product-fallback.svg";
    }
    
    // If it's already a data URL or absolute URL, return as-is
    if (url.startsWith("data:") || url.startsWith("http")) {
        return url;
    }
    
    // If it's a relative path, ensure it starts with /
    if (!url.startsWith("/")) {
        return `/${url}`;
    }
    
    return url;
}
