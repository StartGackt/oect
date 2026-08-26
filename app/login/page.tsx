"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  Eye,
  EyeOff,
  Fingerprint,
  Headphones,
  KeyRound,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";

type Gateway = "user" | "admin";
type LoginMethod = "password" | "thaid";

const OFFICER_ACCESS_OPTIONS = [
  { value: "intake", label: "พนักงานรับและบันทึกคำร้อง" },
  { value: "director", label: "ผอ.สนง.กกต.จว." },
  { value: "commission", label: "กกต. / ลธ.กกต. ส่วนกลาง" },
  { value: "admin", label: "ผู้ดูแลระบบ (System Admin)" },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [selectedGateway, setSelectedGateway] = useState<Gateway>("user");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("password");
  const [username, setUsername] = useState("citizen_thaid");
  const [identityStatus, setIdentityStatus] = useState("ผู้มีสิทธิเลือกตั้งในเขต");
  const [officerRole, setOfficerRole] = useState("intake");
  const [password, setPassword] = useState("demo-password");
  const [otp, setOtp] = useState("291846");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    window.setTimeout(() => {
      router.push(selectedGateway === "user"
        ? "/user?view=citizen"
        : officerRole === "admin" ? "/admin" : `/user?role=${officerRole}`);
    }, 550);
  };

  const handleDemoLogin = (destination: "citizen" | "officer") => {
    setIsLoading(true);
    window.setTimeout(() => {
      router.push(destination === "citizen"
        ? "/user?view=citizen"
        : officerRole === "admin" ? "/admin" : `/user?role=${officerRole}`);
    }, 350);
  };

  return (
    <main className="relative min-h-svh overflow-hidden bg-[#F4F8FC] font-kanit text-slate-950 selection:bg-[#FFD600] selection:text-[#1B3F8B]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-48 -top-48 h-[34rem] w-[34rem] rounded-full bg-[#4FB3E8]/25 blur-3xl" />
        <div className="absolute -bottom-56 -right-40 h-[38rem] w-[38rem] rounded-full bg-[#FFD600]/15 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.42)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.42)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_72%)]" />
      </div>

      <header className="relative z-10 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1480px] items-center justify-between px-4 sm:px-7 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[#FFD600] bg-white p-1.5 shadow-sm">
              <Image src="/oect-logo.png" alt="ตราสัญลักษณ์สำนักงานคณะกรรมการการเลือกตั้ง" fill sizes="44px" className="object-contain p-1" priority />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-[#1B3F8B] sm:text-base">สำนักงานคณะกรรมการการเลือกตั้ง</span>
              <span className="block truncate text-[10px] font-normal tracking-wide text-slate-500 sm:text-[11px]">OFFICE OF THE ELECTION COMMISSION OF THAILAND</span>
            </span>
          </div>

          <div className="hidden items-center gap-5 text-[11px] text-slate-500 sm:flex">
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#4FB3E8] ring-4 ring-[#4FB3E8]/20" /> ระบบพร้อมให้บริการ</span>
            <span className="h-4 w-px bg-slate-200" />
            <span className="inline-flex items-center gap-1.5"><Headphones className="h-3.5 w-3.5" /> ศูนย์ช่วยเหลือ 02-141-8888</span>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-116px)] max-w-[1180px] items-center justify-center px-4 py-5 sm:px-7 sm:py-7 lg:px-10 lg:py-8">
        <section className="w-full">
          <div className="relative w-full overflow-hidden rounded-[28px] border border-white/90 border-t-[#FFD600] bg-white/95 p-5 shadow-[0_28px_80px_-40px_rgba(27,63,139,.38)] backdrop-blur-xl sm:border-t-4 sm:p-8 lg:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#4FB3E8]/10 blur-3xl" />
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="relative h-10 w-10 overflow-hidden rounded-xl border border-[#FFD600] bg-white p-1"><Image src="/oect-logo.png" alt="ตราสัญลักษณ์ สนง.กกต." fill sizes="40px" className="object-contain p-1" /></span>
                  <span className="text-[10px] font-semibold leading-4 text-[#1B3F8B]">สำนักงานคณะกรรมการ<br />การเลือกตั้ง</span>
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#4FB3E8]">Secure sign in</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-[1.7rem]">{selectedGateway === "user" ? "บริการสำหรับผู้ร้องเรียน" : "ระบบงานเจ้าหน้าที่"}</h2>
                <p className="mt-1.5 text-xs font-light leading-5 text-slate-500">{selectedGateway === "user" ? "ยื่นคำร้อง ติดตาม แก้ไขเอกสาร และรับผลการพิจารณา" : "จัดการคำร้อง สำนวน Workflow และการกำกับระบบ"}</p>
              </div>
              <span className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#4FB3E8]/10 px-2.5 py-1 text-[10px] font-medium text-[#1B3F8B] ring-1 ring-[#4FB3E8]/35">
                <LockKeyhole className="h-3 w-3" /> ปลอดภัย
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1.5" role="tablist" aria-label="เลือกประเภทระบบงาน">
              <GatewayTab active={selectedGateway === "user"} onClick={() => setSelectedGateway("user")} icon={<UserRound className="h-4 w-4" />} label="ผู้ร้องเรียน" detail="ยื่นและติดตามคำร้อง" />
              <GatewayTab active={selectedGateway === "admin"} onClick={() => setSelectedGateway("admin")} icon={<Building2 className="h-4 w-4" />} label="เจ้าหน้าที่ / ผู้ดูแล" detail="จัดการคำร้องและระบบ" tone="gold" />
            </div>

            {selectedGateway === "user" ? (
              <div className="mt-6">
                <div className="mb-5 flex gap-6 border-b border-slate-200" role="tablist" aria-label="วิธียืนยันตัวตน">
                  <MethodTab active={loginMethod === "password"} onClick={() => setLoginMethod("password")} icon={<KeyRound className="h-3.5 w-3.5" />} label="บัญชีผู้ใช้ + OTP" />
                  <MethodTab active={loginMethod === "thaid"} onClick={() => setLoginMethod("thaid")} icon={<Fingerprint className="h-3.5 w-3.5" />} label="ยืนยันผ่าน ThaID" />
                </div>

                {loginMethod === "password" ? (
                  <form onSubmit={handleLogin} className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="identity-status" className="mb-1.5 block text-[11px] font-medium text-slate-700">ประเภทผู้ใช้งาน</label>
                      <select id="identity-status" value={identityStatus} onChange={(event) => setIdentityStatus(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-800 outline-none transition focus:border-[#4FB3E8] focus:bg-white focus:ring-4 focus:ring-[#4FB3E8]/20">
                        <option>ผู้มีสิทธิเลือกตั้งในเขต</option>
                        <option>ผู้สมัครรับเลือกตั้งในเขต</option>
                      </select>
                    </div>

                    <Field id="username" label="ชื่อผู้ใช้ / เลขประจำตัวประชาชน" icon={<UserRound className="h-4 w-4" />}>
                      <input id="username" type="text" required autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-[#4FB3E8] focus:bg-white focus:ring-4 focus:ring-[#4FB3E8]/20" placeholder="กรอกชื่อผู้ใช้หรือเลขประจำตัวประชาชน" />
                    </Field>

                    <Field id="password" label="รหัสผ่าน" icon={<LockKeyhole className="h-4 w-4" />} action="ลืมรหัสผ่าน?">
                      <input id="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 text-xs outline-none transition placeholder:text-slate-400 focus:border-[#4FB3E8] focus:bg-white focus:ring-4 focus:ring-[#4FB3E8]/20" placeholder="กรอกรหัสผ่าน" />
                      <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"} className="absolute bottom-0 right-0 flex h-11 w-11 items-center justify-center text-slate-400 transition hover:text-slate-700">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </Field>

                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <label htmlFor="otp" className="text-[11px] font-medium text-slate-700">รหัส OTP 6 หลัก</label>
                        <button type="button" className="text-[10px] font-medium text-[#1B3F8B] hover:underline">ส่งรหัสอีกครั้ง</button>
                      </div>
                      <div className="relative">
                        <Smartphone className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <input id="otp" type="text" required inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 font-kanit text-sm tracking-[.22em] outline-none transition focus:border-[#4FB3E8] focus:bg-white focus:ring-4 focus:ring-[#4FB3E8]/20" />
                      </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1B3F8B] px-5 text-xs font-semibold text-white shadow-lg shadow-[#1B3F8B]/20 transition hover:bg-[#4FB3E8] hover:text-[#1B3F8B] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4FB3E8]/30 disabled:cursor-wait disabled:opacity-70 md:col-span-2">
                      {isLoading ? "กำลังตรวจสอบข้อมูล..." : "เข้าสู่ระบบ"}
                      <ArrowRight className="h-4 w-4 text-[#FFD600] transition group-hover:translate-x-0.5" />
                    </button>
                  </form>
                ) : (
                  <ThaIdPanel onSuccess={() => handleDemoLogin("citizen")} isLoading={isLoading} />
                )}

                <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#4FB3E8]/35 bg-[#4FB3E8]/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#1B3F8B]" />
                    <div><div className="text-[11px] font-semibold text-[#1B3F8B]">พื้นที่ส่วนตัวของผู้ร้องเรียน</div><div className="mt-1 text-[10px] leading-5 text-slate-500">แสดงเฉพาะคำร้องของตนเอง และไม่เปิดเผยข้อมูลการทำงานภายในของเจ้าหน้าที่</div></div>
                  </div>
                  <button type="button" onClick={() => handleDemoLogin("citizen")} className="shrink-0 rounded-xl border border-[#4FB3E8] bg-white px-4 py-2.5 text-[10px] font-semibold text-[#1B3F8B] transition hover:bg-[#4FB3E8]/15">ทดลองระบบผู้ร้อง</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3 rounded-2xl border border-[#FFD600] bg-[#FFD600]/10 p-3.5 text-[10px] leading-5 text-[#1B3F8B] md:col-span-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1B3F8B]" />
                  สำหรับเจ้าหน้าที่ผู้รับผิดชอบการรับเรื่อง ตรวจสอบ สั่งการ สืบสวน วินิจฉัย และผู้ดูแลระบบเท่านั้น
                </div>
                <div>
                  <label htmlFor="officer-role" className="mb-1.5 block text-[11px] font-medium text-slate-700">บทบาทเจ้าหน้าที่</label>
                  <select id="officer-role" value={officerRole} onChange={(event) => setOfficerRole(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-800 outline-none transition focus:border-[#FFD600] focus:bg-white focus:ring-4 focus:ring-[#FFD600]/20">
                    {OFFICER_ACCESS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>
                <Field id="admin-account" label="บัญชีเจ้าหน้าที่ / ผู้ดูแลระบบ" icon={<UserRound className="h-4 w-4" />}>
                  <input id="admin-account" type="text" required autoComplete="username" defaultValue="admin_root" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs outline-none transition focus:border-[#FFD600] focus:bg-white focus:ring-4 focus:ring-[#FFD600]/20" />
                </Field>
                <Field id="admin-password" label="รหัสผ่าน" icon={<LockKeyhole className="h-4 w-4" />}>
                  <input id="admin-password" type="password" required autoComplete="current-password" defaultValue="admin-demo-password" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs outline-none transition focus:border-[#FFD600] focus:bg-white focus:ring-4 focus:ring-[#FFD600]/20" />
                </Field>
                <Field id="admin-otp" label="รหัสยืนยัน 2FA / Hardware Token" icon={<Smartphone className="h-4 w-4" />}>
                  <input id="admin-otp" type="text" required inputMode="numeric" autoComplete="one-time-code" defaultValue="842195" maxLength={6} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 font-kanit text-sm tracking-[.22em] outline-none transition focus:border-[#FFD600] focus:bg-white focus:ring-4 focus:ring-[#FFD600]/20" />
                </Field>
                <button type="submit" disabled={isLoading} className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FFD600] px-5 text-xs font-semibold text-[#1B3F8B] shadow-lg shadow-[#FFD600]/20 transition hover:bg-[#4FB3E8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD600]/30 disabled:cursor-wait disabled:opacity-70 md:col-span-2">
                  {isLoading ? "กำลังตรวจสอบสิทธิ์..." : "เข้าสู่ระบบงานเจ้าหน้าที่"}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </button>
                <button type="button" onClick={() => handleDemoLogin("officer")} className="w-full text-center text-[10px] font-medium text-[#1B3F8B] hover:underline md:col-span-2">ทดลองระบบตามบทบาทที่เลือก</button>
              </form>
            )}

            <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-4 text-[9px] text-slate-400">
              <LockKeyhole className="h-3 w-3" /> การเข้าสู่ระบบจะถูกบันทึกใน Audit Log ตามนโยบายความมั่นคงปลอดภัย
            </div>
          </div>
        </section>
      </div>

      <footer className="relative z-10 border-t border-slate-200/80 bg-white/60 px-4 py-3 text-[10px] text-slate-500 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1480px] flex-col items-center justify-between gap-1.5 text-center sm:flex-row sm:px-3 sm:text-left">
          <span>© 2569 สำนักงานคณะกรรมการการเลือกตั้ง</span>
          <span>PDPA · OWASP Top 10 · TLS 1.3 / AES-256</span>
        </div>
      </footer>
    </main>
  );
}

function GatewayTab({ active, onClick, icon, label, detail, tone = "blue" }: { active: boolean; onClick: () => void; icon: ReactNode; label: string; detail: string; tone?: "blue" | "gold" }) {
  const activeClass = tone === "gold" ? "bg-white text-[#1B3F8B] shadow-sm ring-1 ring-[#FFD600]" : "bg-white text-[#1B3F8B] shadow-sm ring-1 ring-[#4FB3E8]/45";
  return (
    <button type="button" role="tab" aria-selected={active} onClick={onClick} className={`flex min-h-14 items-center gap-2.5 rounded-xl px-3 text-left transition ${active ? activeClass : "text-slate-500 hover:bg-white/50 hover:text-slate-800"}`}>
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? tone === "gold" ? "bg-[#FFD600] text-[#1B3F8B]" : "bg-[#4FB3E8]/15 text-[#1B3F8B]" : "bg-slate-200/70"}`}>{icon}</span>
      <span className="min-w-0">
        <span className="block truncate text-[11px] font-semibold">{label}</span>
        <span className="block truncate text-[9px] font-light opacity-65">{detail}</span>
      </span>
    </button>
  );
}

function MethodTab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) {
  return (
    <button type="button" role="tab" aria-selected={active} onClick={onClick} className={`relative flex items-center gap-1.5 pb-3 text-[11px] font-medium transition ${active ? "text-[#1B3F8B]" : "text-slate-400 hover:text-slate-700"}`}>
      {icon}{label}
      {active && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#4FB3E8]" />}
    </button>
  );
}

function Field({ id, label, icon, action, children }: { id: string; label: string; icon: ReactNode; action?: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-[11px] font-medium text-slate-700">{label}</label>
        {action && <button type="button" className="text-[10px] font-medium text-[#1B3F8B] hover:underline">{action}</button>}
      </div>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400">{icon}</span>
        {children}
      </div>
    </div>
  );
}

function ThaIdPanel({ onSuccess, isLoading }: { onSuccess: () => void; isLoading: boolean }) {
  return (
    <div className="rounded-2xl border border-[#4FB3E8]/45 bg-[#4FB3E8]/10 p-4 sm:p-5">
      <div className="grid items-center gap-5 sm:grid-cols-[138px_1fr]">
        <div className="relative mx-auto flex h-[138px] w-[138px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
          <QrCode className="h-[108px] w-[108px] text-slate-950" />
          <span className="absolute inset-0 m-auto flex h-9 w-9 items-center justify-center rounded-lg border border-[#4FB3E8] bg-white text-[#1B3F8B]"><Fingerprint className="h-5 w-5" /></span>
        </div>
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[#1B3F8B]"><Fingerprint className="h-4 w-4 text-[#4FB3E8]" /> ยืนยันตัวตนด้วย ThaID</h3>
          <ol className="mt-3 space-y-2 text-[10px] leading-5 text-[#1B3F8B]/75">
            {["เปิดแอปพลิเคชัน ThaID", "เลือกเมนูสแกน QR Code", "ตรวจสอบและยืนยันการเข้าสู่ระบบ"].map((step, index) => <li key={step} className="flex gap-2"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFD600] text-[9px] font-semibold text-[#1B3F8B]">{index + 1}</span>{step}</li>)}
          </ol>
        </div>
      </div>
      <button type="button" onClick={onSuccess} disabled={isLoading} className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1B3F8B] text-xs font-semibold text-white transition hover:bg-[#4FB3E8] hover:text-[#1B3F8B] disabled:opacity-70">
        {isLoading ? "กำลังยืนยันตัวตน..." : "จำลองการยืนยัน ThaID สำเร็จ"}<Check className="h-4 w-4" />
      </button>
    </div>
  );
}
