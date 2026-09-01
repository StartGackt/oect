"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Bell,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Database,
  FileCheck2,
  FilePlus2,
  FileText,
  History,
  Layers3,
  LogOut,
  Menu,
  MessageSquareText,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  UploadCloud,
  UserRound,
  X,
} from "lucide-react";
import initialCasesData from "@/data/complaintsData.json";
import CaseDetailModal from "@/components/oect/CaseDetailModal";
import CaseListView from "@/components/oect/CaseListView";
import CitizenServiceView, { type CitizenTab } from "@/components/oect/CitizenServiceView";
import DashboardView from "@/components/oect/DashboardView";
import GovernanceCenterView from "@/components/oect/GovernanceCenterView";
import NewComplaintForm from "@/components/oect/NewComplaintForm";
import RoleWorkspaceView, { OFFICER_ROLES } from "@/components/oect/RoleWorkspaceView";
import SlaMonitoringView from "@/components/oect/SlaMonitoringView";
import WorkflowVisualizer from "@/components/oect/WorkflowVisualizer";
import { MOCK_CITIZENS, type ComplaintItem } from "@/components/oect/complaintDomain";
import { useComplaintsStore } from "@/components/oect/useComplaintsStore";
import { useCitizenSessionStore, type SystemRoleId } from "@/components/oect/rbacDomain";

type PortalView = "dashboard" | "workspace" | "cases" | "workflow" | "sla" | "citizen" | "governance" | "integrations";

const NAV_ITEMS = [
  {
    id: "dashboard" as const,
    label: "ภาพรวมและ SLA",
    description: "สถานการณ์ทั่วประเทศและงานเร่งด่วน",
    icon: BarChart3,
  },
  {
    id: "workspace" as const,
    label: "คิวงานตามบทบาท",
    description: "ตรวจ สั่งการ สืบสวน และวินิจฉัย",
    icon: ClipboardCheck,
  },
  {
    id: "cases" as const,
    label: "เรื่องร้องเรียน",
    description: "รับเรื่อง ค้นหา และเปิดสำนวน",
    icon: FileText,
  },
  {
    id: "workflow" as const,
    label: "Workflow กระบวนงาน",
    description: "ขั้นตอน ระยะเวลา และจุดวินิจฉัย",
    icon: Layers3,
  },
  {
    id: "sla" as const,
    label: "ติดตามกำหนดเวลา",
    description: "ตัวจับเวลาทุกเคสและการแจ้งเตือน",
    icon: Clock3,
  },
  {
    id: "citizen" as const,
    label: "บริการผู้ร้อง",
    description: "ยื่น ติดตาม แก้ไข และรับผล",
    icon: MessageSquareText,
  },
  {
    id: "governance" as const,
    label: "รายงานและกำกับระบบ",
    description: "Reports, Audit Log, User และ Role",
    icon: ShieldCheck,
  },
  {
    id: "integrations" as const,
    label: "ระบบเชื่อมโยง",
    description: "DXC, e-Saraban และ PRAXTICOL",
    icon: Database,
  },
];

const CITIZEN_NAV_ITEMS = [
  {
    id: "overview" as const,
    label: "หน้าหลัก",
    description: "ภาพรวมคำร้องของฉัน",
    icon: ShieldCheck,
  },
  {
    id: "new" as const,
    label: "ยื่นคำร้องใหม่",
    description: "กรอกคำร้องและแนบหลักฐาน",
    icon: FilePlus2,
  },
  {
    id: "tracking" as const,
    label: "ติดตามสถานะ",
    description: "ดู Timeline การดำเนินการ",
    icon: Clock3,
  },
  {
    id: "correction" as const,
    label: "แก้ไขคำร้อง",
    description: "ส่งข้อมูลหรือเอกสารเพิ่มเติม",
    icon: UploadCloud,
  },
  {
    id: "result" as const,
    label: "ผลการพิจารณา",
    description: "ดูและดาวน์โหลดผล",
    icon: FileCheck2,
  },
  {
    id: "history" as const,
    label: "ประวัติของฉัน",
    description: "คำร้องที่เคยยื่นทั้งหมด",
    icon: History,
  },
  {
    id: "profile" as const,
    label: "โปรไฟล์",
    description: "ข้อมูลส่วนตัวและการแจ้งเตือน",
    icon: UserRound,
  },
  {
    id: "search_election" as const,
    label: "ค้นหาข้อมูลการเลือกตั้ง",
    description: "ข้อมูลผู้สมัครและผลการเลือกตั้ง",
    icon: Search,
  },
];

