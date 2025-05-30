import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgetPassword: React.FC = () => {
  const [username, setUsername] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showConfirmSection, setShowConfirmSection] = useState(false);

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f7fa] py-12 px-2">
      <div className="bg-white rounded-2xl shadow-lg border border-black/10 w-full max-w-[600px] p-12 flex flex-col gap-4">
        <h1 className="text-center text-[20px] font-bold text-[#000000] leading-tight mb-2 font-['Roboto'] tracking-wide uppercase drop-shadow-sm">
          HỆ THỐNG QUẢN LÝ THU PHÍ CHUNG CƯ
      </h1>
        {!showConfirmSection && (
          <form className="flex flex-col gap-6 mt-4" onSubmit={handleSendCode}>
            <label className="text-[14px] font-medium text-black mb-1 font-['Roboto']" htmlFor="username">
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
            />
            {!showConfirmSection && error && username === "" && <div className="text-red-500 text-sm mt-1 mb-2">{error}</div>}
            <button
              type="submit"
              className="mt-4 w-full bg-[#2196F3] text-white font-medium text-[14px] py-2 rounded-lg shadow-md hover:bg-[#1976D2] transition uppercase tracking-wider font-['Roboto']"
            >
              GỬI MÃ XÁC THỰC
            </button>
          </form>
        )}

        {showConfirmSection && (
          <form className="flex flex-col gap-6 mt-4" onSubmit={handleConfirm}>
            <label className="text-[14px] font-medium text-black mb-1 font-['Roboto']" htmlFor="authCode">
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
            />
             {showConfirmSection && error && authCode === "" && <div className="text-red-500 text-sm mt-1 mb-2">{error}</div>}

            <label className="text-[14px] font-medium text-black mb-1 mt-2 font-['Roboto']" htmlFor="newPassword">
              Mật khẩu mới
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] text-[16px] placeholder-gray-400 shadow-sm mt-1 font-['Roboto'] font-normal"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới của bạn"
            />
             {showConfirmSection && error && newPassword === "" && <div className="text-red-500 text-sm mt-1 mb-2">{error}</div>}

            <label className="text-[14px] font-medium text-black mb-1 mt-2 font-['Roboto']" htmlFor="confirmPassword">
              Xác nhận mật khẩu
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] text-[16px] placeholder-gray-400 shadow-sm mt-1 font-['Roboto'] font-normal"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu"
            />
            {showConfirmSection && error && confirmPassword === "" && <div className="text-red-500 text-sm mt-1 mb-2">{error}</div>}
            {showConfirmSection && error && newPassword !== confirmPassword && <div className="text-red-500 text-sm mt-1 mb-2">{error}</div>}

            <button
              type="submit"
              className="mt-4 w-full bg-[#2196F3] text-white font-medium text-[14px] py-2 rounded-lg shadow-md hover:bg-[#1976D2] transition uppercase tracking-wider font-['Roboto']"
            >
              XÁC NHẬN
            </button>
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