import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL || !DATABASE_URL.startsWith("libsql://")) {
  console.error("❌ DATABASE_URL must be set and start with libsql://");
  console.error("Current value:", DATABASE_URL);
  process.exit(1);
}

async function main() {
  console.log("🚀 Pushing schema to Turso...");
  console.log("URL:", DATABASE_URL.split("?")[0]);
  
  // Read the SQL file and remove BOM if present
  const sqlPath = path.join(__dirname, "../prisma/schema.sql");
  let sql = fs.readFileSync(sqlPath, "utf-8");
  
  // Remove UTF-8 BOM if present
  if (sql.charCodeAt(0) === 0xFEFF) {
    sql = sql.slice(1);
  }
  
  // Connect to Turso
  const client = createClient({ url: DATABASE_URL });
  
  // Split by semicolon, handling multi-line statements properly
  const statements: string[] = [];
  let currentStatement = "";
  
  for (const line of sql.split("\n")) {
    const trimmedLine = line.trim();
    // Skip comment-only lines
    if (trimmedLine.startsWith("--")) continue;
    
    currentStatement += line + "\n";
    
    // Check if line ends with semicolon (end of statement)
    if (trimmedLine.endsWith(";")) {
      const stmt = currentStatement.trim().replace(/;$/, "");
      if (stmt.length > 0) {
        statements.push(stmt);
      }
      currentStatement = "";
    }
  }
  
  console.log(`\n📋 Executing ${statements.length} SQL statements...\n`);
  
  let success = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const statement of statements) {
    const preview = statement.replace(/\s+/g, " ").substring(0, 60);
    try {
      await client.execute(statement + ";");
      console.log(`✅ ${preview}...`);
      success++;
    } catch (error: any) {
      const msg = error.message || "";
      // Skip "already exists" errors
      if (msg.includes("already exists") || msg.includes("SQLITE_ERROR") && msg.includes("exists")) {
        console.log(`⏭️  ${preview}... (already exists)`);
        skipped++;
      } else {
        console.error(`❌ ${preview}...`);
        console.error(`   Error: ${msg}`);
        failed++;
      }
    }
  }
  
  console.log(`\n========================================`);
  console.log(`✅ Success: ${success}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`========================================\n`);
  
  if (failed === 0) {
    console.log("🎉 Schema pushed to Turso successfully!");
  } else {
    console.log("⚠️  Some statements failed. Check errors above.");
    process.exit(1);
  }
}

main().catch(console.error);
