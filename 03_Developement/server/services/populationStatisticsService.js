const db = require('../db/models');
const { Op, fn, col, literal } = require('sequelize');

/**
 * Population Statistics Service
 * Provides business logic for population statistics operations
 * Replaces raw SQL queries with ORM-based methods
 */

class PopulationStatisticsService {
    /**
     * Get gender statistics for population
     * Replaces raw SQL in getGenderStatistics controller
     */
    static async getGenderStatistics() {
        const totalPopulation = await db.NhanKhau.count();

        if (totalPopulation === 0) {
            return {
                total: 0,
                byGender: [],
                chartData: []
            };
        }

        const genderStats = await db.NhanKhau.findAll({
            attributes: [
                'gioiTinh',
                [fn('COUNT', col('id')), 'count']
            ],
            group: ['gioiTinh'],
            order: [['gioiTinh', 'ASC']]
        });

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

        return {
            total: totalPopulation,
            byGender: genderData,
            chartData: chartData
        };
    }

    /**
     * Get age statistics for population
     * Replaces raw SQL in getAgeStatistics controller
     */
    static async getAgeStatistics(customAgeGroups = null) {
        const defaultAgeGroups = [
            { name: '0-6 tuổi', min: 0, max: 6 },
            { name: '7-14 tuổi', min: 7, max: 14 },
            { name: '15-18 tuổi', min: 15, max: 18 },
            { name: '19-30 tuổi', min: 19, max: 30 },
            { name: '31-45 tuổi', min: 31, max: 45 },
            { name: '46-60 tuổi', min: 46, max: 60 },
            { name: 'Trên 60 tuổi', min: 61, max: 150 }
        ];

        const ageGroups = customAgeGroups || defaultAgeGroups;

        // Get population with calculated age using ORM
        const populationWithAge = await db.NhanKhau.findAll({
            attributes: [
                'id',
                'gioiTinh',
                [literal('YEAR(CURDATE()) - YEAR(ngaySinh) - (DATE_FORMAT(CURDATE(), "%m%d") < DATE_FORMAT(ngaySinh, "%m%d"))'), 'age']
            ],
            raw: true
        });

        const totalPopulation = populationWithAge.length;

        if (totalPopulation === 0) {
            return {
                total: 0,
                byAgeGroup: [],
                chartData: []
            };
        }

        const ageGroupData = ageGroups.map(group => {
            const populationInGroup = populationWithAge.filter(person => 
                person.age >= group.min && person.age <= group.max
            );

            const count = populationInGroup.length;
            const percentage = ((count / totalPopulation) * 100).toFixed(2);

            const genderBreakdown = {
                Nam: populationInGroup.filter(p => p.gioiTinh === 'Nam').length,
                'Nữ': populationInGroup.filter(p => p.gioiTinh === 'Nữ').length
            };

            return {
                ageGroup: group.name,
                count: count,
                percentage: parseFloat(percentage),
                genderBreakdown: genderBreakdown,
                range: `${group.min}-${group.max === 150 ? '∞' : group.max} tuổi`
            };
        });

        const chartData = ageGroupData.map(item => ({
            label: item.ageGroup,
            value: item.count,
            percentage: item.percentage
        }));

        return {
            total: totalPopulation,
            byAgeGroup: ageGroupData,
            chartData: chartData
        };
    }

    /**
     * Get population movement statistics (move in/out)
     * Replaces raw SQL in getPopulationMovement controller
     */
    static async getPopulationMovement(startDate, endDate) {
        const dateFilter = {
            ngayThayDoi: {
                [Op.between]: [startDate, endDate]
            }
        };

        // Get move-in data
        const moveInFromChanges = await db.LichSuThayDoiHoKhau.findAll({
            attributes: [
                [literal('DATE(ngayThayDoi)'), 'date'],
                [fn('COUNT', col('id')), 'count']
            ],
            where: {
                ...dateFilter,
                loaiThayDoi: 'Chuyển đến'
            },
            group: [literal('DATE(ngayThayDoi)')],
            order: [[literal('DATE(ngayThayDoi)'), 'ASC']],
            raw: true
        });

        // Get move-out data
        const moveOutFromChanges = await db.LichSuThayDoiHoKhau.findAll({
            attributes: [
                [literal('DATE(ngayThayDoi)'), 'date'],
                [fn('COUNT', col('id')), 'count']
            ],
            where: {
                ...dateFilter,
                loaiThayDoi: 'Chuyển đi'
            },
            group: [literal('DATE(ngayThayDoi)')],
            order: [[literal('DATE(ngayThayDoi)'), 'ASC']],
            raw: true
        });

        const totalMoveIn = moveInFromChanges.reduce((sum, item) => sum + parseInt(item.count), 0);
        const totalMoveOut = moveOutFromChanges.reduce((sum, item) => sum + parseInt(item.count), 0);
        const netChange = totalMoveIn - totalMoveOut;

        return {
            totalMoveIn,
            totalMoveOut,
            netChange,
            moveInByDate: moveInFromChanges,
            moveOutByDate: moveOutFromChanges,
            chartData: {
                moveIn: moveInFromChanges,
                moveOut: moveOutFromChanges
            }
        };
    }

