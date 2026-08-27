export type SlaStatus = "NORMAL" | "NEAR_DUE" | "OVERDUE" | "COMPLETED";

export interface ComplaintItem {
  id: number;
  electionType: string;
  announcementDate: string;
  caseNumber: string;
  electionDate: string;
  receivedDate: string;
  constituency: string;
  district: string;
  province: string;
  officer: string;
  officerId?: string;
  complainants: string;
  respondent: string;
  allegation: string;
  details: string;
  missionGroup: string;
  currentStage: string;
  currentSection: string;
  stageId: number;
  slaDays: number;
  remainingDays: number;
  slaStatus: SlaStatus;
  // Proxy / Delegation fields (ข้อ 25)
  isDelegated?: boolean;
  proxyName?: string;
  proxyIdCard?: string;
  proxyRelationship?: string;
  powerOfAttorneyDoc?: string;
  // Correction fields (ข้อ 26(2))
  correctionRequested?: boolean;
  correctionNote?: string;
  correctionDeadline?: string;
  correctionSubmitted?: boolean;
  correctionSubmittedDate?: string;
  correctionDoc?: string;
  // Investigation Extension fields (ข้อ 41 ว.3)
  extensionRequested?: boolean;
  extensionDays?: number;
  extensionReason?: string;
  extensionApproved?: boolean;
  // Official Ruling & Decision
  officialDecision?: string;
  decisionNote?: string;
  decidedBy?: string;
  decidedDate?: string;
  // Paper-based intake (หมายเหตุ ข้อ ๖.๑): เลขรับจากใบรับคำร้องกระดาษ แยกจากเลขที่เรื่องที่ระบบสร้างให้
  receiptNumber?: string;
  // บันทึกรายละเอียด/ขอขยายเวลารายขั้นตอนใน Timeline (ภาคผนวก ข ข้อ ๔.๒ หน้าจอที่ ๕ ส่วนที่ ๒)
  stepLogs?: StepLogEntry[];
}

export interface StepLogEntry {
  id: string;
  stepId: number;
  type: "note" | "extension";
  note: string;
  extensionDays?: number;
  author: string;
  timestamp: string;
}

export const ELECTION_TYPE_OPTIONS = [
  { value: "สส.", label: "สมาชิกสภาผู้แทนราษฎร (สส.)", code: "MP" },
  { value: "สว.", label: "สมาชิกวุฒิสภา (สว.)", code: "SEN" },
  { value: "อบจ.", label: "องค์การบริหารส่วนจังหวัด (อบจ.)", code: "PAO" },
  { value: "อบต.", label: "องค์การบริหารส่วนตำบล (อบต.)", code: "SAO" },
  { value: "ทต.", label: "เทศบาล", code: "MUN" },
  { value: "กทม.", label: "กรุงเทพมหานคร", code: "BKK" },
  { value: "พัทยา", label: "เมืองพัทยา", code: "PTY" },
  { value: "การออกเสียงประชามติ", label: "การออกเสียงประชามติ", code: "REF" },
] as const;

export const MISSION_GROUP_OPTIONS = [
  "สืบสวนและไต่สวน",
  "พรรคการเมือง",
  "การจัดการเลือกตั้ง",
  "บริหารทั่วไป",
  "กระบวนการยุติธรรม",
] as const;

export const ALLEGATION_OPTIONS = [
  "ซื้อเสียง/ให้เงินหรือทรัพย์สิน",
  "จัดเลี้ยง/ให้ประโยชน์",
  "หาเสียงใส่ร้าย/ข้อมูลอันอาจเป็นเท็จ",
  "คุณสมบัติ/ลักษณะต้องห้ามผู้สมัคร",
  "ข่มขู่/ใช้อิทธิพล",
  "ป้าย/เอกสารหาเสียง",
] as const;

