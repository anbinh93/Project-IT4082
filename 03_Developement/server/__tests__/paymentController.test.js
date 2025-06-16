const db = require('../db/models');
const paymentController = require('../controllers/paymentController');

// Mock the database models
jest.mock('../db/models', () => ({
    sequelize: {
        transaction: jest.fn(() => ({
            commit: jest.fn(),
            rollback: jest.fn()
        }))
    },
    HoKhau: {
        findByPk: jest.fn()
    },
    KhoanThu: {
        findByPk: jest.fn()
    },
    NopPhi: {
        create: jest.fn(),
        findByPk: jest.fn(),
        findAndCountAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
        restore: jest.fn()
    }
}));

describe('Payment Controller Tests', () => {
    let mockReq;
    let mockRes;
    let mockTransaction;

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Setup mock request and response
        mockReq = {
            body: {},
            params: {},
            query: {},
            user: { id: 1 }
        };

        mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn(),
            send: jest.fn()
        };

        mockTransaction = {
            commit: jest.fn(),
            rollback: jest.fn()
        };

        db.sequelize.transaction.mockResolvedValue(mockTransaction);
    });

    // ========== Kiểm thử hộp đen (Black Box Testing) ==========

    describe('Black Box Testing - createPayment', () => {
        test('TC1: Tạo payment thành công với dữ liệu hợp lệ', async () => {
            // Arrange
            mockReq.body = {
                householdId: 1,
                feeTypeId: 1,
                amountPaid: 1000000,
                paymentDate: '2024-03-20',
                paymentMethod: 'CASH',
                notes: 'Test payment',
                nguoinop: 'Nguyen Van A'
            };

            const mockHoKhau = {
                id: 1,
                chuHoInfo: { id: 1, hoTen: 'Nguyen Van A' }
            };

            const mockKhoanThu = {
                id: 1,
                ten: 'Phí vệ sinh'
            };

            db.HoKhau.findByPk.mockResolvedValue(mockHoKhau);
            db.KhoanThu.findByPk.mockResolvedValue(mockKhoanThu);
            db.NopPhi.findOne.mockResolvedValue(null);
            db.NopPhi.create.mockResolvedValue({
                id: 1,
                ...mockReq.body,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Act
            await paymentController.createPayment(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalled();
            expect(mockTransaction.commit).toHaveBeenCalled();
        });

        test('TC2: Tạo payment thất bại khi thiếu dữ liệu bắt buộc', async () => {
            // Arrange
            mockReq.body = {
                householdId: 1,
                // Thiếu feeTypeId và amountPaid
                paymentMethod: 'CASH'
            };

            // Act
            await paymentController.createPayment(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.objectContaining({
                    code: 'VALIDATION_ERROR'
                })
            }));
            expect(mockTransaction.rollback).toHaveBeenCalled();
        });

        test('TC3: Tạo payment thất bại khi hộ khẩu không tồn tại', async () => {
            // Arrange
            mockReq.body = {
                householdId: 999,
                feeTypeId: 1,
                amountPaid: 1000000
            };

            db.HoKhau.findByPk.mockResolvedValue(null);

            // Act
            await paymentController.createPayment(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.objectContaining({
                    code: 'HOUSEHOLD_NOT_FOUND'
                })
            }));
            expect(mockTransaction.rollback).toHaveBeenCalled();
        });
    });

    describe('Black Box Testing - getPayments', () => {
        test('TC4: Lấy danh sách payment thành công với các tham số tìm kiếm', async () => {
            // Arrange
            mockReq.query = {
                householdId: 1,
                feeTypeId: 1,
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                page: 0,
                size: 10
            };

            const mockPayments = {
                count: 1,
                rows: [{
                    id: 1,
                    hokhau_id: 1,
                    khoanthu_id: 1,
                    sotien: 1000000,
                    ngaynop: new Date(),
                    phuongthuc: 'CASH',
                    hoKhau: {
                        id: 1,
                        chuHoInfo: { id: 1, hoTen: 'Nguyen Van A' }
                    },
                    khoanThu: {
                        id: 1,
                        ten: 'Phí vệ sinh'
                    }
                }]
            };

            db.NopPhi.findAndCountAll.mockResolvedValue(mockPayments);

            // Act
            await paymentController.getPayments(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                payments: expect.any(Array),
                pagination: expect.any(Object)
            }));
        });
    });

    // ========== Kiểm thử hộp trắng (White Box Testing) ==========

    describe('White Box Testing - deletePayment', () => {
        test('TC5: Xóa payment thành công với lý do hủy', async () => {
            // Arrange
            mockReq.params = { paymentId: 1 };
            mockReq.body = { cancelReason: 'Test cancellation' };

            const mockPayment = {
                id: 1,
                status: 'ACTIVE',
                deletedAt: null,
                update: jest.fn(),
                destroy: jest.fn()
            };

            db.NopPhi.findByPk.mockResolvedValue(mockPayment);

            // Act
            await paymentController.deletePayment(mockReq, mockRes);

            // Assert
            expect(mockPayment.update).toHaveBeenCalledWith(expect.objectContaining({
                status: 'CANCELLED',
                cancelledBy: 1,
                cancelReason: 'Test cancellation'
            }));
            expect(mockPayment.destroy).toHaveBeenCalled();
            expect(mockTransaction.commit).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(204);
        });

        test('TC6: Xóa payment thất bại khi payment đã bị xóa trước đó', async () => {
            // Arrange
            mockReq.params = { paymentId: 1 };

            const mockPayment = {
                id: 1,
                status: 'ACTIVE',
                deletedAt: new Date(),
                update: jest.fn(),
                destroy: jest.fn()
            };

            db.NopPhi.findByPk.mockResolvedValue(mockPayment);

            // Act
            await paymentController.deletePayment(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockTransaction.commit).toHaveBeenCalled();
        });
    });

    describe('White Box Testing - restorePayment', () => {
        test('TC7: Khôi phục payment thành công', async () => {
            // Arrange
            mockReq.params = { paymentId: 1 };
            mockReq.body = { restoreReason: 'Test restoration' };

            const mockPayment = {
                id: 1,
                status: 'CANCELLED',
                deletedAt: new Date(),
                ghichu: 'Old note',
                update: jest.fn(),
                restore: jest.fn()
            };

            db.NopPhi.findByPk.mockResolvedValue(mockPayment);

            // Act
            await paymentController.restorePayment(mockReq, mockRes);

            // Assert
            expect(mockPayment.restore).toHaveBeenCalled();
            expect(mockPayment.update).toHaveBeenCalledWith(expect.objectContaining({
                status: 'ACTIVE',
                cancelledBy: null,
                cancelReason: null
            }));
            expect(mockTransaction.commit).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });

        test('TC8: Khôi phục payment thất bại khi payment chưa bị xóa', async () => {
            // Arrange
            mockReq.params = { paymentId: 1 };

            const mockPayment = {
                id: 1,
                status: 'ACTIVE',
                deletedAt: null,
                update: jest.fn(),
                restore: jest.fn()
            };

            db.NopPhi.findByPk.mockResolvedValue(mockPayment);

            // Act
            await paymentController.restorePayment(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Giao dịch này chưa bị xóa'
            }));
            expect(mockTransaction.rollback).toHaveBeenCalled();
        });
    });

    describe('White Box Testing - getPaymentStatistics', () => {
        test('TC9: Lấy thống kê thành công với đầy đủ dữ liệu', async () => {
            // Arrange
            mockReq.query = {
                feeTypeId: 1,
                startDate: '2024-01-01',
                endDate: '2024-12-31'
            };

            const mockTotalStats = {
                dataValues: {
                    totalTransactions: 10,
                    totalAmount: 10000000
                }
            };

            const mockPaymentMethodStats = [
                {
                    phuongthuc: 'CASH',
                    dataValues: {
                        count: 5,
                        amount: 5000000
                    }
                },
                {
                    phuongthuc: 'BANK_TRANSFER',
                    dataValues: {
                        count: 5,
                        amount: 5000000
                    }
                }
            ];

            db.NopPhi.findOne.mockResolvedValue(mockTotalStats);
            db.NopPhi.findAll.mockResolvedValue(mockPaymentMethodStats);

            // Act
            await paymentController.getPaymentStatistics(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                totalTransactions: 10,
                totalAmount: 10000000,
                paymentMethodBreakdown: expect.any(Array)
            }));
        });
    });
}); 