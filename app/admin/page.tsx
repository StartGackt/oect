"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Database,
  FileText,
  FileClock,
  GitBranch,
  KeyRound,
  Lock,
  LockKeyhole,
  LogOut,
  MapPinned,
  Menu,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TimerReset,
  UserCheck,
  UserCog,
  Users,
  X,
} from "lucide-react";
import initialCasesData from "@/data/complaintsData.json";
import CaseDetailModal from "@/components/oect/CaseDetailModal";
import CaseListView from "@/components/oect/CaseListView";
import DashboardView from "@/components/oect/DashboardView";
import GovernanceCenterView from "@/components/oect/GovernanceCenterView";
import NewComplaintForm from "@/components/oect/NewComplaintForm";
import RoleWorkspaceView from "@/components/oect/RoleWorkspaceView";
import SlaMonitoringView from "@/components/oect/SlaMonitoringView";
import AdminUserManagementView from "@/components/oect/admin/AdminUserManagementView";
import AdminSecurityAuditView from "@/components/oect/admin/AdminSecurityAuditView";
import AdminWorkflowSlaView from "@/components/oect/admin/AdminWorkflowSlaView";
import AdminMasterDataView from "@/components/oect/admin/AdminMasterDataView";
import AdminIntegrationsView from "@/components/oect/admin/AdminIntegrationsView";
import { type ComplaintItem } from "@/components/oect/complaintDomain";
import { useComplaintsStore } from "@/components/oect/useComplaintsStore";

export type AdminView =
  | "overview"
  | "cases"
  | "workspace"
  | "sla"
  | "governance"
  | "users"
  | "workflow"
  | "master"
  | "integrations"
  | "security";

export interface RolePersona {
  id: string;
  name: string;
  roleTitle: string;
  category: "admin" | "central" | "provincial" | "specialist";
  badge: string;
  avatarInitials: string;
  avatarBg: string;
  description: string;
  allowedTabs: AdminView[];
}

export const ADMIN_ROLE_PERSONAS: RolePersona[] = [
  {
    id: "admin-super",
    name: "GIT Admin",
    roleTitle: "System Administrator",
    category: "admin",
    badge: "สิทธิ์เต็มทุกเมนู (10/10)",
    avatarInitials: "GA",
    avatarBg: "bg-[#1B3F8B]",
    description: "ผู้ดูแลระบบศูนย์สารสนเทศ สนง.กกต. มีสิทธิ์เข้าถึงและควบคุมทุกโมดูล",
    allowedTabs: [
      "overview",
      "cases",
      "workspace",
      "sla",
      "governance",
      "users",
      "workflow",
      "master",
      "integrations",
      "security",
    ],
  },
  {
    id: "central-executive",
    name: "ศ.ดร.วินิจฉัย ชี้ขาด",
    roleTitle: "กกต. / ผู้บริหารส่วนกลาง",
    category: "central",
    badge: "บริหารส่วนกลาง (6/10)",
    avatarInitials: "วช",
    avatarBg: "bg-emerald-700",
    description: "กำกับสำนวนทั่วประเทศ พิจารณาทำความเห็น วินิจฉัยชี้ขาด และกำหนด SLA",
    allowedTabs: ["overview", "cases", "workspace", "sla", "governance", "workflow"],
  },
  {
    id: "provincial-director",
    name: "ผอ.เกียรติศักดิ์ ขอนแก่น",
    roleTitle: "ผอ.สนง.กกต.จว.",
    category: "provincial",
    badge: "สั่งการระดับจังหวัด (5/10)",
    avatarInitials: "กศ",
    avatarBg: "bg-indigo-700",
    description: "สั่งรับ/ไม่รับคำร้อง แต่งตั้งพนักงานสืบสวน และติดตาม SLA ภายในจังหวัด",
    allowedTabs: ["overview", "cases", "workspace", "sla", "governance"],
  },
  {
    id: "provincial-officer",
    name: "นายวรากร กรณีศึกษา",
    roleTitle: "พนักงานส่วนภูมิภาค (รับ/ตรวจคำร้อง)",
    category: "provincial",
    badge: "ปฏิบัติการระดับจังหวัด (4/10)",
    avatarInitials: "วก",
    avatarBg: "bg-blue-700",
    description: "รับคำร้อง ตรวจองค์ประกอบ สั่งแก้ไขเพิ่มเติม และแสวงหาพยานหลักฐาน",
    allowedTabs: ["overview", "cases", "workspace", "sla"],
  },
  {
    id: "data-admin",
    name: "นายพัฒนะ ดูแลระบบ",
    roleTitle: "Master Data & Integrations Admin",
    category: "specialist",
    badge: "ข้อมูลและระบบเชื่อมโยง (4/10)",
    avatarInitials: "พธ",
    avatarBg: "bg-amber-700",
    description: "จัดการฐานข้อมูล 77 จังหวัด รูปแบบคำร้อง และกำกับระบบเชื่อมโยง DXC/e-Saraban",
    allowedTabs: ["overview", "master", "integrations", "governance"],
  },
  {
    id: "security-auditor",
    name: "นางสาววิไลลักษณ์ ตรวจสอบ",
    roleTitle: "Security & Compliance Auditor",
    category: "specialist",
    badge: "ความปลอดภัยและ Audit (4/10)",
    avatarInitials: "วล",
    avatarBg: "bg-rose-700",
    description: "ตรวจสอบความปลอดภัย นโยบาย 2FA และตรวจสอบ Audit Trail Logs ย้อนหลัง",
    allowedTabs: ["overview", "security", "governance", "sla"],
  },
];

