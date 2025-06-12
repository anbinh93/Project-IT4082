const bcrypt = require('bcryptjs');
const { User } = require('../db/models');

async function createAdmin() {
  try {
    // Kiểm tra xem admin đã tồn tại chưa
    const existingAdmin = await User.findOne({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Username: admin');
      console.log('Role:', existingAdmin.role);
      
      // Cập nhật role nếu cần
      if (existingAdmin.role !== 'admin') {
        await existingAdmin.update({ role: 'admin' });
        console.log('Updated role to admin');
      }
      
      return;
    }

    // Tạo admin user mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'manager'  // Sử dụng 'manager' thay vì 'admin'
    });

    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Role: manager');
    console.log('ID:', adminUser.id);

    // Tạo thêm manager và accountant user
    const managerPassword = await bcrypt.hash('manager123', salt);
    const accountantPassword = await bcrypt.hash('accountant123', salt);

    await User.create({
      username: 'manager',
      password: managerPassword,
      role: 'manager'
    });

    await User.create({
      username: 'accountant',
      password: accountantPassword,
      role: 'accountant'
    });

    console.log('\nAdditional users created:');
    console.log('Manager - Username: manager, Password: manager123');
    console.log('Accountant - Username: accountant, Password: accountant123');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit();
  }
}

createAdmin(); 