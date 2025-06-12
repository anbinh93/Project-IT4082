const { HoKhau, NhanKhau, ThanhVienHoKhau, LichSuThayDoiHoKhau, Sequelize } = require('../db/models');
const { Op } = Sequelize;
const db = require('../db/models');

const residentController = {
  // Get all residents
  async getAllResidents(req, res) {
    try {
      const { page = 1, limit = 100, search } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {};
      if (search) {
        whereClause[Op.or] = [
          { hoTen: { [Op.like]: `%${search}%` } },
          { cccd: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows: residents } = await NhanKhau.findAndCountAll({
        where: whereClause,
        attributes: ['id', 'hoTen', 'ngaySinh', 'gioiTinh', 'cccd', 'danToc', 'ngheNghiep'],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['hoTen', 'ASC']]
      });

      res.json({
        success: true,
        data: {
          residents,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Error fetching residents:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách nhân khẩu',
        error: error.message
      });
    }
  },

  // Get available residents (not assigned to any household)
  async getAvailableResidents(req, res) {
    try {
      const { search } = req.query;

      const whereClause = {};
      if (search) {
        whereClause[Op.or] = [
          { hoTen: { [Op.like]: `%${search}%` } },
          { cccd: { [Op.like]: `%${search}%` } }
        ];
      }

      // Get all residents who are either household members or household heads
      const unavailableResidentIds = new Set();

      // Get residents who are household members
      const householdMembers = await ThanhVienHoKhau.findAll({
        attributes: ['nhanKhauId']
      });
      householdMembers.forEach(member => {
        unavailableResidentIds.add(member.nhanKhauId);
      });

      // Get residents who are household heads
      const householdHeads = await HoKhau.findAll({
        attributes: ['chuHo']
      });
      householdHeads.forEach(household => {
        if (household.chuHo) {
          unavailableResidentIds.add(household.chuHo);
        }
      });

      // Find residents who are not in the unavailable list
      const whereClauseWithAvailability = {
        ...whereClause,
        id: {
          [Op.notIn]: Array.from(unavailableResidentIds)
        }
      };

      const availableResidents = await NhanKhau.findAll({
        where: whereClauseWithAvailability,
        attributes: ['id', 'hoTen', 'ngaySinh', 'gioiTinh', 'cccd'],
        order: [['hoTen', 'ASC']]
      });

      res.json({
        success: true,
        data: availableResidents.map(resident => ({
          id: resident.id,
          name: resident.hoTen,
          ngaySinh: resident.ngaySinh,
          gioiTinh: resident.gioiTinh,
          cccd: resident.cccd
        }))
      });
    } catch (error) {
      console.error('Error fetching available residents:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách nhân khẩu khả dụng',
        error: error.message
      });
    }
  },

  // Get resident by ID
  async getResidentById(req, res) {
    try {
      const { id } = req.params;
      
      const resident = await NhanKhau.findByPk(id, {
        include: [
          {
            model: ThanhVienHoKhau,
            as: 'thanhVienHoKhau',
            include: [
              {
                model: HoKhau,
                as: 'hoKhau',
                attributes: ['soHoKhau']
              }
            ]
          }
        ]
      });

      if (!resident) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy nhân khẩu'
        });
      }

      res.json({
        success: true,
        data: resident
      });
    } catch (error) {
      console.error('Error fetching resident:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin nhân khẩu',
        error: error.message
      });
    }
  },

  // Create new resident
  async createResident(req, res) {
    try {
      const { 
        hoTen, 
        ngaySinh, 
        gioiTinh, 
        danToc, 
        tonGiao, 
        cccd, 
        ngayCap, 
        noiCap, 
        ngheNghiep,
        selectedHouseholdId,
        quanHeVoiChuHo
      } = req.body;

      // Validate required fields
      if (!hoTen || !ngaySinh || !gioiTinh || !cccd) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, ngày sinh, giới tính, CCCD)'
        });
      }

      // Check if CCCD already exists
      const existingResident = await NhanKhau.findOne({
        where: { cccd: cccd }
      });

      if (existingResident) {
        return res.status(400).json({
          success: false,
          message: 'Số CCCD này đã tồn tại trong hệ thống'
        });
      }

      // Create new resident
      const newResident = await NhanKhau.create({
        hoTen,
        ngaySinh: new Date(ngaySinh),
        gioiTinh,
        danToc: danToc || 'Kinh',
        tonGiao: tonGiao || 'Không',
        cccd,
        ngayCap: ngayCap ? new Date(ngayCap) : null,
        noiCap: noiCap || null,
        ngheNghiep: ngheNghiep || null
      });

      // If household is selected, add resident to household
      if (selectedHouseholdId && quanHeVoiChuHo) {
        const household = await HoKhau.findByPk(selectedHouseholdId);
        if (household) {
          await ThanhVienHoKhau.create({
            nhanKhauId: newResident.id,
            hoKhauId: selectedHouseholdId,
            quanHeVoiChuHo: quanHeVoiChuHo,
            ngayThemNhanKhau: new Date()
          });

          // Create change history entry
          await LichSuThayDoiHoKhau.create({
            nhanKhauId: newResident.id,
            hoKhauId: selectedHouseholdId,
            loaiThayDoi: 1, // 1: Thêm vào hộ
            thoiGian: new Date()
          });
        }
      }

      res.status(201).json({
        success: true,
        message: 'Tạo nhân khẩu thành công',
        data: newResident
      });
    } catch (error) {
      console.error('Error creating resident:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo nhân khẩu',
        error: error.message
      });
    }
  },

  // Add resident to household
  async addToHousehold(req, res) {
    try {
      const { residentId, householdId, quanHeVoiChuHo, ngayThem } = req.body;

      // Check if resident exists
      const resident = await NhanKhau.findByPk(residentId);
      if (!resident) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy nhân khẩu'
        });
      }

      // Check if household exists
      const household = await HoKhau.findByPk(householdId);
      if (!household) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy hộ khẩu'
        });
      }

      // Check if resident is already in a household
      const existingMembership = await ThanhVienHoKhau.findOne({
        where: { nhanKhauId: residentId }
      });

      if (existingMembership) {
        return res.status(400).json({
          success: false,
          message: 'Nhân khẩu này đã thuộc về một hộ khẩu khác. Vui lòng sử dụng chức năng tách hộ khẩu để chuyển đổi.'
        });
      }

      // Check if resident is already a household head
      const isHouseholdHead = await HoKhau.findOne({
        where: { chuHo: residentId }
      });

      if (isHouseholdHead) {
        return res.status(400).json({
          success: false,
          message: 'Nhân khẩu này đang là chủ hộ của một hộ khẩu khác.'
        });
      }

      // Add resident to household
      const newMember = await ThanhVienHoKhau.create({
        nhanKhauId: residentId,
        hoKhauId: householdId,
        quanHeVoiChuHo: quanHeVoiChuHo,
        ngayThemNhanKhau: ngayThem || new Date()
      });

      res.json({
        success: true,
        message: 'Thêm nhân khẩu vào hộ khẩu thành công',
        data: newMember
      });
    } catch (error) {
      console.error('Error adding resident to household:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi thêm nhân khẩu vào hộ khẩu',
        error: error.message
      });
    }
  },

  // Get resident household info for separation
  async getResidentHouseholdInfo(req, res) {
    try {
      const { id } = req.params;
      
      // Check if resident exists
      const resident = await NhanKhau.findByPk(id);
      if (!resident) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy nhân khẩu'
        });
      }

      // Get current household membership with detailed info
      const currentMembership = await ThanhVienHoKhau.findOne({
        where: { nhanKhauId: id },
        include: [
          {
            model: HoKhau,
            as: 'hoKhau',
            attributes: ['soHoKhau', 'soNha', 'duong', 'phuong', 'quan', 'thanhPho', 'ngayLamHoKhau'],
            include: [
              {
                model: NhanKhau,
                as: 'chuHoInfo',
                attributes: ['id', 'hoTen', 'cccd']
              }
            ]
          }
        ]
      });

      // Check if resident is head of household
      const isHeadOfHousehold = currentMembership && 
        currentMembership.hoKhau && 
        currentMembership.hoKhau.chuHoInfo &&
        currentMembership.hoKhau.chuHoInfo.id === parseInt(id);

      // Get other household members if resident is head
      let otherMembers = [];
      if (currentMembership && isHeadOfHousehold) {
        otherMembers = await ThanhVienHoKhau.findAll({
          where: { 
            hoKhauId: currentMembership.hoKhauId,
            nhanKhauId: { [Op.ne]: id }
          },
          include: [
            {
              model: NhanKhau,
              as: 'nhanKhau',
              attributes: ['id', 'hoTen', 'cccd', 'ngaySinh', 'gioiTinh']
            }
          ]
        });
      }

      const response = {
        residentInfo: {
          id: resident.id,
          hoTen: resident.hoTen,
          cccd: resident.cccd,
          ngaySinh: resident.ngaySinh,
          gioiTinh: resident.gioiTinh,
          ngheNghiep: resident.ngheNghiep
        },
        householdStatus: currentMembership ? 'in_household' : 'no_household',
        isHeadOfHousehold: isHeadOfHousehold,
        currentHousehold: currentMembership ? {
          soHoKhau: currentMembership.hoKhau.soHoKhau,
          diaChi: `${currentMembership.hoKhau.soNha}, ${currentMembership.hoKhau.duong}, ${currentMembership.hoKhau.phuong}, ${currentMembership.hoKhau.quan}, ${currentMembership.hoKhau.thanhPho}`,
          chuHo: currentMembership.hoKhau.chuHoInfo?.hoTen || 'Chưa có',
          quanHeVoiChuHo: currentMembership.quanHeVoiChuHo,
          ngayThemVaoHo: currentMembership.ngayThemNhanKhau,
          ngayLamHoKhau: currentMembership.hoKhau.ngayLamHoKhau
        } : null,
        otherHouseholdMembers: otherMembers.map(member => ({
          id: member.nhanKhau.id,
          hoTen: member.nhanKhau.hoTen,
          cccd: member.nhanKhau.cccd,
          quanHeVoiChuHo: member.quanHeVoiChuHo,
          ngayThemVaoHo: member.ngayThemNhanKhau
        })),
        canSeparate: currentMembership !== null,
        separationNotes: currentMembership ? 
          (isHeadOfHousehold ? 
            (otherMembers.length > 0 ? 
              'Nhân khẩu này là chủ hộ. Khi tách hộ, thành viên khác sẽ được chọn làm chủ hộ mới.' : 
              'Nhân khẩu này là chủ hộ duy nhất. Hộ khẩu cũ sẽ bị xóa khi tách hộ.'
            ) : 
            'Nhân khẩu này có thể tách hộ thành hộ mới hoặc chuyển sang hộ khác.'
          ) : 
          'Nhân khẩu này hiện không thuộc hộ khẩu nào.'
      };

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Error fetching resident household info:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin hộ khẩu của nhân khẩu',
        error: error.message
      });
    }
  },

  // Separate household - move resident to different household
  async separateHousehold(req, res) {
    try {
      const { residentId, targetType, targetHouseholdId, newHouseholdAddress, reason } = req.body;

      if (!residentId || !targetType || !reason) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bắt buộc: residentId, targetType, reason'
        });
      }

      // Check if resident exists
      const resident = await NhanKhau.findByPk(residentId);
      if (!resident) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy nhân khẩu'
        });
      }

      // Get current household membership with detailed info
      const currentMembership = await ThanhVienHoKhau.findOne({
        where: { nhanKhauId: residentId },
        include: [
          {
            model: HoKhau,
            as: 'hoKhau',
            attributes: ['soHoKhau', 'soNha', 'duong', 'phuong', 'quan', 'thanhPho'],
            include: [
              {
                model: NhanKhau,
                as: 'chuHoInfo',
                attributes: ['id', 'hoTen']
              }
            ]
          }
        ]
      });
      
      if (!currentMembership) {
        const errorResponse = {
          success: false,
          message: 'Nhân khẩu hiện không thuộc hộ khẩu nào',
          data: {
            residentInfo: {
              id: resident.id,
              hoTen: resident.hoTen,
              cccd: resident.cccd
            },
            currentHousehold: null,
            status: 'no_household'
          }
        };
        return res.status(400).json(errorResponse);
      }

      // Get current household info
      const currentHouseholdInfo = {
        soHoKhau: currentMembership.hoKhau.soHoKhau,
        diaChi: `${currentMembership.hoKhau.soNha}, ${currentMembership.hoKhau.duong}, ${currentMembership.hoKhau.phuong}, ${currentMembership.hoKhau.quan}, ${currentMembership.hoKhau.thanhPho}`,
        chuHo: currentMembership.hoKhau.chuHoInfo?.hoTen || 'Chưa có',
        quanHeVoiChuHo: currentMembership.quanHeVoiChuHo,
        ngayThemVaoHo: currentMembership.ngayThemNhanKhau
      };

      // Check if resident is currently head of household
      const currentHousehold = await HoKhau.findByPk(currentMembership.hoKhauId);
      const isCurrentHead = currentHousehold && currentHousehold.chuHo === residentId;
      let targetHouseholdId_final;

      // STEP 1: Record the removal from current household
      await LichSuThayDoiHoKhau.create({
        nhanKhauId: residentId,
        hoKhauId: currentMembership.hoKhauId,
        loaiThayDoi: 2, // Removed from household
        thoiGian: new Date()
      });

      // STEP 2: Remove from current household FIRST to avoid constraint violations
      await currentMembership.destroy();

      // STEP 3: Handle old household if resident was the head - UPDATE BEFORE CREATING NEW
      if (isCurrentHead) {
        // Check if there are other members in the current household
        const otherMembers = await ThanhVienHoKhau.findAll({
          where: { 
            hoKhauId: currentMembership.hoKhauId,
            nhanKhauId: { [Op.ne]: residentId }
          }
        });

        if (otherMembers.length > 0) {
          // There are other members, assign a new head IMMEDIATELY
          const newHeadId = otherMembers[0].nhanKhauId;
          
          await HoKhau.update(
            { chuHo: newHeadId },
            { where: { soHoKhau: currentMembership.hoKhauId } }
          );

          // Update the new head's relationship
          await ThanhVienHoKhau.update(
            { quanHeVoiChuHo: 'chủ hộ' },
            { where: { nhanKhauId: newHeadId, hoKhauId: currentMembership.hoKhauId } }
          );
        } else {
          // No other members, delete the old household IMMEDIATELY
          await HoKhau.destroy({
            where: { soHoKhau: currentMembership.hoKhauId }
          });
        }
      }

      // STEP 4: Handle target household creation/assignment
      if (targetType === 'new') {
        // Create new household with resident as head
        if (!newHouseholdAddress) {
          return res.status(400).json({
            success: false,
            message: 'Vui lòng cung cấp địa chỉ hộ gia đình mới'
          });
        }

        // Parse address
        const addressParts = newHouseholdAddress.split(' - ');
        
        const newHouseholdData = {
          chuHo: residentId,
          soNha: addressParts[0] || '',
          duong: addressParts[1] || '',
          phuong: addressParts[2] || '',
          quan: 'Thanh Xuân',
          thanhPho: 'Hà Nội',
          ngayLamHoKhau: new Date()
        };
        
        const newHousehold = await HoKhau.create(newHouseholdData);

        targetHouseholdId_final = newHousehold.soHoKhau;
      } else if (targetType === 'existing') {
        if (!targetHouseholdId) {
          return res.status(400).json({
            success: false,
            message: 'Vui lòng chọn hộ khẩu đích'
          });
        }

        // Check if target household exists
        const targetHousehold = await HoKhau.findByPk(targetHouseholdId);
        if (!targetHousehold) {
          return res.status(404).json({
            success: false,
            message: 'Không tìm thấy hộ khẩu đích'
          });
        }

        targetHouseholdId_final = targetHouseholdId;
      }

      // Add to new household
      await ThanhVienHoKhau.create({
        nhanKhauId: residentId,
        hoKhauId: targetHouseholdId_final,
        ngayThemNhanKhau: new Date(),
        quanHeVoiChuHo: targetType === 'new' ? 'chủ hộ' : 'khác'
      });

      // Record the addition in history
      await LichSuThayDoiHoKhau.create({
        nhanKhauId: residentId,
        hoKhauId: targetHouseholdId_final,
        loaiThayDoi: 1, // Added to household
        thoiGian: new Date()
      });

      res.json({
        success: true,
        message: 'Tách hộ thành công',
        data: {
          residentInfo: {
            id: resident.id,
            hoTen: resident.hoTen,
            cccd: resident.cccd
          },
          oldHousehold: currentHouseholdInfo,
          newHouseholdId: targetHouseholdId_final,
          separationType: targetType,
          reason: reason,
          timestamp: new Date()
        }
      });

    } catch (error) {
      console.error('Error separating household:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tách hộ',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? {
          name: error.name,
          sql: error.sql,
          parent: error.parent
        } : undefined
      });
    }
  },

  // Get household change history
  async getHouseholdChangeHistory(req, res) {
    try {
      const { page = 1, limit = 20, fromDate, toDate, changeType } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {};
      
      if (fromDate || toDate) {
        whereClause.thoiGian = {};
        if (fromDate) whereClause.thoiGian[Op.gte] = new Date(fromDate);
        if (toDate) whereClause.thoiGian[Op.lte] = new Date(toDate + ' 23:59:59');
      }

      if (changeType) {
        whereClause.loaiThayDoi = changeType;
      }

      const { count, rows: history } = await db.LichSuThayDoiHoKhau.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: NhanKhau,
            as: 'nhanKhau',
            attributes: ['id', 'hoTen', 'cccd']
          },
          {
            model: HoKhau,
            as: 'hoKhau',
            attributes: ['soHoKhau', 'soNha', 'duong', 'phuong']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['thoiGian', 'DESC']]
      });

      // Map change types to Vietnamese descriptions
      const changeTypeMap = {
        1: 'Thêm vào hộ',
        2: 'Xóa khỏi hộ', 
        3: 'Cập nhật thông tin',
        4: 'Tạm vắng',
        5: 'Tạm trú'
      };

      const formattedHistory = history.map(record => ({
        id: record.id,
        tenNhanKhau: record.nhanKhau?.hoTen || 'N/A',
        cccd: record.nhanKhau?.cccd || 'N/A',
        soHoKhau: record.hoKhau?.soHoKhau ? `HK${record.hoKhau.soHoKhau.toString().padStart(3, '0')}` : 'N/A',
        diaChi: record.hoKhau ? `${record.hoKhau.soNha}, ${record.hoKhau.duong}, ${record.hoKhau.phuong}` : 'N/A',
        loaiThayDoi: changeTypeMap[record.loaiThayDoi] || 'Không xác định',
        loaiThayDoiCode: record.loaiThayDoi,
        thoiGian: record.thoiGian ? new Date(record.thoiGian).toLocaleString('vi-VN') : 'N/A',
        chiTiet: `${changeTypeMap[record.loaiThayDoi] || 'Thay đổi'} nhân khẩu ${record.nhanKhau?.hoTen || ''} ${record.loaiThayDoi === 1 ? 'vào' : record.loaiThayDoi === 2 ? 'khỏi' : 'trong'} hộ khẩu ${record.hoKhau?.soHoKhau || ''}`
      }));

      res.json({
        success: true,
        data: {
          history: formattedHistory,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Error fetching household change history:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy lịch sử thay đổi hộ khẩu',
        error: error.message
      });
    }
  }
};

module.exports = residentController;