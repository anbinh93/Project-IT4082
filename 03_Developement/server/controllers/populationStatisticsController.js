const db = require('../db/models');
const { Op } = require('sequelize');

/**
 * TT006 - Thống kê nhân khẩu theo giới tính
 * GET /api/statistics/population/gender
 * Mục đích: Hiển thị số lượng và tỷ lệ nhân khẩu theo từng giới tính
 * Actor: Ban Quản Trị (BQT)
 */
exports.getGenderStatistics = async (req, res) => {
    try {
        console.log('Starting gender statistics query...');
        const totalPopulation = await db.NhanKhau.count();
        console.log('Total population:', totalPopulation);

        if (totalPopulation === 0) {
            return res.status(200).json({
                message: "Chưa có dữ liệu nhân khẩu để thống kê.",
                statistics: {
                    total: 0,
                    byGender: [],
                    chartData: []
                }
            });
        }

        console.log('Executing gender statistics query...');
        const genderStats = await db.NhanKhau.findAll({
            attributes: [
                'gioiTinh',
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
            ],
            group: ['gioiTinh'],
            order: [['gioiTinh', 'ASC']],
            logging: console.log
        });
        console.log('Gender stats result:', genderStats);

        const genderData = genderStats.map(stat => {
            const count = parseInt(stat.dataValues.count);
            const percentage = ((count / totalPopulation) * 100).toFixed(2);
            
            return {
                gender: stat.gioiTinh || 'Không xác định',
                count: count,
                percentage: parseFloat(percentage)
            };
        });

        const chartData = genderData.map(item => ({
            label: item.gender,
            value: item.count,
            percentage: item.percentage
        }));

        return res.status(200).json({
            statistics: {
                total: totalPopulation,
                byGender: genderData,
                chartData: chartData
            },
            summary: {
                totalPopulation: totalPopulation,
                genderDistribution: genderData.reduce((acc, item) => {
                    acc[item.gender] = {
                        count: item.count,
                        percentage: item.percentage
                    };
                    return acc;
                }, {})
            }
        });

    } catch (error) {
        return res.status(500).json({
            error: {
                code: 'GENDER_STATISTICS_ERROR',
                message: 'Lỗi khi lấy thống kê theo giới tính',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }
        });
    }
};

/**
 * TT007 - Thống kê nhân khẩu theo độ tuổi
 * GET /api/statistics/population/age
 * Mục đích: Hiển thị số lượng và tỷ lệ nhân khẩu theo các nhóm độ tuổi
 * Actor: Ban Quản Trị (BQT)
 */
exports.getAgeStatistics = async (req, res) => {
    try {
        const { customAgeGroups } = req.query;
        
        const defaultAgeGroups = [
            { name: '0-6 tuổi', min: 0, max: 6 },
            { name: '7-14 tuổi', min: 7, max: 14 },
            { name: '15-18 tuổi', min: 15, max: 18 },
            { name: '19-30 tuổi', min: 19, max: 30 },
            { name: '31-45 tuổi', min: 31, max: 45 },
            { name: '46-60 tuổi', min: 46, max: 60 },
            { name: 'Trên 60 tuổi', min: 61, max: 150 }
        ];

        let ageGroups = defaultAgeGroups;
        if (customAgeGroups) {
            try {
                ageGroups = JSON.parse(customAgeGroups);
                for (const group of ageGroups) {
                    if (!group.name || group.min === undefined || group.max === undefined || group.min > group.max) {
                        return res.status(400).json({
                            error: {
                                code: 'INVALID_AGE_GROUPS',
                                message: 'Khoảng tuổi không hợp lệ. Tuổi bắt đầu phải nhỏ hơn hoặc bằng tuổi kết thúc.'
                            }
                        });
                    }
                }
            } catch (parseError) {
                return res.status(400).json({
                    error: {
                        code: 'INVALID_AGE_GROUPS_FORMAT',
                        message: 'Định dạng nhóm tuổi không hợp lệ'
                    }
                });
            }
        }

        const populationWithAge = await db.sequelize.query(`
            SELECT 
                id,
                "hoTen",
                "ngaySinh",
                EXTRACT(YEAR FROM AGE("ngaySinh")) as age
            FROM "NhanKhau" 
            WHERE "ngaySinh" IS NOT NULL
        `, { type: db.sequelize.QueryTypes.SELECT });

        if (populationWithAge.length === 0) {
            return res.status(200).json({
                message: "Chưa có dữ liệu nhân khẩu với thông tin ngày sinh để thống kê.",
                statistics: {
                    total: 0,
                    byAgeGroup: [],
                    chartData: []
                }
            });
        }

        const ageGroupStats = ageGroups.map(group => {
            const count = populationWithAge.filter(person => {
                const age = parseInt(person.age);
                return age >= group.min && age <= group.max;
            }).length;

            const percentage = ((count / populationWithAge.length) * 100).toFixed(2);

            return {
                ageGroup: group.name,
                minAge: group.min,
                maxAge: group.max,
                count: count,
                percentage: parseFloat(percentage)
            };
        });

        const chartData = ageGroupStats.map(item => ({
            label: item.ageGroup,
            value: item.count,
            percentage: item.percentage
        }));

        return res.status(200).json({
            statistics: {
                total: populationWithAge.length,
                byAgeGroup: ageGroupStats,
                chartData: chartData,
                ageGroupsUsed: ageGroups
            },
            summary: {
                totalWithAgeData: populationWithAge.length,
                ageDistribution: ageGroupStats
            }
        });

    } catch (error) {
        return res.status(500).json({
            error: {
                code: 'AGE_STATISTICS_ERROR',
                message: 'Lỗi khi lấy thống kê theo độ tuổi',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }
        });
    }
};

