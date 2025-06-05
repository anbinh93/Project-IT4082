import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from '../assets/logo.png';

const ForgetPassword: React.FC = () => {
  const [username, setUsername] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showConfirmSection, setShowConfirmSection] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const navigate = useNavigate();

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setError("Vui lòng nhập tên đăng nhập.");
      return;
    }
    // Logic to send authentication code
    setError("");
    setShowConfirmSection(true); // Show the second section after sending code
    alert("Mã xác thực đã được gửi đến email/số điện thoại liên kết với tài khoản của bạn."); // Placeholder
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authCode || !newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin xác nhận.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }
    // Logic to reset password
    setError("");
    alert("Mật khẩu của bạn đã được đặt lại thành công."); // Placeholder
    navigate('/KTPM_FE/login');
  };

  const checkPasswordStrength = (pwd: string) => {
    if (pwd.length < 8) return 'Yếu (tối thiểu 8 ký tự)';
    if (!/[A-Z]/.test(pwd)) return 'Yếu (cần chữ hoa)';
    if (!/[0-9]/.test(pwd)) return 'Yếu (cần số)';
    if (!/[^A-Za-z0-9]/.test(pwd)) return 'Yếu (cần ký tự đặc biệt)';
    return 'Mạnh';
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setPasswordStrength(checkPasswordStrength(e.target.value));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f7fa] py-12 px-2">
      <div className="bg-white rounded-2xl shadow-lg border border-black/10 w-full max-w-[600px] p-12 flex flex-col gap-4">
        <div className="flex flex-col items-center mb-2">
          <img src={Logo} alt="Bluemoon Logo" className="w-16 h-16 mb-2" />
          <h1 className="text-center text-[22px] font-bold text-[#000000] leading-tight mb-1 font-['Roboto'] tracking-wide uppercase">
            Khôi phục mật khẩu
          </h1>
          <span className="text-center text-[16px] font-semibold text-[#1976D2] font-['Roboto'] mb-2">
          HỆ THỐNG QUẢN LÝ THU PHÍ CHUNG CƯ
          </span>
        </div>
        {!showConfirmSection && (
          <form className="flex flex-col gap-2 mt-0" onSubmit={handleSendCode}>
            <label className="text-[14px] font-bold text-black font-['Roboto']" htmlFor="username">
              Tên đăng nhập
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] text-[16px] placeholder-gray-400 shadow-sm mt-1 font-['Roboto'] font-normal"
              autoComplete="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              required
            />
            {!showConfirmSection && error && username === "" && <div className="text-red-500 text-sm mt-1 mb-2">{error}</div>}
            <button
              type="submit"
              className="mt-4 w-full bg-[#2196F3] text-white font-medium text-[14px] py-2 rounded-lg shadow-md hover:bg-[#1976D2] transition uppercase tracking-wider font-['Roboto']"
            >
              GỬI MÃ XÁC THỰC
            </button>
            <div className="flex items-center justify-between mt-2">
              <button
                type="button"
                className="text-[15px] font-bold text-[#2196F3] hover:underline font-['Roboto']"
                onClick={() => navigate('/login')}
              >
                Quay lại đăng nhập
              </button>
            </div>
          </form>
        )}

        {showConfirmSection && (
          <form className="flex flex-col gap-2 mt-4" onSubmit={handleConfirm}>
            <label className="text-[14px] font-medium text-black font-['Roboto']" htmlFor="authCode">
              Mã xác thực
            </label>
            <input
              id="authCode"
              name="authCode"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] text-[16px] placeholder-gray-400 shadow-sm mt-1 font-['Roboto'] font-normal"
              value={authCode}
              onChange={e => setAuthCode(e.target.value)}
              placeholder="Nhập mã xác thực"
              required
            />
             {showConfirmSection && error && authCode === "" && <div className="text-red-500 text-sm mt-1 mb-2">{error}</div>}

            <label className="text-[14px] font-medium text-black mt-2 font-['Roboto']" htmlFor="newPassword">
              Mật khẩu mới
            </label>
            <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
                type={showNewPassword ? "text" : "password"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] text-[16px] placeholder-gray-400 shadow-sm mt-1 font-['Roboto'] font-normal"
              value={newPassword}
                onChange={handleNewPasswordChange}
              placeholder="Nhập mật khẩu mới của bạn"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1976D2] text-xs font-semibold focus:outline-none"
                onClick={() => setShowNewPassword(v => !v)}
                tabIndex={-1}
              >
                {showNewPassword ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
            {newPassword && <div className={`text-xs mt-1 mb-1 ${passwordStrength === 'Mạnh' ? 'text-green-600' : 'text-red-500'}`}>{passwordStrength}</div>}

            <label className="text-[14px] font-medium text-black mt-2 font-['Roboto']" htmlFor="confirmPassword">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] text-[16px] placeholder-gray-400 shadow-sm mt-1 font-['Roboto'] font-normal"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu"
                required
            />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1976D2] text-xs font-semibold focus:outline-none"
                onClick={() => setShowConfirmPassword(v => !v)}
                tabIndex={-1}
              >
                {showConfirmPassword ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
            {showConfirmSection && error && confirmPassword === "" && <div className="text-red-500 text-sm mt-1 mb-2">{error}</div>}
            {showConfirmSection && error && newPassword !== confirmPassword && <div className="text-red-500 text-sm mt-1 mb-2">{error}</div>}

            <button
              type="submit"
              className="mt-4 w-full bg-[#2196F3] text-white font-medium text-[14px] py-2 rounded-lg shadow-md hover:bg-[#1976D2] transition uppercase tracking-wider font-['Roboto']"
            >
              XÁC NHẬN
            </button>
            <div className="flex items-center justify-between mt-2">
              <button
                type="button"
                className="text-[15px] font-bold text-[#2196F3] hover:underline font-['Roboto']"
                onClick={() => navigate('/login')}
              >
                Quay lại đăng nhập
              </button>
            </div>
          </form>
        )}
    </div>
      <footer className="mt-8 text-[#746565] text-[16px] text-center font-['Roboto'] font-normal">
      @2025 Hệ thống Quản lý Thu phí Chung cư BlueMoon
    </footer>
  </div>
);
};

export default ForgetPassword; 