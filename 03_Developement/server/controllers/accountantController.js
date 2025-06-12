const db = require('../db/models');

// Lấy danh sách khoản thu
exports.getKhoanThu = async (req, res) => {
    try {
        const khoanthu = await db.KhoanThu.findAll();
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
        const { tenKhoanThu, batBuoc, ghiChu } = req.body;
        
        const khoanthu = await db.KhoanThu.create({
            tenKhoanThu,
            batBuoc,
            ghiChu
        });

        return res.status(201).json(khoanthu);
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
        const { khoanthu_id, hokhau_id, ngaynop, sotien, ghichu } = req.body;

        // Kiểm tra khoản thu tồn tại
        const khoanthu = await db.KhoanThu.findByPk(khoanthu_id);
        if (!khoanthu) {
            return res.status(404).json({ message: 'Không tìm thấy khoản thu' });
        }

        // Kiểm tra hộ khẩu tồn tại
        const hokhau = await db.HoKhau.findByPk(hokhau_id);
        if (!hokhau) {
            return res.status(404).json({ message: 'Không tìm thấy hộ khẩu' });
        }

        // Tạo bản ghi nộp phí
        const nopPhi = await db.NopPhi.create({
            khoanthu_id,
            hokhau_id,
            ngaynop: ngaynop || new Date(),
            sotien,
            ghichu
        });

        return res.status(201).json(nopPhi);
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
