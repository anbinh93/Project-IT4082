const { HoKhau } = require('./db/models');

async function testNullChuHo() {
  try {
    console.log('Testing household creation with null chuHo...');
    
    const testData = {
      chuHo: null,
      soNha: '123',
      duong: 'Test Street',
      phuong: 'Nhân Chính',
      quan: 'Thanh Xuân',
      thanhPho: 'Hà Nội',
      ngayLamHoKhau: new Date()
    };
    
    const result = await HoKhau.create(testData);
    console.log('Success! Created household:', result.toJSON());
    
  } catch (error) {
    console.error('Error creating household:', error.message);
    console.error('Full error:', error);
  }
  
  process.exit(0);
}

testNullChuHo();
