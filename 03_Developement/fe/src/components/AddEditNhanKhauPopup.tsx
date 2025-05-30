import React from 'react';

interface AddEditNhanKhauPopupProps {
  isOpen: boolean;
  onClose: () => void;
  // Add props for data if editing an existing person
}

const AddEditNhanKhauPopup: React.FC<AddEditNhanKhauPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50" id="add-edit-nhan-khau-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Nhập Thông tin Nhân khẩu</h3>
          <div className="mt-2 px-7 py-3">
            {/* Form Fields */}
            <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700">Nhân khẩu</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Nhân khẩu" />
            </div>
            <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700">Quan hệ với chủ hộ</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Quan hệ với chủ hộ" />
            </div>
             <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700">Ngày thêm</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Ngày thêm" />
            </div>

          </div>
          <div className="items-center px-4 py-3">
            <button
              id="save-button"
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Lưu
            </button>
             <button
              id="cancel-button"
              className="mt-3 px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={onClose}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditNhanKhauPopup; 