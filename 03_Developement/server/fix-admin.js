const bcrypt = require('bcryptjs');
const { User } = require('./db/models');

async function fixAdminPassword() {
  try {
    console.log('Fixing admin password...');
    
    // Delete existing admin
    await User.destroy({ where: { username: 'admin' } });
    
    // Create new admin with correct password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log('✅ Admin user recreated successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('ID:', adminUser.id);
    
    // Also create to_truong_01 user for testing
    const toTruongPassword = await bcrypt.hash('admin123', salt);
    const toTruongUser = await User.create({
      username: 'to_truong_01',
      password: toTruongPassword,
      role: 'to_truong'
    });
    
    console.log('\n✅ Team leader user created!');
    console.log('Username: to_truong_01');
    console.log('Password: admin123');
    console.log('Role: to_truong');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

fixAdminPassword();
