import React from 'react';

interface EditHoKhauPopupProps {
  isOpen: boolean;
  onClose: () => void;
  // Add props for data if editing an existing household
}

const EditHoKhauPopup: React.FC<EditHoKhauPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full" id="edit-ho-khau-modal">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Chỉnh sửa Hộ khẩu</h3>
          <div className="mt-2 px-7 py-3">
            {/* Form Fields */}
            <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700">Số hộ khẩu</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Số hộ khẩu" />
            </div>
            <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700">Chủ hộ</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Chủ hộ" />
            </div>
             <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700">Số nhà</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Số nhà" />
            </div>
             <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700">Đường</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Đường" />
            </div>
              <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700">Phường, Quận, Thành phố</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Phường, Quận, Thành phố" />
            </div>
             <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700">Ngày làm hộ khẩu</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Ngày làm hộ khẩu" />
            </div>

            {/* Danh sách thành viên Table */}
             <div className="mt-6 text-left">
                <h4 className="text-md font-medium text-gray-900 mb-2">Danh sách thành viên</h4>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên nhân khẩu</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quan hệ với chủ hộ</th>
                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày thêm</th>
                           <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {/* Example row (replace with dynamic data) */}
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Nguyễn Văn An</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td> {/* Add relationship */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td> {/* Add date added */}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {/* Action buttons */}
                            <button className="text-indigo-600 hover:text-indigo-900 mr-2">Sửa</button>
                            <button className="text-red-600 hover:text-red-900">Xóa</button>
                          </td>
                        </tr>
                         <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Lê Thị Vân Anh</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td> {/* Add relationship */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td> {/* Add date added */}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {/* Action buttons */}
                            <button className="text-indigo-600 hover:text-indigo-900 mr-2">Sửa</button>
                            <button className="text-red-600 hover:text-red-900">Xóa</button>
                          </td>
                        </tr>
                         <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Nguyễn Văn Mạnh</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td> {/* Add relationship */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td> {/* Add date added */}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {/* Action buttons */}
                            <button className="text-indigo-600 hover:text-indigo-900 mr-2">Sửa</button>
                            <button className="text-red-600 hover:text-red-900">Xóa</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                 </div>
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

export default EditHoKhauPopup; 