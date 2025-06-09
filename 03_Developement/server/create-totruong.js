/**
 * Script to create a team leader (tổ trưởng) user for testing vehicle management
 */

const db = require('./db/models');
const bcrypt = require('bcryptjs');

async function createToTruong() {
  try {
    console.log('🔧 Creating team leader user...');
    
    const { User } = db;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { username: 'totruong' } 
    });
    
    if (existingUser) {
      console.log('⚠️ Team leader user already exists');
      console.log('User info:', {
        id: existingUser.id,
        username: existingUser.username,
        role: existingUser.role
      });
      return existingUser;
    }
    
    // Create new team leader
    const hashedPassword = await bcrypt.hash('totruong123', 10);
    
    const newUser = await User.create({
      username: 'totruong',
      password: hashedPassword,
      role: 'to_truong'
    });
    
    console.log('✅ Team leader user created successfully!');
    console.log('Login credentials:');
    console.log('  Username: totruong');
    console.log('  Password: totruong123');
    console.log('  Role: to_truong');
    
    return newUser;
    
  } catch (error) {
    console.error('❌ Error creating team leader user:', error);
  } finally {
    await db.sequelize.close();
  }
}

createToTruong();
