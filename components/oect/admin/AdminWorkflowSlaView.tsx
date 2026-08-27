"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Edit3,
  FileCheck2,
  GitBranch,
  History,
  Layers3,
  Plus,
  RefreshCw,
  Scale,
  ShieldCheck,
  Sliders,
} from "lucide-react";
import { WORKFLOW_STEPS } from "@/components/oect/complaintDomain";
import { WORKFLOW_VERSIONS, type WorkflowVersion } from "@/components/oect/rbacDomain";

interface StepSlaConfig {
  id: number;
  title: string;
  publicTitle: string;
  section: string;
  roleOwner: string;
  legalBasis: string;
  slaDays: number;
}

const INITIAL_STEP_CONFIGS: StepSlaConfig[] = [
  {
    id: 1,
    title: "ตรวจคำร้องและมอบหมายผู้รับผิดชอบ",
    publicTitle: "ตรวจความครบถ้วนของคำร้อง",
    section: "สนง.กกต.จว.",
    roleOwner: "พนักงานรับคำร้อง / พนักงานตรวจคำร้อง",
    legalBasis: "ระเบียบฯ ข้อ ๒๒, ข้อ ๒๓ และข้อ ๒๖(๒)",
    slaDays: 3,
  },
  {
    id: 2,
    title: "ผอ.กกต.จว. พิจารณาสั่งรับ/ไม่รับ",
    publicTitle: "พิจารณาสั่งรับคำร้อง",
    section: "สนง.กกต.จว.",
    roleOwner: "ผอ.สนง.กกต.จว.",
    legalBasis: "ระเบียบฯ ข้อ ๒๗ และข้อ ๒๘",
    slaDays: 3,
  },
  {
    id: 3,
    title: "สืบสวนและไต่สวน (สนง.กกต.จว.)",
    publicTitle: "สืบสวนและไต่สวน",
    section: "สนง.กกต.จว.",
    roleOwner: "คณะกรรมการสืบสวนและไต่สวน",
    legalBasis: "ระเบียบฯ ข้อ ๔๑ (๒๐ วัน ขยายได้ครั้งละ ๑๕ วัน รวมไม่เกิน ๙๐ วัน)",
    slaDays: 90,
  },
  {
    id: 4,
    title: "ผอ.กกต.จว. มีความเห็นและส่งส่วนกลาง",
    publicTitle: "จัดส่งสำนวนให้ส่วนกลาง",
    section: "สนง.กกต.จว.",
    roleOwner: "ผอ.สนง.กกต.จว.",
    legalBasis: "ระเบียบฯ ข้อ ๕๕",
    slaDays: 5,
  },
  {
    id: 5,
    title: "ตรวจคำร้อง/สำนวนส่วนกลาง (๔ ลำดับชั้น)",
    publicTitle: "ตรวจคำร้องหรือสำนวนส่วนกลาง",
    section: "สนง.กกต. ส่วนกลาง",
    roleOwner: "ผู้ตรวจสำนวนส่วนกลาง (ผอ.ฝ่าย → รอง ผอ.สำนัก → ผอ.สำนัก → ลธ.)",
    legalBasis: "ระเบียบฯ ข้อ ๕๘ และข้อ ๖๐ (คำร้อง ๓๐ วัน / สำนวน ๖๐ วัน)",
    slaDays: 60,
  },
  {
    id: 6,
    title: "เลขาธิการ กกต. มีความเห็น",
    publicTitle: "เสนอความเห็นต่อผู้มีอำนาจ",
    section: "สนง.กกต. ส่วนกลาง",
    roleOwner: "เลขาธิการ กกต.",
    legalBasis: "ระเบียบฯ ข้อ ๖๑ (คำร้อง ๕ วัน / สำนวน ๙ วัน)",
    slaDays: 9,
  },
  {
    id: 7,
    title: "คณะอนุวินิจฉัยมีความเห็น",
    publicTitle: "คณะอนุวินิจฉัยพิจารณา",
    section: "สนง.กกต. ส่วนกลาง",
    roleOwner: "เลขาคณะอนุวินิจฉัย / คณะอนุกรรมการวินิจฉัย",
    legalBasis: "ระเบียบฯ ข้อ ๗๒ (กรอบเวลา ๙๐ วัน)",
    slaDays: 90,
  },
  {
    id: 8,
    title: "กกต. วินิจฉัยชี้ขาด",
    publicTitle: "กกต. พิจารณาวินิจฉัย",
    section: "สนง.กกต. ส่วนกลาง",
    roleOwner: "คณะกรรมการการเลือกตั้ง (กกต.)",
    legalBasis: "ระเบียบฯ ข้อ ๘๐ (กรอบเวลา ๙๐ วัน)",
    slaDays: 90,
  },
  {
    id: 9,
    title: "จัดทำคำวินิจฉัย กกต.",
    publicTitle: "จัดทำคำวินิจฉัย",
    section: "สนง.กกต. ส่วนกลาง",
    roleOwner: "เลขาธิการ กกต. / สำนักวินิจฉัยและคดี",
    legalBasis: "ระเบียบฯ ข้อ ๘๔ (กรอบเวลา ๖๐ วัน)",
    slaDays: 60,
  },
  {
    id: 10,
    title: "แจ้งผู้ร้อง/ผู้ถูกร้องและปิดเรื่อง",
    publicTitle: "แจ้งผลและปิดเรื่อง",
    section: "สนง.กกต. ส่วนกลาง / สนง.กกต.จว.",
    roleOwner: "ลธ.กกต. / ผอ.สนง.กกต.จว.",
    legalBasis: "ระเบียบฯ ข้อ ๘๕ (ภายใน ๑๕ วัน)",
    slaDays: 15,
  },
];

