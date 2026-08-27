"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileText,
  Gavel,
  MapPin,
  PlusCircle,
  Scale,
  SearchCheck,
  Send,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { WORKFLOW_STEPS as DOMAIN_WORKFLOW_STEPS, getSlaLabel, type ComplaintItem } from "@/components/oect/complaintDomain";

import { getScopedCases, type SystemRoleId } from "@/components/oect/rbacDomain";

interface RoleWorkspaceViewProps {
  cases: ComplaintItem[];
  roleId: string;
  userProvince?: string;
  onSelectCase: (caseItem: ComplaintItem) => void;
  onUpdateCase?: (updated: ComplaintItem) => void;
}

export const OFFICER_ROLES = [
  { id: "intake", label: "พนักงานรับคำร้อง", scope: "รับเรื่องและออกใบรับคำร้อง", stage: "รับคำร้อง" },
  { id: "review-1", label: "พนักงานตรวจคำร้อง ชั้น 1", scope: "ตรวจองค์ประกอบตามข้อ 22", stage: "ตรวจคำร้องชั้น 1" },
  { id: "review-2", label: "พนักงานตรวจคำร้อง ชั้น 2", scope: "ตรวจข้อเท็จจริงตามข้อ 27/28", stage: "ตรวจคำร้องชั้น 2" },
  { id: "director", label: "ลธ./ผอ.สนง.กกต.จว.", scope: "สั่งรับ ไม่รับ หรือยกคำร้อง", stage: "พิจารณาสั่งรับ" },
  { id: "investigation", label: "คณะกรรมการสืบสวนและไต่สวน", scope: "สืบสวน บันทึกผล และขยายเวลา", stage: "สืบสวน/ไต่สวน" },
  { id: "sequential", label: "ผู้ตรวจสำนวนส่วนกลาง", scope: "ผอ.ฝ่าย → รอง ผอ.สำนัก → ผอ.สำนัก → ลธ.", stage: "ตรวจสำนวนส่วนกลาง" },
  { id: "subcommittee", label: "เลขาคณะอนุวินิจฉัย", scope: "โอนเรื่อง นัดประชุม และบันทึกความเห็น", stage: "คณะอนุวินิจฉัย" },
  { id: "commission", label: "กกต.", scope: "พิจารณาและวินิจฉัยชี้ขาด", stage: "กกต. วินิจฉัย" },
  { id: "secretary", label: "ลธ.กกต. จัดทำคำวินิจฉัย", scope: "จัดทำคำวินิจฉัยและแจ้งผล", stage: "จัดทำและแจ้งคำวินิจฉัย" },
] as const;

const ADMIN_ROLE = { id: "admin", label: "ผู้ดูแลระบบ", scope: "ตรวจสอบคิวงานได้ทุกขั้นตอน", stage: "ทุกขั้นตอน" } as const;

const WORKFLOW_OWNERS = ["พนง./พสต.", "ลธ./ผอ.", "คณะสืบสวนฯ", "ผอ.กกต.จว.", "4 ลำดับชั้น", "ลธ.กกต.", "คณะอนุฯ", "กกต.", "ลธ.กกต.", "ผอ./เจ้าของเรื่อง"];
const WORKFLOW_STEPS = DOMAIN_WORKFLOW_STEPS.map((step, index) => ({ short: step.publicTitle, owner: WORKFLOW_OWNERS[index], sla: step.slaLabel }));

const ROLE_STAGE_IDS: Record<string, number[]> = {
  intake: [1],
  "review-1": [1],
  "review-2": [1],
  director: [2, 4],
  investigation: [3],
  sequential: [5, 6],
  subcommittee: [7],
  commission: [8],
  secretary: [9],
  admin: [1, 2, 3, 4, 5, 6, 7, 8, 9],
};

const CHECKLIST = [
  "ระบุชื่อและที่อยู่ของผู้ร้องครบถ้วน",
  "ระบุผู้ถูกร้องและเขตเลือกตั้งชัดเจน",
  "มีข้อเท็จจริง พฤติการณ์ วัน เวลา และสถานที่",
  "มีลายมือชื่อหรือยืนยันตัวตนตามช่องทางที่กำหนด",
  "ยื่นภายในระยะเวลาที่กฎหมายกำหนด",
];