const NAV_ITEMS = [
  { id: "overview" as const, label: "ภาพรวมระบบ", description: "ข้อมูลคำร้องและ SLA", icon: BarChart3 },
  { id: "cases" as const, label: "รายการเรื่องร้องเรียน", description: "ทะเบียนคำร้องและสำนวน", icon: FileText },
  { id: "workspace" as const, label: "คิวงานทุกขั้นตอน", description: "งานที่ยังไม่ปิดเรื่อง", icon: ClipboardList },
  { id: "sla" as const, label: "ติดตาม SLA", description: "ใกล้ครบและเกินกำหนด", icon: TimerReset },
  { id: "governance" as const, label: "รายงานและ Audit", description: "สถิติและประวัติการดำเนินการ", icon: FileClock },
  { id: "users" as const, label: "ผู้ใช้และสิทธิ์ (RBAC)", description: "User, Role และสิทธิ์เข้าถึง", icon: UserCog },
  { id: "workflow" as const, label: "Workflow และ SLA", description: "เวอร์ชัน ขั้นตอน และกฎเวลา", icon: GitBranch },
  { id: "master" as const, label: "ข้อมูลพื้นฐาน", description: "จังหวัด เขตเลือกตั้ง และแบบฟอร์ม", icon: MapPinned },
  { id: "integrations" as const, label: "ระบบเชื่อมโยง", description: "DXC, e-Saraban, PRAXTICOL", icon: Database },
  { id: "security" as const, label: "Security และ Audit", description: "นโยบาย Log และ Session", icon: ShieldCheck },
];

