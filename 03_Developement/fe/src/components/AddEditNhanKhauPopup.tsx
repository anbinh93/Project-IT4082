import React from 'react';

interface AddEditNhanKhauPopupProps {
  isOpen: boolean;
  onClose: () => void;
  // Add props for data if editing an existing person
}

const AddEditNhanKhauPopup: React.FC<AddEditNhanKhauPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="mb-8 pb-4 border-b border-gray-300">
          <h2 className="text-2xl font-bold text-gray-900 text-left">Chỉnh sửa Nhân khẩu</h2>
        </div>
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Họ tên</label>
              <input type="text" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" placeholder="Search" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày sinh</label>
              <input type="date" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" placeholder="Search" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Giới tính</label>
              <select className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none" required>
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Dân tộc</label>
              <input type="text" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" placeholder="Search" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tôn giáo</label>
              <input type="text" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" placeholder="Search" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">CCCD</label>
              <input type="text" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" placeholder="Search" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày cấp</label>
              <input type="date" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" placeholder="Search" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nơi cấp</label>
              <input type="text" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" placeholder="Search" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nghề nghiệp</label>
              <input type="text" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" placeholder="Search" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hộ khẩu hiện tại</label>
              <input type="text" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" placeholder="Search" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Quan hệ với chủ hộ</label>
              <select className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none">
                <option value="">Chọn quan hệ</option>
                <option value="Con">Con</option>
                <option value="Vợ/Chồng">Vợ/Chồng</option>
                <option value="Cha/Mẹ">Cha/Mẹ</option>
                <option value="Anh/Chị/Em">Anh/Chị/Em</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>
          {/* Footer */}
          <div className="flex justify-between gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2 border border-gray-300 rounded-xl text-gray-700 font-bold bg-gray-100 hover:bg-gray-200 shadow-sm text-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-8 py-2 bg-blue-500 text-white rounded-xl font-bold shadow hover:bg-blue-600 transition text-lg"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditNhanKhauPopup; 