const db = require('../db/models');
const { Op } = require('sequelize');

/**
 * A. Ghi nhận một khoản nộp phí mới (Create)
 * POST /api/payments
 */
exports.createPayment = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    
    try {
        const {
            householdId,
            feeTypeId,
            amountPaid,
            paymentDate,
            paymentMethod,
            notes,
            nguoinop
        } = req.body;

        // Enhanced validation
        const validationErrors = [];
        
        if (!householdId || isNaN(parseInt(householdId))) {
            validationErrors.push('householdId phải là số nguyên hợp lệ');
        }
        
        if (!feeTypeId || isNaN(parseInt(feeTypeId))) {
            validationErrors.push('feeTypeId phải là số nguyên hợp lệ');
        }
        
        if (!amountPaid || isNaN(parseFloat(amountPaid)) || parseFloat(amountPaid) <= 0) {
            validationErrors.push('amountPaid phải là số dương hợp lệ');
        }
        
        if (paymentDate && isNaN(Date.parse(paymentDate))) {
            validationErrors.push('paymentDate phải có định dạng ngày hợp lệ (YYYY-MM-DD)');
        }
        
        if (paymentMethod && !['CASH', 'BANK_TRANSFER', 'ONLINE', 'CHECK'].includes(paymentMethod)) {
            validationErrors.push('paymentMethod phải là một trong: CASH, BANK_TRANSFER, ONLINE, CHECK');
        }

        if (validationErrors.length > 0) {
            await transaction.rollback();
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Dữ liệu đầu vào không hợp lệ',
                    details: validationErrors
                }
            });
        }

        // Kiểm tra hộ khẩu tồn tại
        const hokhau = await db.HoKhau.findByPk(householdId, {
            include: [{
                model: db.NhanKhau,
                as: 'chuHo',
                attributes: ['id', 'hoten']
            }],
            transaction
        });
        
        if (!hokhau) {
            await transaction.rollback();
            return res.status(404).json({ 
                error: {
                    code: 'HOUSEHOLD_NOT_FOUND',
                    message: 'Không tìm thấy hộ khẩu'
                }
            });
        }

        // Kiểm tra khoản thu tồn tại
        const khoanthu = await db.KhoanThu.findByPk(feeTypeId, { transaction });
        if (!khoanthu) {
            await transaction.rollback();
            return res.status(404).json({ 
                error: {
                    code: 'FEE_TYPE_NOT_FOUND',
                    message: 'Không tìm thấy khoản thu'
                }
            });
        }

        // Kiểm tra xem đã nộp khoản thu này chưa (chỉ check ACTIVE payments)
        const existingPayment = await db.NopPhi.findOne({
            where: {
                hokhau_id: householdId,
                khoanthu_id: feeTypeId,
                status: 'ACTIVE'
            },
            transaction
        });

        if (existingPayment) {
            await transaction.rollback();
            return res.status(400).json({
                error: {
                    code: 'PAYMENT_ALREADY_EXISTS',
                    message: 'Hộ khẩu này đã nộp khoản thu này rồi',
                    existingPaymentId: existingPayment.id
                }
            });
        }

        // Tạo bản ghi nộp phí
        const payment = await db.NopPhi.create({
            hokhau_id: householdId,
            khoanthu_id: feeTypeId,
            sotien: amountPaid,
            ngaynop: paymentDate || new Date(),
            nguoinop: nguoinop || hokhau.chuHo?.hoten,
            phuongthuc: paymentMethod || 'CASH',
            ghichu: notes,
            status: 'ACTIVE'
        }, { transaction });

        await transaction.commit();

        // Lấy thông tin chi tiết để trả về
        const paymentDetail = await db.NopPhi.findByPk(payment.id, {
            include: [
                {
                    model: db.HoKhau,
                    as: 'hoKhau',
                    include: [{
                        model: db.NhanKhau,
                        as: 'chuHo',
                        attributes: ['id', 'hoten']
                    }]
                },
                {
                    model: db.KhoanThu,
                    as: 'khoanThu'
                }
            ]
        });

        return res.status(201).json({
            paymentId: payment.id,
            householdId: payment.hokhau_id,
            feeTypeId: payment.khoanthu_id,
            amountPaid: payment.sotien,
            paymentDate: payment.ngaynop,
            paymentMethod: payment.phuongthuc,
            status: payment.status,
            notes: payment.ghichu,
            nguoinop: payment.nguoinop,
            createdAt: payment.createdAt,
            household: paymentDetail.hoKhau,
            feeType: paymentDetail.khoanThu
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Error creating payment:', error);
        
        return res.status(500).json({ 
            error: {
                code: 'PAYMENT_CREATE_ERROR',
                message: 'Lỗi khi tạo giao dịch nộp phí',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }
        });
    }
};

