const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'coffee_shop_db',
  });

  try {
    console.log('🌱 Seeding database...');

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Insert admin user
    await connection.query(`
      INSERT INTO users (username, email, password, role, full_name, is_active)
      VALUES 
        ('admin', 'admin@coffeeshop.com', ?, 'admin', 'Administrator', true),
        ('manager1', 'manager@coffeeshop.com', ?, 'manager', 'Quản lý 1', true),
        ('staff1', 'staff1@coffeeshop.com', ?, 'staff', 'Nhân viên 1', true),
        ('pos1', 'pos1@coffeeshop.com', ?, 'pos', 'Thu ngân 1', true)
    `, [hashedPassword, hashedPassword, hashedPassword, hashedPassword]);

    // Insert sample products
    await connection.query(`
      INSERT INTO products (name, description, price, category, is_available)
      VALUES 
        ('Cà phê đen', 'Cà phê đen truyền thống', 25000, 'Coffee', true),
        ('Cà phê sữa', 'Cà phê sữa đá', 30000, 'Coffee', true),
        ('Bạc xỉu', 'Bạc xỉu đá', 32000, 'Coffee', true),
        ('Trà đào cam sả', 'Trà trái cây', 35000, 'Tea', true),
        ('Sinh tố bơ', 'Sinh tố bơ sữa', 40000, 'Smoothie', true)
    `);

    // Insert sample tables
    await connection.query(`
      INSERT INTO tables (table_number, capacity, status, floor)
      VALUES 
        ('T01', 2, 'available', '1'),
        ('T02', 4, 'available', '1'),
        ('T03', 4, 'available', '1'),
        ('T04', 6, 'available', '2'),
        ('T05', 2, 'available', '2')
    `);

    console.log('✅ Database seeded successfully!');
    console.log('\n📝 Default credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seedDatabase();