/**
 * TT008 - Thống kê biến động nhân khẩu theo khoảng thời gian
 * GET /api/statistics/population/movement
 * Mục đích: Hiển thị số lượng nhân khẩu chuyển đến, chuyển đi trong khoảng thời gian
 * Actor: Ban Quản Trị (BQT)
 */
exports.getPopulationMovement = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;

        if (!fromDate || !toDate) {
            return res.status(400).json({
                error: {
                    code: 'MISSING_DATE_RANGE',
                    message: 'Vui lòng cung cấp ngày bắt đầu và ngày kết thúc'
                }
            });
        }

        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({
                error: {
                    code: 'INVALID_DATE_FORMAT',
                    message: 'Định dạng ngày không hợp lệ'
                }
            });
        }

        if (startDate > endDate) {
            return res.status(400).json({
                error: {
                    code: 'INVALID_DATE_RANGE',
                    message: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu'
                }
            });
        }

        const moveInCount = await db.NhanKhau.count({
            where: {
                createdAt: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            }
        });

        const moveInFromChanges = await db.sequelize.query(`
            SELECT COUNT(*) as count
            FROM lichsuthaydoihokhau 
            WHERE loaithaydoi = 3 
            AND thoigian >= :fromDate 
            AND thoigian <= :toDate
        `, {
            replacements: { 
                fromDate: startDate.toISOString(), 
                toDate: endDate.toISOString() 
            },
            type: db.sequelize.QueryTypes.SELECT
        });

        const moveOutFromChanges = await db.sequelize.query(`
            SELECT COUNT(*) as count
            FROM lichsuthaydoihokhau 
            WHERE loaithaydoi = 4 
            AND thoigian >= :fromDate 
            AND thoigian <= :toDate
        `, {
            replacements: { 
                fromDate: startDate.toISOString(), 
                toDate: endDate.toISOString() 
            },
            type: db.sequelize.QueryTypes.SELECT
        });

        const moveInFromChangesCount = parseInt(moveInFromChanges[0]?.count || 0);
        const moveOutFromChangesCount = parseInt(moveOutFromChanges[0]?.count || 0);

        const totalMoveIn = moveInCount + moveInFromChangesCount;
        const totalMoveOut = moveOutFromChangesCount;
        const netChange = totalMoveIn - totalMoveOut;

        if (totalMoveIn === 0 && totalMoveOut === 0) {
            return res.status(200).json({
                message: "Không có biến động nhân khẩu trong khoảng thời gian này.",
                statistics: {
                    period: {
                        fromDate: fromDate,
                        toDate: toDate
                    },
                    movements: {
                        moveIn: 0,
                        moveOut: 0,
                        netChange: 0
                    }
                }
            });
        }

        return res.status(200).json({
            statistics: {
                period: {
                    fromDate: fromDate,
                    toDate: toDate
                },
                movements: {
                    moveIn: totalMoveIn,
                    moveOut: totalMoveOut,
                    netChange: netChange
                },
                breakdown: {
                    newRegistrations: moveInCount,
                    officialMoveIn: moveInFromChangesCount,
                    officialMoveOut: moveOutFromChangesCount
                }
            },
            summary: {
                totalMovements: totalMoveIn + totalMoveOut,
                netPopulationChange: netChange,
                changeType: netChange > 0 ? 'Tăng' : netChange < 0 ? 'Giảm' : 'Không đổi'
            }
        });

    } catch (error) {
        return res.status(500).json({
            error: {
                code: 'MOVEMENT_STATISTICS_ERROR',
                message: 'Lỗi khi lấy thống kê biến động nhân khẩu',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }
        });
    }
};

