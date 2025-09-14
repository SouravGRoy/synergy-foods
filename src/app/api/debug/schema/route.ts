import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // Check if tables exist
        const tablesQuery = `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('categories', 'subcategories', 'product_types')
            ORDER BY table_name;
        `;
        
        const tables = await db.execute(tablesQuery);
        
        // If tables exist, check if they have data
        let categoriesCount = 0;
        let subcategoriesCount = 0;
        let productTypesCount = 0;
        
        const tableNames = tables.map((row: any) => row.table_name);
        
        if (tableNames.includes('categories')) {
            const categoriesResult = await db.execute('SELECT COUNT(*) as count FROM categories');
            categoriesCount = Number(categoriesResult[0]?.count) || 0;
        }
        
        if (tableNames.includes('subcategories')) {
            const subcategoriesResult = await db.execute('SELECT COUNT(*) as count FROM subcategories');
            subcategoriesCount = Number(subcategoriesResult[0]?.count) || 0;
        }
        
        if (tableNames.includes('product_types')) {
            const productTypesResult = await db.execute('SELECT COUNT(*) as count FROM product_types');
            productTypesCount = Number(productTypesResult[0]?.count) || 0;
        }
        
        return Response.json({
            success: true,
            message: "Database schema check completed",
            data: {
                existingTables: tableNames,
                counts: {
                    categories: categoriesCount,
                    subcategories: subcategoriesCount,
                    productTypes: productTypesCount
                }
            }
        });
    } catch (error) {
        console.error('Database schema check failed:', error);
        
        return Response.json({
            success: false,
            message: "Database schema check failed",
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
