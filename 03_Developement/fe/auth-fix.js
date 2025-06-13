// Fix authentication and test fee creation
// Run this in browser console

// Generate valid admin token
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0OTc5NTQzNCwiZXhwIjoxNzQ5ODgxODM0fQ.WNqC7CojfYR0-30CThinLH0YeATxJfV2bKU070Bx8y0';

// Set authentication token in localStorage
localStorage.setItem('authToken', token);
localStorage.setItem('user', JSON.stringify({
  id: 1,
  username: 'admin',
  role: 'admin'
}));

console.log('✅ Admin token set successfully!');
console.log('🔄 Please refresh the page to use the new token.');

// Test API call
fetch('http://localhost:8000/api/khoan-thu', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('📊 Fee types loaded:', data);
})
.catch(error => {
  console.error('❌ Error:', error);
});