    /**
     * Get temporary residence statistics
     * Replaces raw SQL in getTemporaryResidenceStatistics controller
     */
    static async getTemporaryResidenceStatistics() {
        const currentDate = new Date();

        // Get temporary residence statistics
        const temporaryResidenceStats = await db.TamTruTamVang.findAll({
            attributes: [
                [fn('COUNT', col('id')), 'count']
            ],
            where: {
                loai: 'Tạm trú',
                [Op.or]: [
                    { denNgay: null },
                    { denNgay: { [Op.gte]: currentDate } }
                ]
            },
            raw: true
        });

        // Get temporary absence statistics  
        const temporaryAbsenceStats = await db.TamTruTamVang.findAll({
            attributes: [
                [fn('COUNT', col('id')), 'count']
            ],
            where: {
                loai: 'Tạm vắng',
                [Op.or]: [
                    { denNgay: null },
                    { denNgay: { [Op.gte]: currentDate } }
                ]
            },
            raw: true
        });

        const temporaryResidenceCount = parseInt(temporaryResidenceStats[0]?.count || 0);
        const temporaryAbsenceCount = parseInt(temporaryAbsenceStats[0]?.count || 0);

        return {
            temporaryResidence: temporaryResidenceCount,
            temporaryAbsence: temporaryAbsenceCount,
            total: temporaryResidenceCount + temporaryAbsenceCount
        };
    }

    /**
     * Get detailed temporary residence/absence data with filtering
     * Replaces raw SQL in controller helper functions
     */
    static async getTemporaryResidenceDetails(type, includeExpired = false) {
        const currentDate = new Date();
        
        let whereCondition = {
            loai: type === 'residence' ? 'Tạm trú' : 'Tạm vắng'
        };

        if (!includeExpired) {
            whereCondition[Op.or] = [
                { denNgay: null },
                { denNgay: { [Op.gte]: currentDate } }
            ];
        }

        const details = await db.TamTruTamVang.findAll({
            where: whereCondition,
            include: [
                {
                    model: db.NhanKhau,
                    as: 'nhanKhau',
                    attributes: ['hoTen', 'cccd', 'gioiTinh', 'ngaySinh']
                }
            ],
            order: [['tuNgay', 'DESC']]
        });

        return details;
    }

    /**
     * Get comprehensive population report
     * Replaces complex raw SQL in getPopulationReport controller
     */
    static async getPopulationReport() {
        // Get age group statistics using ORM
        const ageGroups = await db.NhanKhau.findAll({
            attributes: [
                [literal(`
                    CASE 
                        WHEN YEAR(CURDATE()) - YEAR(ngaySinh) - (DATE_FORMAT(CURDATE(), '%m%d') < DATE_FORMAT(ngaySinh, '%m%d')) BETWEEN 0 AND 6 THEN '0-6'
                        WHEN YEAR(CURDATE()) - YEAR(ngaySinh) - (DATE_FORMAT(CURDATE(), '%m%d') < DATE_FORMAT(ngaySinh, '%m%d')) BETWEEN 7 AND 14 THEN '7-14'
                        WHEN YEAR(CURDATE()) - YEAR(ngaySinh) - (DATE_FORMAT(CURDATE(), '%m%d') < DATE_FORMAT(ngaySinh, '%m%d')) BETWEEN 15 AND 18 THEN '15-18'
                        WHEN YEAR(CURDATE()) - YEAR(ngaySinh) - (DATE_FORMAT(CURDATE(), '%m%d') < DATE_FORMAT(ngaySinh, '%m%d')) BETWEEN 19 AND 30 THEN '19-30'
                        WHEN YEAR(CURDATE()) - YEAR(ngaySinh) - (DATE_FORMAT(CURDATE(), '%m%d') < DATE_FORMAT(ngaySinh, '%m%d')) BETWEEN 31 AND 45 THEN '31-45'
                        WHEN YEAR(CURDATE()) - YEAR(ngaySinh) - (DATE_FORMAT(CURDATE(), '%m%d') < DATE_FORMAT(ngaySinh, '%m%d')) BETWEEN 46 AND 60 THEN '46-60'
                        ELSE '60+'
                    END
                `), 'ageGroup'],
                'gioiTinh',
                [fn('COUNT', col('id')), 'count']
            ],
            group: [literal('ageGroup'), 'gioiTinh'],
            order: [
                [literal('ageGroup'), 'ASC'],
                ['gioiTinh', 'ASC']
            ],
            raw: true
        });

        // Get temporary residence data
        const currentDate = new Date();
        const temporaryResidence = await db.TamTruTamVang.findAll({
            attributes: [
                [fn('COUNT', col('id')), 'count']
            ],
            where: {
                loai: 'Tạm trú',
                [Op.or]: [
                    { denNgay: null },
                    { denNgay: { [Op.gte]: currentDate } }
                ]
            },
            raw: true
        });

        const temporaryAbsence = await db.TamTruTamVang.findAll({
            attributes: [
                [fn('COUNT', col('id')), 'count']
            ],
            where: {
                loai: 'Tạm vắng',
                [Op.or]: [
                    { denNgay: null },
                    { denNgay: { [Op.gte]: currentDate } }
                ]
            },
            raw: true
        });

        // Get total population
        const totalPopulation = await db.NhanKhau.count();

        return {
            totalPopulation,
            ageGroups,
            temporaryResidence: parseInt(temporaryResidence[0]?.count || 0),
            temporaryAbsence: parseInt(temporaryAbsence[0]?.count || 0)
        };
    }
}

module.exports = PopulationStatisticsService;