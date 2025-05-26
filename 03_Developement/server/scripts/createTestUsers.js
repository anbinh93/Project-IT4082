const bcrypt = require('bcryptjs');
const { User } = require('../db/models');

async function createTestUsers() {
  try {
    console.log('Creating test users...');

    const salt = await bcrypt.genSalt(10);

    // Tạo admin user
    const adminPassword = await bcrypt.hash('admin123', salt);
    const [adminUser, adminCreated] = await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        username: 'admin',
        password: adminPassword,
        role: 'admin'
      }
    });

    if (adminCreated) {
      console.log('✅ Admin user created: username=admin, password=admin123, role=admin');
    } else {
      // Cập nhật role nếu user đã tồn tại
      await adminUser.update({ role: 'admin' });
      console.log('✅ Admin user updated: username=admin, role=admin');
    }

    // Tạo accountant user
    const accountantPassword = await bcrypt.hash('accountant123', salt);
    const [accountantUser, accountantCreated] = await User.findOrCreate({
      where: { username: 'accountant' },
      defaults: {
        username: 'accountant',
        password: accountantPassword,
        role: 'accountant'
      }
    });

    if (accountantCreated) {
      console.log('✅ Accountant user created: username=accountant, password=accountant123, role=accountant');
    } else {
      await accountantUser.update({ role: 'accountant' });
      console.log('✅ Accountant user updated: username=accountant, role=accountant');
    }

    // Tạo manager user
    const managerPassword = await bcrypt.hash('manager123', salt);
    const [managerUser, managerCreated] = await User.findOrCreate({
      where: { username: 'manager' },
      defaults: {
        username: 'manager',
        password: managerPassword,
        role: 'manager'
      }
    });

    if (managerCreated) {
      console.log('✅ Manager user created: username=manager, password=manager123, role=manager');
    } else {
      await managerUser.update({ role: 'manager' });
      console.log('✅ Manager user updated: username=manager, role=manager');
    }

    console.log('\n🎉 All test users ready!');
    console.log('\nLogin credentials:');
    console.log('Admin: username=admin, password=admin123');
    console.log('Accountant: username=accountant, password=accountant123');
    console.log('Manager: username=manager, password=manager123');

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    process.exit();
  }
}

createTestUsers(); 