const PAGE_META: Record<AdminView, { eyebrow: string; title: string; description: string }> = {
  overview: { eyebrow: "System overview", title: "ภาพรวมข้อมูลและการกำกับระบบ", description: "ติดตามข้อมูลคำร้อง สถานะ Workflow และ SLA จากฐานข้อมูลชุดเดียวกับพื้นที่ทำงานเจ้าหน้าที่" },
  cases: { eyebrow: "Complaint registry", title: "รายการเรื่องร้องเรียนทั้งหมด", description: "ค้นหา กรอง ตรวจสอบ และเปิดรายละเอียดคำร้องหรือสำนวนจากทะเบียนกลาง" },
  workspace: { eyebrow: "All-stage work queue", title: "คิวงานทุกขั้นตอน", description: "ตรวจสอบงานที่ยังไม่ปิดเรื่องได้ทุกขั้นตอนโดยไม่ต้องสลับบทบาท" },
  sla: { eyebrow: "SLA monitoring", title: "ติดตามกรอบเวลาทั้งระบบ", description: "เรียงลำดับเรื่องที่ต้องเร่งรัดจากข้อมูลทะเบียนกลางชุดเดียวกับ Dashboard" },
  governance: { eyebrow: "Reports & audit", title: "รายงานและประวัติการดำเนินการ", description: "สรุปสถิติ ผู้รับผิดชอบ และเหตุการณ์ล่าสุดจากข้อมูลคำร้องชุดเดียวกัน" },
  users: { eyebrow: "Identity & Access Management", title: "ผู้ใช้งาน บทบาท และสิทธิ์เข้าถึง (RBAC)", description: "กำหนดสิทธิ์ตามบทบาท หน่วยงาน จังหวัด และขั้นตอนของ Workflow ด้วยหลัก least privilege" },
  workflow: { eyebrow: "Versioned Workflow Administration", title: "Workflow และกฎ SLA", description: "ออกแบบ ทบทวน และเผยแพร่ขั้นตอนโดยไม่เปลี่ยนกฎกลางสำนวนที่กำลังดำเนินการ" },
  master: { eyebrow: "Master Data Governance", title: "ข้อมูลพื้นฐานและแบบฟอร์มมาตรฐาน", description: "ดูแลจังหวัด อำเภอ ตำบล เขตเลือกตั้ง ประเภทคำร้อง และแบบ สตว.1/สตว.1/1" },
  integrations: { eyebrow: "Government Data Exchange", title: "การเชื่อมโยงระบบภายนอก", description: "กำกับ endpoint, certificate, retry policy และประวัติการเชื่อมต่อของแต่ละระบบ" },
  security: { eyebrow: "Security, Privacy & Audit", title: "นโยบายความปลอดภัยและการตรวจสอบ (Audit Trail)", description: "กำกับ 2FA, Auto logout, Data masking, Retention และ Audit event ที่แก้ไขย้อนหลังไม่ได้" },
};

