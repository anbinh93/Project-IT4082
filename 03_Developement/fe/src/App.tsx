import {
  BrowserRouter as Router,
  Routes,
  Route
  // Link
} from "react-router-dom";
import {
  Login,
  ForgetPassword,
  HomepageKeToan,
  HomepageToTruong,
  QuanLyKhoanThu,
  QuanLyDotThuPhi,
  ThongKeKhoanThu,
  QuanLyHoKhau,
  QuanLyNhanKhau,
  QuanLyTamTru,
  LichSuThayDoiNhanKhau,
  ThongKeNhanKhau
} from "./pages";

function App() {
  return (
    <Router basename="/KTPM_FE">
      {/* <nav className="flex flex-wrap gap-2 p-4 bg-gray-100 border-b mb-4 text-sm">
        <Link to="/login" className="hover:underline">Login</Link>
        <Link to="/forget-password" className="hover:underline">Quên mật khẩu</Link>
        <Link to="/homepage-ketoan" className="hover:underline">Trang chủ Kế toán</Link>
        <Link to="/homepage-totruong" className="hover:underline">Trang chủ Tổ trưởng</Link>
        <Link to="/quan-ly-khoan-thu" className="hover:underline">Quản lý khoản thu</Link>
        <Link to="/quan-ly-dot-thu-phi" className="hover:underline">Quản lý đợt thu phí</Link>
        <Link to="/thong-ke-khoan-thu" className="hover:underline">Thống kê khoản thu</Link>
        <Link to="/quan-ly-ho-khau" className="hover:underline">Quản lý hộ khẩu</Link>
        <Link to="/quan-ly-nhan-khau" className="hover:underline">Quản lý nhân khẩu</Link>
        <Link to="/quan-ly-tam-tru" className="hover:underline">Quản lý tạm trú/tạm vắng</Link>
        <Link to="/lich-su-thay-doi-nhan-khau" className="hover:underline">Lịch sử thay đổi nhân khẩu</Link>
        <Link to="/thong-ke-nhan-khau" className="hover:underline">Thống kê nhân khẩu</Link>
      </nav> */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/homepage-ketoan" element={<HomepageKeToan />} />
        <Route path="/homepage-totruong" element={<HomepageToTruong />} />
        <Route path="/quan-ly-khoan-thu" element={<QuanLyKhoanThu />} />
        <Route path="/quan-ly-dot-thu-phi" element={<QuanLyDotThuPhi />} />
        <Route path="/thong-ke-khoan-thu" element={<ThongKeKhoanThu />} />
        <Route path="/quan-ly-ho-khau" element={<QuanLyHoKhau />} />
        <Route path="/quan-ly-nhan-khau" element={<QuanLyNhanKhau />} />
        <Route path="/quan-ly-tam-tru" element={<QuanLyTamTru />} />
        <Route path="/lich-su-thay-doi-nhan-khau" element={<LichSuThayDoiNhanKhau />} />
        <Route path="/thong-ke-nhan-khau" element={<ThongKeNhanKhau />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
