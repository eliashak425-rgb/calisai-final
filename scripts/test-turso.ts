import { createClient } from "@libsql/client";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set");
  process.exit(1);
}

async function main() {
  console.log("🔌 Testing Turso connection...");
  console.log("URL:", DATABASE_URL.split("?")[0]);
  
  // Use intMode: "number" and disable migrations
  const client = createClient({ 
    url: DATABASE_URL,
    intMode: "number",
  });
  
  try {
    // Try a simple query using batch
    const results = await client.batch([
      "SELECT 1 as test"
    ], "read");
    console.log("✅ Connection successful!", results);
    
    // Try to list tables
    const tables = await client.batch([
      "SELECT name FROM sqlite_master WHERE type='table'"
    ], "read");
    console.log("\n📋 Existing tables:");
    if (tables[0] && tables[0].rows) {
      tables[0].rows.forEach(row => console.log("  -", row.name));
    }
    
    // Try creating a simple table using write mode
    console.log("\n🔧 Trying to create a test table...");
    await client.batch([
      "CREATE TABLE IF NOT EXISTS _test_table (id INTEGER PRIMARY KEY)"
    ], "write");
    console.log("✅ Table creation works!");
    
    // Clean up
    await client.batch([
      "DROP TABLE IF EXISTS _test_table"
    ], "write");
    console.log("✅ Cleanup complete!");
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

main();

