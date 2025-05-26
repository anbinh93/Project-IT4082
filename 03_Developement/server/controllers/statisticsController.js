const db = require('../db/models');
const { Op } = require('sequelize');

/**
 * Truy cập chức năng Thống kê
 * GET /api/statistics/overview
 * Mục đích: Hiển thị giao diện tổng quan về thống kê
 * Actor: Ban Quản Trị (BQT)
 */
exports.getStatisticsOverview = async (req, res) => {
    try {
        const overview = await Promise.all([
            getPopulationStatistics(),
            
            getFeeCollectionStatistics(),
            
            getHouseholdStatistics(),
            
            getRecentActivities()
        ]);

        const [populationStats, feeStats, householdStats, recentActivities] = overview;

        return res.status(200).json({
            overview: {
                population: populationStats,
                feeCollection: feeStats,
                households: householdStats,
                recentActivities: recentActivities
            },
            availableReports: {
                population: {
                    title: "Thống kê Nhân khẩu",
                    description: "Báo cáo về dân số, độ tuổi, giới tính, nghề nghiệp",
                    endpoint: "/api/statistics/population",
                    icon: "users"
                },
                feeCollection: {
                    title: "Thống kê Thu phí",
                    description: "Báo cáo về các khoản thu, tình hình nộp phí",
                    endpoint: "/api/statistics/fee-collection",
                    icon: "dollar-sign"
                },
                households: {
                    title: "Thống kê Hộ khẩu",
                    description: "Báo cáo về số lượng hộ khẩu, phân bố địa lý",
                    endpoint: "/api/statistics/households",
                    icon: "home"
                },
                temporaryResidence: {
                    title: "Thống kê Tạm trú/Tạm vắng",
                    description: "Báo cáo về tình hình tạm trú, tạm vắng",
                    endpoint: "/api/statistics/temporary-residence",
                    icon: "map-pin"
                }
            }
        });

    } catch (error) {
        console.error('Error getting statistics overview:', error);
        return res.status(500).json({
            error: {
                code: 'STATISTICS_OVERVIEW_ERROR',
                message: 'Lỗi khi lấy thống kê tổng quan',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }
        });
    }
};

/**
 * Thống kê nhân khẩu tổng quan
 */
async function getPopulationStatistics() {
    const totalPopulation = await db.NhanKhau.count();
    
    const genderStats = await db.NhanKhau.findAll({
        attributes: [
            'gioitinh',
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
        ],
        group: ['gioitinh']
    });

    const ageGroups = await db.sequelize.query(`
        SELECT 
            CASE 
                WHEN EXTRACT(YEAR FROM AGE(ngaysinh)) < 18 THEN 'Dưới 18'
                WHEN EXTRACT(YEAR FROM AGE(ngaysinh)) BETWEEN 18 AND 60 THEN '18-60'
                ELSE 'Trên 60'
            END as age_group,
            COUNT(*) as count
        FROM nhankhau 
        WHERE ngaysinh IS NOT NULL
        GROUP BY age_group
    `, { type: db.sequelize.QueryTypes.SELECT });

    return {
        total: totalPopulation,
        byGender: genderStats.map(stat => ({
            gender: stat.gioitinh,
            count: parseInt(stat.dataValues.count)
        })),
        byAgeGroup: ageGroups.map(group => ({
            ageGroup: group.age_group,
            count: parseInt(group.count)
        }))
    };
}

/**
 * Thống kê thu phí tổng quan
 */
async function getFeeCollectionStatistics() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // Tổng thu trong năm
    const yearlyTotal = await db.NopPhi.findOne({
        attributes: [
            [db.sequelize.fn('SUM', db.sequelize.col('sotien')), 'total'],
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'transactions']
        ],
        where: {
            ngaynop: {
                [Op.gte]: new Date(currentYear, 0, 1),
                [Op.lt]: new Date(currentYear + 1, 0, 1)
            },
            status: 'ACTIVE'
        }
    });

    // Tổng thu trong tháng
    const monthlyTotal = await db.NopPhi.findOne({
        attributes: [
            [db.sequelize.fn('SUM', db.sequelize.col('sotien')), 'total'],
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'transactions']
        ],
        where: {
            ngaynop: {
                [Op.gte]: new Date(currentYear, currentMonth - 1, 1),
                [Op.lt]: new Date(currentYear, currentMonth, 1)
            },
            status: 'ACTIVE'
        }
    });

    // Số khoản thu đang hoạt động
    const activeFeeTypes = await db.KhoanThu.count();

    return {
        yearly: {
            total: parseFloat(yearlyTotal?.dataValues?.total) || 0,
            transactions: parseInt(yearlyTotal?.dataValues?.transactions) || 0
        },
        monthly: {
            total: parseFloat(monthlyTotal?.dataValues?.total) || 0,
            transactions: parseInt(monthlyTotal?.dataValues?.transactions) || 0
        },
        activeFeeTypes: activeFeeTypes
    };
}

/**
 * Thống kê hộ khẩu tổng quan
 */
