const db = require('../db/models');

exports.getStatisticsOverview = async (req, res) => {
    try {
        const [
            totalUsers,
            totalHoKhau,
            totalNhanKhau,
            totalCanho,
            availableCanho
        ] = await Promise.all([
            db.User.count(),
            db.HoKhau.count(),
            db.NhanKhau.count(),
            db.Canho.count(),
            db.Canho.count({ where: { hoKhauId: null } })
        ]);

        const overview = {
            totalUsers,
            totalHoKhau,
            totalNhanKhau,
            totalCanho,
            availableCanho,
            occupiedCanho: totalCanho - availableCanho,
            timestamp: new Date().toISOString()
        };

        return res.status(200).json({
            success: true,
            data: overview,
            message: 'Thống kê tổng quan thành công'
        });

    } catch (error) {
        console.error('Statistics overview error:', error);
        return res.status(500).json({
            success: false,
            error: 'Lỗi khi lấy thống kê tổng quan',
            details: error.message
        });
    }
};