export default function RoleWorkspaceView({ cases, roleId, userProvince = "เชียงใหม่", onSelectCase, onUpdateCase }: RoleWorkspaceViewProps) {
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<number[]>([0, 1, 2, 4]);
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState<string>(userProvince);

  const role = roleId === "admin" ? ADMIN_ROLE : OFFICER_ROLES.find((item) => item.id === roleId) ?? OFFICER_ROLES[0];
  
  // Apply RBAC Data Scope
  const scopedCases = useMemo(() => {
    return getScopedCases(selectedProvinceFilter, roleId as SystemRoleId, cases);
  }, [selectedProvinceFilter, roleId, cases]);

  const roleCases = useMemo(
    () =>
      [...scopedCases]
        .filter((item) => item.slaStatus !== "COMPLETED" && (ROLE_STAGE_IDS[roleId] ?? []).includes(item.stageId))
        .sort((a, b) => a.remainingDays - b.remainingDays),
    [scopedCases, roleId],
  );
  const queueCases = roleCases.slice(0, 5);
  const nearDueCount = roleCases.filter((item) => item.slaStatus === "NEAR_DUE").length;
  const overdueCount = roleCases.filter((item) => item.slaStatus === "OVERDUE").length;
  const activeCase = queueCases.find((item) => item.id === selectedCaseId) ?? queueCases[0];
  const activeStage = Math.min(Math.max(activeCase?.stageId ?? 1, 1), WORKFLOW_STEPS.length);

  const submitAction = (message: string, targetStageId?: number) => {
    if (activeCase && targetStageId && onUpdateCase) {
      const updated: ComplaintItem = {
        ...activeCase,
        stageId: targetStageId,
      };
      onUpdateCase(updated);
    }
    setActionMessage(message);
    window.setTimeout(() => setActionMessage(null), 2600);
  };

  return (
    <div className="space-y-5 pb-14">
      {actionMessage && (
        <div className="fixed right-4 top-20 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-emerald-200 bg-white p-4 text-xs text-emerald-900 shadow-xl">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div><strong className="block">บันทึกการดำเนินการแล้ว</strong>{actionMessage}</div>
        </div>
      )}

      <section className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-blue-700">
                <ShieldCheck className="h-4 w-4" /> Role-based workspace
              </div>
              <h2 className="mt-2 text-xl font-bold text-slate-950">{role.label}</h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">{role.scope} · ระบบจะแสดงเฉพาะคิวงานและคำสั่งที่บทบาทนี้มีสิทธิ์ดำเนินการ</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-700">
                <MapPin className="h-3.5 w-3.5 text-blue-700" /> ขอบเขต: {selectedProvinceFilter} {["intake", "review-1", "review-2", "director", "investigation"].includes(roleId) ? "(เฉพาะพื้นที่ จว.)" : "(ทั่วประเทศ)"}
              </span>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-800 ring-1 ring-blue-200">
                <UserCheck className="h-3.5 w-3.5" /> ขั้นรับผิดชอบ: {role.stage}
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Metric label="คิวที่รอดำเนินการ" value={String(roleCases.length)} helper={`${nearDueCount + overdueCount} เรื่องต้องเร่งรัด`} tone="blue" />
            <Metric label="ใกล้ครบกำหนด" value={String(nearDueCount)} helper="เหลือไม่เกิน 5 วัน" tone="amber" />
            <Metric label="เกินกำหนด" value={String(overdueCount)} helper="ต้องรายงานเหตุผล" tone="rose" />
          </div>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-950">SLA ขั้นตอนปัจจุบัน</span>
            <Clock3 className="h-5 w-5 text-rose-600" />
          </div>
          <div className="mt-5 flex items-end gap-2">
            <span className="text-4xl font-bold tracking-tight text-rose-700">{Math.abs(activeCase?.remainingDays ?? 2)}</span>
            <span className="pb-1 text-sm font-semibold text-rose-800">{(activeCase?.remainingDays ?? 2) < 0 ? "วันเกินกำหนด" : "วันคงเหลือ"}</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-rose-100"><div className="h-full w-[78%] rounded-full bg-rose-600" /></div>
          <p className="mt-3 text-[11px] leading-5 text-rose-800">ระบบจะแจ้งเตือนผู้รับผิดชอบและผู้บังคับบัญชาเมื่อเหลือน้อยกว่า 5 วัน</p>
        </div>
      </section>

      <section className="grid gap-5 2xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-950">คิวงานของฉัน</h3>
                <p className="mt-1 text-[10px] text-slate-500">เรียงตามความเสี่ยง SLA</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">{queueCases.length} เรื่อง</span>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {queueCases.map((caseItem) => {
              const isActive = activeCase?.id === caseItem.id;
              return (
                <button
                  key={caseItem.id}
                  type="button"
                  onClick={() => setSelectedCaseId(caseItem.id)}
                  className={`w-full p-4 text-left transition ${isActive ? "bg-blue-50" : "hover:bg-slate-50"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-xs font-bold text-slate-950">{caseItem.caseNumber}</div>
                      <div className="mt-1 truncate text-[11px] text-slate-600">{caseItem.allegation}</div>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400"><FileText className="h-3 w-3" /> จ.{caseItem.province} · {caseItem.currentStage}</div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${caseItem.slaStatus === "OVERDUE" ? "bg-rose-100 text-rose-700" : caseItem.slaStatus === "NEAR_DUE" ? "bg-amber-100 text-amber-700" : caseItem.slaStatus === "COMPLETED" ? "bg-slate-100 text-slate-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {getSlaLabel(caseItem)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-w-0 space-y-5">
          {activeCase && (
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#1B3F8B] px-3 py-1 text-[11px] font-bold text-white">{activeCase.caseNumber}</span>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-800 ring-1 ring-amber-200">{activeCase.currentSection}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-slate-950">{activeCase.allegation}</h3>
                  <p className="mt-1 text-xs text-slate-500">ผู้ร้อง {activeCase.complainants} · ผู้ถูกร้อง {activeCase.respondent}</p>
                </div>
                <button type="button" onClick={() => onSelectCase(activeCase)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
                  เปิดรายละเอียดและบันทึกคำสั่ง <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="overflow-x-auto px-5 py-4">
                <div className="flex min-w-[900px] items-start">
                  {WORKFLOW_STEPS.map((step, index) => {
                    const position = index + 1;
                    const isDone = position < activeStage;
                    const isCurrent = position === activeStage;
                    return (
                      <div key={step.short} className="flex min-w-0 flex-1 items-start">
                        <div className="min-w-0 flex-1 text-center">
                          <div className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold ${isDone ? "bg-emerald-600 text-white" : isCurrent ? "bg-blue-700 text-white ring-4 ring-blue-100" : "bg-slate-100 text-slate-400"}`}>
                            {isDone ? <Check className="h-4 w-4" /> : position}
                          </div>
                          <div className={`mt-2 text-[10px] font-bold ${isCurrent ? "text-blue-800" : "text-slate-600"}`}>{step.short}</div>
                          <div className="mt-0.5 text-[9px] text-slate-400">{step.sla}</div>
                        </div>
                        {index < WORKFLOW_STEPS.length - 1 && <div className={`mt-4 h-0.5 w-4 shrink-0 ${isDone ? "bg-emerald-400" : "bg-slate-200"}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          <RoleTaskPanel
            roleId={role.id}
            checkedItems={checkedItems}
            onToggleCheck={(index) => setCheckedItems((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index])}
            onSubmit={submitAction}
            adminStats={{ workflowSteps: WORKFLOW_STEPS.length, openCases: roleCases.length, officers: new Set(cases.map((item) => item.officer)).size }}
          />
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, helper, tone }: { label: string; value: string; helper: string; tone: "blue" | "amber" | "rose" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
  };
  return (
    <div className={`rounded-2xl p-4 ${tones[tone]}`}>
      <div className="text-[10px] font-bold uppercase tracking-wide opacity-75">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      <div className="mt-1 text-[10px] opacity-80">{helper}</div>
    </div>
  );
}

function RoleTaskPanel({
  roleId,
  checkedItems,
  onToggleCheck,
  onSubmit,
  adminStats,
}: {
  roleId: string;
  checkedItems: number[];
  onToggleCheck: (index: number) => void;
  onSubmit: (message: string, targetStageId?: number) => void;
  adminStats: { workflowSteps: number; openCases: number; officers: number };
}) {
  if (roleId === "review-1" || roleId === "intake") {
    return (
      <TaskShell icon={ClipboardCheck} title="ตรวจองค์ประกอบคำร้องตามข้อ 22" subtitle="ต้องบันทึกผลตรวจและเหตุผลก่อนส่งต่อทุกครั้ง">
        <div className="grid gap-3 lg:grid-cols-2">
          {CHECKLIST.map((item, index) => (
            <button key={item} type="button" onClick={() => onToggleCheck(index)} className={`flex items-start gap-3 rounded-xl border p-3 text-left text-xs transition ${checkedItems.includes(index) ? "border-emerald-200 bg-emerald-50 text-emerald-950" : "border-slate-200 bg-white text-slate-600"}`}>
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${checkedItems.includes(index) ? "bg-emerald-600 text-white" : "border border-slate-300 bg-white"}`}>{checkedItems.includes(index) && <Check className="h-3.5 w-3.5" />}</span>
              {item}
            </button>
          ))}
        </div>
        <textarea rows={3} placeholder="บันทึกความเห็นของเจ้าหน้าที่..." className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-blue-500 focus:bg-white" />
        <ActionBar>
          <button type="button" onClick={() => onSubmit("ส่งรายการที่ไม่ครบถ้วนให้ผู้ร้องแก้ไข พร้อมเริ่มนับถอยหลัง 7 วัน")} className="btn-secondary text-amber-800"><AlertTriangle className="h-4 w-4" /> ไม่ครบถ้วน — แจ้งแก้ไข (ข้อ 26(2))</button>
          <button type="button" onClick={() => onSubmit("ตรวจครบถ้วนและส่งต่อไปยัง ผอ.สนง.กกต.จว. แล้ว", 2)} className="btn-primary"><CheckCircle2 className="h-4 w-4" /> ครบถ้วน — เสนอสั่งรับ</button>
        </ActionBar>
      </TaskShell>
    );
  }

  if (roleId === "review-2") {
    return (
      <TaskShell icon={SearchCheck} title="ตรวจข้อเท็จจริง พฤติการณ์ และพยานหลักฐาน" subtitle="ชั้นตรวจตามข้อ 27/28 · SLA 3 วัน">
        <div className="grid gap-3 md:grid-cols-3">
          <EvidenceCard title="ข้อเท็จจริง" value="ครบ 8 รายการ" status="verified" />
          <EvidenceCard title="พยานบุคคล" value="3 ราย" status="verified" />
          <EvidenceCard title="เอกสาร/สื่อ" value="6 ไฟล์" status="review" />
        </div>
        <textarea rows={4} placeholder="สรุปผลตรวจสอบหรือระบุแหล่งข้อมูลที่ต้องตรวจเพิ่มเติม..." className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-blue-500 focus:bg-white" />
        <ActionBar>
          <button type="button" onClick={() => onSubmit("สร้างงานตรวจสอบข้อเท็จจริงเพิ่มเติมและแจ้งผู้รับผิดชอบแล้ว")} className="btn-secondary"><PlusCircle className="h-4 w-4" /> ตรวจข้อเท็จจริงเพิ่ม</button>
          <button type="button" onClick={() => onSubmit("ส่งสรุปผลตรวจให้ ลธ./ผอ. พิจารณาแล้ว", 2)} className="btn-primary"><Send className="h-4 w-4" /> ส่งต่อ ลธ./ผอ.</button>
        </ActionBar>
      </TaskShell>
    );
  }

  if (roleId === "director") {
    return (
      <TaskShell icon={Gavel} title="พิจารณาสั่งรับคำร้องและแต่งตั้งคณะกรรมการสืบสวน (สส. 4/1)" subtitle="อำนาจ ผอ.สนง.กกต.จว. ตามระเบียบ กกต. ข้อ ๒๘ และ ๓๒">
        <div className="grid gap-3 md:grid-cols-3">
          <SummaryCard label="ผลตรวจชั้น 1" value="ครบองค์ประกอบตามข้อ 22" tone="green" />
          <SummaryCard label="ผลตรวจชั้น 2" value="มีมูลเพียงพอตามข้อ 28" tone="blue" />
          <SummaryCard label="ความเห็นกฎหมาย" value="เสนอสั่งรับคำร้อง" tone="amber" />
        </div>

        {/* Investigator Appointment Panel */}
        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
              <Users className="h-4 w-4 text-blue-700" />
              แต่งตั้งคณะกรรมการสืบสวนและไต่สวน (แบบ สส. ๔/๑)
            </span>
            <span className="text-[10px] text-blue-700 font-semibold bg-white px-2 py-0.5 rounded-full border border-blue-200">
              กรอบเวลาปกติ 20 วัน
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 text-xs">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">ประธานกรรมการ *</label>
              <select className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs">
                <option>นายวรากร กรณีศึกษา011 (ชำนาญการพิเศษ)</option>
                <option>นางสุภาวดี วงศ์คำ (ชำนาญการพิเศษ)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">กรรมการ *</label>
              <select className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs">
                <option>นายนรินทร์ เชิดชู (ปฏิบัติการ)</option>
                <option>นายสมศักดิ์ มุ่งมั่น (ชำนาญการ)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">กรรมการและเลขานุการ *</label>
              <select className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs">
                <option>น.ส.กมลชนก พรหมมา (ปฏิบัติการ)</option>
                <option>นายธนดล เจริญทรัพย์ (ปฏิบัติการ)</option>
              </select>
            </div>
          </div>
        </div>

        <textarea rows={3} placeholder="ระบุเหตุผลและข้อสั่งการของ ผอ.สนง.กกต.จว. (ตามระเบียบฯ)..." className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-blue-500 focus:bg-white" />
        <ActionBar>
          <button type="button" onClick={() => onSubmit("บันทึกคำสั่งไม่รับ/ยกคำร้องและรายงานส่วนกลางแล้ว", 4)} className="btn-secondary text-rose-700"><FileCheck2 className="h-4 w-4" /> ไม่รับ / ยกคำร้อง</button>
          <button type="button" onClick={() => onSubmit("ส่งกลับให้พนักงานตรวจข้อเท็จจริงเพิ่มเติมแล้ว", 1)} className="btn-secondary"><SearchCheck className="h-4 w-4" /> ส่งตรวจเพิ่ม</button>
          <button type="button" onClick={() => onSubmit("สั่งรับคำร้องและออกคำสั่งแต่งตั้ง คกก.สืบสวนฯ (สส. 4/1) สำเร็จ", 3)} className="btn-primary"><Gavel className="h-4 w-4" /> สั่งรับและแต่งตั้ง คกก.สืบสวน</button>
        </ActionBar>
      </TaskShell>
    );
  }

  if (roleId === "commission") {
    return (
      <TaskShell icon={Gavel} title="กกต. พิจารณาและมีมติวินิจฉัยชี้ขาด" subtitle="ตามรัฐธรรมนูญและระเบียบ กกต. ข้อ ๗๖-๘๓">
        <div className="grid gap-3 md:grid-cols-3">
          <SummaryCard label="ความเห็น คกก.สืบสวนฯ" value="มีมูลการกระทำผิด" tone="green" />
          <SummaryCard label="ความเห็น 4 ลำดับชั้น" value="เห็นพ้องกับ สนง." tone="blue" />
          <SummaryCard label="มติคณะอนุวินิจฉัย" value="เสนอสั่งเลือกตั้งใหม่" tone="amber" />
        </div>
        <textarea rows={4} placeholder="ระบุเหตุผลและมติที่ประชุม กกต. (มติเอกฉันท์ / มติเสียงข้างมาก)..." className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-blue-500 focus:bg-white" />
        <ActionBar>
          <button type="button" onClick={() => onSubmit("มติ กกต. วินิจฉัยยกคำร้อง", 9)} className="btn-secondary text-slate-700"><FileCheck2 className="h-4 w-4" /> ยกคำร้อง</button>
          <button type="button" onClick={() => onSubmit("มติ กกต. สั่งให้สืบสวนและไต่สวนเพิ่มเติม", 3)} className="btn-secondary text-amber-800"><SearchCheck className="h-4 w-4" /> ไต่สวนเพิ่ม</button>
          <button type="button" onClick={() => onSubmit("มติ กกต. วินิจฉัยสั่งให้เลือกตั้งใหม่ / เพิกถอนสิทธิ", 9)} className="btn-primary"><Gavel className="h-4 w-4" /> บันทึกมติ กกต.</button>
        </ActionBar>
      </TaskShell>
    );
  }

  if (roleId === "investigation") {
    return (
      <TaskShell icon={Users} title="บันทึกผลสืบสวนและไต่สวน" subtitle="กรอบปกติ 20 วัน · ขอขยายได้ 15 + 15 วัน · รายงานก่อนครบไม่น้อยกว่า 5 วัน">
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div>
            <label className="text-xs font-bold text-slate-700">สรุปข้อค้นพบและความเห็น</label>
            <textarea rows={6} placeholder="บันทึกข้อเท็จจริง พยานหลักฐาน และข้อเสนอของคณะกรรมการ..." className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-blue-500 focus:bg-white" />
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-bold text-slate-800">คณะทำงานที่ได้รับมอบหมาย</div>
            {["สุภาวดี วงศ์คำ — ประธาน", "นรินทร์ เชิดชู — กรรมการ", "กมลชนก พรหมมา — เลขานุการ"].map((name) => <div key={name} className="mt-3 flex items-center gap-2 text-[11px] text-slate-600"><span className="h-7 w-7 rounded-full bg-white text-center leading-7 ring-1 ring-slate-200">{name.charAt(0)}</span>{name}</div>)}
          </div>
        </div>
        <ActionBar>
          <button type="button" onClick={() => onSubmit("ส่งคำขอขยายเวลา 15 วันให้ผู้มีอำนาจอนุมัติแล้ว")} className="btn-secondary text-amber-800"><Clock3 className="h-4 w-4" /> ขอขยายเวลา 15 วัน</button>
          <button type="button" onClick={() => onSubmit("บันทึกผลสืบสวนและส่งสำนวนเข้าส่วนกลางแล้ว")} className="btn-primary"><Send className="h-4 w-4" /> เสร็จสิ้นและส่งสำนวน</button>
        </ActionBar>
      </TaskShell>
    );
  }

  if (roleId === "sequential") {
    const reviews = [
      ["พนักงานวิเคราะห์ข้อมูล", "เสร็จแล้ว", "30 วัน"],
      ["ผอ.ฝ่าย", "กำลังดำเนินการ", "7 วัน"],
      ["รอง ผอ.สำนัก", "รอรับงาน", "7 วัน"],
      ["ผอ.สำนัก", "รอรับงาน", "7 วัน"],
      ["ลธ.กกต.", "รอรับงาน", "9 วัน"],
    ];
    return (
      <TaskShell icon={ArrowRight} title="ความเห็นตามลำดับชั้น" subtitle="กรณีสำนวน · SLA รวม 60 วัน · ส่งต่ออัตโนมัติเมื่อบันทึกความเห็น">
        <div className="space-y-2">
          {reviews.map(([name, status, sla], index) => <div key={name} className="grid grid-cols-[32px_1fr_auto] items-center gap-3 rounded-xl border border-slate-200 p-3"><span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${index === 0 ? "bg-emerald-100 text-emerald-700" : index === 1 ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-400"}`}>{index === 0 ? <Check className="h-4 w-4" /> : index + 1}</span><div><div className="text-xs font-bold text-slate-800">{name}</div><div className="mt-0.5 text-[10px] text-slate-500">{status}</div></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">{sla}</span></div>)}
        </div>
        <textarea rows={3} placeholder="บันทึกความเห็นของลำดับปัจจุบัน..." className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-blue-500 focus:bg-white" />
        <ActionBar><button type="button" onClick={() => onSubmit("บันทึกความเห็นและส่งเคสไปยังลำดับถัดไปอัตโนมัติแล้ว")} className="btn-primary"><Send className="h-4 w-4" /> บันทึกและส่งต่อลำดับถัดไป</button></ActionBar>
      </TaskShell>
    );
  }

  if (roleId === "subcommittee") {
    return (
      <TaskShell icon={CalendarDays} title="งานคณะอนุวินิจฉัย" subtitle="โอนเรื่องภายใน 3 วัน · จัดประชุมและทำความเห็นภายในกรอบ 30/90 วัน">
        <div className="grid gap-3 md:grid-cols-3">
          <SummaryCard label="วันโอนเรื่อง" value="26 ส.ค. 2569" tone="green" />
          <SummaryCard label="วาระประชุม" value="ครั้งที่ 18/2569" tone="blue" />
          <SummaryCard label="SLA คงเหลือ" value="74 วัน" tone="amber" />
        </div>
        <textarea rows={4} placeholder="บันทึกความเห็นคณะอนุวินิจฉัยหรือมติให้สืบสวนเพิ่มเติม..." className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-blue-500 focus:bg-white" />
        <ActionBar>
          <button type="button" onClick={() => onSubmit("เพิ่มเรื่องเข้าวาระประชุมและแจ้งคณะอนุวินิจฉัยแล้ว")} className="btn-secondary"><CalendarDays className="h-4 w-4" /> จัดวาระประชุม</button>
          <button type="button" onClick={() => onSubmit("บันทึกความเห็นคณะอนุวินิจฉัยและส่งต่อ กกต. แล้ว")} className="btn-primary"><Scale className="h-4 w-4" /> บันทึกความเห็น</button>
        </ActionBar>
      </TaskShell>
    );
  }

  if (roleId === "secretary") {
    return (
      <TaskShell icon={FileCheck2} title="จัดทำคำวินิจฉัยและแจ้งผล" subtitle="คำวินิจฉัยภายใน 60 วันนับแต่มีมติ · แจ้งมติเบื้องต้นภายใน 15 วัน">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-800">ร่างคำวินิจฉัย กกต. ที่ 128/2569</span><span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-700">รอตรวจทาน</span></div>
          <p className="mt-3 text-xs leading-6 text-slate-600">ตามที่คณะกรรมการการเลือกตั้งมีมติในการประชุมครั้งที่ 42/2569 ให้... ระบบจะประกอบข้อมูลมติ คู่กรณี และรายการแจ้งผลโดยอัตโนมัติ</p>
        </div>
        <ActionBar>
          <button type="button" onClick={() => onSubmit("สร้างไฟล์ร่างคำวินิจฉัยจากมติ กกต. แล้ว")} className="btn-secondary"><FileText className="h-4 w-4" /> สร้างร่างเอกสาร</button>
          <button type="button" onClick={() => onSubmit("ส่งคำวินิจฉัยให้ผู้ร้อง ผู้ถูกร้อง และ ผอ. พร้อมกันแล้ว")} className="btn-primary"><Send className="h-4 w-4" /> อนุมัติและแจ้งทุกฝ่าย</button>
        </ActionBar>
      </TaskShell>
    );
  }

  return (
    <TaskShell icon={ShieldCheck} title="กำกับ Workflow, SLA และสิทธิ์ผู้ใช้งาน" subtitle="การเปลี่ยนกฎทุกครั้งต้องมีเวอร์ชัน ผู้อนุมัติ และ Audit event">
      <div className="grid gap-3 md:grid-cols-3">
        <SummaryCard label="ขั้นตอน Workflow กลาง" value={`${adminStats.workflowSteps} ขั้นตอน`} tone="blue" />
        <SummaryCard label="คิวงานที่ยังไม่ปิด" value={`${adminStats.openCases} เรื่อง`} tone="amber" />
        <SummaryCard label="ผู้รับผิดชอบในทะเบียน" value={`${adminStats.officers} คน`} tone="green" />
      </div>
      <ActionBar><button type="button" onClick={() => onSubmit("เปิดหน้าร่าง Workflow ใหม่ในโหมดตรวจทานแล้ว")} className="btn-primary"><PlusCircle className="h-4 w-4" /> สร้าง Workflow version</button></ActionBar>
    </TaskShell>
  );
}