/**
 * B. Lấy danh sách các khoản đã nộp phí (Read - List)
 * GET /api/payments
 */
exports.getPayments = async (req, res) => {
    try {
        const {
            householdId,
            feeTypeId,
            startDate,
            endDate,
            paymentMethod,
            page = 0,
            size = 20,
            sortBy = 'ngaynop',
            sortDir = 'desc'
        } = req.query;

        // Build where conditions
        const whereConditions = {};
        
        if (householdId) {
            whereConditions.hokhau_id = householdId;
        }
        
        if (feeTypeId) {
            whereConditions.khoanthu_id = feeTypeId;
        }
        
        if (paymentMethod) {
            whereConditions.phuongthuc = paymentMethod;
        }
        
        if (startDate || endDate) {
            whereConditions.ngaynop = {};
            if (startDate) {
                whereConditions.ngaynop[Op.gte] = new Date(startDate);
            }
            if (endDate) {
                whereConditions.ngaynop[Op.lte] = new Date(endDate);
            }
        }

        const offset = parseInt(page) * parseInt(size);
        const limit = parseInt(size);

        const { count, rows: payments } = await db.NopPhi.findAndCountAll({
            where: whereConditions,
            include: [
                {
                    model: db.HoKhau,
                    as: 'hoKhau',
                    include: [{
                        model: db.NhanKhau,
                        as: 'chuHo',
                        attributes: ['id', 'hoten']
                    }]
                },
                {
                    model: db.KhoanThu,
                    as: 'khoanThu'
                }
            ],
            order: [[sortBy, sortDir.toUpperCase()]],
            offset,
            limit
        });

        // Format response
        const formattedPayments = payments.map(payment => ({
            paymentId: payment.id,
            householdId: payment.hokhau_id,
            feeTypeId: payment.khoanthu_id,
            amountPaid: payment.sotien,
            paymentDate: payment.ngaynop,
            paymentMethod: payment.phuongthuc,
            notes: payment.ghichu,
            nguoinop: payment.nguoinop,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
            household: payment.hoKhau,
            feeType: payment.khoanThu
        }));

        return res.status(200).json({
            payments: formattedPayments,
            pagination: {
                currentPage: parseInt(page),
                pageSize: parseInt(size),
                totalItems: count,
                totalPages: Math.ceil(count / parseInt(size))
            }
        });

    } catch (error) {
        console.error('Error getting payments:', error);
        return res.status(500).json({ message: error.message });
    }
};

/**
 * C. Lấy chi tiết một khoản nộp phí (Read - Detail)
 * GET /api/payments/{paymentId}
 */
exports.getPaymentById = async (req, res) => {
    try {
        const { paymentId } = req.params;

        const payment = await db.NopPhi.findByPk(paymentId, {
            include: [
                {
                    model: db.HoKhau,
                    as: 'hoKhau',
                    include: [{
                        model: db.NhanKhau,
                        as: 'chuHo',
                        attributes: ['id', 'hoten']
                    }]
                },
                {
                    model: db.KhoanThu,
                    as: 'khoanThu'
                }
            ]
        });

        if (!payment) {
            return res.status(404).json({ message: 'Không tìm thấy giao dịch nộp phí' });
        }

        const formattedPayment = {
            paymentId: payment.id,
            householdId: payment.hokhau_id,
            feeTypeId: payment.khoanthu_id,
            amountPaid: payment.sotien,
            paymentDate: payment.ngaynop,
            paymentMethod: payment.phuongthuc,
            notes: payment.ghichu,
            nguoinop: payment.nguoinop,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
            household: payment.hoKhau,
            feeType: payment.khoanThu
        };

        return res.status(200).json(formattedPayment);

    } catch (error) {
        console.error('Error getting payment by ID:', error);
        return res.status(500).json({ message: error.message });
    }
};

/**
 * D. Cập nhật thông tin một khoản nộp phí (Update)
 * PUT /api/payments/{paymentId}
 */
