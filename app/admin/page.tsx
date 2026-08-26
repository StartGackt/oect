"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Database,
  FileText,
  FileClock,
  GitBranch,
  KeyRound,
  LockKeyhole,
  LogOut,
  MapPinned,
  Menu,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  TimerReset,
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
import { WORKFLOW_STEPS, type ComplaintItem } from "@/components/oect/complaintDomain";
import { useComplaintsStore } from "@/components/oect/useComplaintsStore";

type AdminView = "overview" | "cases" | "workspace" | "sla" | "governance" | "users" | "workflow" | "master" | "integrations" | "security";

const NAV_ITEMS = [
  { id: "overview" as const, label: "ภาพรวมระบบ", description: "ข้อมูลคำร้องและ SLA", icon: BarChart3 },
  { id: "cases" as const, label: "รายการเรื่องร้องเรียน", description: "ทะเบียนคำร้องและสำนวน", icon: FileText },
  { id: "workspace" as const, label: "คิวงานทุกขั้นตอน", description: "งานที่ยังไม่ปิดเรื่อง", icon: ClipboardList },
  { id: "sla" as const, label: "ติดตาม SLA", description: "ใกล้ครบและเกินกำหนด", icon: TimerReset },
  { id: "governance" as const, label: "รายงานและ Audit", description: "สถิติและประวัติการดำเนินการ", icon: FileClock },
  { id: "users" as const, label: "ผู้ใช้และสิทธิ์", description: "User, Role และหน่วยงาน", icon: UserCog },
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
  users: { eyebrow: "Identity & Access Management", title: "ผู้ใช้งาน บทบาท และสิทธิ์เข้าถึง", description: "กำหนดสิทธิ์ตามบทบาท หน่วยงาน จังหวัด และขั้นตอนของ Workflow ด้วยหลัก least privilege" },
  workflow: { eyebrow: "Versioned Workflow Administration", title: "Workflow และกฎ SLA", description: "ออกแบบ ทบทวน และเผยแพร่ขั้นตอนโดยไม่เปลี่ยนกฎกลางสำนวนที่กำลังดำเนินการ" },
  master: { eyebrow: "Master Data Governance", title: "ข้อมูลพื้นฐานและแบบฟอร์มมาตรฐาน", description: "ดูแลจังหวัด อำเภอ ตำบล เขตเลือกตั้ง ประเภทคำร้อง และแบบ สตว.1/สตว.1/1" },
  integrations: { eyebrow: "Government Data Exchange", title: "การเชื่อมโยงระบบภายนอก", description: "กำกับ endpoint, certificate, retry policy และประวัติการเชื่อมต่อของแต่ละระบบ" },
  security: { eyebrow: "Security, Privacy & Audit", title: "นโยบายความปลอดภัยและการตรวจสอบ", description: "กำกับ 2FA, Auto logout, Data masking, Retention และ Audit event ที่แก้ไขย้อนหลังไม่ได้" },
};

