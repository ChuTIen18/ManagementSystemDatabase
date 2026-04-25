const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'coffee_shop_db',
    multipleStatements: true,
  });

  try {
    console.log('🔄 Running database migration...');
    
    const schemaPath = path.join(__dirname, '../infrastructure/database/schemas/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    
    await connection.query(sql);
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigration();
