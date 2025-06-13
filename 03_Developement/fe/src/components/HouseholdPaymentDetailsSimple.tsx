import React from 'react';

interface HouseholdPaymentDetailsProps {
  dotThuId: number;
  khoanThuId: number;
  soTien: number;
}

function HouseholdPaymentDetails({ dotThuId, khoanThuId, soTien }: HouseholdPaymentDetailsProps) {
  return (
    <div className="p-6">
      <div className="text-center text-gray-500">
        <h3 className="text-lg font-semibold mb-2">Chi tiết thanh toán</h3>
        <p>Đợt thu: {dotThuId}</p>
        <p>Khoản thu: {khoanThuId}</p>
        <p>Số tiền: {soTien.toLocaleString('vi-VN')} VND</p>
        <p className="text-sm mt-2 text-blue-600">Tính năng đang được phát triển...</p>
      </div>
    </div>
  );
}

export default HouseholdPaymentDetails;
