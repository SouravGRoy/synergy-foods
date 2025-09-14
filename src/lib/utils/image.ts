/**
 * Converts Google Drive sharing links to direct image URLs
 * @param url - The Google Drive sharing URL
 * @returns The direct image URL or the original URL if not a Google Drive link
 */
export function convertGoogleDriveUrl(url: string): string {
    if (!url) return url;
    
    // Check if it's a Google Drive sharing link
    const driveMatch = url.match(/https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    
    if (driveMatch) {
        const fileId = driveMatch[1];
        // Convert to direct image URL
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    
    return url;
}

/**
 * Validates if a URL is accessible for image display
 * @param url - The image URL to validate
 * @returns Promise<boolean> - True if the image is accessible
 */
export async function validateImageUrl(url: string): Promise<boolean> {
    if (!url) return false;
    
    try {
        // For Google Drive URLs, assume they're valid after conversion
        if (url.includes('drive.google.com')) {
            return true;
        }
        
        // For other URLs, try to fetch with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(url, { 
            method: 'HEAD',
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ImageValidator/1.0)'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) return false;
        
        const contentType = response.headers.get('content-type');
        return contentType ? contentType.startsWith('image/') : false;
        
    } catch (error) {
        // If fetch fails (CORS, network, etc.), assume the URL might still be valid
        // This is more permissive but avoids blocking valid URLs due to CORS
        console.warn('Image URL validation failed:', error);
        return true; // Fail open - let the browser handle it
    }
}

/**
 * Simple URL validation for image URLs (client-side safe)
 * @param url - The image URL to validate
 * @returns boolean - True if the URL looks like a valid image URL
 */
export function isValidImageUrl(url: string): boolean {
    if (!url) return false;
    
    try {
        const urlObj = new URL(url);
        
        // Check if it's a valid URL
        if (!urlObj.protocol.startsWith('http')) return false;
        
        // Check for common image extensions
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
        const pathname = urlObj.pathname.toLowerCase();
        const hasImageExtension = imageExtensions.some((ext) => pathname.endsWith(ext));
        
        // Allow Google Drive URLs or URLs with image extensions
        return url.includes('drive.google.com') ||
               url.includes('uploadthing') ||
               hasImageExtension ||
               url.includes('unsplash') ||
               url.includes('imgur') ||
               url.includes('cloudinary');
               
    } catch {
        return false;
    }
}
