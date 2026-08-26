"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  FileText, 
  Database, 
  Layers, 
  Cpu, 
  BarChart3, 
  Settings, 
  Search, 
  Plus, 
  UploadCloud, 
  Download, 
  Pencil, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Bell, 
  ChevronDown, 
  MessageSquare, 
  Eye, 
  ExternalLink,
  Users,
  Sliders,
  Check,
  Lock,
  LogOut,
  Sparkles,
  ArrowRight,
  Filter,
  Scale,
  Building2,
  Calendar
} from "lucide-react";
import initialCasesData from "@/data/complaintsData.json";
import CaseDetailModal from "@/components/oect/CaseDetailModal";
import NewComplaintForm from "@/components/oect/NewComplaintForm";
import CitizenTrackingView from "@/components/oect/CitizenTrackingView";
import DashboardView from "@/components/oect/DashboardView";
import WorkflowVisualizer from "@/components/oect/WorkflowVisualizer";

export default function UserPortalPage() {
  const [cases, setCases] = useState(initialCasesData);
  const [activeSidebarMenu, setActiveSidebarMenu] = useState<string>("cases");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMission, setSelectedMission] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedProvince, setSelectedProvince] = useState<string>("ALL");
  const [selectedPrivacy, setSelectedPrivacy] = useState<string>("ALL");
  
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Statistics
  const totalCases = cases.length;
  const normalCases = cases.filter((c) => c.slaStatus === "NORMAL").length;
  const nearDueCases = cases.filter((c) => c.slaStatus === "NEAR_DUE").length;
  const overdueCases = cases.filter((c) => c.slaStatus === "OVERDUE").length;
  const completedCases = cases.filter((c) => c.slaStatus === "COMPLETED").length;

  // Filtered dataset
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          c.caseNumber.toLowerCase().includes(q) ||
          c.allegation.toLowerCase().includes(q) ||
          c.complainants.toLowerCase().includes(q) ||
          c.respondent.toLowerCase().includes(q) ||
          c.province.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          c.officer.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Tab filter
      if (activeTab === "pending" && c.stageId > 2 && c.slaStatus === "COMPLETED") return false;
      if (activeTab === "overdue" && c.slaStatus !== "OVERDUE") return false;
      if (activeTab === "completed" && c.slaStatus !== "COMPLETED") return false;

      // Dropdown filters
      if (selectedMission !== "ALL" && c.missionGroup !== selectedMission) return false;
      if (selectedStatus !== "ALL" && c.slaStatus !== selectedStatus) return false;
      if (selectedProvince !== "ALL" && c.province !== selectedProvince) return false;

      return true;
    });
  }, [cases, searchQuery, activeTab, selectedMission, selectedStatus, selectedProvince]);

  const handleAddCase = (newCase: any) => {
    setCases([newCase, ...cases]);
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setSyncMessage(null);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncMessage("เชื่อมต่อฐานข้อมูลทะเบียนราษฎร (DXC) และระบบ PRAXTICOL เรียบร้อยแล้ว");
      setTimeout(() => setSyncMessage(null), 4000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-kanit selection:bg-[#0D9488] selection:text-white">
      
      {/* 1. TOP NAVBAR (EXACT STYLE FROM SCREENSHOT) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-6">
            <Link href="/user" className="flex items-center gap-2.5">
              <div className="w-8 h-8 relative flex-shrink-0 bg-white rounded-lg p-0.5 border border-amber-400">
                <Image
                  src="/oect-logo.png"
                  alt="สนง.กกต."
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-[#0F172A] tracking-tight">OECT ECT-CMS</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">OFFICER PORTAL</span>
              </div>
            </Link>

            {/* Navigation Switcher Pills */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#0D9488] bg-[#F0FDFA] border border-[#0D9488]/40 shadow-2xs">
                <MessageSquare className="w-3.5 h-3.5 text-[#0D9488]" />
                <span>Chatbot & User Portal</span>
              </div>

              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span>Admin Console</span>
              </Link>
            </div>
          </div>

          {/* Right: Notifications, User Profile Avatar, Logout */}
          <div className="flex items-center gap-3">
            
            {/* Notification Bell */}
            <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl relative transition-colors">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
            </button>

            {/* Officer Avatar & Role */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#173B6B] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                WK
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">วรากร (พนักงานสืบสวน)</div>
                <div className="text-[10px] text-slate-400 leading-tight">สนง.กกต.จว. เชียงใหม่</div>
              </div>
            </div>

            {/* Logout Button */}
            <Link
              href="/login"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
              title="ออกจากระบบ"
            >
              <LogOut className="w-4 h-4" />
            </Link>

          </div>

        </div>
      </header>

      {/* 2. MAIN LAYOUT WITH LEFT SIDEBAR + MAIN CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR (EXACT STYLE FROM SCREENSHOT) */}
        <aside className="w-64 sm:w-72 bg-white border-r border-slate-200 flex flex-col justify-between p-4 flex-shrink-0 min-h-[calc(100vh-57px)]">
          
          <div className="space-y-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              เมนูการจัดการ
            </div>

            <nav className="space-y-1.5">
              
              {/* Menu Item 1: Case Management */}
              <button
                onClick={() => setActiveSidebarMenu("cases")}
                className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between group ${
                  activeSidebarMenu === "cases"
                    ? "bg-[#EBF5FF] border border-blue-200/80 shadow-2xs"
                    : "hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    activeSidebarMenu === "cases" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-snug">
                      จัดการเอกสารและความรู้
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                      นำเข้า Versioning, Workflow และ OCR
                    </div>
                  </div>
                </div>
                {activeSidebarMenu === "cases" && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                )}
              </button>

              {/* Menu Item 2: External Integrations */}
              <button
                onClick={() => setActiveSidebarMenu("integrations")}
                className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between group ${
                  activeSidebarMenu === "integrations"
                    ? "bg-[#EBF5FF] border border-blue-200/80 shadow-2xs"
                    : "hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    activeSidebarMenu === "integrations" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-snug">
                      แหล่งข้อมูลเชื่อมต่อ
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                      DXC, e-Saraban, PRAXTICOL
                    </div>
                  </div>
                </div>
                {activeSidebarMenu === "integrations" && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                )}
              </button>

              {/* Menu Item 3: Legal Workflow & SLA */}
              <button
                onClick={() => setActiveSidebarMenu("workflow")}
                className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between group ${
                  activeSidebarMenu === "workflow"
                    ? "bg-[#EBF5FF] border border-blue-200/80 shadow-2xs"
                    : "hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    activeSidebarMenu === "workflow" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-snug">
                      ขั้นตอนและกรอบเวลา SLA
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                      10 ขั้นตอนตามระเบียบ กกต.
                    </div>
                  </div>
                </div>
                {activeSidebarMenu === "workflow" && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                )}
              </button>

              {/* Menu Item 4: Dashboard & BI */}
              <button
                onClick={() => setActiveSidebarMenu("dashboard")}
                className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between group ${
                  activeSidebarMenu === "dashboard"
                    ? "bg-[#EBF5FF] border border-blue-200/80 shadow-2xs"
                    : "hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    activeSidebarMenu === "dashboard" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-snug">
                      สถิติและความปลอดภัย
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                      Dashboard, Top 10 จว., รายงาน
                    </div>
                  </div>
                </div>
                {activeSidebarMenu === "dashboard" && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                )}
              </button>

              {/* Menu Item 5: Citizen Tracking */}
              <button
                onClick={() => setActiveSidebarMenu("citizen")}
                className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between group ${
                  activeSidebarMenu === "citizen"
                    ? "bg-[#EBF5FF] border border-blue-200/80 shadow-2xs"
                    : "hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    activeSidebarMenu === "citizen" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-snug">
                      ติดตามสถานะประชาชน
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                      ค้นหาด้วยเลขคดี / ThaID
                    </div>
                  </div>
                </div>
                {activeSidebarMenu === "citizen" && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                )}
              </button>

            </nav>
          </div>

          {/* Bottom Floating Engine Card */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3 mt-4">
            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
              ECT
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">ECT Case Engine v2.6</div>
              <div className="text-[10px] text-slate-400">DXC & PRAXTICOL Connected</div>
            </div>
          </div>

        </aside>

        {/* MAIN CONTENT WORKSPACE AREA */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* Breadcrumb & Top Action */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">จัดการเอกสารและความรู้</h2>
              <div className="text-[11px] text-slate-400">นำเข้า Versioning, Workflow และ OCR</div>
            </div>

            <button
              onClick={() => setActiveSidebarMenu("citizen")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D9488] hover:bg-[#0f766e] text-white text-xs font-bold transition-all shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>ทดสอบ Chatbot AI</span>
            </button>
          </div>

          {syncMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{syncMessage}</span>
            </div>
          )}

          {/* LARGE TITLE & ACTION BUTTONS */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Knowledge Base & Document Management (ระบบบริหารจัดการเอกสารและความรู้)
              </h1>
              <p className="text-xs text-slate-500 font-light max-w-3xl leading-relaxed">
                นำเข้าเอกสาร PDF, Office, รูปภาพ, วิดีโอ ควบคุมการแบ่ง Chunking, จัดการเวอร์ชัน, ตรวจสอบเอกสารซ้ำ, อนุมัติ Workflow และสิทธิ์การเข้าถึง (RBAC)
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-shrink-0">
              <button
                onClick={() => alert("ระบบกำลังประมวลผลการนำเข้าข้อมูลแบบ Batch")}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Batch Upload</span>
              </button>

              <button
                onClick={() => setIsNewModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0f766e] text-white font-bold text-xs transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>นำเข้าเอกสารใหม่ (Upload Document)</span>
              </button>
            </div>
          </div>

          {/* 4 KPI METRIC STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">เอกสารทั้งหมด</span>
                <FileText className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">{totalCases}</div>
                <div className="text-[11px] font-bold text-emerald-600 mt-1">พร้อมใช้งานในระบบ RAG</div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Vector Chunks</span>
                <Layers className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">427</div>
                <div className="text-[11px] font-bold text-purple-600 mt-1">BGE-M3 Multilingual Vector</div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">รอตรวจสอบ/อนุมัติ</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-600">{nearDueCases}</div>
                <div className="text-[11px] font-bold text-amber-600 mt-1">Workflow Approval Queue</div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">สแกนความปลอดภัย</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600">100% Clean</div>
                <div className="text-[11px] font-bold text-emerald-600 mt-1">Antivirus & DLP Verified</div>
              </div>
            </div>

          </div>

          {/* VIEW SWITCHER BASED ON SIDEBAR MENU */}
          {activeSidebarMenu === "dashboard" ? (
            <DashboardView
              cases={cases}
              onSelectCase={(c) => setSelectedCase(c)}
              onViewAllCases={() => setActiveSidebarMenu("cases")}
            />
          ) : activeSidebarMenu === "workflow" ? (
            <WorkflowVisualizer />
          ) : activeSidebarMenu === "citizen" ? (
            <CitizenTrackingView
              cases={cases}
              onSelectCase={(c) => setSelectedCase(c)}
            />
          ) : (
            /* DEFAULT VIEW: CASES DIRECTORY TABLE */
            <>
              {/* TABS ROW */}
              <div className="flex items-center gap-3 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-full font-bold transition-all ${
                    activeTab === "all"
                      ? "bg-[#E6FFFA] text-[#0D9488] border border-[#0D9488]/30 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  คลังเอกสารทั้งหมด ({totalCases})
                </button>

                <button
                  onClick={() => setActiveTab("pending")}
                  className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === "pending"
                      ? "bg-[#E6FFFA] text-[#0D9488] border border-[#0D9488]/30 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>รอการตรวจสอบ/อนุมัติ (Workflow)</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                    {nearDueCases}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("overdue")}
                  className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === "overdue"
                      ? "bg-[#E6FFFA] text-[#0D9488] border border-[#0D9488]/30 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>เกินกำหนดเวลา SLA</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                    {overdueCases}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("audit")}
                  className={`px-4 py-2 rounded-full font-bold transition-all ${
                    activeTab === "audit"
                      ? "bg-[#E6FFFA] text-[#0D9488] border border-[#0D9488]/30 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  ประวัติและ Audit Logs (3)
                </button>
              </div>

              {/* SEARCH & FILTER CONTROLS BAR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                
                <div className="lg:col-span-2 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="ค้นหาเอกสารตามชื่อ, ไฟล์, หรือ Tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0D9488] shadow-2xs"
                  />
                </div>

                <div className="relative">
                  <select
                    value={selectedMission}
                    onChange={(e) => setSelectedMission(e.target.value)}
                    className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#0D9488] shadow-2xs appearance-none cursor-pointer"
                  >
                    <option value="ALL">ทุกหมวดหมู่ (All)</option>
                    <option value="การจัดการเลือกตั้ง">การจัดการเลือกตั้ง</option>
                    <option value="สืบสวนและไต่สวน">สืบสวนและไต่สวน</option>
                    <option value="พรรคการเมือง">พรรคการเมือง</option>
                    <option value="บริหารทั่วไป">บริหารทั่วไป</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#0D9488] shadow-2xs appearance-none cursor-pointer"
                  >
                    <option value="ALL">ทุกสถานะ (All Status)</option>
                    <option value="NORMAL">ปกติ (Normal)</option>
                    <option value="NEAR_DUE">ใกล้ครบกำหนด (Near Due)</option>
                    <option value="OVERDUE">เกิน SLA (Overdue)</option>
                    <option value="COMPLETED">เสร็จสิ้น (Completed)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={selectedPrivacy}
                    onChange={(e) => setSelectedPrivacy(e.target.value)}
                    className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#0D9488] shadow-2xs appearance-none cursor-pointer"
                  >
                    <option value="ALL">ทุกชั้นความลับ</option>
                    <option value="INTERNAL">INTERNAL</option>
                    <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                    <option value="PUBLIC">PUBLIC</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>

              </div>

              {/* ENTERPRISE DATA TABLE */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    
                    <thead className="bg-[#F8FAFC] text-slate-500 border-b border-slate-200 text-[11px] font-bold">
                      <tr>
                        <th className="p-4">รหัส / ชื่อเอกสาร</th>
                        <th className="p-4">หมวดหมู่ & หน่วยงาน</th>
                        <th className="p-4 text-center">ชั้นความลับ</th>
                        <th className="p-4 text-center">เวอร์ชัน</th>
                        <th className="p-4 text-center">สถานะ INDEXING</th>
                        <th className="p-4 text-center">สถานะ WORKFLOW</th>
                        <th className="p-4">อายุเอกสาร (RETENTION)</th>
                        <th className="p-4 text-center">การจัดการ (ACTIONS)</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {filteredCases.slice(0, 8).map((c, index) => (
                        <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                          
                          {/* Col 1 */}
                          <td className="p-4 max-w-sm">
                            <div className="flex items-start gap-3">
                              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="space-y-1">
                                <div 
                                  onClick={() => setSelectedCase(c)}
                                  className="font-bold text-slate-900 hover:text-[#0D9488] cursor-pointer transition-colors leading-snug"
                                >
                                  {c.allegation}: {c.details.substring(0, 48)}...
                                </div>
                                <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                                  <span className="font-mono">{c.caseNumber}</span>
                                  <span>·</span>
                                  <span>{c.missionGroup} ({c.province})</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <span>Clean · DXC Linkage Verified</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Col 2 */}
                          <td className="p-4 text-xs text-slate-700">
                            <div className="font-semibold text-slate-800">{c.missionGroup}</div>
                            <div className="text-[10px] text-slate-400">สนง.กกต.จว. {c.province} ({c.constituency})</div>
                          </td>

                          {/* Col 3 */}
                          <td className="p-4 text-center">
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                              {index % 2 === 0 ? "INTERNAL" : "PUBLIC"}
                            </span>
                          </td>

                          {/* Col 4 */}
                          <td className="p-4 text-center">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold flex items-center justify-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>v{index === 0 ? "2.4" : index === 1 ? "3.1" : "1.0"}</span>
                            </span>
                          </td>

                          {/* Col 5 */}
                          <td className="p-4 text-center">
                            <span className="px-3 py-1 rounded-full bg-[#E6FFFA] text-[#0D9488] border border-[#0D9488]/30 text-[10px] font-bold inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{142 - index * 12} Chunks</span>
                            </span>
                          </td>

                          {/* Col 6 */}
                          <td className="p-4 text-center">
                            <div className="inline-flex items-center justify-between gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                              <span>อนุมัติ (Approved)</span>
                              <ChevronDown className="w-3 h-3 text-emerald-600" />
                            </div>
                          </td>

                          {/* Col 7 */}
                          <td className="p-4 text-xs text-slate-700">
                            <div className="font-semibold text-slate-800">
                              {c.slaStatus === "OVERDUE" ? "เกินกำหนด SLA" : `เหลือ ${c.remainingDays} วัน`}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              หมดอายุ 2569-03-15
                            </div>
                          </td>

                          {/* Col 8 */}
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2 text-slate-400">
                              <button
                                onClick={() => setSelectedCase(c)}
                                title="แก้ไข / ดูสำนวน"
                                className="p-1 hover:text-[#0D9488] transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={handleTriggerSync}
                                title="Sync ข้อมูล"
                                className="p-1 hover:text-blue-600 transition-colors"
                              >
                                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                              </button>
                              <button
                                onClick={() => alert(`ลบสำนวน: ${c.caseNumber}`)}
                                title="ลบเอกสาร"
                                className="p-1 hover:text-rose-600 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>

                {/* Pagination */}
                <div className="p-4 bg-[#F8FAFC] border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <div>
                    แสดง 8 จากทั้งหมด <strong className="text-slate-800">{filteredCases.length}</strong> รายการ
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50">
                      ย้อนกลับ
                    </button>
                    <span className="px-3 py-1 rounded-lg bg-[#0D9488] text-white font-bold">1</span>
                    <button className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100">
                      2
                    </button>
                    <button className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100">
                      ถัดไป
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

        </main>

      </div>

      {/* Electronic Case File Modal (e-Dossier) */}
      {selectedCase && (
        <CaseDetailModal
          caseItem={selectedCase}
          onClose={() => setSelectedCase(null)}
        />
      )}

      {/* New Complaint Form Modal */}
      {isNewModalOpen && (
        <NewComplaintForm
          onClose={() => setIsNewModalOpen(false)}
          onAddCase={handleAddCase}
        />
      )}

    </div>
  );
}