const SLA_STORAGE_KEY = "oect-sla-configs-v2";

interface AdminWorkflowSlaViewProps {
  onNotify?: (text: string) => void;
}

export default function AdminWorkflowSlaView({ onNotify }: AdminWorkflowSlaViewProps) {
  const [steps, setSteps] = useState<StepSlaConfig[]>(INITIAL_STEP_CONFIGS);
  const [versions, setVersions] = useState<WorkflowVersion[]>(WORKFLOW_VERSIONS);
  const [activeTab, setActiveTab] = useState<"sla" | "versions">("sla");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SLA_STORAGE_KEY);
      if (stored) {
        setSteps(JSON.parse(stored));
      }
    } catch {
      // fallback
    }
  }, []);

  const notify = (msg: string) => {
    if (onNotify) onNotify(msg);
  };

  const handleDayChange = (stepId: number, newDays: number) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, slaDays: Math.max(1, newDays) } : s))
    );
  };

  const handleSaveSla = () => {
    try {
      localStorage.setItem(SLA_STORAGE_KEY, JSON.stringify(steps));
    } catch {
      // ignore
    }
    notify("บันทึกการปรับปรุงกรอบเวลา SLA ทั้ง 10 ขั้นตอนเรียบร้อยแล้ว");
  };

  const handleResetSla = () => {
    setSteps(INITIAL_STEP_CONFIGS);
    try {
      localStorage.setItem(SLA_STORAGE_KEY, JSON.stringify(INITIAL_STEP_CONFIGS));
    } catch {
      // ignore
    }
    notify("คืนค่าระยะเวลา SLA เป็นค่ามาตรฐานตามระเบียบ กกต. แล้ว");
  };

  const provincialTotalDays = steps.filter((s) => s.id <= 4).reduce((sum, s) => sum + s.slaDays, 0);
  const centralTotalDays = steps.filter((s) => s.id > 4).reduce((sum, s) => sum + s.slaDays, 0);
  const totalSlaDays = provincialTotalDays + centralTotalDays;

  return (
    <div className="space-y-6 pb-14">
      {/* Top Metric Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-slate-400">
            <span>Workflow Version</span>
            <GitBranch className="h-4 w-4 text-blue-700" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">v1.3</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">ACTIVE</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400">ระเบียบ กกต. สืบสวนฯ ๒๕๖๖ (ฉบับที่ ๓)</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-blue-700">
            <span>ขั้นตอนกระบวนงาน</span>
            <Layers3 className="h-4 w-4" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-800">10</span>
            <span className="text-xs text-slate-500">ขั้นตอนหลัก</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400">จังหวัด 4 ขั้น + ส่วนกลาง 6 ขั้น</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-purple-700">
            <span>รวม SLA ระดับจังหวัด</span>
            <Clock className="h-4 w-4" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-800">{provincialTotalDays}</span>
            <span className="text-xs text-slate-500">วันทำการสูงสุด</span>
          </div>
          <div className="mt-2 text-[10px] text-purple-600">รับคำร้อง สั่งรับ สืบสวน ส่งส่วนกลาง</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-emerald-700">
            <span>รวม SLA ทั้งกระบวนงาน</span>
            <Scale className="h-4 w-4" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-800">{totalSlaDays}</span>
            <span className="text-xs text-slate-500">วันทำการ</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-600">ตั้งแต่รับคำร้องจนถึงแจ้งผลและปิดเรื่อง</div>
        </div>
      </div>

      {/* Main Section */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Navigation Tabs */}
        <div className="flex flex-col border-b border-slate-200 bg-slate-50/70 p-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("sla")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                activeTab === "sla"
                  ? "bg-[#1B3F8B] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Sliders className="h-4 w-4" />
              <span>กำหนดกรอบเวลา SLA 10 ขั้นตอน</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("versions")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                activeTab === "versions"
                  ? "bg-[#1B3F8B] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <History className="h-4 w-4" />
              <span>ประวัติและ Version ของกระบวนงาน ({versions.length})</span>
            </button>
          </div>

          {activeTab === "sla" && (
            <div className="mt-3 flex items-center gap-2 sm:mt-0">
              <button
                type="button"
                onClick={handleResetSla}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>คืนค่ามาตรฐาน</span>
              </button>
              <button
                type="button"
                onClick={handleSaveSla}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1B3F8B] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#15326f]"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>บันทึกการตั้งค่า SLA</span>
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: SLA EDITOR */}
        {activeTab === "sla" && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-xs leading-relaxed text-amber-900">
              <strong>ข้อควรระวัง:</strong> การแก้ไขระยะเวลา SLA ในหน้านี้จะมีผลเฉพาะสำนวนที่รับเข้าใหม่
              โดยไม่ส่งผลกระทบย้อนหลังต่อสำนวนที่กำลังดำเนินการอยู่ในระบบ ตามหลักการ Versioning ของกระบวนงาน
            </div>

            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
              {steps.map((step) => {
                const isProvincial = step.id <= 4;
                return (
                  <div
                    key={step.id}
                    className="grid gap-4 p-4 sm:grid-cols-[44px_1.5fr_1.2fr_140px] sm:items-center hover:bg-slate-50/70 transition"
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
                        isProvincial ? "bg-blue-50 text-blue-800" : "bg-emerald-50 text-emerald-800"
                      }`}
                    >
                      {step.id}
                    </span>

                    <div>
                      <div className="text-xs font-bold text-slate-900">{step.title}</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">
                        สำหรับผู้ร้อง: <span className="font-semibold text-blue-800">{step.publicTitle}</span>
                      </div>
                      <div className="mt-1 font-mono text-[10px] text-slate-400">{step.legalBasis}</div>
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          isProvincial ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {step.section}
                      </span>
                      <div className="mt-1 text-[10px] text-slate-600 font-medium">{step.roleOwner}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={180}
                        value={step.slaDays}
                        onChange={(e) => handleDayChange(step.id, Number(e.target.value))}
                        className="w-20 rounded-xl border border-slate-200 bg-white p-2 text-center text-xs font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                      <span className="text-xs text-slate-500 font-semibold">วัน</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: WORKFLOW VERSIONING */}
        {activeTab === "versions" && (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">ประวัติและสถานะเวอร์ชัน Workflow (Versioning Governance)</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  กำกับขั้นตอนและกฎหมายที่บังคับใช้ เพื่อให้สำนวนคดีที่เกิดขึ้นในแต่ละช่วงเวลาอ้างอิงกฎเกณฑ์ที่ถูกต้อง
                </p>
              </div>
              <button
                type="button"
                onClick={() => notify("สร้างแบบร่าง Version ใหม่ (Draft v1.4) แล้ว")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
              >
                <Plus className="h-4 w-4 text-blue-700" />
                <span>ร่าง Version ใหม่</span>
              </button>
            </div>

            <div className="space-y-4">
              {versions.map((ver) => (
                <div
                  key={ver.version}
                  className={`rounded-2xl border p-5 shadow-xs transition ${
                    ver.status === "ACTIVE"
                      ? "border-emerald-300 bg-emerald-50/30 ring-1 ring-emerald-200"
                      : ver.status === "DRAFT"
                      ? "border-amber-300 bg-amber-50/20"
                      : "border-slate-200 bg-slate-50/60 opacity-70"
                  }`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold text-[#1B3F8B]">{ver.version}</span>
                      <h4 className="text-sm font-bold text-slate-900">{ver.name}</h4>
                    </div>

                    <span
                      className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        ver.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-800"
                          : ver.status === "DRAFT"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {ver.status === "ACTIVE" ? "● เผยแพร่ใช้งานจริง" : ver.status === "DRAFT" ? "ร่างเตรียมประกาศ" : "ยกเลิกแล้ว"}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-3 text-xs sm:grid-cols-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">วันที่มีผลบังคับใช้</span>
                      <div className="font-medium text-slate-800">{ver.effectiveDate}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">ฐานอำนาจกฎหมาย</span>
                      <div className="font-medium text-slate-800">{ver.ruleReference}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">ผู้เผยแพร่ / กำกับ</span>
                      <div className="font-medium text-slate-800">{ver.publishedBy}</div>
                    </div>
                  </div>

                  <div className="mt-3 border-t border-slate-200/70 pt-3 text-xs text-slate-600">
                    <strong className="text-slate-800">บันทึกการเปลี่ยนแปลง:</strong> {ver.notes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
