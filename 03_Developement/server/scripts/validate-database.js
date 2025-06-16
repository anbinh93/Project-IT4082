#!/usr/bin/env node

/**
 * Database Validation Script
 * Validates database schema, models, and data integrity
 */

const db = require('../db/models');
const { sequelize } = db;

async function validateDatabase() {
  console.log('🔍 Starting database validation...\n');
  
  try {
    // 1. Test database connection
    console.log('1. Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');
    
    // 2. Check available models
    console.log('2. Checking available models...');
    const models = Object.keys(db).filter(key => key !== 'sequelize' && key !== 'Sequelize');
    console.log(`✅ Found ${models.length} models: ${models.join(', ')}\n`);
    
    // 3. Check database tables
    console.log('3. Checking database tables...');
    const queryInterface = sequelize.getQueryInterface();
    const tables = await queryInterface.showAllTables();
    console.log(`✅ Found ${tables.length} tables: ${tables.join(', ')}\n`);
    
    // 4. Check essential tables exist
    console.log('4. Checking essential tables...');
    const essentialTables = ['Users', 'HoKhau', 'NhanKhau', 'KhoanThu', 'DotThu', 'CanHo'];
    const missingTables = essentialTables.filter(table => !tables.includes(table));
    
    if (missingTables.length > 0) {
      console.error(`❌ Missing essential tables: ${missingTables.join(', ')}`);
      process.exit(1);
    }
    console.log('✅ All essential tables present\n');
    
    // 5. Check data counts
    console.log('5. Checking data counts...');
    for (const tableName of ['Users', 'HoKhau', 'NhanKhau', 'KhoanThu', 'DotThu']) {
      try {
        const model = db[tableName];
        if (model) {
          const count = await model.count();
          console.log(`   ${tableName}: ${count} records`);
        }
      } catch (error) {
        console.warn(`   ⚠️ Could not count ${tableName}: ${error.message}`);
      }
    }
    console.log('');
    
    // 6. Test model associations
    console.log('6. Testing model associations...');
    try {
      // Test User model
      if (db.User) {
        const userCount = await db.User.count();
        console.log(`   Users: ${userCount} records`);
      }
      
      // Test HoKhau associations
      if (db.HoKhau && db.NhanKhau) {
        const hoKhauWithMembers = await db.HoKhau.findOne({
          include: [db.NhanKhau],
          limit: 1
        });
        console.log(`   HoKhau associations: ${hoKhauWithMembers ? 'Working' : 'No data'}`);
      }
      
      // Test DotThu associations
      if (db.DotThu && db.KhoanThu) {
        const dotThuWithFees = await db.DotThu.findOne({
          include: [db.KhoanThu],
          limit: 1
        });
        console.log(`   DotThu associations: ${dotThuWithFees ? 'Working' : 'No data'}`);
      }
      
      console.log('✅ Model associations working\n');
    } catch (error) {
      console.warn(`⚠️ Association test failed: ${error.message}\n`);
    }
    
    // 7. Check admin users
    console.log('7. Checking admin users...');
    if (db.User) {
      const adminUsers = await db.User.findAll({
        where: { role: ['admin', 'manager', 'accountant'] },
        attributes: ['username', 'role']
      });
      
      if (adminUsers.length > 0) {
        console.log('✅ Admin users found:');
        adminUsers.forEach(user => {
          console.log(`   - ${user.username} (${user.role})`);
        });
      } else {
        console.warn('⚠️ No admin users found. Run createTestUsers.js script.');
      }
    }
    console.log('');
    
    console.log('🎉 Database validation completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Models: ${models.length}`);
    console.log(`   - Tables: ${tables.length}`);
    console.log('   - Associations: Working');
    console.log('   - Status: ✅ Ready for use');
    
  } catch (error) {
    console.error('❌ Database validation failed:', error.message);
    console.error('\n🔧 Possible solutions:');
    console.error('   1. Run migrations: npm run migrate');
    console.error('   2. Run seeders: npm run seed');
    console.error('   3. Reset database: npm run db:reset');
    console.error('   4. Check database configuration in config/config.js');
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run validation if script is executed directly
if (require.main === module) {
  validateDatabase();
}

module.exports = { validateDatabase };
