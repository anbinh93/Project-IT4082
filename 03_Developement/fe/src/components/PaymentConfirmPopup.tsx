import React, { useState } from 'react';

interface PaymentConfirmPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  household: {
    soHoKhau: number;
    chuHo: string;
    diaChi: string;
  };
  defaultAmount: number;
}

const PaymentConfirmPopup: React.FC<PaymentConfirmPopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  household,
  defaultAmount
}) => {
  const [amount, setAmount] = useState(defaultAmount.toString());
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const formatCurrency = (value: string) => {
    // Remove all non-digit characters
    const numericValue = value.replace(/[^\d]/g, '');
    if (!numericValue) return '';
    
    // Format with thousands separator
    return new Intl.NumberFormat('vi-VN').format(parseInt(numericValue));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^\d]/g, '');
    
    if (numericValue) {
      setAmount(formatCurrency(numericValue));
      setError('');
    } else {
      setAmount('');
    }
  };

  const handleConfirm = () => {
    const numericAmount = parseInt(amount.replace(/[^\d]/g, ''));
    
    if (!numericAmount || numericAmount <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    onConfirm(numericAmount);
    onClose();
    setAmount(defaultAmount.toString());
    setError('');
  };

  const handleClose = () => {
    onClose();
    setAmount(defaultAmount.toString());
    setError('');
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={handleOverlayClick}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Xác nhận thanh toán
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Hộ khẩu:</p>
            <p className="font-medium">Hộ {household.soHoKhau} - {household.chuHo}</p>
            <p className="text-sm text-gray-600">{household.diaChi}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số tiền đã nộp (VND) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập số tiền..."
              autoFocus
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="text-sm text-gray-600">
            <p>Số tiền được nhập sẽ được xác nhận là số tiền mà hộ khẩu này đã nộp.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmPopup;
