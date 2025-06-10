const db = require('../db/models');            

exports.getDotThu = async (req, res) => {
    try {
        const dotThuList = await db.DotThu.findAll({
            include: [{
                model: db.KhoanThu,
                as: 'khoanThu',
                include: [{
                    model: db.NopPhi,
                    as: 'nopPhi',
                    include: [{
                        model: db.HoKhau,
                        as: 'hoKhau'
                    }]
                }]
            }],
            order: [['ngayTao', 'DESC']]
        });

        const currentDate = new Date();
        
        const formattedDotThu = dotThuList.map(dot => {
            const dotData = dot.toJSON();
            
            const result = {
                maDot: dotData.id, // Plain ID instead of formatted string
                tenDot: dotData.tenDotThu,
                ngayTao: new Date(dotData.ngayTao).toLocaleDateString('vi-VN'),
                hanCuoi: new Date(dotData.thoiHan).toLocaleDateString('vi-VN'),
                trangThai: new Date(dotData.thoiHan) > currentDate ? 'Đang mở' : 'Đã đóng',
                details: {
                    maDot: dotData.id, // Plain ID in details too
                    tenDot: dotData.tenDotThu,
                    ngayTao: new Date(dotData.ngayTao).toLocaleDateString('vi-VN'),
                    hanCuoi: new Date(dotData.thoiHan).toLocaleDateString('vi-VN'),
                    khoanThu: dotData.khoanThu.map(kt => {
                        const householdFees = kt.nopPhi.reduce((acc, np) => {
                            acc[np.hoKhau.soHoKhau] = { // Plain household ID
                                amount: Number(np.soTien),
                                auto: true
                            };
                            return acc;
                        }, {});

                        return {
                            id: kt.id, // Plain ID for khoanThu
                            type: kt.tenKhoanThu.replace(/\s+/g, '_').toUpperCase(),
                            tenKhoan: kt.tenKhoanThu,
                            chiTiet: kt.ghiChu,
                            batBuoc: kt.batBuoc ? 'Bắt buộc' : 'Không bắt buộc',
                            householdFees
                        };
                    })
                },
                isExpanded: false
            };

            return result;
        });

        return res.status(200).json(formattedDotThu);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Thêm đợt thu mới
exports.createDotThu = async (req, res) => {
    try {
        const { tenDotThu, ngayTao, thoiHan } = req.body;

        const dotThu = await db.DotThu.create({
            tenDotThu,
            ngayTao,
            thoiHan
        });

        return res.status(201).json(dotThu);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Cập nhật đợt thu
exports.updateDotThu = async (req, res) => {
    try {
        const { id } = req.params;
        const { tenDotThu, ngayTao, thoiHan } = req.body;

        const dotThu = await db.DotThu.findByPk(id);
        
        if (!dotThu) {
            return res.status(404).json({ message: 'Không tìm thấy đợt thu' });
        }

        await dotThu.update({
            tenDotThu,
            ngayTao,
            thoiHan
        });

        return res.status(200).json(dotThu);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Xóa đợt thu
exports.deleteDotThu = async (req, res) => {
    try {
        const { id } = req.params;
        const dotThu = await db.DotThu.findByPk(id);
        
        if (!dotThu) {
            return res.status(404).json({ message: 'Không tìm thấy đợt thu' });
        }

        // Kiểm tra xem đợt thu có khoản thu nào không
        const hasKhoanThu = await db.DotThu_KhoanThu.count({
            where: { dotThuId: id }
        });

        if (hasKhoanThu > 0) {
            return res.status(400).json({ 
                message: 'Không thể xóa đợt thu này vì đã có khoản thu được thêm vào' 
            });
        }

        await dotThu.destroy();
        return res.status(200).json({ message: 'Đã xóa đợt thu thành công' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// Lấy danh sách khoản thu
exports.getKhoanThu = async (req, res) => {
    try {
        const khoanthu = await db.KhoanThu.findAll({
            include: [{
                model: db.NopPhi,
                as: 'nopPhi'
            }],
        });
        return res.status(200).json(khoanthu);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết một khoản thu
exports.getKhoanThuById = async (req, res) => {
    try {
        const { id } = req.params;
        const khoanthu = await db.KhoanThu.findByPk(id, {
            include: [{
                model: db.NopPhi,
                as: 'nopPhi'
            }]
        });
        
        if (!khoanthu) {
            return res.status(404).json({ message: 'Không tìm thấy khoản thu' });
        }
        
        return res.status(200).json(khoanthu);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Thêm khoản thu mới
exports.createKhoanThu = async (req, res) => {
    try {
        const { dotThuId, tenKhoanThu, batBuoc, ghiChu, hoKhauList } = req.body;

        // Validate dotThu exists
        const dotThu = await db.DotThu.findByPk(dotThuId);
        if (!dotThu) {
            return res.status(404).json({ message: 'Không tìm thấy đợt thu' });
        }

        // Start transaction
        const result = await db.sequelize.transaction(async (t) => {
            // Create KhoanThu
            const khoanThu = await db.KhoanThu.create({
                tenKhoanThu,
                batBuoc,
                ghiChu
            }, { transaction: t });

            // Create DotThu_KhoanThu association
            await db.DotThu_KhoanThu.create({
                dotThuId,
                khoanThuId: khoanThu.id
            }, { transaction: t });

            // Create NopPhi records for each hoKhau
            if (hoKhauList && hoKhauList.length > 0) {
                const nopPhiRecords = hoKhauList.map(item => ({
                    hoKhauId: item.hoKhauId,
                    khoanThuId: khoanThu.id,
                    soTien: item.soTien || 0,
                    trangThai: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }));

                await db.NopPhi.bulkCreate(nopPhiRecords, { transaction: t });
            }

            return khoanThu;
        });

        // Get created KhoanThu with associations
        const createdKhoanThu = await db.KhoanThu.findByPk(result.id, {
            include: [
                {
                    model: db.DotThu,
                    as: 'dotThu'
                },
                {
                    model: db.NopPhi,
                    as: 'nopPhi',
                    include: [{
                        model: db.HoKhau,
                        as: 'hoKhau'
                    }]
                }
            ]
        });

        return res.status(201).json(createdKhoanThu);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Cập nhật khoản thu
exports.updateKhoanThu = async (req, res) => {
    try {
        const { id } = req.params;
        const { tenkhoanthu, thoihan, batbuoc, ghichu } = req.body;

        const khoanthu = await db.KhoanThu.findByPk(id);
        
        if (!khoanthu) {
            return res.status(404).json({ message: 'Không tìm thấy khoản thu' });
        }

        await khoanthu.update({
            tenkhoanthu,
            thoihan,
            batbuoc,
            ghichu
        });

        return res.status(200).json(khoanthu);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Xóa khoản thu
exports.deleteKhoanThu = async (req, res) => {
    try {
        const { id } = req.params;
        const khoanthu = await db.KhoanThu.findByPk(id);
        
        if (!khoanthu) {
            return res.status(404).json({ message: 'Không tìm thấy khoản thu' });
        }

        // Kiểm tra xem có ai đã nộp khoản thu này chưa
        const nopPhiCount = await db.NopPhi.count({
            where: { khoanthu_id: id }
        });

        if (nopPhiCount > 0) {
            return res.status(400).json({ 
                message: 'Không thể xóa khoản thu này vì đã có người nộp' 
            });
        }

        await khoanthu.destroy();
        return res.status(200).json({ message: 'Đã xóa khoản thu thành công' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Xác nhận thanh toán khoản thu
exports.confirmPayment = async (req, res) => {
    try {
        const { khoanThuId, hoKhauId, nguoiNop, ngayNop, soTien } = req.body;

        // Find existing NopPhi record
        const nopPhi = await db.NopPhi.findOne({
            where: {
                khoanThuId,
                hoKhauId
            }
        });

        if (!nopPhi) {
            return res.status(404).json({ 
                message: 'Không tìm thấy bản ghi nộp phí cho khoản thu và hộ khẩu này' 
            });
        }

        if (nopPhi.trangThai) {
            return res.status(400).json({ 
                message: 'Khoản thu này đã được xác nhận thanh toán trước đó' 
            });
        }

        // Update the record
        await nopPhi.update({
            nguoiNop,
            ngayNop: ngayNop || new Date(),
            soTien: soTien || nopPhi.soTien,
            trangThai: true,
        });

        // Get updated record with associations
        const updatedNopPhi = await db.NopPhi.findOne({
            where: {
                khoanThuId,
                hoKhauId
            },
            include: [
                {
                    model: db.KhoanThu,
                    as: 'khoanThu'
                },
                {
                    model: db.HoKhau,
                    as: 'hoKhau'
                }
            ]
        });

        return res.status(200).json(updatedNopPhi);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách hộ khẩu chưa đóng một khoản thu cụ thể
exports.getChuaNopPhi = async (req, res) => {
    try {
        const { khoanthu_id } = req.params;

        // Kiểm tra khoản thu tồn tại
        const khoanthu = await db.KhoanThu.findByPk(khoanthu_id);
        if (!khoanthu) {
            return res.status(404).json({ message: 'Không tìm thấy khoản thu' });
        }

        // Lấy tất cả hộ khẩu và chủ hộ
        const hokhau = await db.HoKhau.findAll({
            include: [
                {
                    model: db.NhanKhau,
                    as: 'chuHo',
                    attributes: ['id', 'hoten']
                }
            ]
        });

        // Lấy danh sách hộ khẩu đã nộp
        const daNopIds = await db.NopPhi.findAll({
            where: { khoanthu_id },
            attributes: ['hokhau_id']
        });

        const daNopHoKhauIds = daNopIds.map(item => item.hokhau_id);
        
        // Lọc ra những hộ chưa nộp
        const chuaNop = hokhau.filter(hk => !daNopHoKhauIds.includes(hk.sohokhau));
        
        // Format lại dữ liệu trả về
        const result = chuaNop.map(hk => ({
            sohokhau: hk.sohokhau,
            tenchuho: hk.chuHo ? hk.chuHo.hoten : 'Chưa có chủ hộ'
        }));

        return res.status(200).json({
            khoanthu: {
                id: khoanthu.id,
                tenkhoanthu: khoanthu.tenkhoanthu,
                thoihan: khoanthu.thoihan
            },
            chuanop: result
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Lấy tất cả các khoản thu mà một hộ chưa nộp
exports.getKhoanThuChuaNop = async (req, res) => {
    try {
        const { hokhau_id } = req.params;

        // Kiểm tra hộ khẩu tồn tại
        const hokhau = await db.HoKhau.findByPk(hokhau_id);
        if (!hokhau) {
            return res.status(404).json({ message: 'Không tìm thấy hộ khẩu' });
        }

        // Lấy tất cả khoản thu
        const tatcaKhoanThu = await db.KhoanThu.findAll();

        // Lấy các khoản thu đã nộp của hộ
        const daNop = await db.NopPhi.findAll({
            where: { hokhau_id },
            attributes: ['khoanthu_id']
        });

        const daNopIds = daNop.map(item => item.khoanthu_id);

        // Lọc ra những khoản thu chưa nộp
        const chuaNop = tatcaKhoanThu.filter(kt => !daNopIds.includes(kt.id));

        return res.status(200).json({
            hokhau: {
                id: hokhau.id,
                mahokhau: hokhau.mahokhau,
                diachi: hokhau.diachi
            },
            khoanthuchuanop: chuaNop
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};