/**
 * TT009 - Thống kê nhân khẩu theo tình trạng tạm trú, tạm vắng
 * GET /api/statistics/population/temporary-status
 * Mục đích: Hiển thị số lượng nhân khẩu đang tạm trú, tạm vắng
 * Actor: Ban Quản Trị (BQT)
 */
exports.getTemporaryStatusStatistics = async (req, res) => {
    try {
        const { mode, fromDate, toDate } = req.query;
        const currentDate = new Date();

        let whereCondition = {};

        if (mode === 'period' && fromDate && toDate) {
            const startDate = new Date(fromDate);
            const endDate = new Date(toDate);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({
                    error: {
                        code: 'INVALID_DATE_FORMAT',
                        message: 'Định dạng ngày không hợp lệ'
                    }
                });
            }

            if (startDate > endDate) {
                return res.status(400).json({
                    error: {
                        code: 'INVALID_DATE_RANGE',
                        message: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu'
                    }
                });
            }

            whereCondition = {
                thoiGian: {
                    [Op.between]: [startDate, endDate]
                }
            };
        } else {
            whereCondition = {
                thoiGian: {
                    [Op.lte]: currentDate
                }
            };
        }

        // Get temporary residence count (trangThai = 'đang tạm trú')
        const temporaryResidenceCount = await db.TamTruTamVang.count({
            where: {
                ...whereCondition,
                trangThai: 'đang tạm trú'
            }
        });

        // Get temporary absence count (trangThai = 'tạm vắng')
        const temporaryAbsenceCount = await db.TamTruTamVang.count({
            where: {
                ...whereCondition,
                trangThai: 'tạm vắng'
            }
        });

        const totalTemporary = temporaryResidenceCount + temporaryAbsenceCount;

        if (totalTemporary === 0) {
            const message = mode === 'period' 
                ? "Không có đăng ký tạm trú hoặc tạm vắng trong khoảng thời gian này."
                : "Hiện không có nhân khẩu nào đăng ký tạm trú hoặc tạm vắng.";
            
            return res.status(200).json({
                message: message,
                statistics: {
                    mode: mode || 'current',
                    period: mode === 'period' ? { fromDate, toDate } : null,
                    temporaryStatus: {
                        temporaryResidence: 0,
                        temporaryAbsence: 0,
                        total: 0
                    }
                }
            });
        }

        const { includeDetails } = req.query;
        let detailData = null;

        if (includeDetails === 'true') {
            const temporaryResidenceDetails = await db.TamTruTamVang.findAll({
                where: {
                    ...whereCondition,
                    trangThai: 'đang tạm trú'
                },
                include: [{
                    model: db.NhanKhau,
                    as: 'nhanKhau',
                    attributes: ['hoTen', 'cccd']
                }],
                order: [['thoiGian', 'DESC']]
            });

            const temporaryAbsenceDetails = await db.TamTruTamVang.findAll({
                where: {
                    ...whereCondition,
                    trangThai: 'tạm vắng'
                },
                include: [{
                    model: db.NhanKhau,
                    as: 'nhanKhau',
                    attributes: ['hoTen', 'cccd']
                }],
                order: [['thoiGian', 'DESC']]
            });

            detailData = {
                temporaryResidence: temporaryResidenceDetails.map(item => ({
                    id: item.id,
                    nhankhau_id: item.nhanKhauId,
                    loaithaydoi: 'tạm trú',
                    ngaybatdau: item.thoiGian,
                    ngayketthuc: null,
                    ghichu: item.noiDungDeNghi || 'Đăng ký tạm trú',
                    hoten: item.nhanKhau?.hoTen || 'N/A',
                    cccd: item.nhanKhau?.cccd || 'N/A',
                    diaChi: item.diaChi || 'N/A'
                })),
                temporaryAbsence: temporaryAbsenceDetails.map(item => ({
                    id: item.id,
                    nhankhau_id: item.nhanKhauId,
                    loaithaydoi: 'tạm vắng',
                    ngaybatdau: item.thoiGian,
                    ngayketthuc: null,
                    ghichu: item.noiDungDeNghi || 'Đăng ký tạm vắng',
                    hoten: item.nhanKhau?.hoTen || 'N/A',
                    cccd: item.nhanKhau?.cccd || 'N/A',
                    diaChi: item.diaChi || 'N/A'
                }))
            };
        }

        return res.status(200).json({
            statistics: {
                mode: mode || 'current',
                period: mode === 'period' ? { fromDate, toDate } : null,
                temporaryStatus: {
                    temporaryResidence: temporaryResidenceCount,
                    temporaryAbsence: temporaryAbsenceCount,
                    total: totalTemporary
                },
                chartData: [
                    {
                        label: 'Tạm trú',
                        value: temporaryResidenceCount,
                        percentage: totalTemporary > 0 ? ((temporaryResidenceCount / totalTemporary) * 100).toFixed(2) : 0
                    },
                    {
                        label: 'Tạm vắng',
                        value: temporaryAbsenceCount,
                        percentage: totalTemporary > 0 ? ((temporaryAbsenceCount / totalTemporary) * 100).toFixed(2) : 0
                    }
                ]
            },
            details: detailData
        });

    } catch (error) {
        console.error('Error in getTemporaryStatusStatistics:', error);
        return res.status(500).json({
            error: {
                code: 'TEMPORARY_STATUS_STATISTICS_ERROR',
                message: 'Lỗi khi lấy thống kê tạm trú, tạm vắng',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }
        });
    }
};

