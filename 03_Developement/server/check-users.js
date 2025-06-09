const { User } = require('./db/models');

async function checkUsers() {
  try {
    const users = await User.findAll({ 
      attributes: ['id', 'username', 'role'],
      raw: true 
    });
    
    console.log('Users in database:');
    console.log('================');
    
    if (users.length === 0) {
      console.log('No users found in database');
    } else {
      users.forEach(user => {
        console.log(`ID: ${user.id}, Username: ${user.username}, Role: ${user.role}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit();
  }
}

checkUsers();
