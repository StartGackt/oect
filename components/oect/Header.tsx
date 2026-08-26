"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Bell, 
  ChevronDown, 
  PlusCircle, 
  Lock,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { CURRENT_CITIZEN } from "@/components/oect/complaintDomain";

export interface UserRole {
  id: string;
  name: string;
  level: string;
  scope: string;
  badgeColor: string;
  bgLight: string;
}

export const USER_ROLES: UserRole[] = [
  {
    id: "officer",
    name: "วรากร กรณีศึกษา (พนักงานส่วนภูมิภาค)",
    level: "ระดับ 1: พนักงานบันทึกข้อมูล",
    scope: "สนง.กกต.จว. เชียงใหม่",
    badgeColor: "bg-blue-600",
    bgLight: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "provincial_director",
    name: "นายสมศักดิ์ บริหารงาน (ผอ.กกต.จว.)",
    level: "ระดับ 2: ผอ.สนง.กกต.จว.",
    scope: "สนง.กกต.จว. เชียงใหม่",
    badgeColor: "bg-blue-600",
    bgLight: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "central_commissioner",
    name: "กรรมการการเลือกตั้ง / ลธ.กกต.",
    level: "ระดับ 3: กกต./ลธ.กกต. (ส่วนกลาง)",
    scope: "สนง.กกต. ส่วนกลาง (ทั่วประเทศ)",
    badgeColor: "bg-amber-600",
    bgLight: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "citizen",
    name: `${CURRENT_CITIZEN.name} (ผู้ร้องเรียน)`,
    level: "ระดับ 4: ประชาชน/ผู้ร้องเรียน",
    scope: "ติดตามเรื่องของตนเอง",
    badgeColor: "bg-emerald-600",
    bgLight: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "admin",
    name: "System Administrator (แอดมิน)",
    level: "ระดับ 5: ผู้ดูแลระบบ",
    scope: "การจัดการระบบ & ความปลอดภัย",
    badgeColor: "bg-slate-800",
    bgLight: "bg-slate-100 text-slate-800 border-slate-300",
  },
];

interface HeaderProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  currentRole?: UserRole;
  setCurrentRole?: (role: UserRole) => void;
  openNewModal?: () => void;
  mode?: "portal" | "user" | "admin";
}