exports.updatePayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const {
            amountPaid,
            paymentDate,
            paymentMethod,
            notes,
            nguoinop
        } = req.body;

        const payment = await db.NopPhi.findByPk(paymentId);
        
        if (!payment) {
            return res.status(404).json({ message: 'Không tìm thấy giao dịch nộp phí' });
        }

        // Update only provided fields
        const updateData = {};
        if (amountPaid !== undefined) updateData.sotien = amountPaid;
        if (paymentDate !== undefined) updateData.ngaynop = paymentDate;
        if (paymentMethod !== undefined) updateData.phuongthuc = paymentMethod;
        if (notes !== undefined) updateData.ghichu = notes;
        if (nguoinop !== undefined) updateData.nguoinop = nguoinop;

        await payment.update(updateData);

        // Get updated payment with relations
        const updatedPayment = await db.NopPhi.findByPk(paymentId, {
            include: [
                {
                    model: db.HoKhau,
                    as: 'hoKhau',
                    include: [{
                        model: db.NhanKhau,
                        as: 'chuHo',
                        attributes: ['id', 'hoten']
                    }]
                },
                {
                    model: db.KhoanThu,
                    as: 'khoanThu'
                }
            ]
        });

        const formattedPayment = {
            paymentId: updatedPayment.id,
            householdId: updatedPayment.hokhau_id,
            feeTypeId: updatedPayment.khoanthu_id,
            amountPaid: updatedPayment.sotien,
            paymentDate: updatedPayment.ngaynop,
            paymentMethod: updatedPayment.phuongthuc,
            notes: updatedPayment.ghichu,
            nguoinop: updatedPayment.nguoinop,
            createdAt: updatedPayment.createdAt,
            updatedAt: updatedPayment.updatedAt,
            household: updatedPayment.hoKhau,
            feeType: updatedPayment.khoanThu
        };

        return res.status(200).json(formattedPayment);

    } catch (error) {
        console.error('Error updating payment:', error);
        return res.status(500).json({ message: error.message });
    }
};

/**
 * E. Xóa một khoản nộp phí (Delete - Soft Delete)
 * DELETE /api/payments/{paymentId}
 */
exports.deletePayment = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    
    try {
        const { paymentId } = req.params;
        const { cancelReason } = req.body;
        const userId = req.user?.id; // Từ JWT token

        // Validate paymentId
        if (!paymentId || isNaN(parseInt(paymentId))) {
            await transaction.rollback();
            return res.status(400).json({ 
                message: 'ID giao dịch không hợp lệ' 
            });
        }

        const payment = await db.NopPhi.findByPk(paymentId, {
            paranoid: false,
            include: [
                {
                    model: db.HoKhau,
                    as: 'hoKhau',
                    include: [{
                        model: db.NhanKhau,
                        as: 'chuHo',
                        attributes: ['id', 'hoten']
                    }]
                },
                {
                    model: db.KhoanThu,
                    as: 'khoanThu'
                }
            ],
            transaction
        });
        
        if (!payment) {
            await transaction.rollback();
            return res.status(404).json({ 
                message: 'Không tìm thấy giao dịch nộp phí' 
            });
        }

        // Kiểm tra xem đã bị xóa chưa (idempotency)
        if (payment.deletedAt !== null) {
            await transaction.rollback();
            return res.status(204).send(); // Already deleted, return 204 for idempotency
        }

        // Kiểm tra trạng thái hiện tại
        if (payment.status === 'CANCELLED') {
            await transaction.rollback();
            return res.status(400).json({
                message: 'Giao dịch đã được hủy trước đó'
            });
        }

        // Cập nhật trạng thái và thực hiện soft delete
        await payment.update({
            status: 'CANCELLED',
            cancelledBy: userId,
            cancelReason: cancelReason || 'Hủy giao dịch bởi kế toán'
        }, { transaction });

        // Soft delete
        await payment.destroy({ transaction });

        await transaction.commit();
        
        // Return 204 No Content theo chuẩn REST
        return res.status(204).send();

    } catch (error) {
        await transaction.rollback();
        console.error('Error deleting payment:', error);
        
                 return res.status(500).json({ 
             error: {
                 code: 'PAYMENT_DELETE_ERROR',
                 message: 'Lỗi khi xóa giao dịch nộp phí',
                 details: process.env.NODE_ENV === 'development' ? error.message : undefined
             }
         });
     }
};

/**
 * G. Khôi phục một khoản nộp phí đã bị xóa (Restore)
 * POST /api/payments/{paymentId}/restore
 */
