import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, categories, subcategories, productTypes, mediaItems } from "@/lib/db/schemas";
import { eq, and, like, or, desc, asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");
        const limit = parseInt(searchParams.get("limit") || "20");
        const offset = parseInt(searchParams.get("offset") || "0");

        if (!query || query.trim().length < 2) {
            return NextResponse.json({ 
                products: [], 
                total: 0,
                message: "Search query must be at least 2 characters long" 
            });
        }

        const searchTerm = `%${query.trim().toLowerCase()}%`;

        // Search products with related data
        const searchResults = await db
            .select({
                id: products.id,
                title: products.title,
                slug: products.slug,
                price: products.price,
                description: products.description,
                isAvailable: products.isAvailable,
                category: {
                    name: categories.name,
                    slug: categories.slug,
                },
                subcategory: {
                    name: subcategories.name,
                    slug: subcategories.slug,
                },
                productType: {
                    name: productTypes.name,
                    slug: productTypes.slug,
                },
            })
            .from(products)
            .leftJoin(categories, eq(products.categoryId, categories.id))
            .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
            .leftJoin(productTypes, eq(products.productTypeId, productTypes.id))
            .where(
                and(
                    eq(products.isAvailable, true),
                    or(
                        like(products.title, searchTerm),
                        like(products.description, searchTerm),
                        like(categories.name, searchTerm),
                        like(subcategories.name, searchTerm),
                        like(productTypes.name, searchTerm)
                    )
                )
            )
            .orderBy(desc(products.updatedAt))
            .limit(limit)
            .offset(offset);

        // Format results
        const productsWithMedia = searchResults.map(product => {
            return {
                id: product.id,
                name: product.title,
                slug: product.slug,
                price: product.price,
                description: product.description,
                category: product.category?.name ? {
                    name: product.category.name,
                    slug: product.category.slug,
                } : null,
                subcategory: product.subcategory?.name ? {
                    name: product.subcategory.name,
                    slug: product.subcategory.slug,
                } : null,
                productType: product.productType?.name ? {
                    name: product.productType.name,
                    slug: product.productType.slug,
                } : null,
                mediaItems: [], // Will be populated from the media JSON field if needed
            };
        });

        return NextResponse.json({
            products: productsWithMedia,
            total: searchResults.length,
            query: query.trim(),
        });

    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json(
            { 
                error: "Failed to search products",
                products: [],
                total: 0 
            },
            { status: 500 }
        );
    }
}