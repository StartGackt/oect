"use client";

import { useRef, useState } from "react";
import {
  X,
  FileText,
  User,
  ShieldCheck,
  Send,
  Download,
  Printer,
  Eye,
  EyeOff,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Gavel,
  BadgeCheck,
  FileCheck2,
  Users,
  Pencil,
  Save
} from "lucide-react";
import { WORKFLOW_STEPS, formatThaiDate, getSlaLabel, getWorkflowStep, type ComplaintItem, type StepLogEntry } from "@/components/oect/complaintDomain";
import { useAuditLogStore, type SystemRoleId, type AuditActionType } from "@/components/oect/rbacDomain";

// ผู้บริหารระดับ กกต./ลธ.กกต. ส่วนกลาง เห็นภาพรวมใหญ่ 365 วันนับจากวันประกาศผล ตามภาคผนวก ข ข้อ ๔.๔ หน้าจอที่ ๔ ส่วนที่ ๒
const EXECUTIVE_OVERVIEW_ROLES: SystemRoleId[] = ["sequential", "subcommittee", "commission", "secretary", "admin"];
const OVERALL_TIMEFRAME_DAYS = 365;

// เฉพาะบทบาทที่บันทึกรับเรื่อง/ตรวจคำร้องระดับจังหวัดเท่านั้นที่แก้ไขข้อมูลที่คีย์ผิดของคำร้องเดิมได้ ไม่ให้ส่วนกลางย้อนแก้ข้อมูลสำนวนที่ปิดชั้นแล้ว
const DATA_EDIT_ROLES: SystemRoleId[] = ["intake", "review-1", "review-2", "director", "admin"];
function canEditCaseData(roleId: SystemRoleId) {
  return DATA_EDIT_ROLES.includes(roleId);
}

interface CaseEditForm {
  complainants: string;
  respondent: string;
  allegation: string;
  details: string;
}

interface CaseDetailModalProps {
  caseItem: ComplaintItem;
  onClose: () => void;
  readOnly?: boolean;
  presentation?: "modal" | "page";
  currentUserRole?: SystemRoleId;
  currentUserName?: string;
  onUpdateCase?: (updated: ComplaintItem) => void;
}

interface ActionOption {
  value: string;
  label: string;
  targetStageId: number;
  auditAction: AuditActionType;
  actionKind: "advance" | "correction" | "extension" | "ruling" | "complete" | "reinvestigate";
  desc: string;
}

