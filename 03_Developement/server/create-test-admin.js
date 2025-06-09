const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('./db/models');

async function createTestAdminUser() {
  try {
    // Delete existing test admin if it exists
    await User.destroy({ where: { username: 'testadmin' } });
    
    // Create a new admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = await User.create({
      username: 'testadmin',
      password: hashedPassword,
      role: 'to_truong' // This should have vehicle management permissions
    });
    
    console.log('✅ Test admin user created successfully!');
    console.log('Username: testadmin');
    console.log('Password: admin123');
    console.log('Role: to_truong');
    console.log('ID:', adminUser.id);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit();
  }
}

createTestAdminUser();