export const WORKFLOW_STEPS = [
  { id: 1, title: "ตรวจคำร้องและมอบหมายผู้รับผิดชอบ", publicTitle: "ตรวจความครบถ้วนของคำร้อง", section: "สนง.กกต.จว.", slaLabel: "3 วัน", slaDays: 3 },
  { id: 2, title: "ผอ.กกต.จว. พิจารณาสั่งรับ/ไม่รับ", publicTitle: "พิจารณาสั่งรับคำร้อง", section: "สนง.กกต.จว.", slaLabel: "3 วัน", slaDays: 3 },
  { id: 3, title: "สืบสวนและไต่สวน", publicTitle: "สืบสวนและไต่สวน", section: "สนง.กกต.จว.", slaLabel: "20 วัน / สูงสุด 90 วัน", slaDays: 90 },
  { id: 4, title: "ผอ.กกต.จว. มีความเห็นและส่งส่วนกลาง", publicTitle: "จัดส่งสำนวนให้ส่วนกลาง", section: "สนง.กกต.จว.", slaLabel: "ตามขั้นตอน", slaDays: null },
  { id: 5, title: "ตรวจคำร้อง/สำนวนส่วนกลาง", publicTitle: "ตรวจคำร้องหรือสำนวนส่วนกลาง", section: "สนง.กกต. ส่วนกลาง", slaLabel: "คำร้อง 30 วัน / สำนวน 60 วัน", slaDays: 30 },
  { id: 6, title: "ลธ.กกต. มีความเห็น", publicTitle: "เสนอความเห็นต่อผู้มีอำนาจ", section: "สนง.กกต. ส่วนกลาง", slaLabel: "คำร้อง 5 วัน / สำนวน 9 วัน", slaDays: 9 },
  { id: 7, title: "คณะอนุวินิจฉัยมีความเห็น", publicTitle: "คณะอนุวินิจฉัยพิจารณา", section: "สนง.กกต. ส่วนกลาง", slaLabel: "90 วัน", slaDays: 90 },
  { id: 8, title: "กกต. วินิจฉัยชี้ขาด", publicTitle: "กกต. พิจารณาวินิจฉัย", section: "สนง.กกต. ส่วนกลาง", slaLabel: "90 วัน", slaDays: 90 },
  { id: 9, title: "จัดทำคำวินิจฉัย กกต.", publicTitle: "จัดทำคำวินิจฉัย", section: "สนง.กกต. ส่วนกลาง", slaLabel: "60 วัน", slaDays: 60 },
  { id: 10, title: "แจ้งผู้ร้อง/ผู้ถูกร้องและปิดเรื่อง", publicTitle: "แจ้งผลและปิดเรื่อง", section: "สนง.กกต. ส่วนกลาง", slaLabel: "15 วัน", slaDays: 15 },
] as const;

export interface CitizenAccount {
  id: string;
  name: string;
  shortName: string;
  initials: string;
  citizenIdMasked: string;
  phoneMasked: string;
  emailMasked: string;
  province: string;
  constituency: string;
  verifiedVia: "ThaID" | "บัญชีผู้ใช้ + OTP";
}

