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

      const { count, rows } = await NhanKhau.findAndCountAll({
        where: whereClause,
        attributes: ['id', 'hoTen', 'ngaySinh', 'gioiTinh', 'cccd', 'danToc', 'ngheNghiep', 'soDienThoai'],
        include: [
          {
            model: HoKhau,
            as: 'hoKhauChuHo', // Association from NhanKhau to HoKhau where NhanKhau is chuHo
            attributes: ['soHoKhau'], // Only need to confirm existence
            required: false // LEFT JOIN to include all NhanKhau
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['hoTen', 'ASC']]
      });

      const residents = rows.map(nk => {
        const nkData = nk.get({ plain: true });
        return {
          id: nkData.id,
          hoTen: nkData.hoTen,
          ngaySinh: nkData.ngaySinh,
          gioiTinh: nkData.gioiTinh,
          cccd: nkData.cccd,
          danToc: nkData.danToc,
          ngheNghiep: nkData.ngheNghiep,
          soDienThoai: nkData.soDienThoai,
          isHeadOfHousehold: !!nkData.hoKhauChuHo // True if hoKhauChuHo object exists
        };
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
        attributes: ['id', 'hoTen', 'ngaySinh', 'gioiTinh', 'cccd', 'soDienThoai'],
        order: [['hoTen', 'ASC']]
      });

      res.json({
        success: true,
        data: availableResidents.map(resident => ({
          id: resident.id,
          name: resident.hoTen,
          ngaySinh: resident.ngaySinh,
          gioiTinh: resident.gioiTinh,
          cccd: resident.cccd,
          soDienThoai: resident.soDienThoai
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
        soDienThoai,
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

      // Normalize CCCD (trim spaces)
      const normalizedCCCD = cccd.trim();
      
      // Check if CCCD already exists
      const existingResident = await NhanKhau.findOne({
        where: { cccd: normalizedCCCD }
      });

      if (existingResident) {
        console.log(`🚫 CCCD validation failed: ${normalizedCCCD} already exists for resident ID ${existingResident.id} (${existingResident.hoTen})`);
        return res.status(400).json({
          success: false,
          message: 'Số CCCD này đã tồn tại trong hệ thống'
        });
      }
      
      console.log(`✅ CCCD validation passed: ${normalizedCCCD} is available`);

      // Create new resident
      const newResident = await NhanKhau.create({
        hoTen,
        ngaySinh: new Date(ngaySinh),
        gioiTinh,
        danToc: danToc || 'Kinh',
        tonGiao: tonGiao || 'Không',
        cccd: normalizedCCCD, // Use normalized CCCD
        ngayCap: ngayCap ? new Date(ngayCap) : null,
        noiCap: noiCap || null,
        ngheNghiep: ngheNghiep || null,
        soDienThoai: soDienThoai || null
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

      // Create change history entry
      await LichSuThayDoiHoKhau.create({
        nhanKhauId: residentId,
        hoKhauId: householdId,
        loaiThayDoi: 1, // 1: Thêm vào hộ
        thoiGian: new Date()
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

      // Check if resident is head of household first
      const householdAsHead = await HoKhau.findOne({
        where: { chuHo: id },
        attributes: ['soHoKhau', 'soNha', 'duong', 'phuong', 'quan', 'thanhPho', 'ngayLamHoKhau'],
        include: [
          {
            model: NhanKhau,
            as: 'chuHoInfo',
            attributes: ['id', 'hoTen', 'cccd']
          }
        ]
      });

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

      // Determine if resident is head of household
      const isHeadOfHousehold = householdAsHead !== null;
      
      // Use household data from head position or membership
      const householdData = householdAsHead || currentMembership?.hoKhau;

      // Get other household members if resident is head
      let otherMembers = [];
      const householdId = householdAsHead?.soHoKhau || currentMembership?.hoKhauId;
      
      if (isHeadOfHousehold && householdId) {
        otherMembers = await ThanhVienHoKhau.findAll({
          where: { 
            hoKhauId: householdId,
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
        householdStatus: (householdAsHead || currentMembership) ? 'in_household' : 'no_household',
        isHeadOfHousehold: isHeadOfHousehold,
        currentHousehold: householdData ? {
          soHoKhau: householdData.soHoKhau,
          diaChi: `${householdData.soNha}, ${householdData.duong}, ${householdData.phuong}, ${householdData.quan}, ${householdData.thanhPho}`,
          chuHo: householdData.chuHoInfo?.hoTen || resident.hoTen, // If this person is the head, use their name
          quanHeVoiChuHo: isHeadOfHousehold ? 'chủ hộ' : currentMembership?.quanHeVoiChuHo,
          ngayThemVaoHo: currentMembership?.ngayThemNhanKhau || householdData.ngayLamHoKhau,
          ngayLamHoKhau: householdData.ngayLamHoKhau
        } : null,
        otherHouseholdMembers: otherMembers.map(member => ({
          id: member.nhanKhau.id,
          hoTen: member.nhanKhau.hoTen,
          cccd: member.nhanKhau.cccd,
          quanHeVoiChuHo: member.quanHeVoiChuHo,
          ngayThemVaoHo: member.ngayThemNhanKhau
        })),
        canSeparate: (householdAsHead || currentMembership) !== null,
        separationNotes: (householdAsHead || currentMembership) ? 
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
      const { residentId, targetType, targetHouseholdId, newHouseholdAddress, reason, quanHeVoiChuHoMoi } = req.body;

      if (!residentId || !targetType || !reason) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bắt buộc: residentId, targetType, reason'
        });
      }

      // Validate relationship with new head if moving to existing household
      if (targetType === 'existing' && !quanHeVoiChuHoMoi) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng chọn quan hệ với chủ hộ mới khi chuyển vào hộ có sẵn'
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

      // Check if resident is head of household - prevent separation/removal if they are the head
      const isHeadOfHousehold = await HoKhau.findOne({
        where: { chuHo: residentId }
      });

      if (isHeadOfHousehold) {
        return res.status(400).json({
          success: false,
          // Updated message to be more general
          message: 'Chủ hộ không thể tự xóa mình hoặc tách hộ. Vui lòng chuyển chức chủ hộ cho thành viên khác trước.'
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
      let targetHouseholdId_final = null; // Initialize with null

      // STEP 1: Record the removal from current household
      await LichSuThayDoiHoKhau.create({
        nhanKhauId: residentId,
        hoKhauId: currentMembership.hoKhauId,
        loaiThayDoi: 2, // Removed from household
        thoiGian: new Date(),
        ghiChu: reason // Add reason to history
      });

      // STEP 2: Remove from current household FIRST to avoid constraint violations
      const oldHouseholdId = currentMembership.hoKhauId; // Store for later use if needed
      await currentMembership.destroy();

      // STEP 3: Handle old household if resident was the head - THIS LOGIC IS ALREADY GUARDED BY isHeadOfHousehold CHECK
      // The existing check `if (isHeadOfHousehold)` prevents this block from running if the person is a head.
      // So, no changes needed here for the 'remove' case regarding headship transfer, as heads cannot be removed this way.

      let message = 'Xóa nhân khẩu khỏi hộ thành công';

      // STEP 4: Handle target household creation/assignment OR just removal
      if (targetType === 'new') {
        // Create new household with resident as head
        if (!newHouseholdAddress) {
          return res.status(400).json({
            success: false,
            message: 'Vui lòng cung cấp địa chỉ hộ gia đình mới'
          });
        }

        // Parse address - handle different separator styles
        let addressParts = [];
        
        // Try to split by the expected delimiter ' - '
        if (newHouseholdAddress.includes(' - ')) {
          addressParts = newHouseholdAddress.split(' - ').map(part => part.trim());
        } 
        // If there are no ' - ' delimiters, try comma
        else if (newHouseholdAddress.includes(',')) {
          addressParts = newHouseholdAddress.split(',').map(part => part.trim());
        }
        // If no separators, treat as a single address part
        else {
          addressParts = [newHouseholdAddress.trim()];
        }
        
        const newHouseholdData = {
          chuHo: residentId,
          soNha: addressParts[0] || '',
          duong: addressParts[1] || '',
          phuong: addressParts[2] || 'Nhân Chính',
          quan: addressParts[3] || 'Thanh Xuân',
          thanhPho: addressParts[4] || 'Hà Nội',
          ngayLamHoKhau: new Date()
        };
        
        const newHousehold = await HoKhau.create(newHouseholdData);

        targetHouseholdId_final = newHousehold.soHoKhau;
        message = 'Tách hộ và tạo hộ mới thành công';
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
        message = 'Chuyển hộ thành công';
      } else if (targetType === 'remove') {
        // No further action needed, already removed from household
        // targetHouseholdId_final remains null
        message = 'Xóa nhân khẩu khỏi hộ thành công';
      } else {
        return res.status(400).json({
          success: false,
          message: 'Loại mục tiêu không hợp lệ.'
        });
      }

      // Add to new household only if not just removing
      if (targetType === 'new' || targetType === 'existing') {
        await ThanhVienHoKhau.create({
          nhanKhauId: residentId,
          hoKhauId: targetHouseholdId_final,
          ngayThemNhanKhau: new Date(),
          quanHeVoiChuHo: targetType === 'new' ? 'chủ hộ' : (quanHeVoiChuHoMoi || 'khác')
        });

        // Record the addition in history
        await LichSuThayDoiHoKhau.create({
          nhanKhauId: residentId,
          hoKhauId: targetHouseholdId_final,
          loaiThayDoi: 1, // Added to household
          thoiGian: new Date(),
          ghiChu: reason // Add reason to history
        });
      }

      res.json({
        success: true,
        message: message, // Use dynamic message
        data: {
          residentInfo: {
            id: resident.id,
            hoTen: resident.hoTen,
            cccd: resident.cccd
          },
          oldHousehold: currentHouseholdInfo,
          newHouseholdId: targetHouseholdId_final, // Will be null if only removed
          separationType: targetType,
          reason: reason,
          timestamp: new Date()
        }
      });

    } catch (error) {
      console.error('Error separating household:', error);
      
      // Provide more descriptive error messages
      let errorMessage = 'Lỗi server khi tách hộ';
      
      if (error.name === 'SequelizeValidationError') {
        errorMessage = 'Lỗi xác thực dữ liệu: ' + error.message;
      } else if (error.name === 'SequelizeForeignKeyConstraintError') {
        errorMessage = 'Lỗi ràng buộc dữ liệu: Không thể liên kết với hộ khẩu hoặc nhân khẩu yêu cầu';
      } else if (error.name === 'SequelizeUniqueConstraintError') {
        errorMessage = 'Lỗi dữ liệu trùng lặp: ' + error.message;
      }
      
      res.status(500).json({
        success: false,
        message: errorMessage,
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
        thoiGian: record.thoiGian ? new Date(record.thoiGian).toLocaleDateString('vi-VN') : 'N/A',
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
  },

  // Update resident information
  async updateResident(req, res) {
    try {
      const { id } = req.params;
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
        soDienThoai,
        ghiChu
      } = req.body;

      // Check if resident exists
      const resident = await NhanKhau.findByPk(id);
      if (!resident) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy nhân khẩu'
        });
      }

      // Check if CCCD already exists for another resident
      if (cccd && cccd.trim() !== resident.cccd) {
        const normalizedCCCD = cccd.trim();
        const existingResident = await NhanKhau.findOne({
          where: { 
            cccd: normalizedCCCD,
            id: { [Op.ne]: id }
          }
        });

        if (existingResident) {
          console.log(`🚫 CCCD update failed: ${normalizedCCCD} already exists for resident ID ${existingResident.id} (${existingResident.hoTen})`);
          return res.status(400).json({
            success: false,
            message: 'Số CCCD này đã tồn tại trong hệ thống'
          });
        }
        
        console.log(`✅ CCCD update validation passed: ${normalizedCCCD} is available`);
      }

      // Update resident information
      const updatedData = {
        hoTen: hoTen || resident.hoTen,
        ngaySinh: ngaySinh ? new Date(ngaySinh) : resident.ngaySinh,
        gioiTinh: gioiTinh || resident.gioiTinh,
        danToc: danToc || resident.danToc,
        tonGiao: tonGiao || resident.tonGiao,
        cccd: (cccd && cccd.trim()) || resident.cccd, // Use trimmed CCCD
        ngayCap: ngayCap ? new Date(ngayCap) : resident.ngayCap,
        noiCap: noiCap || resident.noiCap,
        ngheNghiep: ngheNghiep || resident.ngheNghiep,
        soDienThoai: soDienThoai || resident.soDienThoai,
        ghiChu: ghiChu || resident.ghiChu
      };

      // Record the information update in change history BEFORE updating
      // Check if resident belongs to any household
      const householdMembership = await ThanhVienHoKhau.findOne({
        where: { nhanKhauId: id }
      });

      // Also check if resident is head of household
      const householdAsHead = await HoKhau.findOne({
        where: { chuHo: id }
      });

      const householdId = householdMembership?.hoKhauId || householdAsHead?.soHoKhau;

      // Track what fields have changed for the history note
      const changedFields = [];
      if (hoTen && hoTen !== resident.hoTen) changedFields.push('Họ tên');
      if (ngaySinh && new Date(ngaySinh).getTime() !== resident.ngaySinh?.getTime()) changedFields.push('Ngày sinh');
      if (gioiTinh && gioiTinh !== resident.gioiTinh) changedFields.push('Giới tính');
      if (danToc && danToc !== resident.danToc) changedFields.push('Dân tộc');
      if (tonGiao && tonGiao !== resident.tonGiao) changedFields.push('Tôn giáo');
      if (cccd && cccd.trim() !== resident.cccd) changedFields.push('CCCD');
      if (ngayCap && new Date(ngayCap).getTime() !== resident.ngayCap?.getTime()) changedFields.push('Ngày cấp CCCD');
      if (noiCap && noiCap !== resident.noiCap) changedFields.push('Nơi cấp CCCD');
      if (ngheNghiep && ngheNghiep !== resident.ngheNghiep) changedFields.push('Nghề nghiệp');
      if (soDienThoai && soDienThoai !== resident.soDienThoai) changedFields.push('Số điện thoại');
      if (ghiChu && ghiChu !== resident.ghiChu) changedFields.push('Ghi chú');

      await resident.update(updatedData);

      if (householdId && changedFields.length > 0) {
        // Record the information update in history with details of what changed
        await LichSuThayDoiHoKhau.create({
          nhanKhauId: id,
          hoKhauId: householdId,
          loaiThayDoi: 3, // Information update
          thoiGian: new Date(),
          ghiChu: `Cập nhật thông tin: ${changedFields.join(', ')}`
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật thông tin nhân khẩu thành công',
        data: resident
      });
    } catch (error) {
      console.error('Error updating resident:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật thông tin nhân khẩu',
        error: error.message
      });
    }
  },

  // Delete resident
  async deleteResident(req, res) {
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

      // Check if resident is head of any household
      const isHouseholdHead = await HoKhau.findOne({
        where: { chuHo: id }
      });

      if (isHouseholdHead) {
        return res.status(400).json({
          success: false,
          message: 'Không thể xóa nhân khẩu này vì đang là chủ hộ. Vui lòng chuyển chủ hộ trước khi xóa.'
        });
      }

      // Check if resident is member of any household
      const householdMembership = await ThanhVienHoKhau.findOne({
        where: { nhanKhauId: id }
      });

      if (householdMembership) {
        return res.status(400).json({
          success: false,
          message: 'Không thể xóa nhân khẩu này vì đang thuộc về một hộ khẩu. Vui lòng loại bỏ khỏi hộ khẩu trước khi xóa.'
        });
      }

      // Delete the resident
      await resident.destroy();

      res.json({
        success: true,
        message: 'Xóa nhân khẩu thành công'
      });
    } catch (error) {
      console.error('Error deleting resident:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa nhân khẩu',
        error: error.message
      });
    }
  }
};

module.exports = residentController;