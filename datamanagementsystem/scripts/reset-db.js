const mysql = require('mysql2/promise');
const readline = require('readline');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function resetDatabase() {
  const dbName = process.env.DB_NAME || 'coffee_shop_db';

  return new Promise((resolve) => {
    rl.question(`⚠️  WARNING: This will DROP and recreate database "${dbName}". Continue? (yes/no): `, async (answer) => {
      if (answer.toLowerCase() !== 'yes') {
        console.log('❌ Operation cancelled');
        rl.close();
        resolve();
        return;
      }

      const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
      });

      try {
        console.log(`🗑️  Dropping database ${dbName}...`);
        await connection.query(`DROP DATABASE IF EXISTS ${dbName}`);
        
        console.log(`📦 Creating database ${dbName}...`);
        await connection.query(`CREATE DATABASE ${dbName}`);
        
        console.log('✅ Database reset successfully!');
        console.log('💡 Run "npm run migrate" and "npm run seed" to setup tables and data');
      } catch (error) {
        console.error('❌ Reset failed:', error.message);
      } finally {
        await connection.end();
        rl.close();
        resolve();
      }
    });
  });
}

resetDatabase();