export default function Header({
  currentRole = USER_ROLES[0],
  setCurrentRole,
  openNewModal,
}: HeaderProps) {
  const pathname = usePathname();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "คำร้องใกล้ครบกำหนดเวลา SLA (เหลือ 1 วัน)",
      caseNum: "MP-CMI-2569-002",
      type: "warning",
      time: "10 นาทีที่แล้ว",
      province: "เชียงใหม่",
    },
    {
      id: 2,
      title: "สำนวนเกินกำหนดระยะเวลาดำเนินงาน",
      caseNum: "MP-KKN-2569-004",
      type: "danger",
      time: "45 นาทีที่แล้ว",
      province: "ขอนแก่น",
    },
    {
      id: 3,
      title: "มีเรื่องร้องเรียนเข้าใหม่รอตรวจรับคำร้อง",
      caseNum: "MP-BKK-2569-012",
      type: "info",
      time: "2 ชั่วโมงที่แล้ว",
      province: "กรุงเทพมหานคร",
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro-bar for GovTech authenticity */}
      <div className="bg-[#1B3F8B] text-slate-300 text-[11px] py-1 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-medium text-white">ระบบสารสนเทศสำนักงานคณะกรรมการการเลือกตั้ง</span>
            <span className="text-slate-400 hidden md:inline">| ระบบบริหารจัดการเรื่องร้องเรียนและการสืบสวนไต่สวน (ECT-CMS)</span>
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <span className="hidden sm:inline-flex items-center gap-1 text-slate-300">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>TLS 1.3 / AES-256</span>
            </span>
            <span className="text-amber-300 font-medium">PDPA Compliant</span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <Link href="/user" className="flex items-center gap-3 group">
          <div className="w-10 h-10 relative flex-shrink-0 bg-white rounded-xl p-1 border border-amber-300/70 shadow-xs group-hover:scale-105 transition-transform">
            <Image
              src="/oect-logo.png"
              alt="ตราสัญลักษณ์ สนง.กกต."
              fill
              className="object-contain p-0.5"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-[#1B3F8B] tracking-tight group-hover:text-[#1B3F8B]">
                สนง.กกต. (ECT-CMS)
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                {pathname?.startsWith("/admin") ? "ADMIN CONSOLE" : "OFFICER & CITIZEN PORTAL"}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-light hidden sm:block truncate max-w-sm">
              กระบวนการสืบสวน ไต่สวน และวินิจฉัยชี้ขาดตามระเบียบ กกต.
            </div>
          </div>
        </Link>

        {/* Center: Dual Portal Switcher */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200 shadow-2xs">
          
          {/* User Operations Portal */}
          <Link
            href="/user"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !pathname?.startsWith("/admin")
                ? "bg-[#1B3F8B] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <span>👤 ระบบงานผู้ใช้ & เจ้าหน้าที่</span>
          </Link>

          {/* Admin Console */}
          <Link
            href="/admin"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              pathname?.startsWith("/admin")
                ? "bg-[#1B3F8B] text-amber-300 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <span>⚙️ ศูนย์ควบคุมผู้ดูแล (Admin)</span>
          </Link>
        </nav>

        {/* Right: Actions, Role Switcher, Alerts */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Action: New Complaint Intake (If in user/portal mode) */}
          {openNewModal && (
            <button
              onClick={openNewModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#1B3F8B] to-[#1B3F8B] text-white hover:from-[#1B3F8B] hover:to-[#1B3F8B] font-medium text-xs shadow-xs hover:shadow transition-all duration-200"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline font-semibold">+ รับคำร้องใหม่</span>
            </button>
          )}

          {/* Role Switcher Pill */}
          {setCurrentRole && (
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs transition-colors"
                title="สลับสิทธิ์การใช้งาน (5 ระดับ)"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${currentRole.badgeColor}`} />
                <div className="text-left hidden sm:block max-w-[150px] truncate">
                  <div className="text-[11px] font-bold text-slate-800 truncate">
                    {currentRole.level.split(":")[1]?.trim() || currentRole.level}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{currentRole.scope}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="px-3.5 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>จำลองสิทธิ์ผู้ใช้งาน (5 ระดับ)</span>
                    <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-[9px]">RBAC</span>
                  </div>
                  <div className="p-1 space-y-0.5 max-h-80 overflow-y-auto">
                    {USER_ROLES.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => {
                          setCurrentRole(role);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                          currentRole.id === role.id 
                            ? "bg-slate-100 text-[#1B3F8B] font-bold border border-slate-200"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full ${role.badgeColor} mt-1 flex-shrink-0`} />
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900 leading-tight">{role.name}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{role.level}</div>
                          <div className="text-[9px] text-[#1B3F8B] mt-0.5 bg-slate-100 px-1.5 py-0.5 rounded inline-block">
                            ขอบเขต: {role.scope}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notifications Drawer Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition-colors"
              aria-label="การแจ้งเตือนและ SLA"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-84 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2.5 z-50 text-slate-900 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-bold text-slate-900">การแจ้งเตือนและกรอบเวลา SLA</span>
                  </div>
                  <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full font-bold">
                    3 เรื่องด่วน
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3.5 hover:bg-slate-50 text-xs transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#1B3F8B]">{n.caseNum}</span>
                        <span className="text-[10px] text-slate-400">{n.province}</span>
                      </div>
                      <div className="text-[11px] font-medium text-slate-700 leading-snug">{n.title}</div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                        <span>{n.time}</span>
                        <span className="text-[9px] text-[#1B3F8B] font-semibold hover:underline cursor-pointer">
                          เปิดดูสำนวน →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Logout / Switch Gateway Button */}
          <Link
            href="/login"
            className="p-2 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1"
            title="ออกจากระบบ / สลับระบบงาน (/login)"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden xl:inline text-xs font-semibold">ออกจากระบบ</span>
          </Link>

        </div>

      </div>
    </header>
  );
}
