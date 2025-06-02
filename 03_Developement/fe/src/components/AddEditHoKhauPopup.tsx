import React, { useState } from 'react';

interface AddEditHoKhauPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequiredLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
    {children} <span className="text-red-500 text-base leading-none">*</span>
  </label>
);

const AddEditHoKhauPopup: React.FC<AddEditHoKhauPopupProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    khoanThu: '',
    hoKhau: '',
    nguoiNop: '',
    soTien: '',
    ngayNop: '',
    daHoanThanh: false
  });

  const [errors, setErrors] = useState({
    khoanThu: false,
    hoKhau: false,
    nguoiNop: false,
    soTien: false,
    ngayNop: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (value.trim() !== '') {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      khoanThu: formData.khoanThu.trim() === '',
      hoKhau: formData.hoKhau.trim() === '',
      nguoiNop: formData.nguoiNop.trim() === '',
      soTien: formData.soTien.trim() === '',
      ngayNop: formData.ngayNop.trim() === ''
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(err => err);
    if (hasError) return;

    console.log('Form submitted:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Nhập Thông tin Nộp phí</h3>
          <div className="mt-2 px-7 py-3">
            <form onSubmit={handleSubmit} noValidate>
              {/* Khoản thu */}
              <div className="mb-4 text-left">
                <RequiredLabel>Khoản thu</RequiredLabel>
                <input
                  name="khoanThu"
                  value={formData.khoanThu}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.khoanThu ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Chọn khoản thu"
                />
                {errors.khoanThu && (
                  <p className="text-red-500 text-xs mt-1">Trường này là bắt buộc.</p>
                )}
              </div>

              {/* Hộ khẩu */}
              <div className="mb-4 text-left">
                <RequiredLabel>Hộ khẩu</RequiredLabel>
                <input
                  name="hoKhau"
                  value={formData.hoKhau}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.hoKhau ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Chọn hộ khẩu"
                />
                {errors.hoKhau && (
                  <p className="text-red-500 text-xs mt-1">Trường này là bắt buộc.</p>
                )}
              </div>

              {/* Người nộp */}
              <div className="mb-4 text-left">
                <RequiredLabel>Người nộp</RequiredLabel>
                <input
                  name="nguoiNop"
                  value={formData.nguoiNop}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.nguoiNop ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Người nộp"
                />
                {errors.nguoiNop && (
                  <p className="text-red-500 text-xs mt-1">Trường này là bắt buộc.</p>
                )}
              </div>

              {/* Số tiền */}
              <div className="mb-4 text-left">
                <RequiredLabel>Số tiền</RequiredLabel>
                <input
                  type="number"
                  name="soTien"
                  value={formData.soTien}
                  onChange={handleChange}
                  min="0"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.soTien ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Số tiền"
                />
                {errors.soTien && (
                  <p className="text-red-500 text-xs mt-1">Trường này là bắt buộc.</p>
                )}
              </div>

              {/* Ngày nộp */}
              <div className="mb-4 text-left">
                <RequiredLabel>Ngày nộp</RequiredLabel>
                <input
                  type="date"
                  name="ngayNop"
                  value={formData.ngayNop}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.ngayNop ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.ngayNop && (
                  <p className="text-red-500 text-xs mt-1">Trường này là bắt buộc.</p>
                )}
              </div>

              {/* Checkbox */}
              <div className="flex items-center justify-start mb-2">
                <input
                  id="completed-checkbox"
                  name="daHoanThanh"
                  type="checkbox"
                  checked={formData.daHoanThanh}
                  onChange={handleChange}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <label htmlFor="completed-checkbox" className="ml-2 block text-sm text-gray-900">
                  Ghi nhận hoàn thành
                </label>
              </div>
              <p className="text-left text-sm text-gray-600 mb-4">
                Tích nếu muốn đợt thu này là hoàn toàn hoàn thành
              </p>

              {/* Nút hành động */}
              <div className="items-center px-4 py-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Lưu
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditHoKhauPopup;
