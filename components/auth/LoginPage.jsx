"use client";

import { Button } from "@/components/ui";
import { useAuthStore } from "@/store";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Power,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // State for error
  const [shake, setShake] = useState(false); // State for shake animation

  const { login } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // Reset Error

    if (!username || !password) {
      showError("Please enter valid credentials.");
      return;
    }

    setIsLoading(true);
    // Simulate delay for realism
    await new Promise((r) => setTimeout(r, 800));

    const result = await login(username, password);
    setIsLoading(false);

    if (result.success) {
      toast.success("Authentication Successful");
    } else {
      showError(result.message || "Invalid username or password.");
    }
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500); // Reset shake
  };

  const handleExit = () => {
    if (window.electron) window.electron.close();
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#020617] overflow-hidden select-none font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse-slow delay-1000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          x: shake ? [0, -10, 10, -10, 10, 0] : 0,
        }}
        transition={{ duration: shake ? 0.4 : 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[380px]"
      >
        <div className="bg-[#0f172a]/90 backdrop-blur-2xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5">
          {/* Header */}
          <div className="pt-8 pb-6 text-center border-b border-slate-800 bg-[#1e293b]/30">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 ring-1 ring-white/10"
            >
              <ShieldCheck className="w-8 h-8 text-white" strokeWidth={2} />
            </motion.div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Hyper Family ICT
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide uppercase">
              Enterprise Access Control
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 space-y-5">
            {/* Error Message (Modern Alert) */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0, mb: 0 }}
                  animate={{ opacity: 1, height: "auto", mb: 12 }}
                  exit={{ opacity: 0, height: 0, mb: 0 }}
                  className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 flex items-start gap-3"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-rose-400">
                      Access Denied
                    </h4>
                    <p className="text-[10px] text-rose-300/80 leading-tight mt-0.5">
                      {errorMsg}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setErrorMsg("")}
                    className="text-rose-400 hover:text-rose-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">
                Identity
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrorMsg("");
                  }}
                  className="w-full h-11 bg-[#0b1120] border border-slate-700 rounded-xl pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                  placeholder="Username"
                  autoFocus
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">
                Credentials
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg("");
                  }}
                  className="w-full h-11 bg-[#0b1120] border border-slate-700 rounded-xl pl-10 pr-10 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 text-xs tracking-wide uppercase mt-4 transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
            >
              <LogIn className="w-4 h-4 mr-2" /> Authenticate Session
            </Button>
          </form>

          {/* Footer */}
          <div className="bg-[#0b1120]/50 border-t border-slate-800 p-4 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500">
                System Status: <span className="text-emerald-500">ONLINE</span>
              </span>
              <span className="text-[9px] text-slate-600">
                v1.2.0 • Build 2024
              </span>
            </div>

            <button
              onClick={handleExit}
              className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-rose-400 transition-colors px-3 py-1.5 rounded-lg border border-slate-800 hover:border-rose-500/30 hover:bg-rose-500/5"
            >
              <Power className="w-3.5 h-3.5" /> SHUTDOWN
            </button>
          </div>
        </div>
      </motion.div>

      {/* Footer Text */}
      <div className="absolute bottom-6 text-center w-full z-10 opacity-40">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
          Restricted Access Area
        </p>
        <p className="text-[9px] text-slate-600">
          Unauthorized access is prohibited and will be logged.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
