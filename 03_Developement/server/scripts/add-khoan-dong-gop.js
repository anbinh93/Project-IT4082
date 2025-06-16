// Script to add "Khoản đóng góp" fee type to database
const db = require('../db/models');

async function addKhoanDongGop() {
  try {
    // Check if "Khoản đóng góp" already exists
    const existingKhoan = await db.KhoanThu.findOne({
      where: {
        tenkhoanthu: 'Khoản đóng góp'
      }
    });

    if (existingKhoan) {
      console.log('✅ "Khoản đóng góp" already exists in database');
      console.log('Existing record:', {
        id: existingKhoan.id,
        tenkhoanthu: existingKhoan.tenkhoanthu,
        batbuoc: existingKhoan.batbuoc,
        ghichu: existingKhoan.ghichu
      });
      return existingKhoan;
    }

    // Create new "Khoản đóng góp" record
    const newKhoan = await db.KhoanThu.create({
      tenkhoanthu: 'Khoản đóng góp',
      ngaytao: new Date(),
      batbuoc: false, // Không bắt buộc
      ghichu: 'Khoản tự nguyện, không bắt buộc, không có số tiền cố định. Hộ gia đình có thể tự nguyện đóng góp theo khả năng.'
    });

    console.log('✅ Successfully created "Khoản đóng góp" fee type');
    console.log('New record:', {
      id: newKhoan.id,
      tenkhoanthu: newKhoan.tenkhoanthu,
      batbuoc: newKhoan.batbuoc,
      ghichu: newKhoan.ghichu
    });

    return newKhoan;

  } catch (error) {
    console.error('❌ Error adding "Khoản đóng góp":', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  addKhoanDongGop()
    .then(() => {
      console.log('Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

module.exports = { addKhoanDongGop };