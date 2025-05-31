import React from 'react';

interface EditNhanKhauPopupProps {
  isOpen: boolean;
  onClose: () => void;
  // Add props for data if editing an existing person
}

const EditNhanKhauPopup: React.FC<EditNhanKhauPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full flex justify-center items-center px-4" id="edit-nhan-khau-modal">
      <div className="relative p-5 border shadow-lg rounded-md bg-white w-full max-w-lg md:max-w-xl lg:max-w-2xl">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Chỉnh sửa Nhân khẩu</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Row 1: Họ tên & Ngày sinh */}
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700">Họ tên</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Họ tên" required />
            </div>
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
              <input type="date" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Ngày sinh" required />
            </div>

            {/* Row 2: Giới tính, Dân tộc, Tôn giáo */}
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700">Giới tính</label>
              <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700">Dân tộc</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Dân tộc" />
            </div>
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700">Tôn giáo</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Tôn giáo" />
            </div>

            {/* Row 3: CCCD & Ngày cấp */}
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700">CCCD</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="CCCD" required />
            </div>
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700">Ngày cấp</label>
              <input type="date" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Ngày cấp" />
            </div>

            {/* Row 4: Nơi cấp (full width) */}
            <div className="text-left md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Nơi cấp</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Nơi cấp" />
            </div>

            {/* Row 5: Nghề nghiệp (full width) */}
            <div className="text-left md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Nghề nghiệp</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Nghề nghiệp" />
            </div>

            {/* Row 6: Hộ khẩu hiện tại (full width) */}
            <div className="mb-4 text-left md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Hộ khẩu hiện tại</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Hộ khẩu hiện tại" />
            </div>

            {/* Row 7: Quan hệ với chủ hộ (full width) */}
            <div className="mb-4 text-left md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Quan hệ với chủ hộ</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Quan hệ với chủ hộ" />
            </div>
          </div>

          {/* Buttons */}
          <div className="items-center px-4 py-3 grid grid-cols-2 gap-4">
            <button
              id="cancel-button"
              className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              id="save-button"
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditNhanKhauPopup; 