async function getHouseholdStatistics() {
    const totalHouseholds = await db.HoKhau.count();

    const byDistrict = await db.HoKhau.findAll({
        attributes: [
            'quan',
            [db.sequelize.fn('COUNT', db.sequelize.col('sohokhau')), 'count']
        ],
        group: ['quan'],
        order: [[db.sequelize.fn('COUNT', db.sequelize.col('sohokhau')), 'DESC']]
    });

    // Thống kê số thành viên trong hộ
    const householdSizes = await db.sequelize.query(`
        SELECT 
            CASE 
                WHEN member_count = 1 THEN '1 người'
                WHEN member_count BETWEEN 2 AND 4 THEN '2-4 người'
                WHEN member_count BETWEEN 5 AND 7 THEN '5-7 người'
                ELSE 'Trên 7 người'
            END as size_group,
            COUNT(*) as count
        FROM (
            SELECT h.sohokhau, COUNT(tv.id) + 1 as member_count
            FROM hokhau h
            LEFT JOIN thanhvienhokhau tv ON h.sohokhau = tv.hokhau_id
            GROUP BY h.sohokhau
        ) household_sizes
        GROUP BY size_group
    `, { type: db.sequelize.QueryTypes.SELECT });

    return {
        total: totalHouseholds,
        byDistrict: byDistrict.slice(0, 5).map(district => ({
            district: district.quan || 'Không xác định',
            count: parseInt(district.dataValues.count)
        })),
        bySizeGroup: householdSizes.map(size => ({
            sizeGroup: size.size_group,
            count: parseInt(size.count)
        }))
    };
}

/**
 * Thống kê hoạt động gần đây
 */
async function getRecentActivities() {
    const recentPayments = await db.NopPhi.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: db.HoKhau,
                as: 'hoKhau',
                include: [{
                    model: db.NhanKhau,
                    as: 'chuHo',
                    attributes: ['hoten']
                }]
            },
            {
                model: db.KhoanThu,
                as: 'khoanThu',
                attributes: ['tenkhoanthu']
            }
        ]
    });

    const recentHouseholds = await db.HoKhau.findAll({
        limit: 3,
        order: [['createdAt', 'DESC']],
        include: [{
            model: db.NhanKhau,
            as: 'chuHo',
            attributes: ['hoten']
        }]
    });

    return {
        recentPayments: recentPayments.map(payment => ({
            id: payment.id,
            amount: payment.sotien,
            householdHead: payment.hoKhau?.chuHo?.hoten || 'N/A',
            feeType: payment.khoanThu?.tenkhoanthu || 'N/A',
            date: payment.createdAt
        })),
        recentHouseholds: recentHouseholds.map(household => ({
            id: household.sohokhau,
            householdHead: household.chuHo?.hoten || 'N/A',
            address: `${household.sonha || ''} ${household.duong || ''}, ${household.phuong || ''}, ${household.quan || ''}`.trim(),
            date: household.createdAt
        }))
    };
}

/**
 * Lấy danh sách các báo cáo có sẵn
 * GET /api/statistics/reports
 */
exports.getAvailableReports = async (req, res) => {
    try {
        const reports = [
            {
                id: 'population-overview',
                title: 'Tổng quan Nhân khẩu',
                category: 'population',
                description: 'Thống kê tổng quan về dân số trong khu vực',
                endpoint: '/api/statistics/population/overview'
            },
            {
                id: 'population-demographics',
                title: 'Nhân khẩu học',
                category: 'population',
                description: 'Phân tích theo độ tuổi, giới tính, nghề nghiệp',
                endpoint: '/api/statistics/population/demographics'
            },
            {
                id: 'fee-collection-summary',
                title: 'Tổng quan Thu phí',
                category: 'fee-collection',
                description: 'Tình hình thu phí tổng quan',
                endpoint: '/api/statistics/fee-collection/summary'
            },
            {
                id: 'fee-collection-detailed',
                title: 'Chi tiết Thu phí',
                category: 'fee-collection',
                description: 'Phân tích chi tiết theo từng khoản thu',
                endpoint: '/api/statistics/fee-collection/detailed'
            },
            {
                id: 'household-distribution',
                title: 'Phân bố Hộ khẩu',
                category: 'households',
                description: 'Phân bố hộ khẩu theo địa lý và quy mô',
                endpoint: '/api/statistics/households/distribution'
            },
            {
                id: 'temporary-residence',
                title: 'Tạm trú/Tạm vắng',
                category: 'temporary-residence',
                description: 'Thống kê tình hình tạm trú, tạm vắng',
                endpoint: '/api/statistics/temporary-residence/summary'
            }
        ];

        return res.status(200).json({
            reports: reports,
            categories: [
                { id: 'population', name: 'Nhân khẩu', icon: 'users' },
                { id: 'fee-collection', name: 'Thu phí', icon: 'dollar-sign' },
                { id: 'households', name: 'Hộ khẩu', icon: 'home' },
                { id: 'temporary-residence', name: 'Tạm trú/Tạm vắng', icon: 'map-pin' }
            ]
        });

    } catch (error) {
        console.error('Error getting available reports:', error);
        return res.status(500).json({
            error: {
                code: 'REPORTS_LIST_ERROR',
                message: 'Lỗi khi lấy danh sách báo cáo',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }
        });
    }
}; 