exports.restorePayment = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    
    try {
        const { paymentId } = req.params;
        const { restoreReason } = req.body;
        const userId = req.user?.id;

        // Validate paymentId
        if (!paymentId || isNaN(parseInt(paymentId))) {
            await transaction.rollback();
            return res.status(400).json({ 
                message: 'ID giao dịch không hợp lệ' 
            });
        }

        const payment = await db.NopPhi.findByPk(paymentId, {
            paranoid: false,
            transaction
        });
        
        if (!payment) {
            await transaction.rollback();
            return res.status(404).json({ 
                message: 'Không tìm thấy giao dịch nộp phí' 
            });
        }

        // Kiểm tra xem có bị xóa không
        if (payment.deletedAt === null) {
            await transaction.rollback();
            return res.status(400).json({
                message: 'Giao dịch này chưa bị xóa'
            });
        }

        // Restore payment
        await payment.restore({ transaction });
        
        // Cập nhật trạng thái
        await payment.update({
            status: 'ACTIVE',
            cancelledBy: null,
            cancelReason: null,
            ghichu: payment.ghichu ? 
                `${payment.ghichu}\n[Khôi phục bởi user ${userId}: ${restoreReason || 'Khôi phục giao dịch'}]` :
                `[Khôi phục bởi user ${userId}: ${restoreReason || 'Khôi phục giao dịch'}]`
        }, { transaction });

        await transaction.commit();
        
        // Lấy thông tin chi tiết sau khi restore
        const restoredPayment = await db.NopPhi.findByPk(paymentId, {
            include: [
                {
                    model: db.HoKhau,
                    as: 'hoKhau',
                    include: [{
                        model: db.NhanKhau,
                        as: 'chuHo',
                        attributes: ['id', 'hoten']
                    }]
                },
                {
                    model: db.KhoanThu,
                    as: 'khoanThu'
                }
            ]
        });

        return res.status(200).json({
            message: 'Đã khôi phục giao dịch nộp phí thành công',
            payment: {
                paymentId: restoredPayment.id,
                householdId: restoredPayment.hokhau_id,
                feeTypeId: restoredPayment.khoanthu_id,
                amountPaid: restoredPayment.sotien,
                paymentDate: restoredPayment.ngaynop,
                paymentMethod: restoredPayment.phuongthuc,
                status: restoredPayment.status,
                notes: restoredPayment.ghichu,
                nguoinop: restoredPayment.nguoinop,
                createdAt: restoredPayment.createdAt,
                updatedAt: restoredPayment.updatedAt,
                household: restoredPayment.hoKhau,
                feeType: restoredPayment.khoanThu
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Error restoring payment:', error);
        
        return res.status(500).json({ 
            error: {
                code: 'PAYMENT_RESTORE_ERROR',
                message: 'Lỗi khi khôi phục giao dịch nộp phí',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }
        });
    }
};

/**
 * F. Lấy thống kê tổng quan về thanh toán
 * GET /api/payments/statistics
 */
exports.getPaymentStatistics = async (req, res) => {
    try {
        const { feeTypeId, startDate, endDate } = req.query;

        const whereConditions = {};
        
        if (feeTypeId) {
            whereConditions.khoanthu_id = feeTypeId;
        }
        
        if (startDate || endDate) {
            whereConditions.ngaynop = {};
            if (startDate) {
                whereConditions.ngaynop[Op.gte] = new Date(startDate);
            }
            if (endDate) {
                whereConditions.ngaynop[Op.lte] = new Date(endDate);
            }
        }

        // Tổng số giao dịch và tổng tiền
        const totalStats = await db.NopPhi.findOne({
            where: whereConditions,
            attributes: [
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalTransactions'],
                [db.sequelize.fn('SUM', db.sequelize.col('sotien')), 'totalAmount']
            ]
        });

        // Thống kê theo phương thức thanh toán
        const paymentMethodStats = await db.NopPhi.findAll({
            where: whereConditions,
            attributes: [
                'phuongthuc',
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
                [db.sequelize.fn('SUM', db.sequelize.col('sotien')), 'amount']
            ],
            group: ['phuongthuc']
        });

        return res.status(200).json({
            totalTransactions: parseInt(totalStats.dataValues.totalTransactions) || 0,
            totalAmount: parseFloat(totalStats.dataValues.totalAmount) || 0,
            paymentMethodBreakdown: paymentMethodStats.map(stat => ({
                method: stat.phuongthuc,
                count: parseInt(stat.dataValues.count),
                amount: parseFloat(stat.dataValues.amount)
            }))
        });

    } catch (error) {
        console.error('Error getting payment statistics:', error);
        return res.status(500).json({ message: error.message });
    }
}; 