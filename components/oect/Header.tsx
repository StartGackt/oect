"use client";

import Image from "next/image";
import { 
  Bell, 
  Search, 
  Shield, 
  UserCheck, 
  ChevronDown, 
  PlusCircle, 
  Layers, 
  Activity, 
  FileText, 
  Sliders, 
  Lock,
  Sparkles,
  Building,
  User
} from "lucide-react";
import { useState } from "react";

export interface UserRole {
  id: string;
  name: string;
  level: string;
  scope: string;
  badgeColor: string;
}

export const USER_ROLES: UserRole[] = [
  {
    id: "officer",
    name: "วรากร กรณีศึกษา (พนักงานส่วนภูมิภาค)",
    level: "ระดับ 1: พนักงานบันทึกข้อมูล",
    scope: "สนง.กกต.จว. เชียงใหม่",
    badgeColor: "bg-blue-600",
  },
  {
    id: "provincial_director",
    name: "นายสมศักดิ์ บริหารงาน (ผอ.กกต.จว.)",
    level: "ระดับ 2: ผอ.สนง.กกต.จว.",
    scope: "สนง.กกต.จว. เชียงใหม่",
    badgeColor: "bg-indigo-600",
  },
  {
    id: "central_commissioner",
    name: "กรรมการการเลือกตั้ง / ลธ.กกต.",
    level: "ระดับ 3: กกต./ลธ.กกต. (ส่วนกลาง)",
    scope: "สนง.กกต. ส่วนกลาง (ทั่วประเทศ)",
    badgeColor: "bg-amber-600",
  },
  {
    id: "citizen",
    name: "นายศุภชัย ทดสอบ (ผู้ร้องเรียน)",
    level: "ระดับ 4: ประชาชน/ผู้ร้องเรียน",
    scope: "ติดตามเรื่องของตนเอง",
    badgeColor: "bg-emerald-600",
  },
  {
    id: "admin",
    name: "System Administrator",
    level: "ระดับ 5: ผู้ดูแลระบบ",
    scope: "การจัดการระบบ & ความปลอดภัย",
    badgeColor: "bg-slate-700",
  },
];

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  openNewModal: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  openNewModal,
}: HeaderProps) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "คำร้องใกล้ครบกำหนดเวลา SLA (เหลือ 1 วัน)",
      caseNum: "MP-CMI-2569-002",
      type: "warning",
      time: "10 นาทีที่แล้ว",
    },
    {
      id: 2,
      title: "สำนวนเกินกำหนดระยะเวลาดำเนินงาน",
      caseNum: "MP-KKN-2569-004",
      type: "danger",
      time: "45 นาทีที่แล้ว",
    },
    {
      id: 3,
      title: "มีเรื่องร้องเรียนเข้าใหม่รอตรวจรับคำร้อง",
      caseNum: "MP-BKK-2569-012",
      type: "info",
      time: "2 ชั่วโมงที่แล้ว",
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 relative flex-shrink-0 bg-white rounded-full p-1 border border-[#ECC94B] shadow-xs">
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
              <span className="text-xs font-bold text-[#173B6B]">
                สนง.กกต. (ECT-CMS)
              </span>
              <span className="text-[10px] text-[#94A3B8]">· ระบบบริหารจัดการเรื่องร้องเรียน</span>
            </div>
            <div className="text-[11px] text-[#64748B] font-light hidden sm:block">
              กระบวนการสืบสวน ไต่สวน และวินิจฉัยชี้ขาดตามกฎหมาย
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0]">
          <button
            onClick={() => setActiveTab("hub")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "hub"
                ? "bg-white text-[#173B6B] shadow-xs font-semibold"
                : "text-[#64748B] hover:text-[#1A202C]"
            }`}
          >
            🏠 หน้าแรก
          </button>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "dashboard"
                ? "bg-white text-[#173B6B] shadow-xs font-semibold"
                : "text-[#64748B] hover:text-[#1A202C]"
            }`}
          >
            📊 สถิติ & แดชบอร์ด
          </button>
          <button
            onClick={() => setActiveTab("workflow")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "workflow"
                ? "bg-white text-[#173B6B] shadow-xs font-semibold"
                : "text-[#64748B] hover:text-[#1A202C]"
            }`}
          >
            ⏱️ ขั้นตอน Workflow
          </button>
          <button
            onClick={() => setActiveTab("admin_settings")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "admin_settings"
                ? "bg-white text-[#173B6B] shadow-xs font-semibold"
                : "text-[#64748B] hover:text-[#1A202C]"
            }`}
          >
            ⚙️ จัดการระบบ
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          
          {/* Quick Action Button: New Complaint */}
          <button
            onClick={openNewModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#173B6B] text-white hover:bg-[#0B1E36] font-medium text-xs shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ รับเรื่องใหม่</span>
          </button>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] px-2.5 py-1.5 rounded-xl text-xs transition-colors"
              title="สลับสิทธิ์การใช้งาน 5 ระดับ"
            >
              <div className={`w-2 h-2 rounded-full ${currentRole.badgeColor}`} />
              <div className="text-left hidden sm:block">
                <div className="text-[11px] font-semibold text-[#1A202C]">{currentRole.level.split(":")[1] || currentRole.level}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-2 z-50 text-[#1A202C] animate-in fade-in-50 duration-150">
                <div className="px-3 py-1.5 border-b border-[#E2E8F0] text-[11px] font-semibold text-[#94A3B8]">
                  สลับบทบาทผู้ใช้งาน (5 ระดับ):
                </div>
                {USER_ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => {
                      setCurrentRole(role);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-[#F8FAFC] flex items-start gap-2.5 transition-colors ${
                      currentRole.id === role.id ? "bg-[#EBF8FF] text-[#1E4E8C] font-semibold" : ""
                    }`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${role.badgeColor} mt-1 flex-shrink-0`} />
                    <div>
                      <div className="font-medium">{role.name}</div>
                      <div className="text-[10px] text-[#94A3B8]">{role.level}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl text-[#475569] transition-colors"
              aria-label="แจ้งเตือน"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-2 z-50 text-[#1A202C]">
                <div className="px-4 py-2 border-b border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1A202C]">การแจ้งเตือนและ SLA</span>
                  <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                    3 เรื่องด่วน
                  </span>
                </div>
                <div className="divide-y divide-[#F1F5F9] max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-[#F8FAFC] text-xs">
                      <div className="flex items-center gap-1.5 mb-1">
                        {n.type === "danger" && <span className="w-2 h-2 rounded-full bg-red-500" />}
                        {n.type === "warning" && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                        {n.type === "info" && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                        <span className="font-semibold text-[#173B6B]">{n.caseNum}</span>
                      </div>
                      <div className="text-[11px] text-[#475569]">{n.title}</div>
                      <div className="text-[10px] text-[#94A3B8] mt-1">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