const PAGE_META: Record<PortalView, { eyebrow: string; title: string; description: string }> = {
  dashboard: {
    eyebrow: "ศูนย์บัญชาการเรื่องร้องเรียน",
    title: "ภาพรวมสถานการณ์และกรอบเวลา SLA",
    description: "เห็นเรื่องที่ต้องตัดสินใจ เรื่องที่เสี่ยงเกินกำหนด และภาระงานทุกพื้นที่ในหน้าเดียว",
  },
  workspace: {
    eyebrow: "Role-based officer workspace",
    title: "คิวงานและการดำเนินการตามบทบาท",
    description: "แสดงงาน ตัวจับเวลา และคำสั่งที่ผู้ใช้งานปัจจุบันมีสิทธิ์ดำเนินการ พร้อมส่งต่อไปยังลำดับถัดไป",
  },
  cases: {
    eyebrow: "ทะเบียนเรื่องร้องเรียน",
    title: "ค้นหาและบริหารสำนวน",
    description: "รับเรื่อง ตรวจสอบ มอบหมาย และติดตามสำนวนตั้งแต่จังหวัดถึงส่วนกลาง",
  },
  workflow: {
    eyebrow: "กระบวนการร้องคัดค้านการเลือกตั้ง",
    title: "Workflow และจุดควบคุม SLA",
    description: "ติดตามลำดับงาน ผู้รับผิดชอบ และกรอบเวลาตามระเบียบ กกต. อย่างเป็นระบบ",
  },
  sla: {
    eyebrow: "SLA Monitoring & Escalation",
    title: "ติดตามกรอบเวลาทุกขั้นตอน",
    description: "รวมคำร้องและสำนวนที่ใกล้ครบหรือเกินกำหนด เพื่อแจ้งเตือนผู้รับผิดชอบและผู้บังคับบัญชา",
  },
  citizen: {
    eyebrow: "บริการผู้ร้องเรียน",
    title: "ยื่นคำร้อง ติดตาม แก้ไข และรับผล",
    description: "บริการครบวงจรสำหรับผู้ร้อง โดยแสดงเฉพาะข้อมูลที่เปิดเผยได้และปกปิดความเห็นภายในตาม PDPA",
  },
  governance: {
    eyebrow: "Governance, Audit & Reporting",
    title: "รายงาน ประวัติการดำเนินการ และสิทธิ์ผู้ใช้",
    description: "ตรวจสอบย้อนหลัง ส่งออกรายงาน และกำกับสิทธิ์ตามบทบาท หน่วยงาน และพื้นที่รับผิดชอบ",
  },
  integrations: {
    eyebrow: "Government Data Exchange",
    title: "สถานะระบบเชื่อมโยงภายนอก",
    description: "ตรวจสุขภาพการเชื่อมต่อทะเบียนราษฎร สารบรรณ และข้อมูลการเลือกตั้ง",
  },
};

const INTEGRATIONS = [
  {
    name: "ฐานข้อมูลทะเบียนราษฎร",
    shortName: "DXC / Linkage Center",
    description: "ตรวจสอบตัวตนและข้อมูลที่อยู่ของผู้ร้อง/ผู้ถูกร้อง",
    latency: "128 ms",
  },
  {
    name: "ระบบสารบรรณอิเล็กทรอนิกส์",
    shortName: "e-Saraban",
    description: "รับ-ส่งหนังสือและเลขสารบรรณระหว่างจังหวัดกับส่วนกลาง",
    latency: "214 ms",
  },
  {
    name: "ระบบข้อมูลการเลือกตั้ง",
    shortName: "PRAXTICOL",
    description: "อ้างอิงเขตเลือกตั้ง ผู้สมัคร และผลการเลือกตั้ง",
    latency: "176 ms",
  },
];

