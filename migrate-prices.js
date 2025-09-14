// Migration script to convert prices from cents to AED
// Run this once to fix existing data

const { Client } = require("pg");

// Database connection (update with your actual connection details)
const client = new Client({
    host: "localhost",
    port: 5432,
    database: "your_database_name",
    user: "your_username",
    password: "your_password",
});

async function migratePrices() {
    try {
        await client.connect();
        console.log("Connected to database");

        // Convert product prices from cents to AED
        console.log("Converting product prices...");
        const productResult = await client.query(`
      UPDATE products 
      SET 
        price = CASE WHEN price IS NOT NULL THEN price / 100 ELSE NULL END,
        compare_at_price = CASE WHEN compare_at_price IS NOT NULL THEN compare_at_price / 100 ELSE NULL END,
        cost_per_item = CASE WHEN cost_per_item IS NOT NULL THEN cost_per_item / 100 ELSE NULL END,
        updated_at = NOW()
      WHERE price IS NOT NULL OR compare_at_price IS NOT NULL OR cost_per_item IS NOT NULL
    `);

        console.log(`Updated ${productResult.rowCount} products`);

        // Convert product variant prices from cents to AED
        console.log("Converting product variant prices...");
        const variantResult = await client.query(`
      UPDATE product_variants 
      SET 
        price = CASE WHEN price IS NOT NULL THEN price / 100 ELSE NULL END,
        compare_at_price = CASE WHEN compare_at_price IS NOT NULL THEN compare_at_price / 100 ELSE NULL END,
        cost_per_item = CASE WHEN cost_per_item IS NOT NULL THEN cost_per_item / 100 ELSE NULL END,
        updated_at = NOW()
      WHERE price IS NOT NULL OR compare_at_price IS NOT NULL OR cost_per_item IS NOT NULL
    `);

        console.log(`Updated ${variantResult.rowCount} product variants`);

        console.log("Migration completed successfully!");

        // Show some sample results
        const sampleProducts = await client.query(`
      SELECT title, price, compare_at_price 
      FROM products 
      WHERE price IS NOT NULL 
      LIMIT 3
    `);

        console.log("\nSample products after migration:");
        sampleProducts.rows.forEach((product) => {
            console.log(
                `- ${product.title}: AED ${product.price} (was AED ${product.compare_at_price || "N/A"} compare)`
            );
        });
    } catch (error) {
        console.error("Migration error:", error);
    } finally {
        await client.end();
    }
}

// Run the migration
migratePrices();
