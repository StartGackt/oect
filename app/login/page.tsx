"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Sliders, 
  ArrowRight, 
  Key, 
  Smartphone, 
  CheckCircle2, 
  Building2, 
  Sparkles,
  Fingerprint,
  QrCode,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [selectedGateway, setSelectedGateway] = useState<"user" | "admin">("user");
  const [loginMethod, setLoginMethod] = useState<"password" | "thaid">("password");
  const [username, setUsername] = useState<string>("warakorn_cmi");
  const [password, setPassword] = useState<string>("••••••••••••");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Quick Preset Roles for Testing
  const quickUserPresets = [
    { label: "ระดับ 1: พนักงานส่วนภูมิภาค (เชียงใหม่)", username: "warakorn_cmi", role: "พนักงานบันทึกข้อมูล/สืบสวน" },
    { label: "ระดับ 2: ผอ.สนง.กกต.จว. เชียงใหม่", username: "director_cmi", role: "ผอ.กกต.จว. (สั่งรับ/ไม่รับ)" },
    { label: "ระดับ 3: กกต./ลธ.กกต. ส่วนกลาง", username: "commissioner_01", role: "วินิจฉัยชี้ขาด (ทั่วประเทศ)" },
    { label: "ระดับ 4: ประชาชน/ผู้ร้องเรียน", username: "citizen_thaid", role: "ติดตามสำนวนตนเอง (PDPA)" },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (selectedGateway === "admin") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    }, 600);
  };

  const handleQuickLogin = (dest: "user" | "admin", presetUsername?: string) => {
    setIsLoading(true);
    if (presetUsername) setUsername(presetUsername);
    setTimeout(() => {
      if (dest === "admin") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    }, 400);
  };

  return (
    <main className="min-h-screen bg-[#071326] text-white flex flex-col justify-between font-kanit selection:bg-amber-500 selection:text-slate-950 relative overflow-hidden">
      
      {/* Background Decorative Lighting */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top GovTech Security Bar */}
      <header className="border-b border-slate-800/80 bg-[#0B1E36]/80 backdrop-blur-md px-4 sm:px-6 py-2.5 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-white">ระบบรักษาความมั่นคงปลอดภัยภาครัฐ (GovTech Security Gateway)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="hidden sm:inline">ระบบพิสูจน์และยืนยันตัวตนทางดิจิทัล (DOPA ThaID)</span>
            <span className="text-amber-300 font-mono">TLS 1.3 / AES-256</span>
          </div>
        </div>
      </header>

      {/* Main Login Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 z-20 my-6">
        <div className="w-full max-w-xl bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 relative">
          
          {/* Brand Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto relative bg-white rounded-2xl p-2 border-2 border-amber-400/80 shadow-lg shadow-amber-500/10">
              <Image
                src="/oect-logo.png"
                alt="ตราสัญลักษณ์ สนง.กกต."
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
                <span>สำนักงานคณะกรรมการการเลือกตั้ง (สนง.กกต.)</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                ระบบบริหารจัดการเรื่องร้องเรียน <br className="hidden sm:inline" />
                และการดำเนินการตามกระบวนการยุติธรรม (ECT-CMS)
              </h1>
              <p className="text-xs text-slate-400 font-light">
                กรุณาเลือกประเภทระบบงานและยืนยันตัวตนเพื่อเข้าสู่ระบบ
              </p>
            </div>
          </div>

          {/* DUAL GATEWAY SELECTOR (ให้เลือกว่าจะไปไหน) */}
          <div className="grid grid-cols-2 gap-2.5 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800">
            
            {/* Option 1: User Portal */}
            <button
              type="button"
              onClick={() => setSelectedGateway("user")}
              className={`p-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                selectedGateway === "user"
                  ? "bg-gradient-to-r from-[#173B6B] to-[#1E4E8C] text-white shadow-md border border-blue-400/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0 ${
                selectedGateway === "user" ? "bg-white/20 text-amber-300" : "bg-slate-800 text-slate-400"
              }`}>
                <User className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold leading-tight">1. ระบบงานผู้ใช้</div>
                <div className="text-[10px] text-slate-300 truncate">เจ้าหน้าที่ / ประชาชน</div>
              </div>
            </button>

            {/* Option 2: Admin Console */}
            <button
              type="button"
              onClick={() => setSelectedGateway("admin")}
              className={`p-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                selectedGateway === "admin"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md border border-amber-300/50"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0 ${
                selectedGateway === "admin" ? "bg-slate-950 text-amber-400" : "bg-slate-800 text-slate-400"
              }`}>
                <Sliders className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold leading-tight">2. ผู้ดูแลระบบ</div>
                <div className={`text-[10px] truncate ${selectedGateway === "admin" ? "text-slate-900 font-medium" : "text-slate-400"}`}>
                  Admin & Governance
                </div>
              </div>
            </button>

          </div>

          {/* AUTH FORM */}
          {selectedGateway === "user" ? (
            <div className="space-y-4">
              
              {/* Method Switch: Username vs ThaID */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 text-xs">
                <span className="text-slate-400 font-medium">วิธีการยืนยันตัวตน:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLoginMethod("password")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                      loginMethod === "password"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    รหัสผ่าน + OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod("thaid")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                      loginMethod === "thaid"
                        ? "bg-emerald-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Fingerprint className="w-3 h-3" />
                    <span>แอป ThaID</span>
                  </button>
                </div>
              </div>

              {loginMethod === "password" ? (
                <form onSubmit={handleLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      ชื่อผู้ใช้งาน / เลขประจำตัวประชาชน 13 หลัก
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="กรอกชื่อผู้ใช้ หรือเลขบัตร 13 หลัก"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-slate-300">
                        รหัสผ่าน (Password)
                      </label>
                      <span className="text-[10px] text-blue-400 hover:underline cursor-pointer">
                        ลืมรหัสผ่าน?
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#173B6B] to-[#1E4E8C] hover:from-[#0B1E36] hover:to-[#173B6B] text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>{isLoading ? "กำลังยืนยันตัวตน..." : "เข้าสู่ระบบงานผู้ใช้ (User Portal)"}</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </button>
                </form>
              ) : (
                /* ThaID QR Code Login */
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center space-y-3">
                  <div className="w-32 h-32 mx-auto bg-white rounded-xl p-2 border border-emerald-500/40 flex items-center justify-center">
                    <QrCode className="w-28 h-28 text-slate-900" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                      <Fingerprint className="w-4 h-4" />
                      <span>สแกน QR Code ด้วยแอปพลิเคชัน ThaID</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      เปิดแอป ThaID บนสมาร์ตโฟน แล้วสแกนเพื่อยืนยันตัวตนทางดิจิทัลทันที
                    </p>
                  </div>
                  <button
                    onClick={() => handleQuickLogin("user", "citizen_thaid")}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                  >
                    จำลองการสแกน ThaID สำเร็จ →
                  </button>
                </div>
              )}

              {/* Quick One-Click Preset Buttons */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                  <span>⚡ หรือเลือกทดสอบเข้าสู่ระบบตามสิทธิ์ (4 ระดับ):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {quickUserPresets.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleQuickLogin("user", preset.username)}
                      className="p-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-left transition-colors text-xs space-y-0.5"
                    >
                      <div className="font-semibold text-blue-300 truncate text-[11px]">{preset.label}</div>
                      <div className="text-[10px] text-slate-400 truncate">{preset.role}</div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* ADMIN LOGIN */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <span>
                  สำหรับผู้ดูแลระบบ สนง.กกต. ส่วนกลาง และฝ่ายเทคโนโลยีสารสนเทศ (ควบคุม RBAC, SLA, API 3 ระบบ)
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  ชื่อผู้ดูแลระบบ (Admin Account / UPN)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    defaultValue="admin_root"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  รหัสผ่านผู้ดูแลระบบ (Admin Master Key)
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    defaultValue="••••••••••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  รหัสยืนยัน 2FA Hardware Token / TOTP Code (6 หลัก)
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    defaultValue="842 195"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-300 tracking-wider focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>{isLoading ? "กำลังตรวจสอบสิทธิ์ Admin..." : "เข้าสู่ศูนย์ควบคุมผู้ดูแลระบบ (Admin Console)"}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <div className="pt-2 border-t border-slate-800 text-center">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("admin")}
                  className="text-xs text-amber-400 hover:underline font-semibold"
                >
                  ⚡ เข้าสู่ระบบ Admin ทันที (โหมดทดสอบ) →
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* Security Compliance Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0B1E36]/90 px-4 sm:px-6 py-4 z-20 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            © 2026 สำนักงานคณะกรรมการการเลือกตั้ง · ระบบบริหารจัดการเรื่องร้องเรียนและการสืบสวนไต่สวน (ECT-CMS)
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>มาตรฐาน OWASP Top 10</span>
            <span>·</span>
            <span>พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)</span>
            <span>·</span>
            <span>ระบบเชื่อมโยง DXC / Linkage Center</span>
          </div>
        </div>
      </footer>

    </main>
  );
}
