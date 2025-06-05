import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';

const roles = [
  { label: "Kế toán", value: "ketoan" },
  { label: "Tổ trưởng/Tổ phó", value: "totruong" },
];

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(roles[0].value);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !role) {
      setError("Vui lòng nhập đầy đủ thông tin và chọn vai trò.");
      return;
    }
    setError("");
    if (rememberMe) {
      localStorage.setItem('loginInfo', JSON.stringify({ username, role }));
    } else {
      localStorage.removeItem('loginInfo');
    }
    if (role === "ketoan") {
      navigate("/homepage-ketoan");
    } else {
      navigate("/homepage-totruong");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f7fa] py-8 px-2">
      <div className="bg-white rounded-2xl shadow-lg border border-black/10 w-full max-w-[600px] p-8 flex flex-col gap-3">
        <div className="flex flex-col items-center mb-2">
          <img src={Logo} alt="Bluemoon Logo" className="w-16 h-16 mb-2" />
          <h1 className="text-center text-[22px] font-bold text-[#000000] leading-tight font-['Roboto'] tracking-wide uppercase mb-1">
            Đăng nhập
          </h1>
          <span className="text-center text-[16px] font-semibold text-[#1976D2] font-['Roboto'] mb-2">
          HỆ THỐNG QUẢN LÝ THU PHÍ CHUNG CƯ
          </span>
        </div>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="block text-[14px] font-bold text-black mb-1 font-['Roboto']" htmlFor="username">
                Tên đăng nhập
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] text-[16px] placeholder-gray-400 shadow-sm font-['Roboto'] font-normal"
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>
            <div className="flex-1 sm:max-w-[220px]">
              <label className="block text-[14px] font-bold text-black mb-1 font-['Roboto']" htmlFor="role">
                Vai trò
              </label>
              <select
                id="role"
                name="role"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] text-[16px] shadow-sm font-['Roboto'] font-normal"
                value={role}
                onChange={e => setRole(e.target.value)}
                required
              >
                <option value="" disabled>Chọn vai trò</option>
                {roles.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[14px] font-bold text-black mb-1 font-['Roboto']" htmlFor="password">
              Mật khẩu
            </label>
            <div className="relative">
            <input
              id="password"
              name="password"
                type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] text-[16px] placeholder-gray-400 shadow-sm font-['Roboto'] font-normal"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
                required
            />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1976D2] text-xs font-semibold focus:outline-none"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
              >
                {showPassword ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-[#2196F3] border-gray-300 rounded focus:ring-[#2196F3]"
            />
            <label htmlFor="rememberMe" className="text-[14px] font-normal text-black font-['Roboto'] cursor-pointer">
              Ghi nhớ đăng nhập
            </label>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-[#2196F3] text-white font-medium text-[14px] py-2 rounded-lg shadow-md hover:bg-[#1976D2] transition uppercase tracking-wider font-['Roboto']"
          >
            Đăng nhập
          </button>
          <div className="flex items-center justify-between">
            <Link to="/forget-password" className="text-[15px] font-bold text-[#2196F3] hover:underline font-['Roboto']">
              Quên mật khẩu?
            </Link>
          </div>
        </form>
      </div>
      <footer className="mt-6 text-[#746565] text-[16px] text-center font-['Roboto'] font-normal">
        @2025 Hệ thống Quản lý Thu phí Chung cư BlueMoon
      </footer>
    </div>
  );
};

export default Login;