export default function AdminConsolePage() {
  const [cases, setCases] = useComplaintsStore(initialCasesData as ComplaintItem[]);
  const [activeView, setActiveView] = useState<AdminView>("overview");
  const [selectedCase, setSelectedCase] = useState<ComplaintItem | null>(null);
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [caseStatusFilter, setCaseStatusFilter] = useState("ALL");
  const [message, setMessage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const meta = PAGE_META[activeView];
  const urgentCount = useMemo(() => cases.filter((item) => item.slaStatus === "OVERDUE" || item.slaStatus === "NEAR_DUE").length, [cases]);

  const selectView = (view: AdminView) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  const notify = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 2400);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      {message && <div className="fixed right-4 top-20 z-50 flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-xs font-bold text-emerald-800 shadow-xl"><CheckCircle2 className="h-4 w-4" /> {message}</div>}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl">
        <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setIsMobileMenuOpen(true)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:hidden" aria-label="เปิดเมนูผู้ดูแลระบบ"><Menu className="h-5 w-5" /></button>
            <Link href="/admin" className="flex min-w-0 items-center gap-3"><span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-amber-300 bg-white p-1 shadow-sm"><Image src="/oect-logo.png" alt="ตราสัญลักษณ์สำนักงานคณะกรรมการการเลือกตั้ง" fill sizes="40px" className="object-contain p-1" priority /></span><span className="min-w-0"><span className="block truncate text-sm font-bold tracking-tight">ECT Complaint Management</span><span className="hidden truncate text-[11px] text-slate-500 sm:block">ศูนย์ผู้ดูแลระบบ สนง.กกต.</span></span></Link>
          </div>

          <div className="hidden w-full max-w-md items-center lg:flex">
            <Search className="pointer-events-none relative left-9 h-4 w-4 text-slate-400" />
            <input value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} onFocus={() => setActiveView("cases")} placeholder="ค้นหาเลขเรื่อง ผู้ร้อง ข้อกล่าวหา หรือจังหวัด" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" aria-label="ค้นหาเรื่องร้องเรียนในศูนย์ผู้ดูแลระบบ" />
          </div>

          <div className="flex items-center gap-2"><button type="button" aria-label={`การแจ้งเตือน ${urgentCount} รายการ`} className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"><Bell className="h-4 w-4" />{urgentCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">{urgentCount > 99 ? "99+" : urgentCount}</span>}</button><span className="hidden items-center gap-2 border-l border-slate-200 pl-3 sm:flex"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1B3F8B] text-xs font-bold text-white">GA</span><span className="hidden xl:block"><span className="block text-xs font-semibold">GIT Admin</span><span className="block text-[10px] text-slate-500">System Admin · สิทธิ์เต็มทุกเมนู</span></span></span><Link href="/login" aria-label="ออกจากระบบ" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><LogOut className="h-4 w-4" /></Link></div>
        </div>
      </header>

      {isMobileMenuOpen && <div className="fixed inset-0 z-50 lg:hidden"><button type="button" onClick={() => setIsMobileMenuOpen(false)} className="absolute inset-0 bg-[#1B3F8B]/45 backdrop-blur-sm" aria-label="ปิดเมนูผู้ดูแลระบบ" /><aside className="relative flex h-full w-[86%] max-w-sm flex-col bg-white p-5 shadow-2xl"><div className="mb-7 flex items-center justify-between"><div><div className="text-sm font-bold">เมนูผู้ดูแลระบบ</div><div className="text-[11px] text-slate-500">System Admin · สิทธิ์เต็ม</div></div><button type="button" onClick={() => setIsMobileMenuOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600" aria-label="ปิดเมนู"><X className="h-5 w-5" /></button></div><AdminNavigation activeView={activeView} onSelect={selectView} /><div className="mt-auto border-t border-slate-100 px-3 pt-4 text-[10px] text-slate-400"><LockKeyhole className="mr-1 inline h-3.5 w-3.5 text-[#1B3F8B]" /> เข้าถึงทุกเมนูและบันทึก Audit Log</div></aside></div>}

      <div className="mx-auto flex min-h-[calc(100vh-65px)] max-w-[1680px]">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-5 lg:sticky lg:top-16 lg:flex lg:h-[calc(100vh-64px)] lg:flex-col lg:overflow-y-auto">
          <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">ระบบผู้ดูแล</div>
          <AdminNavigation activeView={activeView} onSelect={selectView} />
          <div className="mt-auto space-y-3 pt-6"><div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5"><div className="flex items-center gap-2 text-xs font-semibold text-emerald-900"><ShieldCheck className="h-4 w-4 text-emerald-600" /> ระบบทำงานปกติ</div><div className="mt-1.5 text-[10px] leading-relaxed text-emerald-700">2FA 100% · สิทธิ์เต็มทุกเมนู · ไม่พบ Critical finding</div></div><div className="px-3 text-[10px] leading-5 text-slate-400"><LockKeyhole className="mr-1 inline h-3.5 w-3.5 text-[#1B3F8B]" /> ทุกการเปลี่ยนแปลงถูกบันทึกใน Audit Log</div></div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          <div className="mb-3 flex items-center gap-2 text-[10px] text-slate-400"><span>ผู้ดูแลระบบ</span><ChevronRight className="h-3.5 w-3.5" /><span className="font-semibold text-[#1B3F8B]">{meta.title}</span></div>
          <section className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="px-5 py-5 sm:px-6"><div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between"><div className="max-w-3xl"><div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700"><span className="h-1.5 w-1.5 rounded-full bg-[#FFD600]" /> {meta.eyebrow}</div><h1 className="text-xl font-bold tracking-tight text-[#1B3F8B] sm:text-2xl">{meta.title}</h1><p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">{meta.description}</p></div><div className="flex flex-wrap items-center gap-2.5">{activeView === "overview" && <button type="button" onClick={() => setActiveView("cases")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"><FileText className="h-4 w-4" /> ดูทะเบียนเรื่อง</button>}{(activeView === "overview" || activeView === "cases") && <button type="button" onClick={() => setIsNewComplaintOpen(true)} className="btn-primary w-fit"><Plus className="h-4 w-4" /> บันทึกเรื่องใหม่</button>}{(activeView === "workspace" || activeView === "sla" || activeView === "governance") && <button type="button" onClick={() => setActiveView("cases")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"><FileText className="h-4 w-4" /> เปิดทะเบียนเรื่อง</button>}{activeView === "security" && <button type="button" onClick={() => setActiveView("governance")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"><FileClock className="h-4 w-4" /> ดู Audit Log</button>}</div></div></div>
          </section>

          {activeView === "overview" && <DashboardView cases={cases} roleId="admin" onSelectCase={setSelectedCase} onViewAllCases={() => { setCaseStatusFilter("ALL"); setActiveView("cases"); }} onFilterStatus={(status) => { setCaseStatusFilter(status); setActiveView("cases"); }} />}
          {activeView === "cases" && <CaseListView cases={cases} onSelectCase={setSelectedCase} openNewModal={() => setIsNewComplaintOpen(true)} searchQuery={globalSearch} setSearchQuery={setGlobalSearch} statusFilter={caseStatusFilter} setStatusFilter={setCaseStatusFilter} />}
          {activeView === "workspace" && <RoleWorkspaceView cases={cases} roleId="admin" onSelectCase={setSelectedCase} />}
          {activeView === "sla" && <SlaMonitoringView cases={cases} onSelectCase={setSelectedCase} />}
          {activeView === "governance" && <GovernanceCenterView cases={cases} />}
          {activeView === "users" && <UsersPanel cases={cases} onNotify={notify} />}
          {activeView === "workflow" && <WorkflowPanel onNotify={notify} />}
          {activeView === "master" && <MasterDataPanel cases={cases} />}
          {activeView === "integrations" && <IntegrationsPanel onNotify={notify} />}
          {activeView === "security" && <SecurityPanel cases={cases} />}
        </main>
      </div>
      {selectedCase && <CaseDetailModal caseItem={selectedCase} onClose={() => setSelectedCase(null)} />}
      {isNewComplaintOpen && <NewComplaintForm mode="officer" onClose={() => setIsNewComplaintOpen(false)} onAddCase={(newCase) => setCases((currentCases) => [newCase, ...currentCases])} />}
    </div>
  );
}

function AdminNavigation({ activeView, onSelect }: { activeView: AdminView; onSelect: (view: AdminView) => void }) {
  return <nav className="space-y-1.5" aria-label="เมนูผู้ดูแลระบบ">{NAV_ITEMS.map((item) => { const Icon = item.icon; const active = item.id === activeView; return <button key={item.id} type="button" onClick={() => onSelect(item.id)} className={`group flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${active ? "bg-[#1B3F8B] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-[#1B3F8B]"}`} aria-current={active ? "page" : undefined}><Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-[#1B3F8B]"}`} /><span className="min-w-0 flex-1 truncate text-xs font-semibold">{item.label}</span>{active && <ChevronRight className="h-4 w-4 text-white/70" />}</button>; })}</nav>;
}

function UsersPanel({ cases, onNotify }: { cases: ComplaintItem[]; onNotify: (text: string) => void }) {
  const [query, setQuery] = useState("");
  const officerNames = Array.from(new Set(cases.map((item) => item.officer)));
  const users = officerNames.map((name) => {
    const assignedCases = cases.filter((item) => item.officer === name);
    const sample = assignedCases[0];
    const role = Array.from(new Set(assignedCases.map((item) => getRoleForStage(item.stageId)))).slice(0, 2).join(" / ");
    const urgentCount = assignedCases.filter((item) => item.slaStatus === "OVERDUE" || item.slaStatus === "NEAR_DUE").length;
    return { name, role, office: sample.currentSection === "สนง.กกต.จว." ? `สนง.กกต.จว. ${sample.province}` : sample.currentSection, caseCount: assignedCases.length, urgentCount };
  }).filter((item) => `${item.name} ${item.role} ${item.office}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => b.caseCount - a.caseCount).slice(0, 20);
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="flex items-center gap-2 text-sm font-bold"><Users className="h-4 w-4 text-blue-700" /> ผู้รับผิดชอบในชุดข้อมูล {officerNames.length} คน</h2><p className="mt-1 text-[10px] text-slate-500">เชื่อมโยงจากผู้รับผิดชอบในทะเบียนเรื่องร้องเรียน {cases.length} เรื่อง</p></div><label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาชื่อ บทบาท หรือหน่วยงาน" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-blue-500 sm:w-72" /></label></div><div className="divide-y divide-slate-100">{users.map(({ name, role, office, caseCount, urgentCount }) => <div key={name} className="grid gap-3 p-4 sm:grid-cols-[1.1fr_1.2fr_1.2fr_auto] sm:items-center"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-800">{name.charAt(0)}</span><div><div className="text-xs font-bold">{name}</div><div className="mt-0.5 text-[9px] text-slate-400">ปรากฏในทะเบียนกลาง</div></div></div><div className="text-[11px] text-slate-600">{role}</div><div className="text-[11px] text-slate-500">{office}<div className="mt-1 text-[9px] text-slate-400">รับผิดชอบ {caseCount} เรื่อง</div></div><div className="flex items-center justify-between gap-2"><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${urgentCount ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>{urgentCount ? `${urgentCount} เร่งรัด` : "ปกติ"}</span><button type="button" onClick={() => onNotify(`เปิดข้อมูลของ ${name}`)} aria-label={`ดูข้อมูล ${name}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-700"><KeyRound className="h-4 w-4" /></button></div></div>)}</div><div className="border-t border-slate-100 bg-slate-50 p-4 text-[10px] text-slate-500"><LockKeyhole className="mr-1 inline h-3.5 w-3.5 text-emerald-600" /> รายการนี้เป็นข้อมูลผู้รับผิดชอบที่อนุมานจากทะเบียนคำร้อง ไม่ใช่ฐานบัญชี Identity Provider</div></section>;
}

function getRoleForStage(stageId: number) {
  if (stageId <= 1) return "พนักงานตรวจคำร้อง";
  if (stageId === 2 || stageId === 4) return "ผอ.สนง.กกต.จว.";
  if (stageId === 3) return "คณะกรรมการสืบสวนและไต่สวน";
  if (stageId <= 6) return "ผู้ตรวจสำนวนส่วนกลาง";
  if (stageId === 7) return "เลขาคณะอนุวินิจฉัย";
  if (stageId === 8) return "กกต.";
  return "ลธ.กกต. / งานแจ้งผล";
}

function WorkflowPanel({ onNotify }: { onNotify: (text: string) => void }) {
  const slaRuleCount = WORKFLOW_STEPS.filter((step) => step.slaDays !== null).length;
  return <div className="space-y-5"><div className="grid gap-3 sm:grid-cols-3"><AdminMetric label="Workflow ที่ใช้งาน" value="1" /><AdminMetric label="ขั้นตอนกระบวนงาน" value={String(WORKFLOW_STEPS.length)} /><AdminMetric label="กฎ SLA ที่กำหนด" value={String(slaRuleCount)} /></div><section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="text-sm font-bold">Workflow กลางที่ใช้งานปัจจุบัน</h2><p className="mt-1 text-[10px] text-slate-500">ข้อมูลชุดเดียวกับ Timeline, Dashboard และ SLA Monitoring</p></div><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-bold text-emerald-700">เผยแพร่แล้ว</span></div><div className="divide-y divide-slate-100">{WORKFLOW_STEPS.map((step) => <div key={step.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[36px_1fr_180px_140px_auto] sm:items-center"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-800">{step.id}</span><div><div className="text-xs font-bold text-slate-800">{step.title}</div><div className="mt-1 text-[9px] text-slate-400">สำหรับผู้ร้อง: {step.publicTitle}</div></div><span className="text-[10px] text-slate-500">{step.section}</span><span className="text-[10px] font-semibold text-blue-700">{step.slaLabel}</span><button type="button" onClick={() => onNotify(`เปิดขั้นตอน ${step.id}: ${step.title}`)} className="btn-secondary">ตรวจสอบ</button></div>)}</div></section></div>;
}

function MasterDataPanel({ cases }: { cases: ComplaintItem[] }) { const provinces = new Set(cases.map((item) => item.province)).size; const districts = new Set(cases.map((item) => `${item.province}:${item.district}`)).size; const electionTypes = new Set(cases.map((item) => item.electionType)).size; const allegations = new Set(cases.map((item) => item.allegation)).size; return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><MasterCard title="จังหวัดและอำเภอในชุดข้อมูล" count={`${provinces} จังหวัด · ${districts} อำเภอ`} status={`${cases.length} เรื่อง`} /><MasterCard title="เขตเลือกตั้ง" count={`${new Set(cases.map((item) => item.constituency)).size} รูปแบบเขตในชุดข้อมูล`} status="PRAXTICOL" /><MasterCard title="ประเภทการเลือกตั้ง" count={`${electionTypes} ประเภทที่มีข้อมูล`} status="ใช้งาน" /><MasterCard title="ข้อกล่าวหา" count={`${allegations} รายการในชุดข้อมูล`} status="ใช้งาน" /><MasterCard title="แบบฟอร์มมาตรฐาน" count="สตว.1 · สตว.1/1" status="ตาม Workflow" /><MasterCard title="ปฏิทินวันทำการ" count="ปี 2569" status="ประกาศแล้ว" /></div>; }

function IntegrationsPanel({ onNotify }: { onNotify: (text: string) => void }) { const items = [["DXC / Linkage Center", "ตรวจสอบตัวตนและทะเบียนราษฎร", "128 ms"], ["e-Saraban", "รับ-ส่งหนังสือและเลขสารบรรณ", "214 ms"], ["PRAXTICOL", "เขตเลือกตั้ง ผู้สมัคร และผลการเลือกตั้ง", "176 ms"]]; return <div className="grid gap-4 lg:grid-cols-3">{items.map(([name, description, latency]) => <article key={name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Database className="h-5 w-5" /></span><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-bold text-emerald-700">Online</span></div><h2 className="mt-4 text-sm font-bold">{name}</h2><p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">{description}</p><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-[10px] text-slate-500"><span>Response time</span><span className="font-kanit font-bold text-slate-800">{latency}</span></div><button type="button" onClick={() => onNotify(`ตรวจสอบ ${name} สำเร็จ`)} className="btn-secondary mt-4 w-full"><RefreshCw className="h-4 w-4" /> ตรวจสอบการเชื่อมต่อ</button></article>)}</div>; }

function SecurityPanel({ cases }: { cases: ComplaintItem[] }) { const officers = new Set(cases.map((item) => item.officer)).size; const urgent = cases.filter((item) => item.slaStatus === "OVERDUE" || item.slaStatus === "NEAR_DUE").length; const completeRows = cases.filter((item) => item.caseNumber && item.officer && item.currentStage && item.currentSection).length; const coverage = cases.length ? Math.round((completeRows / cases.length) * 100) : 0; return <div className="grid gap-5 lg:grid-cols-[1fr_360px]"><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 text-sm font-bold"><ShieldCheck className="h-5 w-5 text-emerald-600" /> Security controls</h2><p className="mt-1 text-[10px] text-slate-500">นโยบายเดียวสำหรับบัญชี System Admin และข้อมูลทะเบียนกลาง</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><SecurityControl title="Authentication" value="Password + OTP / Hardware Token" /><SecurityControl title="Session" value="Auto logout 15 นาที" /><SecurityControl title="Data encryption" value="TLS 1.3 / AES-256" /><SecurityControl title="Data masking" value="เปิดใช้ตามสิทธิ์การเข้าถึง" /><SecurityControl title="Audit correlation" value="สร้างรหัสต่อรายการในทะเบียน" /><SecurityControl title="OWASP Top 10" value="ไม่พบ Critical finding" /></div></section><aside className="rounded-2xl bg-[#1B3F8B] p-5 text-white shadow-sm"><div className="flex items-center justify-between"><h2 className="text-sm font-bold">Data & audit coverage</h2><FileClock className="h-5 w-5 text-blue-300" /></div><div className="mt-6 text-4xl font-bold text-emerald-400">{coverage}%</div><p className="mt-2 text-xs leading-5 text-blue-100/70">สัดส่วนรายการที่มีเลขเรื่อง ผู้รับผิดชอบ ขั้นตอน และหน่วยงานครบถ้วน</p><div className="mt-5 space-y-3"><HealthRow label="รายการในทะเบียน" value={String(cases.length)} /><HealthRow label="ผู้รับผิดชอบ" value={String(officers)} /><HealthRow label="ต้องติดตาม SLA" value={String(urgent)} /></div></aside></div>; }

function AdminMetric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="text-[10px] font-bold uppercase text-slate-400">{label}</div><div className="mt-2 text-2xl font-bold text-blue-800">{value}</div></div>; }
function MasterCard({ title, count, status }: { title: string; count: string; status: string }) { return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Settings2 className="h-5 w-5" /></span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-600">{status}</span></div><h2 className="mt-4 text-sm font-bold">{title}</h2><p className="mt-2 text-xs text-slate-500">{count}</p><button type="button" className="mt-4 text-[11px] font-bold text-blue-700">จัดการข้อมูล <ChevronRight className="inline h-4 w-4" /></button></article>; }
function SecurityControl({ title, value }: { title: string; value: string }) { return <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"><div><div className="text-xs font-bold">{title}</div><div className="mt-1 text-[10px] text-slate-500">{value}</div></div><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /></div>; }
function HealthRow({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5 text-xs"><span className="text-slate-400">{label}</span><span className="font-bold text-white">{value}</span></div>; }
