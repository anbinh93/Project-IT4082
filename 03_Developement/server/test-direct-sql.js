const { Sequelize } = require('sequelize');
const config = require('./config/config.js');

const sequelize = new Sequelize(config.development);

async function testConstraints() {
  try {
    // Test creating with null directly
    const result = await sequelize.query(`
      INSERT INTO "HoKhau" ("chuHo", "soNha", "duong", "phuong", "quan", "thanhPho", "ngayLamHoKhau", "createdAt", "updatedAt") 
      VALUES (NULL, '123', 'Test Street', 'Nhân Chính', 'Thanh Xuân', 'Hà Nội', NOW(), NOW(), NOW())
      RETURNING *;
    `);
    
    console.log('Success! Created household with NULL chuHo:', result[0]);
    
  } catch (error) {
    console.error('Error:', error.message);
    
    // Try to show constraint info
    try {
      const constraints = await sequelize.query(`
        SELECT * FROM information_schema.table_constraints 
        WHERE table_name = 'HoKhau' AND constraint_type = 'UNIQUE';
      `);
      console.log('Unique constraints:', constraints[0]);
      
      const columns = await sequelize.query(`
        SELECT column_name, is_nullable, column_default, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'HoKhau' AND column_name = 'chuHo';
      `);
      console.log('Column info:', columns[0]);
      
    } catch (err) {
      console.error('Error getting constraint info:', err.message);
    }
  }
  
  await sequelize.close();
}

testConstraints();
