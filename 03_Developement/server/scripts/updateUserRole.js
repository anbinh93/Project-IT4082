const { User } = require('../db/models');

async function updateUserRole() {
  try {
    const username = process.argv[2];
    const role = process.argv[3];

    if (!username || !role) {
      console.log('Usage: node updateUserRole.js <username> <role>');
      console.log('Example: node updateUserRole.js accountant accountant');
      process.exit(1);
    }

    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      console.log(`❌ User '${username}' not found`);
      process.exit(1);
    }

    await user.update({ role });
    console.log(`✅ Updated user '${username}' role to '${role}'`);

  } catch (error) {
    console.error('❌ Error updating user role:', error);
  } finally {
    process.exit();
  }
}

updateUserRole(); 