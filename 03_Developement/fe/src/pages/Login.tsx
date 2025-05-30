import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const roles = [
  { label: "Kế toán", value: "ketoan" },
  { label: "Tổ trưởng/Tổ phó", value: "totruong" },
];

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(roles[0].value);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    setError("");
    if (role === "ketoan") {
      navigate("/homepage-ketoan");
    } else {
      navigate("/homepage-totruong");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f7fa] py-12 px-2">
      <div className="bg-white rounded-2xl shadow-lg border border-black/10 w-full max-w-[600px] p-12 flex flex-col gap-4">
        <h1 className="text-center text-[20px] font-bold text-[#000000] leading-tight mb-2 font-['Roboto'] tracking-wide uppercase drop-shadow-sm">
          <span className="block">HỆ THỐNG QUẢN LÝ THU PHÍ CHUNG CƯ</span>
        </h1>
        <form className="flex flex-col gap-3 mt-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-0 sm:flex-row sm:items-end sm:gap-4">
            <div className="flex-1">
              <label className="text-[14px] font-bold text-black mb-1 font-['Roboto']" htmlFor="username">
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
            </div>
            <div className="flex-1 sm:max-w-[220px]">
              <label className="text-[14px] font-bold text-black mb-1 sm:mb-1 sm:ml-2 font-['Roboto']" htmlFor="role">
                Vai trò
              </label>
              <select
                id="role"
                name="role"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] text-[16px] shadow-sm mt-1 sm:ml-2 font-['Roboto'] font-normal"
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                {roles.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>
          <label className="text-[14px] font-bold text-black mb-1 mt-2 font-['Roboto']" htmlFor="password">
            Mật khẩu
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] text-[16px] placeholder-gray-400 shadow-sm font-['Roboto'] font-normal"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
          />
          {error && <div className="text-red-500 text-sm mt-1 mb-2">{error}</div>}
          <button
            type="submit"
            className="mt-4 w-full bg-[#2196F3] text-white font-medium text-[14px] py-2 rounded-lg shadow-md hover:bg-[#1976D2] transition uppercase tracking-wider font-['Roboto']"
          >
            Đăng nhập
          </button>
          <div className="flex items-center justify-end mt-2">
            <a href="/KTPM_FE/forget-password" className="text-[15px] font-bold text-[#2196F3] hover:underline font-['Roboto']">Quên mật khẩu?</a>
          </div>
        </form>
      </div>
      <footer className="mt-8 text-[#746565] text-[16px] text-center font-['Roboto'] font-normal">
        @2025 Hệ thống Quản lý Thu phí Chung cư BlueMoon
      </footer>
    </div>
  );
};

export default Login; 