/**
 * Tổng quan thống kê nhân khẩu (kết hợp tất cả)
 * GET /api/statistics/population/overview
 */
exports.getPopulationOverview = async (req, res) => {
    try {
        const [genderStats, ageStats, temporaryStats] = await Promise.all([
            getBasicGenderStats(),
            getBasicAgeStats(),
            getBasicTemporaryStats()
        ]);

        return res.status(200).json({
            overview: {
                gender: genderStats,
                age: ageStats,
                temporaryStatus: temporaryStats
            },
            availableReports: [
                {
                    id: 'gender-statistics',
                    title: 'Thống kê theo giới tính',
                    endpoint: '/api/statistics/population/gender',
                    description: 'Phân tích số lượng và tỷ lệ theo giới tính'
                },
                {
                    id: 'age-statistics',
                    title: 'Thống kê theo độ tuổi',
                    endpoint: '/api/statistics/population/age',
                    description: 'Phân tích số lượng và tỷ lệ theo nhóm tuổi'
                },
                {
                    id: 'movement-statistics',
                    title: 'Thống kê biến động',
                    endpoint: '/api/statistics/population/movement',
                    description: 'Thống kê chuyển đến, chuyển đi theo thời gian'
                },
                {
                    id: 'temporary-status',
                    title: 'Thống kê tạm trú/tạm vắng',
                    endpoint: '/api/statistics/population/temporary-status',
                    description: 'Thống kê tình trạng tạm trú, tạm vắng'
                }
            ]
        });

    } catch (error) {
        return res.status(500).json({
            error: {
                code: 'POPULATION_OVERVIEW_ERROR',
                message: 'Lỗi khi lấy tổng quan thống kê nhân khẩu',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }
        });
    }
};

