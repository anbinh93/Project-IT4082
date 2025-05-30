import React from 'react';

interface AddEditTamTruPopupProps {
  isOpen: boolean;
  onClose: () => void;
  // Add props for data if editing an existing entry
}

const AddEditTamTruPopup: React.FC<AddEditTamTruPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full" id="add-edit-tam-tru-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Nhập Thông tin Tạm trú/Tạm vắng</h3>
          <div className="mt-2 px-7 py-3">
            {/* Form Fields */}
            <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700">Nhân khẩu</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Nhân khẩu" />
            </div>
            <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Trạng thái" />
            </div>
             <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700">Địa chỉ tạm trú/tạm vắng</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Địa chỉ tạm trú/tạm vắng" />
            </div>
             <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700">Thời gian</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Thời gian" />
            </div>
              <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700">Nội dung đề nghị</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Nội dung đề nghị" />
            </div>

            {/* Checkbox */}
            <div className="flex items-center justify-start mb-4">
              <input id="completed-checkbox" type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
              <label htmlFor="completed-checkbox" className="ml-2 block text-sm text-gray-900">Ghi nhận hoàn thành</label>
            </div>
             <p className="text-left text-sm text-gray-600 mb-4">Tích nếu muốn đợt thu này là hoàn toàn hoàn thành</p>


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

export default AddEditTamTruPopup; 