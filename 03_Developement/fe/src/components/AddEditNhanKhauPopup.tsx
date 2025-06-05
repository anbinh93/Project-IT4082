import React from 'react';

interface AddEditNhanKhauPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  large?: boolean;
}

const AddEditNhanKhauPopup: React.FC<AddEditNhanKhauPopupProps> = ({ isOpen, onClose, initialData, large }) => {
  const [formData, setFormData] = React.useState(initialData || {
    hoTen: '', ngaySinh: '', gioiTinh: '', danToc: '', tonGiao: '', cccd: '', ngayCap: '', noiCap: '', ngheNghiep: '', hoKhau: '', quanHe: ''
  });
  React.useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className={`bg-white rounded-2xl shadow-2xl p-6 w-full ${large ? 'max-w-3xl' : 'max-w-xl'} max-h-[90vh] overflow-y-auto relative`}>
        {/* Header */}
        <div className="mb-8 pb-4 border-b border-gray-300">
          <h2 className="text-2xl font-bold text-gray-900 text-left">{initialData ? 'Sửa Nhân khẩu' : 'Thêm Nhân khẩu'}</h2>
        </div>
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Họ tên <span className="text-red-500">*</span> </label>
              <input type="text" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" placeholder="Search" required value={formData.hoTen} onChange={e => setFormData((f: any) => ({ ...f, hoTen: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày sinh <span className="text-red-500">*</span> </label>
              <input type="date" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" required value={formData.ngaySinh} onChange={e => setFormData((f: any) => ({ ...f, ngaySinh: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Giới tính <span className="text-red-500">*</span> </label>
              <select className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none" required value={formData.gioiTinh} onChange={e => setFormData((f: any) => ({ ...f, gioiTinh: e.target.value }))}>
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Dân tộc </label>
              <input type="text" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" value={formData.danToc} onChange={e => setFormData((f: any) => ({ ...f, danToc: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tôn giáo</label>
              <input type="text" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" value={formData.tonGiao} onChange={e => setFormData((f: any) => ({ ...f, tonGiao: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">CCCD <span className="text-red-500">*</span> </label>
              <input type="text" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" required value={formData.cccd} onChange={e => setFormData((f: any) => ({ ...f, cccd: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày cấp <span className="text-red-500">*</span> </label>
              <input type="date" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" value={formData.ngayCap} onChange={e => setFormData((f: any) => ({ ...f, ngayCap: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nơi cấp <span className="text-red-500">*</span> </label>
              <input type="text" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" value={formData.noiCap} onChange={e => setFormData((f: any) => ({ ...f, noiCap: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nghề nghiệp</label>
              <input type="text" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" value={formData.ngheNghiep} onChange={e => setFormData((f: any) => ({ ...f, ngheNghiep: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hộ khẩu hiện tại <span className="text-red-500">*</span> </label>
              <input type="text" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" value={formData.hoKhau} onChange={e => setFormData((f: any) => ({ ...f, hoKhau: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Quan hệ với chủ hộ <span className="text-red-500">*</span> </label>
              <select className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none" value={formData.quanHe} onChange={e => setFormData((f: any) => ({ ...f, quanHe: e.target.value }))}>
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