export default function AdminConsolePage() {
  const [cases, setCases] = useComplaintsStore(initialCasesData as ComplaintItem[]);
  const [currentPersonaId, setCurrentPersonaId] = useState<string>("admin-super");
  const [isPersonaDropdownOpen, setIsPersonaDropdownOpen] = useState(false);
  const [activeView, setActiveView] = useState<AdminView>("overview");
  const [selectedCase, setSelectedCase] = useState<ComplaintItem | null>(null);
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [caseStatusFilter, setCaseStatusFilter] = useState("ALL");
  const [message, setMessage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  const currentPersona = useMemo(() => {
    return ADMIN_ROLE_PERSONAS.find((p) => p.id === currentPersonaId) || ADMIN_ROLE_PERSONAS[0];
  }, [currentPersonaId]);

  const meta = PAGE_META[activeView];
  const urgentCount = useMemo(() => cases.filter((item) => item.slaStatus === "OVERDUE" || item.slaStatus === "NEAR_DUE").length, [cases]);

  const selectView = (view: AdminView) => {
    if (!currentPersona.allowedTabs.includes(view)) {
      notify(`บทบาท "${currentPersona.roleTitle}" ไม่มีสิทธิ์เข้าถึงแท็บ "${PAGE_META[view]?.title || view}"`);
      return;
    }
    setActiveView(view);
    setIsNewComplaintOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleSelectPersona = (persona: RolePersona) => {
    setCurrentPersonaId(persona.id);
    setIsPersonaDropdownOpen(false);
    notify(`สลับบทบาทเป็น "${persona.name}" (${persona.roleTitle}) เรียบร้อยแล้ว`);

    // If current activeView is not allowed by new persona, fallback to first allowed tab
    if (!persona.allowedTabs.includes(activeView)) {
      setActiveView(persona.allowedTabs[0] || "overview");
    }
  };

  const notify = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 2800);
  };

  const hasAccessToCurrentView = currentPersona.allowedTabs.includes(activeView);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      {message && (
        <div className="fixed right-4 top-20 z-50 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-xs font-bold text-emerald-800 shadow-2xl animate-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl">
        <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:hidden"
              aria-label="เปิดเมนูผู้ดูแลระบบ"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/admin" className="flex min-w-0 items-center gap-3">
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-amber-300 bg-white p-1 shadow-sm">
                <Image src="/oect-logo.png" alt="ตราสัญลักษณ์สำนักงานคณะกรรมการการเลือกตั้ง" fill sizes="40px" className="object-contain p-1" priority />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold tracking-tight">ECT Complaint Management</span>
                <span className="hidden truncate text-[11px] text-slate-500 sm:block">ศูนย์ผู้ดูแลระบบ สนง.กกต.</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={`การแจ้งเตือน ${urgentCount} รายการ`}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            >
              <Bell className="h-4 w-4" />
              {urgentCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {urgentCount > 99 ? "99+" : urgentCount}
                </span>
              )}
            </button>

            {/* Interactive Role Switcher Dropdown */}
            <div className="relative border-l border-slate-200 pl-3">
              <button
                type="button"
                onClick={() => setIsPersonaDropdownOpen(!isPersonaDropdownOpen)}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-1.5 pr-3 text-left transition hover:border-blue-300 hover:bg-white shadow-2xs"
                aria-expanded={isPersonaDropdownOpen}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shrink-0 ${currentPersona.avatarBg}`}>
                  {currentPersona.avatarInitials}
                </span>
                <span className="hidden text-left xl:block">
                  <span className="block text-xs font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                    <span>{currentPersona.name}</span>
                    <span className="rounded-full bg-blue-100 px-1.5 py-0.2 text-[9px] font-bold text-[#1B3F8B]">
                      {currentPersona.allowedTabs.length}/10 เมนู
                    </span>
                  </span>
                  <span className="block text-[10px] text-slate-500 truncate max-w-[170px]">
                    {currentPersona.roleTitle}
                  </span>
                </span>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-150 ${isPersonaDropdownOpen ? "rotate-180 text-blue-700" : ""}`} />
              </button>

              {/* Role Switcher Menu Popup */}
              {isPersonaDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsPersonaDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 z-50 w-84 overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl animate-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 mb-2">
                      <div className="text-xs font-bold text-slate-900">จำลองสิทธิ์การใช้งาน (Role Switcher)</div>
                      <div className="text-[10px] text-slate-500">เลือกบทบาทเพื่อทดสอบสิทธิ์และการเปิด/ปิดแท็บเมนู</div>
                    </div>

                    <div className="space-y-1.5 max-h-[380px] overflow-y-auto">
                      {ADMIN_ROLE_PERSONAS.map((persona) => {
                        const isSelected = persona.id === currentPersona.id;
                        return (
                          <button
                            key={persona.id}
                            type="button"
                            onClick={() => handleSelectPersona(persona)}
                            className={`w-full p-2.5 rounded-2xl text-left transition flex items-start gap-3 border ${
                              isSelected
                                ? "bg-blue-50/80 border-[#1B3F8B] shadow-2xs"
                                : "border-transparent hover:bg-slate-50 hover:border-slate-200"
                            }`}
                          >
                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white mt-0.5 ${persona.avatarBg}`}>
                              {persona.avatarInitials}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className={`text-xs font-bold truncate ${isSelected ? "text-[#1B3F8B]" : "text-slate-900"}`}>
                                  {persona.name}
                                </span>
                                <span className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold shrink-0 ${
                                  isSelected ? "bg-[#1B3F8B] text-white" : "bg-slate-100 text-slate-600"
                                }`}>
                                  {persona.allowedTabs.length}/10 เมนู
                                </span>
                              </div>
                              <div className="text-[10px] font-medium text-slate-600 truncate">{persona.roleTitle}</div>
                              <div className="text-[9px] text-slate-400 truncate mt-0.5">{persona.description}</div>
                            </div>
                            {isSelected && <Check className="h-4 w-4 text-[#1B3F8B] shrink-0 mt-1" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-2 border-t border-slate-100 pt-2.5 px-3 flex items-center justify-between text-[10px] text-slate-500">
                      <span>สลับไปหน้า User Portal</span>
                      <Link href="/user" className="font-bold text-blue-700 hover:underline">
                        Portal เจ้าหน้าที่ ➔
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link
              href="/login"
              aria-label="ออกจากระบบ"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="absolute inset-0 bg-[#1B3F8B]/45 backdrop-blur-sm" aria-label="ปิดเมนูผู้ดูแลระบบ" />
          <aside className="relative flex h-full w-[86%] max-w-sm flex-col bg-white p-5 shadow-2xl">
            <div className="mb-7 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-900">{currentPersona.name}</div>
                <div className="text-[11px] text-blue-700 font-medium">{currentPersona.roleTitle}</div>
              </div>
              <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600" aria-label="ปิดเมนู">
                <X className="h-5 w-5" />
              </button>
            </div>
            <AdminNavigation activeView={activeView} currentPersona={currentPersona} onSelect={selectView} />
            <div className="mt-auto border-t border-slate-100 px-3 pt-4 text-[10px] text-slate-400">
              <LockKeyhole className="mr-1 inline h-3.5 w-3.5 text-[#1B3F8B]" />
              เข้าถึง {currentPersona.allowedTabs.length} จาก 10 เมนูตามสิทธิ์
            </div>
          </aside>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="mx-auto flex min-h-[calc(100vh-65px)] max-w-[1680px]">
        {/* Left Sidebar with Permission Locking */}
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-5 lg:sticky lg:top-16 lg:flex lg:h-[calc(100vh-64px)] lg:flex-col lg:overflow-y-auto">
          {/* Active Role Indicator Card */}
          <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>สิทธิ์การใช้งานปัจจุบัน</span>
              <span className="text-blue-700 font-mono font-semibold">{currentPersona.allowedTabs.length}/10 เมนู</span>
            </div>
            <div className="text-xs font-bold text-slate-900 truncate">{currentPersona.name}</div>
            <div className="text-[10px] text-slate-500 truncate">{currentPersona.roleTitle}</div>
          </div>

          <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">เมนูระบบ</div>
          <AdminNavigation activeView={activeView} currentPersona={currentPersona} onSelect={selectView} />

          <div className="mt-auto space-y-3 pt-6">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
                <ShieldCheck className="h-4 w-4 text-blue-700" />
                <span>การบังคับใช้สิทธิ์ (RBAC)</span>
              </div>
              <div className="mt-1.5 text-[10px] leading-relaxed text-blue-800/80">
                เมนูที่มีไอคอน 🔒 คือเมนูที่ถูกล็อคตามหลัก Least Privilege ของบทบาทนี้
              </div>
            </div>
            <div className="px-3 text-[10px] leading-5 text-slate-400">
              <LockKeyhole className="mr-1 inline h-3.5 w-3.5 text-[#1B3F8B]" /> ทุกการกระทำบันทึกใน Audit Log
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          <div className="mb-3 flex items-center gap-2 text-[10px] text-slate-400">
            <span>ศูนย์ผู้ดูแลระบบ</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-[#1B3F8B]">{isNewComplaintOpen ? "บันทึกเรื่องร้องเรียนใหม่" : meta.title}</span>
          </div>

          {/* บันทึกเรื่องใหม่แบบเต็มหน้าจอ เหมือนกับฝั่งประชาชน (ไม่ใช่ modal ลอย) */}
          {isNewComplaintOpen ? (
            <NewComplaintForm
              mode="officer"
              presentation="page"
              onClose={() => setIsNewComplaintOpen(false)}
              onAddCase={(newCase) => setCases((currentCases) => [newCase, ...currentCases])}
            />
          ) : !hasAccessToCurrentView ? (
            <div className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm space-y-4 max-w-xl mx-auto my-12">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-rose-50 text-rose-600">
                <Lock className="h-7 w-7" />
              </span>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">จำกัดการเข้าถึงเมนูนี้ (Access Denied)</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  บทบาทปัจจุบัน <strong>&quot;{currentPersona.name}&quot; ({currentPersona.roleTitle})</strong> ไม่ได้รับอนุญาตให้เข้าถึงเมนู <strong>&quot;{meta.title}&quot;</strong> ตามนโยบายความมั่นคงปลอดภัย
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left text-xs space-y-2">
                <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">เมนูที่บทบาทนี้เข้าถึงได้:</div>
                <div className="flex flex-wrap gap-1.5">
                  {currentPersona.allowedTabs.map((tabId) => (
                    <button
                      key={tabId}
                      type="button"
                      onClick={() => selectView(tabId)}
                      className="rounded-xl border border-blue-200 bg-white px-2.5 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-50"
                    >
                      {PAGE_META[tabId]?.title || tabId}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectPersona(ADMIN_ROLE_PERSONAS[0])}
                  className="rounded-xl bg-[#1B3F8B] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-900 transition"
                >
                  สลับเป็น System Admin (สิทธิ์เต็ม)
                </button>
              </div>
            </div>
          ) : (
            <>
              <section className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="px-5 py-5 sm:px-6">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="max-w-3xl">
                      <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FFD600]" /> {meta.eyebrow}
                      </div>
                      <h1 className="text-xl font-bold tracking-tight text-[#1B3F8B] sm:text-2xl">{meta.title}</h1>
                      <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">{meta.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {activeView === "overview" && (
                        <button
                          type="button"
                          onClick={() => selectView("cases")}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <FileText className="h-4 w-4" /> ดูทะเบียนเรื่อง
                        </button>
                      )}
                      {(activeView === "overview" || activeView === "cases") && (
                        <button type="button" onClick={() => setIsNewComplaintOpen(true)} className="btn-primary w-fit">
                          <Plus className="h-4 w-4" /> บันทึกเรื่องใหม่
                        </button>
                      )}
                      {(activeView === "workspace" || activeView === "sla" || activeView === "governance") && (
                        <button
                          type="button"
                          onClick={() => selectView("cases")}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <FileText className="h-4 w-4" /> เปิดทะเบียนเรื่อง
                        </button>
                      )}
                      {activeView === "security" && (
                        <button
                          type="button"
                          onClick={() => selectView("governance")}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <FileClock className="h-4 w-4" /> ดู Audit Log
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {activeView === "overview" && (
                <DashboardView
                  cases={cases}
                  roleId="admin"
                  onSelectCase={setSelectedCase}
                  onViewAllCases={() => {
                    setCaseStatusFilter("ALL");
                    selectView("cases");
                  }}
                  onFilterStatus={(status) => {
                    setCaseStatusFilter(status);
                    selectView("cases");
                  }}
                />
              )}
              {activeView === "cases" && (
                <CaseListView
                  cases={cases}
                  onSelectCase={setSelectedCase}
                  openNewModal={() => setIsNewComplaintOpen(true)}
                  searchQuery={globalSearch}
                  setSearchQuery={setGlobalSearch}
                  statusFilter={caseStatusFilter}
                  setStatusFilter={setCaseStatusFilter}
                />
              )}
              {activeView === "workspace" && (
                <RoleWorkspaceView cases={cases} roleId="admin" onSelectCase={setSelectedCase} />
              )}
              {activeView === "sla" && <SlaMonitoringView cases={cases} onSelectCase={setSelectedCase} />}
              {activeView === "governance" && <GovernanceCenterView cases={cases} />}
              {activeView === "users" && <AdminUserManagementView onNotify={notify} />}
              {activeView === "workflow" && <AdminWorkflowSlaView onNotify={notify} />}
              {activeView === "master" && <AdminMasterDataView onNotify={notify} />}
              {activeView === "integrations" && <AdminIntegrationsView onNotify={notify} />}
              {activeView === "security" && <AdminSecurityAuditView onNotify={notify} />}
            </>
          )}
        </main>
      </div>

      {selectedCase && (
        <CaseDetailModal
          caseItem={selectedCase}
          onClose={() => setSelectedCase(null)}
          onUpdateCase={(updated) =>
            setCases((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
          }
        />
      )}
    </div>
  );
}

function AdminNavigation({
  activeView,
  currentPersona,
  onSelect,
}: {
  activeView: AdminView;
  currentPersona: RolePersona;
  onSelect: (view: AdminView) => void;
}) {
  return (
    <nav className="space-y-1" aria-label="เมนูผู้ดูแลระบบ">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = item.id === activeView;
        const isAllowed = currentPersona.allowedTabs.includes(item.id);

        if (!isAllowed) {
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className="group flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left opacity-45 transition hover:opacity-75 hover:bg-slate-100/70"
              title={`ไม่มีสิทธิ์เข้าถึง (${item.label}) สำหรับบทบาท ${currentPersona.roleTitle}`}
            >
              <Icon className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-500">
                {item.label}
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-md bg-slate-200/80 px-1.5 py-0.5 text-[9px] font-bold text-slate-600">
                <Lock className="h-2.5 w-2.5" />
                <span>ล็อค</span>
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`group flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
              active
                ? "bg-[#1B3F8B] text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100/80 hover:text-[#1B3F8B]"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <Icon
              className={`h-4 w-4 shrink-0 ${
                active ? "text-white" : "text-slate-400 group-hover:text-[#1B3F8B]"
              }`}
            />
            <span className="min-w-0 flex-1 truncate text-xs font-semibold">{item.label}</span>
            {active && <ChevronRight className="h-4 w-4 text-white/70" />}
          </button>
        );
      })}
    </nav>
  );
}
