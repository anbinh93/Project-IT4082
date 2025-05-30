import React from "react";
// import logo from "../assets/logo.svg"; // nếu có logo

const FigmaFrame: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F4F6] py-16 px-2">
      <div className="bg-red-500 rounded-lg shadow-lg border border-black/10 w-[724px] max-w-full p-8 flex flex-col gap-6">
        <h1 className="text-center text-[20px] font-bold text-black leading-tight mb-2 font-['Roboto']">
          HỆ THỐNG QUẢN LÝ THU PHÍ CHUNG CƯ
        </h1>
        <p className="text-left text-[14px] text-black mb-4 font-['Roboto']">
          Fill out the form below and we'll get back to you as soon as possible.
        </p>
        <form className="flex flex-col gap-4 w-[675px] max-w-full mx-auto">
          <label className="text-[14px] font-medium text-black font-['Roboto']" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            className="w-full px-3 py-2 border border-black/40 rounded bg-red-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="username"
          />
          <label className="text-[14px] font-medium text-black font-['Roboto'] mt-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full px-3 py-2 border border-black/40 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="mt-6 w-full bg-[#1976D2] text-white font-medium text-[14px] py-2 rounded shadow hover:bg-blue-700 transition uppercase tracking-wider font-['Roboto']"
          >
            LOGIN
          </button>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[15px] text-black font-['Roboto']">You forgot your password?</span>
            <a href="#" className="text-[15px] font-bold text-black font-['Roboto'] hover:underline">Forgot Password</a>
          </div>
        </form>
      </div>
      <footer className="mt-8 text-[#746565] text-[16px] text-center font-['Roboto']">
        @2025 Hệ thống Quản lý Thu phí Chung cư BlueMoon
      </footer>
    </div>
  );
};

export default FigmaFrame; 