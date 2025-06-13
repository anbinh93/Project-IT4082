const { Client } = require('pg');

async function clearAllData() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'department_management',
    user: 'postgres',
    password: '123456'
  });

  try {
    await client.connect();
    console.log('🔌 Connected to PostgreSQL');

    // Clear data in correct order (respect foreign keys)
    const clearQueries = [
      'DELETE FROM "ThanhToan"',
      'DELETE FROM "NopPhi"',
      'DELETE FROM "DotThu_KhoanThu"',
      'DELETE FROM "QuanLyXe"',
      'DELETE FROM "ThanhVienHoKhau"',
      'DELETE FROM "DotThu"',
      'DELETE FROM "KhoanThu"',
      'UPDATE "Canho" SET "hoKhauId" = NULL',
      'DELETE FROM "HoKhau"',
      'DELETE FROM "NhanKhau"',
      'DELETE FROM "Canho"',
      'DELETE FROM "LoaiXe"',
      'DELETE FROM "SequelizeMeta" WHERE name NOT LIKE \'%create%\''
    ];

    for (const query of clearQueries) {
      try {
        await client.query(query);
        console.log(`✅ Executed: ${query}`);
      } catch (error) {
        console.log(`⚠️ Warning: ${query} - ${error.message}`);
      }
    }

    // Reset sequences
    const resetSequences = [
      'ALTER SEQUENCE "NhanKhau_id_seq" RESTART WITH 1',
      'ALTER SEQUENCE "HoKhau_id_seq" RESTART WITH 1',
      'ALTER SEQUENCE "KhoanThu_id_seq" RESTART WITH 1',
      'ALTER SEQUENCE "DotThu_id_seq" RESTART WITH 1',
      'ALTER SEQUENCE "LoaiXe_id_seq" RESTART WITH 1',
      'ALTER SEQUENCE "Canho_id_seq" RESTART WITH 1',
      'ALTER SEQUENCE "NopPhi_id_seq" RESTART WITH 1',
      'ALTER SEQUENCE "ThanhToan_id_seq" RESTART WITH 1',
      'ALTER SEQUENCE "QuanLyXe_id_seq" RESTART WITH 1',
      'ALTER SEQUENCE "ThanhVienHoKhau_id_seq" RESTART WITH 1'
    ];

    for (const query of resetSequences) {
      try {
        await client.query(query);
        console.log(`✅ Reset: ${query}`);
      } catch (error) {
        console.log(`⚠️ Warning: ${query} - ${error.message}`);
      }
    }

    console.log('🧹 All data cleared successfully');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

clearAllData();