export default function UserPortalPage() {
  const [cases, setCases] = useComplaintsStore(initialCasesData as ComplaintItem[]);
  const [activeView, setActiveView] = useState<PortalView>("citizen");
  const [selectedCase, setSelectedCase] = useState<ComplaintItem | null>(null);
  const [selectedCaseReadOnly, setSelectedCaseReadOnly] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isCitizenFormOpen, setIsCitizenFormOpen] = useState(false);
  const [citizenTab, setCitizenTab] = useState<CitizenTab>("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const MOCK_NOTIFICATIONS = [
    { id: 1, title: "ยื่นคำร้องสำเร็จ", description: "ระบบได้รับคำร้องคัดค้านเลขที่ ECT-2567-001 ของท่านเรียบร้อยแล้ว", time: "10 นาทีที่แล้ว", unread: true },
    { id: 2, title: "ต้องการเอกสารเพิ่มเติม (ด่วน)", description: "เจ้าหน้าที่ขอให้ท่านแนบสำเนาบัตรประชาชนเพิ่มเติมสำหรับคำร้อง ECT-2566-701 ภายใน 3 วัน", time: "2 ชั่วโมงที่แล้ว", unread: true },
    { id: 3, title: "อัปเดตความคืบหน้าคำร้อง", description: "คำร้อง ECT-2566-892 ของท่านเปลี่ยนสถานะเป็น 'อยู่ระหว่างสืบสวน/ไต่สวน'", time: "เมื่อวาน", unread: false },
    { id: 4, title: "แจ้งผลการพิจารณา", description: "คณะกรรมการการเลือกตั้งมีมติ 'ยกคำร้อง' สำหรับคำร้อง ECT-2565-421 ท่านสามารถดูรายละเอียดได้ที่เมนูผลการพิจารณา", time: "3 วันที่แล้ว", unread: false },
    { id: 5, title: "ความปลอดภัยของบัญชี", description: "พบการเข้าสู่ระบบใหม่จากอุปกรณ์ Chrome บน Windows (เชียงใหม่)", time: "สัปดาห์ที่แล้ว", unread: false },
    { id: 6, title: "ประกาศจาก กกต.", description: "เชิญชวนประชาชนร่วมตรวจสอบบัญชีรายชื่อผู้มีสิทธิเลือกตั้ง สว. ประจำปี 2567 ผ่านแอปพลิเคชัน", time: "เดือนที่แล้ว", unread: false }
  ];
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("intake");
  const [caseStatusFilter, setCaseStatusFilter] = useState<string>("ALL");
  const [isCitizenPortal, setIsCitizenPortal] = useState(true);
  const [currentCitizen, setCitizenId] = useCitizenSessionStore();

  const currentMeta = PAGE_META[activeView];
  const selectedRole = OFFICER_ROLES.find((role) => role.id === selectedRoleId) ?? OFFICER_ROLES[0];
  const urgentCount = useMemo(
    () => cases.filter((item) => item.slaStatus === "OVERDUE" || item.slaStatus === "NEAR_DUE").length,
    [cases],
  );
  const citizenCases = useMemo(() => cases.filter((item) => item.complainants.includes(currentCitizen.name)), [cases, currentCitizen]);
  const citizenActionCount = citizenCases.filter((item) => item.slaStatus === "NEAR_DUE" || item.slaStatus === "OVERDUE").length;
  const notificationCount = isCitizenPortal ? citizenActionCount : urgentCount;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const parameters = new URLSearchParams(window.location.search);
      const requestedView = parameters.get("view");
      const requestedRole = parameters.get("role");
      const requestedCitizenId = parameters.get("citizenId");
      if (requestedView === "citizen") {
        setIsCitizenPortal(true);
        setActiveView("citizen");
        setCitizenTab("overview");
        setIsCitizenFormOpen(false);
      }
      if (requestedCitizenId && MOCK_CITIZENS.some((citizen) => citizen.id === requestedCitizenId)) {
        setCitizenId(requestedCitizenId);
      }
      if (requestedRole && OFFICER_ROLES.some((role) => role.id === requestedRole)) {
        setIsCitizenPortal(false);
        setSelectedRoleId(requestedRole);
        setActiveView(requestedRole === "intake" ? "dashboard" : "workspace");
      }
    }, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectView = (view: PortalView) => {
    setActiveView(view);
    if (view === "citizen") setIsCitizenFormOpen(false);
    setIsNewModalOpen(false);
    setIsMobileMenuOpen(false);
  };

  const selectCitizenTab = (tab: CitizenTab) => {
    setActiveView("citizen");
    setCitizenTab(tab);
    setIsCitizenFormOpen(tab === "new");
    setIsMobileMenuOpen(false);
  };

  const syncIntegrations = () => {
    setIsSyncing(true);
    window.setTimeout(() => setIsSyncing(false), 900);
  };

  const openCase = (caseItem: ComplaintItem, readOnly = false) => {
    setSelectedCase(caseItem);
    setSelectedCaseReadOnly(readOnly);
  };

  const handleUpdateCase = (updatedCase: ComplaintItem) => {
    setCases((currentCases) =>
      currentCases.map((c) => (c.id === updatedCase.id ? updatedCase : c))
    );
    if (selectedCase && selectedCase.id === updatedCase.id) {
      setSelectedCase(updatedCase);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl">
        <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:hidden"
              aria-label="เปิดเมนูหลัก"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href={isCitizenPortal ? `/user?view=citizen&citizenId=${currentCitizen.id}` : `/user?role=${selectedRoleId}`} className="flex min-w-0 items-center gap-3">
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-amber-300 bg-white p-1 shadow-sm">
                <Image
                  src="/oect-logo.png"
                  alt="ตราสัญลักษณ์สำนักงานคณะกรรมการการเลือกตั้ง"
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                  priority
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold tracking-tight text-slate-950">
                  ECT Complaint Management
                </span>
                <span className="hidden truncate text-[11px] text-slate-500 sm:block">
                  ระบบบริหารจัดการเรื่องร้องเรียน สนง.กกต.
                </span>
              </span>
            </Link>
          </div>

          {!isCitizenPortal && <div className="hidden w-full max-w-md items-center lg:flex">
            <Search className="pointer-events-none relative left-9 h-4 w-4 text-slate-400" />
            <input
              value={globalSearch}
              onChange={(event) => setGlobalSearch(event.target.value)}
              onFocus={() => setActiveView("cases")}
              placeholder="ค้นหาเลขเรื่อง ผู้ร้อง ข้อกล่าวหา หรือจังหวัด"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              aria-label="ค้นหาเรื่องร้องเรียน"
            />
          </div>}

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
              title="เข้าสู่หน้าผู้ดูแลระบบเพื่อจัดการผู้ใช้ สิทธิ์ SLA และมาสเตอร์ดาต้า"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-blue-700" />
              <span>Admin Console</span>
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl border transition ${isNotificationOpen ? "bg-blue-50 border-blue-200 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                aria-label={`การแจ้งเตือน ${notificationCount} รายการ`}
              >
                <Bell className="h-4 w-4" />
                {notificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </span>
                )}
              </button>
              
              {isNotificationOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    <div className="mb-2 px-3 pt-2">
                      <h3 className="text-sm font-bold text-slate-900">การแจ้งเตือน</h3>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {MOCK_NOTIFICATIONS.map((notif) => (
                        <button key={notif.id} className="flex w-full flex-col gap-1 rounded-xl p-3 text-left hover:bg-slate-50 transition">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${notif.unread ? "text-[#1B3F8B]" : "text-slate-700"}`}>
                              {notif.title}
                            </span>
                            {notif.unread && <span className="h-2 w-2 rounded-full bg-rose-500" />}
                          </div>
                          <span className="text-[11px] text-slate-500 leading-relaxed">{notif.description}</span>
                          <span className="text-[9px] text-slate-400 mt-1">{notif.time}</span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 border-t border-slate-100 p-2 text-center">
                      <button className="text-[11px] font-bold text-blue-700 hover:underline">
                        ดูการแจ้งเตือนทั้งหมด
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="hidden items-center gap-2 border-l border-slate-200 pl-3 sm:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1B3F8B] text-xs font-bold text-white">{isCitizenPortal ? currentCitizen.initials : "WK"}</span>
                <span className="hidden xl:block">
                  <span className="block text-xs font-semibold text-slate-900">{isCitizenPortal ? currentCitizen.shortName : "วรากร กรณีศึกษา"}</span>
                  <span className="block max-w-44 truncate text-[10px] text-slate-500">{isCitizenPortal ? `ผู้ร้องเรียน · ยืนยันด้วย ${currentCitizen.verifiedVia}` : `${selectedRole.label} · เชียงใหม่`}</span>
                </span>
            </div>

            <Link
              href="/login"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
              aria-label="ออกจากระบบ"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-[#1B3F8B]/45 backdrop-blur-sm"
            aria-label="ปิดเมนูหลัก"
          />
          <aside className="relative flex h-full w-[86%] max-w-sm flex-col bg-white p-5 shadow-2xl">
            <div className="mb-7 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-950">{isCitizenPortal ? "บริการผู้ร้องเรียน" : "เมนูระบบงาน"}</div>
                <div className="text-[11px] text-slate-500">{isCitizenPortal ? "ECT-CMS Citizen Portal" : "ECT-CMS Officer Portal"}</div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
                aria-label="ปิดเมนู"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <PortalNavigation
              activeView={activeView}
              onSelect={selectView}
              citizenOnly={isCitizenPortal}
              citizenTab={citizenTab}
              citizenFormOpen={isCitizenFormOpen}
              citizenActionCount={citizenActionCount}
              onCitizenTabChange={selectCitizenTab}
            />
          </aside>
        </div>
      )}

      <div className="mx-auto flex min-h-[calc(100vh-65px)] max-w-[1680px]">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-5 lg:sticky lg:top-16 lg:flex lg:h-[calc(100vh-64px)] lg:flex-col lg:overflow-y-auto">
          <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{isCitizenPortal ? "เมนูบริการผู้ร้อง" : "ระบบงานหลัก"}</div>
          <PortalNavigation
            activeView={activeView}
            onSelect={selectView}
            citizenOnly={isCitizenPortal}
            citizenTab={citizenTab}
            citizenFormOpen={isCitizenFormOpen}
            citizenActionCount={citizenActionCount}
            onCitizenTabChange={selectCitizenTab}
          />

          <div className="mt-auto space-y-3 pt-6">
            {isCitizenPortal ? (
              <div className="border-t border-slate-100 px-3 pt-4">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500"><ShieldCheck className="h-3.5 w-3.5 text-[#1B3F8B]" /> ยืนยันตัวตนด้วย {currentCitizen.verifiedVia} แล้ว</div>
                <label className="mt-2.5 block">
                  <span className="sr-only">สลับบัญชีประชาชนสำหรับทดสอบ</span>
                  <select
                    value={currentCitizen.id}
                    onChange={(event) => setCitizenId(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-[10px] font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
                  >
                    {MOCK_CITIZENS.map((citizen) => (
                      <option key={citizen.id} value={citizen.id}>{citizen.name} · จ.{citizen.province}</option>
                    ))}
                  </select>
                </label>
                <div className="mt-2 text-[10px] text-slate-400">ช่วยเหลือสายด่วน กกต. 1444</div>
              </div>
            ) : (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  ระบบทำงานปกติ
                </div>
                <div className="mt-1.5 text-[10px] leading-relaxed text-emerald-700">
                  เชื่อมต่อ 3 ระบบ · เข้ารหัส TLS 1.3 · PDPA Masking เปิดใช้งาน
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          {!isCitizenPortal && isNewModalOpen && (
            <div className="mb-3 flex items-center gap-2 text-[10px] text-slate-400"><span>ระบบงานเจ้าหน้าที่</span><ChevronRight className="h-3.5 w-3.5" /><span className="font-semibold text-[#1B3F8B]">บันทึกรับคำร้องใหม่</span></div>
          )}
          {!isCitizenPortal && isNewModalOpen && (
            <NewComplaintForm
              mode="officer"
              presentation="page"
              onClose={() => setIsNewModalOpen(false)}
              onAddCase={(newCase) => setCases((currentCases) => [newCase, ...currentCases])}
            />
          )}

          {!isCitizenPortal && !isNewModalOpen && <><div className="mb-3 flex items-center gap-2 text-[10px] text-slate-400"><span>ระบบงานเจ้าหน้าที่</span><ChevronRight className="h-3.5 w-3.5" /><span className="font-semibold text-[#1B3F8B]">{currentMeta.title}</span></div><section className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="max-w-3xl">
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FFD600]" />
                    {currentMeta.eyebrow}
                  </div>
                  <h1 className="text-xl font-bold tracking-tight text-[#1B3F8B] sm:text-2xl">{currentMeta.title}</h1>
                  <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">{currentMeta.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {activeView !== "citizen" && (
                    <label className="relative">
                      <span className="sr-only">เลือกบทบาทสำหรับพื้นที่ทำงาน</span>
                      <select
                        value={selectedRoleId}
                        onChange={(event) => {
                          setSelectedRoleId(event.target.value);
                          setActiveView("workspace");
                        }}
                        className="max-w-[260px] appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-9 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        aria-label="เลือกหรือสลับบทบาทเจ้าหน้าที่"
                      >
                        {OFFICER_ROLES.map((role) => <option key={role.id} value={role.id}>{role.label}</option>)}
                      </select>
                      <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-400" />
                    </label>
                  )}
                  {activeView === "dashboard" && (
                    <button
                      type="button"
                      onClick={() => setActiveView("cases")}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <FileText className="h-4 w-4" /> ดูทะเบียนเรื่อง
                    </button>
                  )}
                  {(activeView === "dashboard" || activeView === "cases") && (
                    <button
                      type="button"
                      onClick={() => setIsNewModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#1B3F8B] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1B3F8B] focus:outline-none focus:ring-4 focus:ring-blue-200"
                    >
                      <Plus className="h-4 w-4" /> รับเรื่องร้องเรียนใหม่
                    </button>
                  )}
                  {activeView === "integrations" && (
                    <button
                      type="button"
                      onClick={syncIntegrations}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#1B3F8B] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1B3F8B]"
                    >
                      <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                      {isSyncing ? "กำลังตรวจสอบ" : "ตรวจสอบการเชื่อมต่อ"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section></>}

          {!isNewModalOpen && activeView === "dashboard" && (
            <DashboardView
              cases={cases}
              onSelectCase={(caseItem) => openCase(caseItem)}
              roleId={selectedRoleId}
              onViewAllCases={() => {
                setCaseStatusFilter("ALL");
                setActiveView("cases");
              }}
              onFilterStatus={(status) => {
                setCaseStatusFilter(status);
                setActiveView("cases");
              }}
            />
          )}

          {!isNewModalOpen && activeView === "workspace" && (
            <RoleWorkspaceView
              cases={cases}
              roleId={selectedRoleId}
              userProvince="เชียงใหม่"
              onSelectCase={(caseItem) => openCase(caseItem)}
              onUpdateCase={handleUpdateCase}
            />
          )}

          {!isNewModalOpen && activeView === "cases" && (
            <CaseListView
              cases={cases}
              onSelectCase={(caseItem) => openCase(caseItem)}
              openNewModal={() => setIsNewModalOpen(true)}
              searchQuery={globalSearch}
              setSearchQuery={setGlobalSearch}
              statusFilter={caseStatusFilter}
              setStatusFilter={setCaseStatusFilter}
            />
          )}

          {!isNewModalOpen && activeView === "workflow" && <WorkflowVisualizer />}

          {!isNewModalOpen && activeView === "sla" && <SlaMonitoringView cases={cases} onSelectCase={(caseItem) => openCase(caseItem)} />}

          {activeView === "citizen" && (isCitizenFormOpen ? (
            <NewComplaintForm
              mode="citizen"
              presentation="page"
              currentCitizen={currentCitizen}
              onClose={() => selectCitizenTab("overview")}
              onAddCase={(newCase) => setCases((currentCases) => [newCase, ...currentCases])}
            />
          ) : (
            <CitizenServiceView
              cases={cases}
              currentCitizen={currentCitizen}
              activeTab={citizenTab}
              onTabChange={selectCitizenTab}
              onOpenNewComplaint={() => selectCitizenTab("new")}
              onSelectCase={(caseItem) => openCase(caseItem, true)}
              onUpdateCase={handleUpdateCase}
            />
          ))}

          {activeView === "governance" && <GovernanceCenterView cases={cases} />}

          {activeView === "integrations" && (
            <div className="grid gap-4 lg:grid-cols-3">
              {INTEGRATIONS.map((integration) => (
                <article key={integration.shortName} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                      <Database className="h-5 w-5" />
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
                    </span>
                  </div>
                  <div className="mt-5">
                    <h2 className="text-sm font-bold text-slate-950">{integration.name}</h2>
                    <div className="mt-1 text-xs font-semibold text-blue-700">{integration.shortName}</div>
                    <p className="mt-3 min-h-10 text-xs leading-5 text-slate-500">{integration.description}</p>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-[11px] text-slate-500">
                    <span>Response time</span>
                    <span className="font-kanit font-semibold text-slate-800">{integration.latency}</span>
                  </div>
                </article>
              ))}

              <article className="rounded-2xl border border-slate-200 bg-[#1B3F8B] p-5 text-white shadow-sm lg:col-span-3">
                <div className="grid gap-5 md:grid-cols-[1.2fr_1fr_1fr] md:items-center">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold"><ShieldCheck className="h-5 w-5 text-emerald-400" /> Integration Security</div>
                    <p className="mt-2 text-xs leading-5 text-slate-400">ทุกคำขอผ่าน API Gateway, Mutual TLS และบันทึก Audit Log ตามนโยบายความมั่นคงปลอดภัย</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">Availability</div>
                    <div className="mt-1 text-xl font-bold text-emerald-400">99.97%</div>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">Last sync</div>
                    <div className="mt-1 text-sm font-semibold">วันนี้ 13:42 น.</div>
                  </div>
                </div>
              </article>
            </div>
          )}
        </main>
      </div>

      {selectedCase && (
        <CaseDetailModal
          caseItem={selectedCase}
          readOnly={selectedCaseReadOnly}
          currentUserRole={isCitizenPortal ? "citizen" : (selectedRoleId as SystemRoleId)}
          currentUserName={isCitizenPortal ? currentCitizen.name : selectedRole.label}
          onClose={() => setSelectedCase(null)}
          onUpdateCase={handleUpdateCase}
        />
      )}
    </div>
  );
}

function PortalNavigation({
  activeView,
  onSelect,
  citizenOnly = false,
  citizenTab = "overview",
  citizenFormOpen = false,
  citizenActionCount = 0,
  onCitizenTabChange,
}: {
  activeView: PortalView;
  onSelect: (view: PortalView) => void;
  citizenOnly?: boolean;
  citizenTab?: CitizenTab;
  citizenFormOpen?: boolean;
  citizenActionCount?: number;
  onCitizenTabChange?: (tab: CitizenTab) => void;
}) {
  if (citizenOnly) {
    return (
      <nav className="space-y-1.5" aria-label="เมนูบริการผู้ร้องเรียน">
        {CITIZEN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === "new" ? citizenFormOpen : !citizenFormOpen && citizenTab === item.id;
          const badgeCount = item.id === "correction" ? citizenActionCount : 0;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onCitizenTabChange?.(item.id)}
              className={`group flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                isActive
                  ? "bg-[#1B3F8B] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-[#1B3F8B]"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-[#1B3F8B]"}`} />
              <span className="min-w-0 flex-1 truncate text-xs font-semibold">{item.label}</span>
              {badgeCount > 0 ? (
                <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[9px] font-bold ${isActive ? "bg-white text-[#1B3F8B]" : "bg-rose-100 text-rose-700"}`}>
                  {badgeCount}
                </span>
              ) : null}
              {isActive && <ChevronRight className="h-4 w-4 text-white/75" />}
            </button>
          );
        })}
      </nav>
    );
  }

  const officerViews: PortalView[] = ["dashboard", "workspace", "cases", "workflow", "sla"];
  const allowedViews = officerViews;
  return (
    <nav className="space-y-1.5" aria-label="เมนูระบบงานหลัก">
      {NAV_ITEMS.filter((item) => allowedViews.includes(item.id)).map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`group flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
              isActive
                ? "bg-[#1B3F8B] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-[#1B3F8B]"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-[#1B3F8B]"}`} />
            <span className="min-w-0 flex-1 truncate text-xs font-semibold">{item.label}</span>
            {isActive && <ChevronRight className="h-4 w-4 text-white/70" />}
          </button>
        );
      })}
    </nav>
  );
}
