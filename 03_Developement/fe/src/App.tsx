import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// Import components
import Login from "./pages/Login";
import HomepageKeToan from "./pages/HomepageKeToan";
import HomepageToTruong from "./pages/HomepageToTruong";
import QuanLyHoKhau from "./pages/QuanLyHoKhau";
import QuanLyNhanKhau from "./pages/QuanLyNhanKhau";
import QuanLyKhoanThu from "./pages/QuanLyKhoanThuTabBased";
import QuanLyDotThuPhi from "./pages/QuanLyDotThuPhi";
import QuanLyTamTru from "./pages/QuanLyTamTru";
import LichSuThayDoiNhanKhau from "./pages/LichSuThayDoiNhanKhau";
import QuanLyXe from "./pages/QuanLyXe";
import QuanLyPhong from "./pages/QuanLyPhong";
import ThongKeNhanKhau from "./pages/ThongKeNhanKhau";
import ThongKeKhoanThu from "./pages/ThongKeKhoanThu";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  // Always start with login page as the main entry point
  const getDefaultRoute = () => {
    return "/login";
  };

  return (
    <Router basename="/KTPM_FE">
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Kế toán routes - accessible by admin and accountant */}
        <Route path="/homepage-ketoan" element={
          <ProtectedRoute requiredRoles={['admin', 'accountant']}>
            <HomepageKeToan />
          </ProtectedRoute>
        } />
        <Route path="/quan-ly-khoan-thu" element={
          <ProtectedRoute requiredRoles={['admin', 'accountant']}>
            <QuanLyKhoanThu />
          </ProtectedRoute>
        } />
        <Route path="/quan-ly-dot-thu-phi" element={
          <ProtectedRoute requiredRoles={['admin', 'accountant']}>
            <QuanLyDotThuPhi />
          </ProtectedRoute>
        } />
        <Route path="/thong-ke-khoan-thu" element={
          <ProtectedRoute requiredRoles={['admin', 'accountant']}>
            <ThongKeKhoanThu />
          </ProtectedRoute>
        } />
        
        {/* Tổ trưởng routes - accessible by admin and manager */}
        <Route path="/homepage-totruong" element={
          <ProtectedRoute requiredRoles={['admin', 'manager']}>
            <HomepageToTruong />
          </ProtectedRoute>
        } />
        <Route path="/quan-ly-ho-khau" element={
          <ProtectedRoute requiredRoles={['admin', 'manager']}>
            <QuanLyHoKhau />
          </ProtectedRoute>
        } />
        <Route path="/quan-ly-nhan-khau" element={
          <ProtectedRoute requiredRoles={['admin', 'manager']}>
            <QuanLyNhanKhau />
          </ProtectedRoute>
        } />

        <Route path="/quan-ly-tam-tru" element={
          <ProtectedRoute requiredRoles={['admin', 'manager']}>
            <QuanLyTamTru />
          </ProtectedRoute>
        } />
        
        <Route path="/lich-su-thay-doi-nhan-khau" element={
          <ProtectedRoute requiredRoles={['admin', 'manager']}>
            <LichSuThayDoiNhanKhau />
          </ProtectedRoute>
        } />

        <Route path="/quan-ly-phong" element={
          <ProtectedRoute requiredRoles={['admin', 'manager']}>
            <QuanLyPhong />
          </ProtectedRoute>
        } />

        <Route path="/quan-ly-xe" element={
          <ProtectedRoute requiredRoles={['admin', 'manager']}>
            <QuanLyXe />
          </ProtectedRoute>
        } />
        <Route path="/thong-ke-nhan-khau" element={
          <ProtectedRoute requiredRoles={['admin', 'manager']}>
            <ThongKeNhanKhau />
          </ProtectedRoute>
        } />
        
        {/* Default routes */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
