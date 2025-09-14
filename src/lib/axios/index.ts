import { env } from "@/../env";
import _axios from "axios";

// Create dynamic base URL that works for both localhost and all Vercel deployments
const getBaseURL = () => {
    // Always use relative URLs in browser to avoid CORS issues
    if (typeof window !== "undefined") {
        return window.location.origin;
    }
    
    // For SSR, use the environment variable if available, otherwise localhost
    return env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
};

export const axios = _axios.create({
    baseURL: getBaseURL(),
    withCredentials: true, // Include cookies for authentication
});