// บัญชีประชาชนจำลอง (ผูกกับ ThaID) สำหรับสาธิตฟีเจอร์ "ประชาชนกรอกเอง" — แทนที่การ hardcode CURRENT_CITIZEN คนเดียว
export const MOCK_CITIZENS: CitizenAccount[] = [
  {
    id: "citizen-077",
    name: "นายศุภชัย ทดสอบ077",
    shortName: "ศุภชัย ทดสอบ077",
    initials: "ศท",
    citizenIdMasked: "1-10**-*****-42-1",
    phoneMasked: "08*-***-7824",
    emailMasked: "sup***@mail.go.th",
    province: "เชียงใหม่",
    constituency: "เขตเลือกตั้งที่ 1",
    verifiedVia: "ThaID",
  },
  {
    id: "citizen-1617",
    name: "น.ส.กมลชนก ข้อมูลสาธิต1617",
    shortName: "กมลชนก ข้อมูลสาธิต1617",
    initials: "กข",
    citizenIdMasked: "1-40**-*****-11-7",
    phoneMasked: "09*-***-1123",
    emailMasked: "kam***@mail.go.th",
    province: "ขอนแก่น",
    constituency: "เขตเลือกตั้งที่ 1",
    verifiedVia: "ThaID",
  },
  {
    id: "citizen-5187",
    name: "น.ส.กัญญารัตน์ กรณีศึกษา5187",
    shortName: "กัญญารัตน์ กรณีศึกษา5187",
    initials: "กก",
    citizenIdMasked: "1-92**-*****-55-3",
    phoneMasked: "06*-***-5187",
    emailMasked: "kany***@mail.go.th",
    province: "ตรัง",
    constituency: "เขตเลือกตั้งที่ 2",
    verifiedVia: "บัญชีผู้ใช้ + OTP",
  },
  {
    id: "citizen-new",
    name: "นางสาวปวีณา ทดลองระบบ",
    shortName: "ปวีณา ทดลองระบบ",
    initials: "ปท",
    citizenIdMasked: "1-15**-*****-90-4",
    phoneMasked: "08*-***-4290",
    emailMasked: "pave***@mail.go.th",
    province: "สงขลา",
    constituency: "เขตเลือกตั้งที่ 1",
    verifiedVia: "ThaID",
  },
];

export function getCitizenById(id: string): CitizenAccount {
  return MOCK_CITIZENS.find((item) => item.id === id) ?? MOCK_CITIZENS[0];
}

// ค่าเริ่มต้นสำหรับโค้ดเดิม/ที่ยังไม่ผูกกับ session จริง
export const CURRENT_CITIZEN = MOCK_CITIZENS[0];

const PROVINCE_CODES: Record<string, string> = {
  "กรุงเทพมหานคร": "BKK",
  "เชียงใหม่": "CMI",
  "ขอนแก่น": "KKN",
  "นครราชสีมา": "NMA",
  "สงขลา": "SKA",
  "สุราษฎร์ธานี": "SNI",
  "อุบลราชธานี": "UBN",
};

export function getProvinceCode(province: string) {
  return PROVINCE_CODES[province] ?? "ECT";
}

export function formatThaiDate(value: string) {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getOfficialSlaDays(stageId: number, fallback: number) {
  return WORKFLOW_STEPS.find((step) => step.id === stageId)?.slaDays ?? fallback;
}

export function getWorkflowStep(stageId: number) {
  return WORKFLOW_STEPS.find((step) => step.id === stageId) ?? WORKFLOW_STEPS[0];
}

export function getCaseKind(caseItem: ComplaintItem) {
  return caseItem.stageId >= 4 ? "สำนวน" : "คำร้อง";
}

export function getPublicStatus(caseItem: ComplaintItem) {
  if (caseItem.slaStatus === "COMPLETED") return "ดำเนินการแล้วเสร็จ";
  if (caseItem.slaStatus === "OVERDUE") return "อยู่ระหว่างเร่งรัดดำเนินการ";
  return getWorkflowStep(caseItem.stageId).publicTitle;
}

export function getSlaLabel(caseItem: ComplaintItem) {
  if (caseItem.slaStatus === "COMPLETED") return "เสร็จสิ้น";
  if (caseItem.slaStatus === "OVERDUE") return `เกิน ${Math.abs(caseItem.remainingDays)} วัน`;
  return `เหลือ ${caseItem.remainingDays} วัน`;
}

const STATUS_LABELS: Record<SlaStatus, string> = {
  NORMAL: "ปกติ",
  NEAR_DUE: "ใกล้ครบกำหนด",
  OVERDUE: "เกินกำหนด",
  COMPLETED: "เสร็จสิ้น",
};

export function getStatusLabel(slaStatus: SlaStatus) {
  return STATUS_LABELS[slaStatus];
}