function TaskShell({ icon: Icon, title, subtitle, children }: { icon: typeof ShieldCheck; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon className="h-5 w-5" /></span><div><h3 className="text-sm font-bold text-slate-950">{title}</h3><p className="mt-1 text-[11px] leading-5 text-slate-500">{subtitle}</p></div></div>
      {children}
    </section>
  );
}

function ActionBar({ children }: { children: React.ReactNode }) {
  return <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">{children}</div>;
}

function EvidenceCard({ title, value, status }: { title: string; value: string; status: "verified" | "review" }) {
  return <div className="rounded-xl border border-slate-200 p-4"><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-800">{title}</span>{status === "verified" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Clock3 className="h-4 w-4 text-amber-600" />}</div><div className="mt-2 text-[11px] text-slate-500">{value}</div></div>;
}

function SummaryCard({ label, value, tone }: { label: string; value: string; tone: "green" | "blue" | "amber" }) {
  const tones = { green: "border-emerald-200 bg-emerald-50 text-emerald-800", blue: "border-blue-200 bg-blue-50 text-blue-800", amber: "border-amber-200 bg-amber-50 text-amber-800" };
  return <div className={`rounded-xl border p-4 ${tones[tone]}`}><div className="text-[10px] font-bold uppercase tracking-wide opacity-70">{label}</div><div className="mt-2 text-sm font-bold">{value}</div></div>;
}
