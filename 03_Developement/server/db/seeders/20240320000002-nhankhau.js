'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('nhankhau', [
      {
        hoten: 'Nguyễn Văn A',
        ngaysinh: new Date('1980-01-01'),
        gioitinh: 'Nam',
        dantoc: 'Kinh',
        tongiao: 'Không',
        cccd: '001080000001',
        ngaycap: new Date('2020-01-01'),
        noicap: 'Hà Nội',
        nghenghiep: 'Giáo viên',
        ghichu: 'Chủ hộ',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hoten: 'Trần Thị B',
        ngaysinh: new Date('1982-02-02'),
        gioitinh: 'Nữ',
        dantoc: 'Kinh',
        tongiao: 'Không',
        cccd: '001082000002',
        ngaycap: new Date('2020-01-01'),
        noicap: 'Hà Nội',
        nghenghiep: 'Kế toán',
        ghichu: 'Vợ chủ hộ',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hoten: 'Nguyễn Văn C',
        ngaysinh: new Date('2005-03-03'),
        gioitinh: 'Nam',
        dantoc: 'Kinh',
        tongiao: 'Không',
        cccd: '001005000003',
        ngaycap: new Date('2021-01-01'),
        noicap: 'Hà Nội',
        nghenghiep: 'Học sinh',
        ghichu: 'Con',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hoten: 'Lê Văn D',
        ngaysinh: new Date('1975-04-04'),
        gioitinh: 'Nam',
        dantoc: 'Kinh',
        tongiao: 'Không',
        cccd: '001075000004',
        ngaycap: new Date('2020-01-01'),
        noicap: 'Hà Nội',
        nghenghiep: 'Kinh doanh',
        ghichu: 'Chủ hộ',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hoten: 'Phạm Thị E',
        ngaysinh: new Date('1978-05-05'),
        gioitinh: 'Nữ',
        dantoc: 'Kinh',
        tongiao: 'Không',
        cccd: '001078000005',
        ngaycap: new Date('2020-01-01'),
        noicap: 'Hà Nội',
        nghenghiep: 'Nội trợ',
        ghichu: 'Vợ chủ hộ',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('nhankhau', null, {});
  }
};