function getAvailableActions(roleId: SystemRoleId, currentStageId: number): ActionOption[] {
  // If admin, return all
  if (roleId === "admin") {
    return [
      {
        value: "admin_advance",
        label: "เลื่อนสถานะไปยังขั้นตอนถัดไป",
        targetStageId: Math.min(currentStageId + 1, 10),
        auditAction: "CASE_DIRECTOR_ORDER",
        actionKind: "advance",
        desc: "ผู้ดูแลระบบสั่งเลื่อนขั้นตอนตามอำนาจหน้าที่",
      },
      {
        value: "admin_correction",
        label: "แจ้งผู้ร้องแก้ไขเพิ่มเติมตามข้อ 26(2) (ภายใน 7 วัน)",
        targetStageId: currentStageId,
        auditAction: "CASE_CORRECTION_REQUESTED",
        actionKind: "correction",
        desc: "แจ้งให้ผู้ร้องส่งเอกสารหรือข้อเท็จจริงเพิ่มเติม",
      },
      {
        value: "admin_extension",
        label: "อนุมัติขยายระยะเวลาสืบสวน 15 วัน (ข้อ 41 ว.3)",
        targetStageId: currentStageId,
        auditAction: "CASE_EXTENSION_REQUESTED",
        actionKind: "extension",
        desc: "ขยายเวลาสืบสวนให้ คกก.สืบสวนฯ เพิ่มเติม 15 วัน",
      },
      {
        value: "admin_ruling",
        label: "บันทึกมติ กกต. วินิจฉัยชี้ขาด",
        targetStageId: 9,
        auditAction: "CASE_COMMISSION_RULING",
        actionKind: "ruling",
        desc: "วินิจฉัยชี้ขาดสำนวนคำร้องคัดค้าน",
      },
      {
        value: "admin_close",
        label: "แจ้งผลคำวินิจฉัยและปิดสำนวนเรื่อง",
        targetStageId: 10,
        auditAction: "CASE_NOTIFY_RESULT",
        actionKind: "complete",
        desc: "ปิดเรื่องเสร็จสมบูรณ์",
      },
    ];
  }

  // Intake & Reviewers (Stage 1)
  if (roleId === "intake" || roleId === "review-1" || roleId === "review-2") {
    return [
      {
        value: "intake_verified",
        label: "ตรวจความครบถ้วนแล้ว — เสนอ ผอ.สนง.กกต.จว. พิจารณาสั่งรับคำร้อง",
        targetStageId: 2,
        auditAction: "CASE_INTAKE",
        actionKind: "advance",
        desc: "ตรวจสอบชื่อ ที่อยู่ ผู้ถูกร้อง และข้อกล่าวหาครบถ้วนตามข้อ 22",
      },
      {
        value: "intake_request_correction",
        label: "แจ้งผู้ร้องแก้ไขเพิ่มเติมตามข้อ 26(2) (ภายใน 7 วันทำการ)",
        targetStageId: 1,
        auditAction: "CASE_CORRECTION_REQUESTED",
        actionKind: "correction",
        desc: "ส่งการแจ้งเตือนไปยัง Citizen Portal ให้ผู้ร้องส่งหลักฐานเพิ่มเติม",
      },
    ];
  }

  // Provincial Director (Stage 2, 4)
  if (roleId === "director") {
    return [
      {
        value: "dir_order_accept",
        label: "สั่งรับคำร้องและแต่งตั้งคณะกรรมการสืบสวนและไต่สวน (แบบ สส. 4/1)",
        targetStageId: 3,
        auditAction: "CASE_DIRECTOR_ORDER",
        actionKind: "advance",
        desc: "คำร้องมีมูลเพียงพอ มอบหมาย คกก.สืบสวนฯ ดำเนินการ",
      },
      {
        value: "dir_order_reject",
        label: "สั่งไม่รับคำร้อง / ยกคำร้อง (เสนอ กกต. ส่วนกลาง)",
        targetStageId: 4,
        auditAction: "CASE_DIRECTOR_ORDER",
        actionKind: "advance",
        desc: "คำร้องขาดองค์ประกอบตามข้อ 22 หรือไม่มีมูลตามข้อ 28",
      },
      {
        value: "dir_approve_extension",
        label: "อนุมัติขยายระยะเวลาสืบสวนและไต่สวน 15 วัน (ตามข้อ 41 ว.3)",
        targetStageId: 3,
        auditAction: "CASE_EXTENSION_REQUESTED",
        actionKind: "extension",
        desc: "อนุมัติตามคำขอของคณะกรรมการสืบสวนฯ",
      },
      {
        value: "dir_submit_central",
        label: "ลงนามสำนวนและจัดส่งให้ สนง.กกต. ส่วนกลาง (e-Saraban)",
        targetStageId: 5,
        auditAction: "CASE_DIRECTOR_ORDER",
        actionKind: "advance",
        desc: "ส่งสำนวนการสืบสวนพร้อมความเห็นเข้าสู่ส่วนกลาง",
      },
    ];
  }

  // Investigation Committee (Stage 3)
  if (roleId === "investigation") {
    return [
      {
        value: "inv_submit_report",
        label: "สรุปสำนวนและทำรายงานการสืบสวนเสนอ ผอ.สนง.กกต.จว.",
        targetStageId: 4,
        auditAction: "CASE_INVESTIGATION_SUBMIT",
        actionKind: "advance",
        desc: "สืบสวนพยาน รวบรวมหลักฐาน และแจ้งข้อกล่าวหาเสร็จสิ้น",
      },
      {
        value: "inv_request_ext",
        label: "ขออนุมัติขยายระยะเวลาสืบสวน 15 วัน (ตามข้อ 41 ว.3)",
        targetStageId: 3,
        auditAction: "CASE_EXTENSION_REQUESTED",
        actionKind: "extension",
        desc: "เนื่องจากมีพยานบุคคลหรือเอกสารสำคัญที่ต้องรวบรวมเพิ่มเติม",
      },
    ];
  }

  // Central Sequential Reviewer (Stage 5, 6)
  if (roleId === "sequential") {
    return [
      {
        value: "seq_advance_secretary",
        label: "ตรวจสำนวนชั้น 4 ลำดับแล้ว — เสนอความเห็นต่อ เลขาธิการ กกต.",
        targetStageId: 6,
        auditAction: "CASE_CENTRAL_REVIEW",
        actionKind: "advance",
        desc: "ผอ.ฝ่าย → รอง ผอ.สำนัก → ผอ.สำนัก ตรวจสอบความถูกต้องครบถ้วน",
      },
      {
        value: "seq_advance_subcom",
        label: "เลขาธิการ กกต. มีความเห็นเสนอต่อ คณะอนุกรรมการวินิจฉัย",
        targetStageId: 7,
        auditAction: "CASE_CENTRAL_REVIEW",
        actionKind: "advance",
        desc: "ส่งต่อสำนวนเข้าสู่วาระการประชุมของคณะอนุวินิจฉัย",
      },
    ];
  }

  // Subcommittee Secretary (Stage 7)
  if (roleId === "subcommittee") {
    return [
      {
        value: "subcom_meeting_opinion",
        label: "บันทึกความเห็นคณะอนุกรรมการวินิจฉัยเสนอ กกต.",
        targetStageId: 8,
        auditAction: "CASE_SUBCOMMITTEE_MEET",
        actionKind: "advance",
        desc: "คณะอนุวินิจฉัยประชุมพิจารณาและมีมติเสนอ กกต. วินิจฉัยชี้ขาด",
      },
    ];
  }

  // Election Commission (Stage 8)
  if (roleId === "commission") {
    return [
      {
        value: "comm_rule_dismiss",
        label: "มติ กกต. วินิจฉัยยกคำร้อง (พยานหลักฐานไม่เพียงพอ)",
        targetStageId: 9,
        auditAction: "CASE_COMMISSION_RULING",
        actionKind: "ruling",
        desc: "กกต. มีมติยกคำร้อง ส่งต่อสำนักวินิจฉัยจัดทำคำวินิจฉัย",
      },
      {
        value: "comm_rule_reelection",
        label: "มติ กกต. วินิจฉัยสั่งให้มีการเลือกตั้งใหม่ (ใบเหลือง)",
        targetStageId: 9,
        auditAction: "CASE_COMMISSION_RULING",
        actionKind: "ruling",
        desc: "กกต. มีมติสั่งให้จัดการเลือกตั้งใหม่ในเขตเลือกตั้ง",
      },
      {
        value: "comm_rule_revoke",
        label: "มติ กกต. วินิจฉัยสั่งเพิกถอนสิทธิเลือกตั้ง/สมัคร (ใบแดง/ส้ม)",
        targetStageId: 9,
        auditAction: "CASE_COMMISSION_RULING",
        actionKind: "ruling",
        desc: "กกต. มีมติส่งศาลฎีกาเพิกถอนสิทธิ",
      },
      {
        value: "comm_reinvestigate",
        label: "มติ กกต. สั่งให้สืบสวนและไต่สวนเพิ่มเติม",
        targetStageId: 3,
        auditAction: "CASE_COMMISSION_RULING",
        actionKind: "reinvestigate",
        desc: "ส่งสำนวนกลับให้ สนง.กกต.จว. ดำเนินการสืบสวนเพิ่มเติม",
      },
    ];
  }

  // Secretary & Decree Office (Stage 9, 10)
  if (roleId === "secretary") {
    return [
      {
        value: "sec_prepare_decree",
        label: "จัดทำและตรวจร่างคำวินิจฉัย กกต. ฉบับสมบูรณ์ (ข้อ 84)",
        targetStageId: 10,
        auditAction: "CASE_DECREE_PREPARED",
        actionKind: "advance",
        desc: "ตรวจทานและลงนามคำวินิจฉัย กกต. ตามระเบียบข้อ 84",
      },
      {
        value: "sec_notify_close",
        label: "แจ้งคำวินิจฉัยให้ ผอ.สนง.กกต.จว. และคู่กรณีทราบ พร้อมปิดเรื่อง (ข้อ 85)",
        targetStageId: 10,
        auditAction: "CASE_NOTIFY_RESULT",
        actionKind: "complete",
        desc: "แจ้งมติให้จังหวัดและประชาชนทราบอย่างเป็นทางการ",
      },
    ];
  }

  // Default fallback
  return [
    {
      value: "default_advance",
      label: "ส่งต่อสำนวนไปยังขั้นตอนถัดไป",
      targetStageId: Math.min(currentStageId + 1, 10),
      auditAction: "CASE_VIEW",
      actionKind: "advance",
      desc: "ส่งต่อตามสายงานปกติ",
    },
  ];
}

