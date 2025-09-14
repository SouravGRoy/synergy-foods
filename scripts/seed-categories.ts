import { db } from "@/lib/db";
import { categories, subcategories, productTypes } from "@/lib/db/schemas";

async function seedCategories() {
    try {
        console.log('Starting to seed categories...');

        // Insert sample categories
        const categoryData = [
            {
                name: "Electronics",
                slug: "electronics", 
                description: "Electronic devices and gadgets",
                isActive: true
            },
            {
                name: "Clothing",
                slug: "clothing",
                description: "Fashion and apparel",
                isActive: true
            },
            {
                name: "Home & Garden",
                slug: "home-garden", 
                description: "Home improvement and gardening supplies",
                isActive: true
            }
        ];

        const insertedCategories = await db.insert(categories).values(categoryData).returning();
        console.log('Inserted categories:', insertedCategories.length);

        // Insert sample subcategories
        const subcategoryData = [
            {
                categoryId: insertedCategories[0].id,
                name: "Smartphones",
                slug: "smartphones",
                description: "Mobile phones and accessories",
                isActive: true
            },
            {
                categoryId: insertedCategories[0].id,
                name: "Laptops",
                slug: "laptops", 
                description: "Portable computers",
                isActive: true
            },
            {
                categoryId: insertedCategories[1].id,
                name: "Men's Clothing",
                slug: "mens-clothing",
                description: "Clothing for men",
                isActive: true
            }
        ];

        const insertedSubcategories = await db.insert(subcategories).values(subcategoryData).returning();
        console.log('Inserted subcategories:', insertedSubcategories.length);

        // Insert sample product types
        const productTypeData = [
            {
                categoryId: insertedCategories[0].id,
                subcategoryId: insertedSubcategories[0].id,
                name: "iPhone",
                slug: "iphone",
                description: "Apple smartphones",
                isActive: true
            },
            {
                categoryId: insertedCategories[0].id,
                subcategoryId: insertedSubcategories[0].id,
                name: "Android Phone",
                slug: "android-phone",
                description: "Android smartphones",
                isActive: true
            }
        ];

        const insertedProductTypes = await db.insert(productTypes).values(productTypeData).returning();
        console.log('Inserted product types:', insertedProductTypes.length);

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding categories:', error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    seedCategories()
        .then(() => {
            console.log('Done!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Seeding failed:', error);
            process.exit(1);
        });
}

export default seedCategories;
