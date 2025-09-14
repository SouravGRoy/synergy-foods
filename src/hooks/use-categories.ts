import { useEffect, useState } from "react";

interface Category {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    subcategories?: Subcategory[];
}

interface Subcategory {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    categoryId: string;
    productTypes?: ProductType[];
}

interface ProductType {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    subcategoryId: string;
}

interface UseCategoriesReturn {
    categories: Category[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// Simple in-memory cache with controls
let cachedCategories: Category[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache control utilities
export const categoriesCache = {
    clear: () => {
        cachedCategories = null;
        cacheTimestamp = null;
    },
    isValid: () => {
        return cachedCategories && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION;
    },
    get: () => cachedCategories,
};

export function useCategories(): UseCategoriesReturn {
    const [categories, setCategories] = useState<Category[]>(() => cachedCategories || []);
    const [isLoading, setIsLoading] = useState(!cachedCategories);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        try {
            // Check cache first
            if (categoriesCache.isValid()) {
                setCategories(cachedCategories!);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            
            // Fetch all data in parallel
            const [categoriesResponse, subcategoriesResponse, productTypesResponse] = await Promise.all([
                fetch('/api/categories'),
                fetch('/api/subcategories'),
                fetch('/api/product-types')
            ]);

            // Check each response individually for better error reporting
            if (!categoriesResponse.ok) {
                const errorText = await categoriesResponse.text();
                console.error('Categories API error:', categoriesResponse.status, errorText);
                throw new Error(`Failed to fetch categories: ${categoriesResponse.status} ${errorText}`);
            }
            
            if (!subcategoriesResponse.ok) {
                const errorText = await subcategoriesResponse.text();
                console.error('Subcategories API error:', subcategoriesResponse.status, errorText);
                throw new Error(`Failed to fetch subcategories: ${subcategoriesResponse.status} ${errorText}`);
            }
            
            if (!productTypesResponse.ok) {
                const errorText = await productTypesResponse.text();
                console.error('Product types API error:', productTypesResponse.status, errorText);
                throw new Error(`Failed to fetch product types: ${productTypesResponse.status} ${errorText}`);
            }

            const [categoriesData, subcategoriesData, productTypesData] = await Promise.all([
                categoriesResponse.json(),
                subcategoriesResponse.json(),
                productTypesResponse.json()
            ]);

            console.log('Categories API response:', categoriesData);
            console.log('Subcategories API response:', subcategoriesData);
            console.log('Product Types API response:', productTypesData);

            // Build the hierarchy
            const categoriesWithHierarchy = categoriesData.data
                ?.filter((cat: Category) => cat.isActive)
                .map((category: Category) => {
                    const categorySubcategories = subcategoriesData.data
                        ?.filter((sub: Subcategory) => 
                            sub.categoryId === category.id && sub.isActive
                        )
                        .map((subcategory: Subcategory) => ({
                            ...subcategory,
                            productTypes: productTypesData.data
                                ?.filter((pt: ProductType) => 
                                    pt.subcategoryId === subcategory.id && pt.isActive
                                ) || []
                        })) || [];

                    return {
                        ...category,
                        subcategories: categorySubcategories
                    };
                }) || [];

            // Update cache
            cachedCategories = categoriesWithHierarchy;
            cacheTimestamp = Date.now();
            
            setCategories(categoriesWithHierarchy);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            console.error('Error fetching categories:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        categories,
        isLoading,
        error,
        refetch: fetchCategories
    };
}
