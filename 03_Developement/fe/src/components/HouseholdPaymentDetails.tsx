import { useState, useEffect } from 'react';
import api from '../services/api';
import PaymentConfirmPopup from './PaymentConfirmPopup';

interface Props {
  dotThuId: number;
  khoanThuId: number;
  soTien: number;
}

interface Household {
  soHoKhau: number;
  chuHo: string;
  diaChi: string;
  daNop: boolean;
  ngayNop: string | null;
  nguoiNop: string | null;
  hinhThucNop: string | null;
}

const HouseholdPaymentDetails = ({ dotThuId, khoanThuId, soTien }: Props) => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);

  const handleQuickPayment = async (household: Household) => {
    setSelectedHousehold(household);
    setShowPaymentPopup(true);
  };

  const handlePaymentConfirm = async (amount: number) => {
    if (!selectedHousehold) return;
    
    try {
      // Call the payment API to create a new payment record
      const paymentData = {
        householdId: selectedHousehold.soHoKhau, // Using soHoKhau as household ID
        feeTypeId: parseInt(khoanThuId.toString()),
        amountPaid: amount,
        paymentDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        paymentMethod: 'CASH', // Default to cash
        notes: `Xác nhận thanh toán qua ứng dụng quản lý cho hộ ${selectedHousehold.soHoKhau}`,
        nguoinop: selectedHousehold.chuHo
      };

      console.log('Creating payment with data:', paymentData);
      
      const response = await api.payment.create(paymentData);
      
      if (response) {
        alert(`Đã xác nhận ${selectedHousehold.chuHo} nộp ${new Intl.NumberFormat('vi-VN').format(amount)} VND thành công!`);
        
        // Refresh the payment data to show updated status
        await fetchPaymentData();
      }
    } catch (error: any) {
      console.error('Error confirming payment:', error);
      
      // Handle specific error cases
      if (error.message && error.message.includes('đã nộp khoản thu này rồi')) {
        alert('Hộ khẩu này đã nộp khoản thu này rồi!');
      } else {
        alert('Có lỗi xảy ra khi xác nhận thanh toán! Vui lòng thử lại.');
      }
    } finally {
      setSelectedHousehold(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  useEffect(() => {
    fetchPaymentData();
  }, [dotThuId, khoanThuId]);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);

      // Fetch actual payments for this fee type
      const paymentsResponse = await api.payment.getAll({
        feeTypeId: parseInt(khoanThuId.toString()),
        page: 0,
        size: 100, // Get a large number to see all households
        sortBy: 'ngaynop',
        sortDir: 'desc'
      });

      // Create a map of paid households
      const paidHouseholds = new Map();
      if (paymentsResponse && paymentsResponse.payments) {
        paymentsResponse.payments.forEach((payment: any) => {
          if (payment.status === 'ACTIVE') {
            paidHouseholds.set(payment.householdId, {
              amountPaid: payment.amountPaid,
              paymentDate: payment.paymentDate,
              paymentMethod: payment.paymentMethod,
              nguoinop: payment.nguoinop
            });
          }
        });
      }

      // Fetch all households to create the complete list
      const householdsResponse = await api.households.getAll({ limit: 100 });
      
      const householdsWithPaymentStatus = householdsResponse.households.map((household: any) => {
        const paymentInfo = paidHouseholds.get(household.id);
        return {
          soHoKhau: household.id,
          chuHo: household.chuHoInfo?.hoTen || household.chuHo || 'Chưa có thông tin',
          diaChi: household.diaChi,
          daNop: !!paymentInfo,
          ngayNop: paymentInfo?.paymentDate || null,
          nguoiNop: paymentInfo?.nguoinop || null,
          hinhThucNop: paymentInfo?.paymentMethod === 'CASH' ? 'Tiền mặt' : 
                      paymentInfo?.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản' :
                      paymentInfo?.paymentMethod === 'ONLINE' ? 'Online' :
                      paymentInfo?.paymentMethod || null
        };
      });
      
      setHouseholds(householdsWithPaymentStatus);
    } catch (error) {
      console.error('Error fetching payment data:', error);
      
      // Fallback to mock data if API fails
      console.log('Using mock data as fallback...');
      const mockHouseholds = [
        {
          soHoKhau: 1,
          chuHo: 'Nguyễn Văn An',
          diaChi: 'Căn hộ 101',
          daNop: true,
          ngayNop: '2025-06-05',
          nguoiNop: 'Nguyễn Văn An',
          hinhThucNop: 'Chuyển khoản'
        },
        {
          soHoKhau: 2,
          chuHo: 'Trần Thị Bình',
          diaChi: 'Căn hộ 102',
          daNop: false,
          ngayNop: null,
          nguoiNop: null,
          hinhThucNop: null
        },
        {
          soHoKhau: 3,
          chuHo: 'Lê Minh Châu',
          diaChi: 'Căn hộ 103',
          daNop: true,
          ngayNop: '2025-06-08',
          nguoiNop: 'Lê Minh Châu',
          hinhThucNop: 'Tiền mặt'
        }
      ];
      
      setHouseholds(mockHouseholds);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Household Payment Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Hộ khẩu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Chủ hộ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Số tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ngày nộp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Hình thức
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {households.map((household) => (
              <tr key={household.soHoKhau} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Hộ {household.soHoKhau}
                    </div>
                    <div className="text-sm text-gray-500">{household.diaChi}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {household.chuHo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    household.daNop
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {household.daNop ? 'Đã nộp' : 'Chưa nộp'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(soTien)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {household.ngayNop || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {household.hinhThucNop || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {!household.daNop && (
                    <button
                      onClick={() => handleQuickPayment(household)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium"
                      title="Xác nhận đã thanh toán"
                    >
                      ✓ Xác nhận
                    </button>
                  )}
                  {household.daNop && (
                    <span className="text-green-600 text-xs">✓ Đã xác nhận</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Confirmation Popup */}
      <PaymentConfirmPopup
        isOpen={showPaymentPopup}
        onClose={() => {
          setShowPaymentPopup(false);
          setSelectedHousehold(null);
        }}
        onConfirm={handlePaymentConfirm}
        household={selectedHousehold || { soHoKhau: 0, chuHo: '', diaChi: '' }}
        defaultAmount={soTien}
      />
    </div>
  );
};

export default HouseholdPaymentDetails;