export default function CaseDetailModal({
  caseItem,
  onClose,
  readOnly = false,
  presentation = "page",
  currentUserRole = "admin",
  currentUserName = "เจ้าหน้าที่ผู้ปฏิบัติงาน",
  onUpdateCase,
}: CaseDetailModalProps) {
  const [, appendAuditLog] = useAuditLogStore();
  const [maskData, setMaskData] = useState<boolean>(true);
  const [officerNote, setOfficerNote] = useState<string>("");
  const [activeSubTab, setActiveSubTab] = useState<"info" | "timeline" | "action">("info");
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const availableActions = getAvailableActions(currentUserRole, caseItem.stageId);
  const [selectedActionValue, setSelectedActionValue] = useState<string>(
    availableActions[0]?.value || ""
  );

  // Masking helper
  const maskName = (text: string) => {
    if (!maskData) return text;
    return text.replace(/(\S{3})\S+(\S{2})/g, "$1***$2");
  };

  const workflowSteps = WORKFLOW_STEPS.map((step) => ({
    id: step.id,
    title: `${step.id}. ${step.title}`,
    dept: step.section,
    sla: step.slaLabel,
  }));

  const selectedAction = availableActions.find((a) => a.value === selectedActionValue) || availableActions[0];

  const [isEditingCase, setIsEditingCase] = useState(false);
  const [editForm, setEditForm] = useState<CaseEditForm>({
    complainants: caseItem.complainants,
    respondent: caseItem.respondent,
    allegation: caseItem.allegation,
    details: caseItem.details,
  });

  const startEditingCase = () => {
    setEditForm({
      complainants: caseItem.complainants,
      respondent: caseItem.respondent,
      allegation: caseItem.allegation,
      details: caseItem.details,
    });
    setIsEditingCase(true);
  };

  const handleSaveDataCorrection = () => {
    const updatedCase: ComplaintItem = { ...caseItem, ...editForm };
    appendAuditLog({
      userId: currentUserRole === "admin" ? "usr-admin" : "usr-officer",
      userName: currentUserName,
      userRole: currentUserRole,
      userRoleLabel: currentUserRole.toUpperCase(),
      action: "CASE_DATA_CORRECTED",
      actionLabel: "แก้ไขข้อมูลคำร้องที่คีย์ผิด",
      caseNumber: caseItem.caseNumber,
      province: caseItem.province,
      ipAddress: "192.168.10.25",
      status: "SUCCESS",
      details: `แก้ไขข้อมูลผู้ร้อง/ผู้ถูกร้อง/ข้อกล่าวหา/รายละเอียดพฤติการณ์ โดย ${currentUserName}`,
    });
    if (onUpdateCase) {
      onUpdateCase(updatedCase);
    }
    setIsEditingCase(false);
    setActionSuccessMessage("บันทึกการแก้ไขข้อมูลคำร้องสำเร็จ");
    window.setTimeout(() => setActionSuccessMessage(null), 1600);
  };

  const [viewedAtMs] = useState(() => Date.now());
  const stepLogCounterRef = useRef(0);

  const [editingStepId, setEditingStepId] = useState<number | null>(null);
  const [stepNoteDraft, setStepNoteDraft] = useState("");
  const [stepExtendEnabled, setStepExtendEnabled] = useState(false);
  const [stepExtendDays, setStepExtendDays] = useState(15);

  const resetStepDraft = () => {
    setEditingStepId(null);
    setStepNoteDraft("");
    setStepExtendEnabled(false);
    setStepExtendDays(15);
  };

  const handleSaveStepLog = (stepId: number, isCurrentStep: boolean) => {
    if (!stepNoteDraft.trim() && !stepExtendEnabled) return;
    stepLogCounterRef.current += 1;
    const entry: StepLogEntry = {
      id: `log-${viewedAtMs}-${stepLogCounterRef.current}`,
      stepId,
      type: stepExtendEnabled ? "extension" : "note",
      note: stepNoteDraft.trim() || `ขอขยายเวลา ${stepExtendDays} วัน`,
      extensionDays: stepExtendEnabled ? stepExtendDays : undefined,
      author: currentUserName,
      timestamp: new Date().toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" }),
    };
    const updatedCase: ComplaintItem = {
      ...caseItem,
      stepLogs: [...(caseItem.stepLogs ?? []), entry],
      ...(stepExtendEnabled && isCurrentStep ? { remainingDays: Math.max(caseItem.remainingDays, 0) + stepExtendDays } : {}),
    };
    appendAuditLog({
      userId: currentUserRole === "admin" ? "usr-admin" : "usr-officer",
      userName: currentUserName,
      userRole: currentUserRole,
      userRoleLabel: currentUserRole.toUpperCase(),
      action: stepExtendEnabled ? "CASE_EXTENSION_REQUESTED" : "CASE_STEP_NOTE_ADDED",
      actionLabel: stepExtendEnabled ? `ขอขยายเวลาขั้นตอน "${getWorkflowStep(stepId).title}"` : `บันทึกรายละเอียดขั้นตอน "${getWorkflowStep(stepId).title}"`,
      caseNumber: caseItem.caseNumber,
      province: caseItem.province,
      ipAddress: "192.168.10.25",
      status: "SUCCESS",
      details: entry.note,
    });
    if (onUpdateCase) {
      onUpdateCase(updatedCase);
    }
    resetStepDraft();
  };

  const showExecutiveOverview = !readOnly && EXECUTIVE_OVERVIEW_ROLES.includes(currentUserRole);
  const announcementDate = new Date(`${caseItem.announcementDate}T00:00:00`);
  const daysElapsed = Number.isNaN(announcementDate.getTime())
    ? 0
    : Math.max(0, Math.floor((viewedAtMs - announcementDate.getTime()) / 86400000));
  const daysOverdue = caseItem.slaStatus === "COMPLETED" ? 0 : Math.max(0, daysElapsed - OVERALL_TIMEFRAME_DAYS);
  const overviewProgressPercent = Math.min(100, Math.round((daysElapsed / OVERALL_TIMEFRAME_DAYS) * 100));
  const overviewStatusLabel = caseItem.slaStatus === "COMPLETED"
    ? "ดำเนินการแล้วเสร็จ"
    : daysOverdue > 0
    ? "เกินกรอบเวลาภาพรวม 365 วัน"
    : "อยู่ระหว่างกรอบเวลาภาพรวม";

  const handleSaveAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction) return;

    // Create updated CaseItem
    const updatedCase: ComplaintItem = {
      ...caseItem,
      stageId: selectedAction.targetStageId,
      currentStage: WORKFLOW_STEPS.find((s) => s.id === selectedAction.targetStageId)?.title || caseItem.currentStage,
      currentSection: WORKFLOW_STEPS.find((s) => s.id === selectedAction.targetStageId)?.section || caseItem.currentSection,
      officialDecision: selectedAction.label,
      decisionNote: officerNote,
      decidedBy: currentUserName,
      decidedDate: new Date().toISOString().split("T")[0],
    };

    // Specific Action mutations
    if (selectedAction.actionKind === "correction") {
      updatedCase.correctionRequested = true;
      updatedCase.correctionNote = officerNote;
      updatedCase.correctionDeadline = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
    } else if (selectedAction.actionKind === "extension") {
      updatedCase.extensionRequested = true;
      updatedCase.extensionDays = 15;
      updatedCase.extensionReason = officerNote;
      updatedCase.extensionApproved = true;
      updatedCase.remainingDays = Math.max(caseItem.remainingDays, 0) + 15;
    } else if (selectedAction.actionKind === "complete") {
      updatedCase.slaStatus = "COMPLETED";
      updatedCase.remainingDays = 0;
    }

    // Append Audit Log
    appendAuditLog({
      userId: currentUserRole === "admin" ? "usr-admin" : "usr-officer",
      userName: currentUserName,
      userRole: currentUserRole,
      userRoleLabel: currentUserRole.toUpperCase(),
      action: selectedAction.auditAction,
      actionLabel: selectedAction.label,
      caseNumber: caseItem.caseNumber,
      province: caseItem.province,
      ipAddress: "192.168.10.25",
      status: "SUCCESS",
      details: `${selectedAction.label}: ${officerNote || "ไม่มีหมายเหตุเพิ่มเติม"} (โดย ${currentUserName})`,
    });

    if (onUpdateCase) {
      onUpdateCase(updatedCase);
    }

    setActionSuccessMessage(`บันทึกคำสั่ง "${selectedAction.label}" สำเร็จ`);
    window.setTimeout(() => {
      setActionSuccessMessage(null);
      setActiveSubTab("info");
    }, 1600);
  };

  return (
    <div className={presentation === "page" ? "fixed inset-0 z-50 overflow-y-auto bg-slate-50" : "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs"}>
      <div role={presentation === "modal" ? "dialog" : undefined} aria-modal={presentation === "modal" ? true : undefined} aria-labelledby="case-detail-title" className={presentation === "page" ? "mx-auto flex min-h-screen w-full max-w-[1480px] flex-col overflow-hidden border-x border-slate-200 bg-white" : "my-6 flex max-h-[90vh] w-full max-w-4xl animate-in flex-col overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-2xl zoom-in-95 duration-150"}>
        
        {/* Modal Top Header */}
        <div className="oect-header-gradient text-white p-5 sm:px-8 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFD600] text-[#1B3F8B] font-bold text-xs">
                {caseItem.caseNumber}
              </span>
              <span className="text-xs text-white/80">
                ประเภท: {caseItem.electionType} · สังกัด: {caseItem.province} ({caseItem.currentSection})
              </span>
            </div>
            <h2 id="case-detail-title" className="text-base sm:text-lg font-medium text-white">
              {readOnly ? "รายละเอียดคำร้องและสถานะที่เปิดเผยได้ (Citizen View)" : `สำนวนอิเล็กทรอนิกส์ (e-Dossier) — ปฏิบัติงานในฐานะ: ${currentUserRole}`}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {!readOnly && <button
              onClick={() => setMaskData(!maskData)}
              className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors ${
                maskData ? "bg-white/20 text-[#FFD600]" : "bg-red-500/80 text-white"
              }`}
              title="เปิด/ปิดการปกปิดข้อมูลส่วนบุคคลตาม พ.ร.บ. PDPA"
            >
              {maskData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="hidden sm:inline">{maskData ? "PDPA Masked" : "Unmasked"}</span>
            </button>}

            <button
              onClick={onClose}
              aria-label="ปิดรายละเอียดสำนวน"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Success Toast */}
        {actionSuccessMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            {actionSuccessMessage}
          </div>
        )}

        {/* Navigation Tabs inside modal */}
        <div className="bg-[#F7FAFC] border-b border-[#E2E8F0] px-6 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab("info")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeSubTab === "info" ? "bg-white text-[#1B3F8B] shadow-2xs" : "text-[#718096] hover:text-[#1A202C]"
              }`}
            >
              📄 ข้อมูลสำนวน & พยานหลักฐาน
            </button>
            <button
              onClick={() => setActiveSubTab("timeline")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeSubTab === "timeline" ? "bg-white text-[#1B3F8B] shadow-2xs" : "text-[#718096] hover:text-[#1A202C]"
              }`}
            >
              ⏱️ ลำดับขั้นตอน Workflow & SLA
            </button>
            {!readOnly && <button
              onClick={() => setActiveSubTab("action")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeSubTab === "action" ? "bg-[#1B3F8B] text-white shadow-2xs" : "text-[#718096] hover:text-[#1A202C]"
              }`}
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>บันทึกคำสั่งตามสิทธิ์ ({availableActions.length} คำสั่ง)</span>
            </button>}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="text-[#718096]">สถานะ SLA:</span>
            <span
              className={`px-2 py-0.5 rounded-full font-semibold ${
                caseItem.slaStatus === "OVERDUE"
                  ? "bg-red-100 text-red-700"
                  : caseItem.slaStatus === "NEAR_DUE"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {getSlaLabel(caseItem)}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className={`flex-1 space-y-6 p-6 sm:p-8 ${presentation === "modal" ? "overflow-y-auto" : ""}`}>
          
          {/* Correction Banner if in correction status */}
          {caseItem.correctionRequested && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong className="block font-bold">แจ้งผู้ร้องแก้ไขเพิ่มเติมตามข้อ 26(2)</strong>
                <p className="mt-0.5 text-[11px] leading-relaxed">
                  หมายเหตุคำสั่ง: {caseItem.correctionNote || "กรุณาแนบหลักฐานเอกสารระบุพฤติการณ์เพิ่มเติม"}
                  {caseItem.correctionDeadline && ` · ครบกำหนดวันที่ ${formatThaiDate(caseItem.correctionDeadline)}`}
                </p>
                {caseItem.correctionSubmitted && (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    <CheckCircle2 className="h-3 w-3" /> ผู้ร้องส่งเอกสารเพิ่มเติมแล้วเมื่อ {caseItem.correctionSubmittedDate}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* TAB 1: INFO & EVIDENCE */}
          {activeSubTab === "info" && (
            <div className="space-y-6">
              
              {/* Top Key Info Cards */}
              <div className={`grid grid-cols-2 gap-3 bg-[#F7FAFC] p-4 rounded-2xl border border-[#EDF2F7] ${caseItem.receiptNumber ? "sm:grid-cols-5" : "sm:grid-cols-4"}`}>
                <div>
                  <span className="text-[10px] text-[#718096] uppercase font-medium">วันที่รับคำร้อง</span>
                  <div className="text-xs font-semibold text-[#1A202C]">{formatThaiDate(caseItem.receivedDate)}</div>
                </div>
                {caseItem.receiptNumber && (
                  <div>
                    <span className="text-[10px] text-[#718096] uppercase font-medium">เลขรับเรื่องร้องเรียน</span>
                    <div className="text-xs font-semibold text-[#1A202C]">{caseItem.receiptNumber}</div>
                  </div>
                )}
                <div>
                  <span className="text-[10px] text-[#718096] uppercase font-medium">วันที่เลือกตั้ง</span>
                  <div className="text-xs font-semibold text-[#1A202C]">{formatThaiDate(caseItem.electionDate)}</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#718096] uppercase font-medium">วันประกาศผล</span>
                  <div className="text-xs font-semibold text-[#1A202C]">{formatThaiDate(caseItem.announcementDate)}</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#718096] uppercase font-medium">พื้นที่ / เขตเลือกตั้ง</span>
                  <div className="text-xs font-semibold text-[#1B3F8B]">จ.{caseItem.province} {caseItem.constituency}</div>
                </div>
              </div>

              {!readOnly && canEditCaseData(currentUserRole) && (
                <div className="flex items-center justify-end">
                  {isEditingCase ? (
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setIsEditingCase(false)} className="px-3 py-1.5 text-xs text-[#718096] hover:text-[#1A202C]">ยกเลิก</button>
                      <button type="button" onClick={handleSaveDataCorrection} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1B3F8B] px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#15326f]">
                        <Save className="h-3.5 w-3.5" /> บันทึกการแก้ไข
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={startEditingCase} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-700">
                      <Pencil className="h-3.5 w-3.5" /> แก้ไขข้อมูลที่คีย์ผิด
                    </button>
                  )}
                </div>
              )}

              {showExecutiveOverview && (
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-indigo-900">สถานะภาพรวมใหญ่ (นับจากวันประกาศผล 365 วัน)</span>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${daysOverdue > 0 ? "bg-rose-100 text-rose-700" : caseItem.slaStatus === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}>
                      {overviewStatusLabel}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white">
                    <div className={`h-full rounded-full ${daysOverdue > 0 ? "bg-rose-500" : "bg-indigo-600"}`} style={{ width: `${overviewProgressPercent}%` }} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div>
                      <div className="text-[9px] font-bold uppercase text-indigo-500">จำนวนวันที่ดำเนินการแล้ว</div>
                      <div className="mt-1 text-sm font-bold text-indigo-950">{daysElapsed} วัน</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold uppercase text-indigo-500">จำนวนวันที่เกินกำหนด</div>
                      <div className="mt-1 text-sm font-bold text-indigo-950">{daysOverdue > 0 ? `${daysOverdue} วัน` : "-"}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold uppercase text-indigo-500">กรอบเวลาภาพรวม</div>
                      <div className="mt-1 text-sm font-bold text-indigo-950">{OVERALL_TIMEFRAME_DAYS} วัน</div>
                    </div>
                  </div>
                </div>
              )}

              {!readOnly && (
                <div className="grid gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 sm:grid-cols-[auto_1fr_1fr] sm:items-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-800 text-sm font-bold text-white">
                    {caseItem.officer.slice(0, 2)}
                  </span>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-blue-500">ผู้รับผิดชอบปัจจุบัน (Officer Relation)</div>
                    <div className="mt-1 text-sm font-bold text-blue-950">{caseItem.officer}</div>
                    <div className="mt-1 text-[10px] text-blue-700">พนักงานผู้ได้รับมอบหมาย · {caseItem.currentSection}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[10px]">
                    <div>
                      <div className="text-blue-500">โทรศัพท์</div>
                      <div className="mt-1 font-semibold text-blue-950">053-112-184</div>
                    </div>
                    <div>
                      <div className="text-blue-500">วันที่รับมอบหมาย</div>
                      <div className="mt-1 font-semibold text-blue-950">{formatThaiDate(caseItem.receivedDate)}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Parties: Complainants & Respondents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Complainants */}
                <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1B3F8B] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>ผู้ร้องเรียน (Complainants)</span>
                    </span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      ผู้มีสิทธิเลือกตั้งในเขต (ข้อ 23)
                    </span>
                  </div>
                  {isEditingCase ? (
                    <input
                      type="text"
                      value={editForm.complainants}
                      onChange={(event) => setEditForm((current) => ({ ...current, complainants: event.target.value }))}
                      className="w-full rounded-xl border border-blue-300 bg-white p-3 text-xs font-medium text-[#2D3748] outline-none focus:border-blue-500"
                    />
                  ) : (
                    <div className="text-xs text-[#2D3748] font-medium leading-relaxed bg-[#F7FAFC] p-3 rounded-xl border border-[#EDF2F7]">
                      {maskName(caseItem.complainants)}
                    </div>
                  )}

                  {/* Proxy / Delegation Badge */}
                  {caseItem.isDelegated ? (
                    <div className="mt-2 rounded-xl bg-purple-50 p-2.5 border border-purple-200 text-xs text-purple-900">
                      <div className="flex items-center gap-1 font-bold text-[11px]">
                        <BadgeCheck className="h-3.5 w-3.5 text-purple-700" />
                        <span>ยื่นโดยผู้รับมอบอำนาจ (ตามระเบียบ ข้อ ๒๕)</span>
                      </div>
                      <div className="mt-1 text-[10px] text-purple-800">
                        ผู้รับมอบอำนาจ: <strong>{caseItem.proxyName || "นายอนุรักษ์ ผู้รับมอบอำนาจ"}</strong>
                        {caseItem.proxyRelationship && ` (${caseItem.proxyRelationship})`}
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-[#718096]">
                      ✓ ยื่นด้วยตนเองและตรวจสอบสิทธิผ่าน DOPA Linkage Center แล้ว
                    </div>
                  )}
                </div>

                {/* Respondents */}
                <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-red-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>ผู้ถูกร้องเรียน (Respondents)</span>
                    </span>
                    <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-medium">
                      ผู้สมัครรับเลือกตั้ง
                    </span>
                  </div>
                  {isEditingCase ? (
                    <input
                      type="text"
                      value={editForm.respondent}
                      onChange={(event) => setEditForm((current) => ({ ...current, respondent: event.target.value }))}
                      className="w-full rounded-xl border border-blue-300 bg-white p-3 text-xs font-medium text-[#2D3748] outline-none focus:border-blue-500"
                    />
                  ) : (
                    <div className="text-xs text-[#2D3748] font-medium leading-relaxed bg-[#F7FAFC] p-3 rounded-xl border border-[#EDF2F7]">
                      {maskName(caseItem.respondent)}
                    </div>
                  )}
                  <div className="text-[10px] text-[#718096]">
                    ✓ ตรวจสอบสถานะผู้สมัครผ่านระบบ PRAXTICOL แล้ว
                  </div>
                </div>

              </div>

              {/* Allegation & Details */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-3">
                {isEditingCase ? (
                  <>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#1A202C]">ข้อกล่าวหา</label>
                      <input
                        type="text"
                        value={editForm.allegation}
                        onChange={(event) => setEditForm((current) => ({ ...current, allegation: event.target.value }))}
                        className="w-full rounded-xl border border-blue-300 bg-white p-2.5 text-xs font-medium text-red-700 outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#1A202C]">รายละเอียดพฤติการณ์</label>
                      <textarea
                        rows={4}
                        value={editForm.details}
                        onChange={(event) => setEditForm((current) => ({ ...current, details: event.target.value }))}
                        className="w-full rounded-xl border border-blue-300 bg-white p-4 text-xs leading-relaxed text-[#4A5568] outline-none focus:border-blue-500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1A202C]">
                        ข้อกล่าวหา: <strong className="text-red-600 font-bold">{caseItem.allegation}</strong>
                      </span>
                      <span className="text-[10px] text-[#718096]">
                        {readOnly ? "ข้อมูลความเห็นภายในถูกปกปิด" : `ผู้รับผิดชอบ: ${caseItem.officer}`}
                      </span>
                    </div>
                    <div className="text-xs text-[#4A5568] leading-relaxed bg-[#F7FAFC] p-4 rounded-xl border border-[#EDF2F7]">
                      {caseItem.details}
                    </div>
                  </>
                )}
              </div>

              {/* Official Decision Display if any */}
              {caseItem.officialDecision && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1B3F8B] flex items-center gap-1.5">
                      <Gavel className="h-4 w-4" />
                      คำสั่ง / คำวินิจฉัยล่าสุด
                    </span>
                    <span className="text-[10px] text-slate-500">{formatThaiDate(caseItem.decidedDate || "")}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800">{caseItem.officialDecision}</div>
                  {caseItem.decisionNote && (
                    <p className="text-[11px] text-slate-600 bg-white p-3 rounded-xl border border-blue-100">
                      {caseItem.decisionNote}
                    </p>
                  )}
                  <div className="text-[10px] text-slate-400">สั่งการโดย: {caseItem.decidedBy || "-"}</div>
                </div>
              )}

              {/* Evidence & Attachments */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-3">
                <div className="text-xs font-semibold text-[#1A202C] flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-[#1B3F8B]" />
                  <span>พยานหลักฐานและเอกสารประกอบสำนวน</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7FAFC] border border-[#EDF2F7] text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="truncate">คำร้องแบบ_สตว1.pdf</span>
                    </div>
                    <Download className="w-3.5 h-3.5 text-[#718096] hover:text-[#1A202C] cursor-pointer" />
                  </div>
                  {caseItem.isDelegated && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-xs">
                      <div className="flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-purple-700" />
                        <span className="truncate">หนังสือมอบอำนาจ_สตว1_1.pdf</span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-purple-700 cursor-pointer" />
                    </div>
                  )}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7FAFC] border border-[#EDF2F7] text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span className="truncate">ภาพถ่ายหลักฐาน_01.jpg</span>
                    </div>
                    <Download className="w-3.5 h-3.5 text-[#718096] hover:text-[#1A202C] cursor-pointer" />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: TIMELINE & WORKFLOW PROGRESS */}
          {activeSubTab === "timeline" && (
            <div className="space-y-4">
              <div className="text-xs text-[#718096] mb-3">
                แสดงสถานะความคืบหน้าตามระเบียบ กกต. ว่าด้วยการสืบสวน การไต่สวน และการวินิจฉัยชี้ขาด พ.ศ. ๒๕๖๖ ฉบับที่ (๓)
              </div>

              <div className="space-y-3">
                {workflowSteps.map((step) => {
                  const isCurrent = step.id === caseItem.stageId;
                  const isPast = step.id < caseItem.stageId;
                  const stepLogs = (caseItem.stepLogs ?? []).filter((log) => log.stepId === step.id);
                  const isEditingStep = editingStepId === step.id;
                  return (
                    <div
                      key={step.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? "bg-[#4FB3E8]/10 border-[#1B3F8B] shadow-xs"
                          : isPast
                          ? "bg-[#F7FAFC] border-[#E2E8F0] opacity-80"
                          : "bg-white border-[#EDF2F7] opacity-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              isCurrent
                                ? "bg-[#1B3F8B] text-white animate-pulse"
                                : isPast
                                ? "bg-emerald-500 text-white"
                                : "bg-[#E2E8F0] text-[#718096]"
                            }`}
                          >
                            {isPast ? "✓" : step.id}
                          </div>
                          <div>
                            <div className={`text-xs font-medium ${isCurrent ? "text-[#1B3F8B] font-semibold" : "text-[#2D3748]"}`}>
                              {step.title}
                            </div>
                            <div className="text-[10px] text-[#718096]">{step.dept}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] font-semibold text-[#4A5568] bg-white px-2.5 py-0.5 rounded-full border border-[#E2E8F0]">
                            SLA: {step.sla}
                          </span>
                          {isCurrent && (
                            <div className="text-[10px] text-[#1B3F8B] font-medium mt-0.5">
                              📍 กำลังดำเนินการในขั้นตอนนี้
                            </div>
                          )}
                        </div>
                      </div>

                      {stepLogs.length > 0 && (
                        <div className="mt-3 space-y-1.5 border-t border-dashed border-slate-300/70 pt-3">
                          {stepLogs.map((log) => (
                            <div key={log.id} className="rounded-lg bg-white/80 p-2 text-[10px] leading-4 text-slate-600">
                              <span className={`mr-1.5 rounded px-1.5 py-0.5 font-bold ${log.type === "extension" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}>
                                {log.type === "extension" ? `ขยาย ${log.extensionDays} วัน` : "บันทึก"}
                              </span>
                              {log.note} <span className="text-slate-400">— {log.author}, {log.timestamp}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {!readOnly && (
                        isEditingStep ? (
                          <div className="mt-3 space-y-2 border-t border-dashed border-slate-300/70 pt-3">
                            <textarea
                              rows={2}
                              value={stepNoteDraft}
                              onChange={(event) => setStepNoteDraft(event.target.value)}
                              placeholder="บันทึกรายละเอียดการดำเนินการในขั้นตอนนี้..."
                              className="w-full rounded-lg border border-slate-200 bg-white p-2 text-[10px] outline-none focus:border-blue-400"
                            />
                            <label className="flex flex-wrap items-center gap-2 text-[10px] font-semibold text-slate-600">
                              <input type="checkbox" checked={stepExtendEnabled} onChange={(event) => setStepExtendEnabled(event.target.checked)} />
                              ขอขยายระยะเวลาขั้นตอนนี้
                              {stepExtendEnabled && (
                                <>
                                  <input
                                    type="number"
                                    min={1}
                                    max={90}
                                    value={stepExtendDays}
                                    onChange={(event) => setStepExtendDays(Number(event.target.value) || 1)}
                                    className="w-16 rounded-lg border border-amber-300 bg-amber-50 px-2 py-1 text-[10px] outline-none"
                                  />
                                  <span>วัน</span>
                                </>
                              )}
                            </label>
                            <div className="flex justify-end gap-2">
                              <button type="button" onClick={resetStepDraft} className="px-2.5 py-1 text-[10px] text-[#718096] hover:text-[#1A202C]">ยกเลิก</button>
                              <button type="button" onClick={() => handleSaveStepLog(step.id, isCurrent)} className="rounded-lg bg-[#1B3F8B] px-3 py-1 text-[10px] font-bold text-white hover:bg-[#15326f]">บันทึก</button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => { setEditingStepId(step.id); setStepNoteDraft(""); setStepExtendEnabled(false); setStepExtendDays(15); }}
                            className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 hover:underline"
                          >
                            <Pencil className="h-3 w-3" /> เพิ่มรายละเอียด / ขยายเวลา
                          </button>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: OFFICIAL ACTION FORM */}
          {activeSubTab === "action" && (
            <form onSubmit={handleSaveAction} className="space-y-4">
              <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4">
                <span className="text-xs font-bold text-[#1B3F8B] block mb-1">
                  การสั่งการและบันทึกความเห็นทางกฎหมาย (Official Action & Ruling)
                </span>
                <p className="text-[11px] text-slate-600">
                  ระบบกรองคำสั่งเฉพาะที่บทบาท <strong>{currentUserRole}</strong> มีสิทธิ์สั่งการตามขั้นตอนปัจจุบัน
                  และจะบันทึกลงใน Audit Trail Logs โดยอัตโนมัติ
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  เลือกประเภทคำสั่งการ / การเปลี่ยนสถานะ *
                </label>
                <select
                  value={selectedActionValue}
                  onChange={(e) => setSelectedActionValue(e.target.value)}
                  className="w-full text-xs bg-[#F7FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1B3F8B] font-medium"
                >
                  {availableActions.map((act) => (
                    <option key={act.value} value={act.value}>
                      {act.label}
                    </option>
                  ))}
                </select>
                {selectedAction && (
                  <p className="mt-1.5 text-[10px] text-slate-500 font-medium">
                    คำอธิบายคำสั่ง: {selectedAction.desc}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  บันทึกความเห็น / ข้อเท็จจริง / เหตุผลประกอบคำสั่ง *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="ระบุข้อเท็จจริง ข้อกฎหมาย และเหตุผลแห่งการสั่งการ..."
                  value={officerNote}
                  onChange={(e) => setOfficerNote(e.target.value)}
                  className="w-full text-xs bg-[#F7FAFC] border border-[#E2E8F0] rounded-xl p-3 focus:outline-none focus:border-[#1B3F8B]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-[#718096] hover:text-[#1A202C]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1B3F8B] hover:bg-[#15326f] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>บันทึกคำสั่งและลงนามอิเล็กทรอนิกส์</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-[#F7FAFC] border-t border-[#E2E8F0] px-6 py-3.5 flex items-center justify-between text-xs text-[#718096]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>ระบบบันทึก Audit Trail การเข้าดูและสั่งการสำนวนตามมาตรฐาน OWASP และ PDPA</span>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 text-[#1B3F8B] font-medium hover:underline"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์สำนวน</span>
          </button>
        </div>

      </div>
    </div>
  );
}
