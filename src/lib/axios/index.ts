import { env } from "@/../env";
import _axios from "axios";

// Create dynamic base URL that works for both localhost and dev tunnels
const getBaseURL = () => {
    // In production or when NEXT_PUBLIC_BACKEND_URL is set, use it
    if (env.NEXT_PUBLIC_BACKEND_URL) {
        return env.NEXT_PUBLIC_BACKEND_URL;
    }
    
    // For development, use relative URLs to work with both localhost and tunnels
    if (typeof window !== "undefined") {
        return window.location.origin;
    }
    
    // Fallback for SSR
    return "http://localhost:3000";
};

export const axios = _axios.create({
    baseURL: getBaseURL(),
    withCredentials: true, // Include cookies for authentication
});