/**
 * Thêm dữ liệu biến động nhân khẩu
 * POST /api/statistics/population/movement
 * Body: {
 *   nhankhau_id: number,
 *   hokhau_id: string,
 *   loaithaydoi: number, // 1: tạm trú, 2: tạm vắng, 3: chuyển đến, 4: chuyển đi
 *   thoigian: string, // YYYY-MM-DD
 *   ghichu: string // optional
 * }
 */
exports.addPopulationMovement = async (req, res) => {
    try {
        const { nhankhau_id, hokhau_id, loaithaydoi, thoigian, ghichu } = req.body;

        if (!nhankhau_id || !hokhau_id || !loaithaydoi || !thoigian) {
            return res.status(400).json({
                error: {
                    code: 'MISSING_REQUIRED_FIELDS',
                    message: 'Vui lòng cung cấp đầy đủ thông tin: nhankhau_id, hokhau_id, loaithaydoi, thoigian'
                }
            });
        }

        if (![1, 2, 3, 4].includes(loaithaydoi)) {
            return res.status(400).json({
                error: {
                    code: 'INVALID_CHANGE_TYPE',
                    message: 'loaithaydoi phải là 1 (tạm trú), 2 (tạm vắng), 3 (chuyển đến) hoặc 4 (chuyển đi)'
                }
            });
        }

        const changeDate = new Date(thoigian);
        if (isNaN(changeDate.getTime())) {
            return res.status(400).json({
                error: {
                    code: 'INVALID_DATE_FORMAT',
                    message: 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'
                }
            });
        }

        const nhankhau = await db.NhanKhau.findByPk(nhankhau_id);
        if (!nhankhau) {
            return res.status(404).json({
                error: {
                    code: 'NHANKHAU_NOT_FOUND',
                    message: 'Không tìm thấy nhân khẩu với ID đã cung cấp'
                }
            });
        }

        const hokhau = await db.HoKhau.findByPk(hokhau_id);
        if (!hokhau) {
            return res.status(404).json({
                error: {
                    code: 'HOKHAU_NOT_FOUND',
                    message: 'Không tìm thấy hộ khẩu với ID đã cung cấp'
                }
            });
        }

        const newChange = await db.LichSuThayDoiHoKhau.create({
            nhankhau_id,
            hokhau_id,
            loaithaydoi,
            thoigian: changeDate,
            ghichu: ghichu || null
        });

        return res.status(201).json({
            message: 'Đã thêm dữ liệu biến động nhân khẩu thành công',
            data: {
                id: newChange.id,
                nhankhau_id: newChange.nhankhau_id,
                hokhau_id: newChange.hokhau_id,
                loaithaydoi: newChange.loaithaydoi,
                thoigian: newChange.thoigian,
                ghichu: newChange.ghichu
            }
        });

    } catch (error) {
        return res.status(500).json({
            error: {
                code: 'ADD_MOVEMENT_ERROR',
                message: 'Lỗi khi thêm dữ liệu biến động nhân khẩu',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }
        });
    }
};

// Helper functions
async function getBasicGenderStats() {
    const total = await db.NhanKhau.count();
    const genderStats = await db.NhanKhau.findAll({
        attributes: [
            'gioitinh',
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
        ],
        group: ['gioitinh']
    });

    return {
        total,
        byGender: genderStats.map(stat => ({
            gender: stat.gioitinh || 'Không xác định',
            count: parseInt(stat.dataValues.count)
        }))
    };
}

async function getBasicAgeStats() {
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
        byAgeGroup: ageGroups.map(group => ({
            ageGroup: group.age_group,
            count: parseInt(group.count)
        }))
    };
}

async function getBasicTemporaryStats() {
    const currentDate = new Date();
    
    const temporaryResidenceCount = await db.TamTruTamVang.count({
        where: {
            trangThai: 'đang tạm trú',
            thoiGian: {
                [Op.lte]: currentDate
            }
        }
    });

    const temporaryAbsenceCount = await db.TamTruTamVang.count({
        where: {
            trangThai: 'tạm vắng',
            thoiGian: {
                [Op.lte]: currentDate
            }
        }
    });

    return {
        temporaryResidence: temporaryResidenceCount,
        temporaryAbsence: temporaryAbsenceCount
    };
} 