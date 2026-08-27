"use client";

import { useState, useEffect } from "react";

// ==========================================
// 1. ROLE DEFINITIONS (UNIFIED 9 ROLES + ADMIN + CITIZEN)
// ==========================================

export type OfficerRoleId =
  | "intake"
  | "review-1"
  | "review-2"
  | "director"
  | "investigation"
  | "sequential"
  | "subcommittee"
  | "commission"
  | "secretary";

export type SystemRoleId = OfficerRoleId | "admin" | "citizen";

export type RoleCategory = "provincial" | "central" | "admin" | "citizen";

export interface RoleDefinition {
  id: SystemRoleId;
  label: string;
  shortLabel: string;
  category: RoleCategory;
  categoryLabel: string;
  scope: string;
  stage: string;
  level: number;
  description: string;
  color: string;
}

export const ALL_ROLES: RoleDefinition[] = [
  {
    id: "intake",
    label: "พนักงานรับคำร้อง",
    shortLabel: "รับคำร้อง",
    category: "provincial",
    categoryLabel: "ส่วนภูมิภาค (สนง.กกต.จว.)",
    scope: "รับเรื่อง ตรวจเบื้องต้น และออกใบรับคำร้อง (สตว.1)",
    stage: "รับคำร้อง",
    level: 1,
    description: "รับคำร้องจากผู้ร้อง/ผู้รับมอบอำนาจ ออกเลขรับ และตรวจสอบเอกสารเบื้องต้น",
    color: "blue",
  },
  {
    id: "review-1",
    label: "พนักงานตรวจคำร้อง ชั้น 1",
    shortLabel: "ตรวจคำร้อง ชั้น 1",
    category: "provincial",
    categoryLabel: "ส่วนภูมิภาค (สนง.กกต.จว.)",
    scope: "ตรวจองค์ประกอบตามข้อ 22 และสิทธิผู้ร้อง (ข้อ 23)",
    stage: "ตรวจคำร้องชั้น 1",
    level: 1,
    description: "ตรวจสอบความครบถ้วนของชื่อ ที่อยู่ ผู้ถูกร้อง และข้อกล่าวหา",
    color: "blue",
  },
  {
    id: "review-2",
    label: "พนักงานตรวจคำร้อง ชั้น 2",
    shortLabel: "ตรวจคำร้อง ชั้น 2",
    category: "provincial",
    categoryLabel: "ส่วนภูมิภาค (สนง.กกต.จว.)",
    scope: "ตรวจข้อเท็จจริงเบื้องต้นตามข้อ 27/28 และทำความเห็น",
    stage: "ตรวจคำร้องชั้น 2",
    level: 1,
    description: "ตรวจพฤติการณ์ มูลกรณี และทำความเห็นเสนอ ผอ.กกต.จว.",
    color: "blue",
  },
  {
    id: "director",
    label: "ลธ./ผอ.สนง.กกต.จว.",
    shortLabel: "ผอ.กกต.จว.",
    category: "provincial",
    categoryLabel: "ส่วนภูมิภาค (สนง.กกต.จว.)",
    scope: "สั่งรับ ไม่รับ หรือยกคำร้อง และมอบหมายพนักงานสืบสวน",
    stage: "พิจารณาสั่งรับ / ส่งส่วนกลาง",
    level: 2,
    description: "ผู้มีอำนาจสั่งการระดับจังหวัด อนุมัติขยายเวลาสืบสวน และส่งสำนวนให้ส่วนกลาง",
    color: "indigo",
  },
  {
    id: "investigation",
    label: "คณะกรรมการสืบสวนและไต่สวน",
    shortLabel: "คกก.สืบสวนฯ",
    category: "provincial",
    categoryLabel: "ส่วนภูมิภาค (สนง.กกต.จว.)",
    scope: "แสวงหาพยานหลักฐาน ไต่สวนพยาน และสรุปสำนวน",
    stage: "สืบสวน/ไต่สวน",
    level: 2,
    description: "ดำเนินการสืบสวน รวบรวมหลักฐาน แจ้งข้อกล่าวหา และทำรายงานการสืบสวน",
    color: "purple",
  },
  {
    id: "sequential",
    label: "ผู้ตรวจสำนวนส่วนกลาง (4 ลำดับชั้น)",
    shortLabel: "ตรวจสำนวนส่วนกลาง",
    category: "central",
    categoryLabel: "ส่วนกลาง (สนง.กกต.)",
    scope: "ผอ.ฝ่าย → รอง ผอ.สำนัก → ผอ.สำนัก → ลธ.กกต.",
    stage: "ตรวจสำนวนส่วนกลาง",
    level: 3,
    description: "ตรวจทานความถูกต้องทางกฎหมายและพยานหลักฐานตามสายการบังคับบัญชา",
    color: "emerald",
  },
  {
    id: "subcommittee",
    label: "เลขาคณะอนุวินิจฉัย",
    shortLabel: "คณะอนุวินิจฉัย",
    category: "central",
    categoryLabel: "ส่วนกลาง (สนง.กกต.)",
    scope: "โอนเรื่อง นัดประชุม ยืมเงินราชการ และบันทึกความเห็น",
    stage: "คณะอนุวินิจฉัย",
    level: 3,
    description: "บริหารงานประชุมคณะอนุกรรมการวินิจฉัย และจัดทำความเห็นเสนอ กกต.",
    color: "amber",
  },
  {
    id: "commission",
    label: "คณะกรรมการการเลือกตั้ง (กกต.)",
    shortLabel: "กกต. วินิจฉัยชี้ขาด",
    category: "central",
    categoryLabel: "ส่วนกลาง (สนง.กกต.)",
    scope: "พิจารณาวินิจฉัยชี้ขาดสำนวนคำร้องคัดค้าน",
    stage: "กกต. วินิจฉัย",
    level: 4,
    description: "มีอำนาจวินิจฉัยชี้ขาด: ยกคำร้อง สั่งเลือกตั้งใหม่ สั่งเพิกถอนสิทธิ",
    color: "rose",
  },
  {
    id: "secretary",
    label: "ลธ.กกต. จัดทำคำวินิจฉัย",
    shortLabel: "จัดทำและแจ้งคำวินิจฉัย",
    category: "central",
    categoryLabel: "ส่วนกลาง (สนง.กกต.)",
    scope: "จัดทำร่างคำวินิจฉัย ตรวจร่าง และแจ้งผล (ข้อ 84)",
    stage: "จัดทำและแจ้งคำวินิจฉัย",
    level: 4,
    description: "จัดทำคำวินิจฉัยฉบับสมบูรณ์ แจ้งคำวินิจฉัยให้ ผอ.กกต.จว. และคู่กรณีทราบ",
    color: "teal",
  },
  {
    id: "admin",
    label: "ผู้ดูแลระบบ (System Admin)",
    shortLabel: "ผู้ดูแลระบบ",
    category: "admin",
    categoryLabel: "ศูนย์ผู้ดูแลระบบ (Admin)",
    scope: "จัดการผู้ใช้, สิทธิ์ RBAC, นโยบายความปลอดภัย, Workflow, และ Audit Log",
    stage: "ทุกขั้นตอนและระบบกลาง",
    level: 5,
    description: "สิทธิ์เต็มทุกเมนู สำหรับดูแลและกำกับระบบความปลอดภัยทั้งระบบ",
    color: "slate",
  },
  {
    id: "citizen",
    label: "ผู้ร้องเรียน (Citizen)",
    shortLabel: "ผู้ร้องเรียน",
    category: "citizen",
    categoryLabel: "บริการประชาชน",
    scope: "ยื่นคำร้อง ติดตามสถานะ ส่งเอกสารเพิ่มเติม และรับผลการพิจารณา",
    stage: "บริการผู้ร้อง",
    level: 0,
    description: "ผู้มีสิทธิเลือกตั้ง/ผู้สมัคร ยืนยันตัวตนด้วย ThaID",
    color: "sky",
  },
];

// ==========================================
// 2. PERMISSION KEYS & PERMISSION MATRIX
// ==========================================

export type PermissionKey =
  | "complaint_intake"          // รับคำร้องและออกเลข
  | "complaint_review"          // ตรวจคุณสมบัติและองค์ประกอบ
  | "request_correction"       // แจ้งผู้ร้องแก้ไขเพิ่มเติม (ข้อ 26(2))
  | "provincial_order"         // ผอ. สั่งรับ/ไม่รับ/ยกคำร้อง
  | "assign_investigator"      // มอบหมายพนักงานสืบสวน
  | "conduct_investigation"    // ดำเนินการสืบสวนและไต่สวน
  | "request_extension"        // ขอขยายเวลาสืบสวน 15+15 วัน
  | "central_review"           // ตรวจสำนวน 4 ลำดับชั้น
  | "subcommittee_meeting"     // นัดประชุมและบันทึกความเห็นคณะอนุฯ
  | "commission_ruling"        // กกต. วินิจฉัยชี้ขาด
  | "prepare_decree"           // จัดทำคำวินิจฉัย กกต. (ข้อ 84)
  | "notify_result"            // แจ้งมติและปิดสำนวน
  | "view_province_only"       // ดูเฉพาะข้อมูลจังหวัดตนเอง
  | "view_nationwide"          // ดูข้อมูลทั่วประเทศ
  | "manage_users"             // เพิ่ม/แก้ไข/ระงับผู้ใช้งาน
  | "manage_rbac"              // กำหนดสิทธิ์ Role & Permissions
  | "manage_security"          // ตั้งค่านโยบายความปลอดภัย 2FA/Session
  | "manage_workflow_sla"      // ปรับปรุง Workflow & SLA
  | "manage_master_data"       // จัดการข้อมูลพื้นฐาน
  | "view_audit_trail"         // ดูประวัติ Audit Log
  | "export_audit_log";        // ส่งออกรายงาน Audit Log

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: { key: PermissionKey; label: string; desc: string }[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "intake_review",
    name: "1. การรับและตรวจคำร้อง (Intake & Review)",
    description: "กระบวนการชั้นต้นที่ สนง.กกต.จว.",
    permissions: [
      { key: "complaint_intake", label: "บันทึกรับคำร้อง", desc: "ออกเลขรับและพิมพ์ใบรับ สตว.1" },
      { key: "complaint_review", label: "ตรวจความครบถ้วน", desc: "ตรวจองค์ประกอบตามข้อ 22 และสิทธิข้อ 23" },
      { key: "request_correction", label: "แจ้งแก้ไขเพิ่มเติม", desc: "แจ้งผู้ร้องแก้ไขเอกสารตามข้อ 26(2)" },
    ],
  },
  {
    id: "provincial_governance",
    name: "2. การสั่งการและสืบสวนระดับจังหวัด (Provincial Stage)",
    description: "อำนาจ ผอ.สนง.กกต.จว. และ คกก.สืบสวนฯ",
    permissions: [
      { key: "provincial_order", label: "สั่งรับ/ไม่รับคำร้อง", desc: "สั่งการรับคำร้องหรือยกคำร้อง" },
      { key: "assign_investigator", label: "มอบหมายผู้รับผิดชอบ", desc: "แต่งตั้งคณะกรรมการสืบสวน" },
      { key: "conduct_investigation", label: "บันทึกผลสืบสวน", desc: "ไต่สวนพยานและทำสรุปสำนวน" },
      { key: "request_extension", label: "ขอ/อนุมัติขยายเวลา", desc: "ขยายเวลาสืบสวน 15 วัน (ข้อ 41 ว.3)" },
    ],
  },
  {
    id: "central_stage",
    name: "3. การตรวจสำนวนและคณะอนุวินิจฉัย (Central Stage)",
    description: "กระบวนการส่วนกลาง สนง.กกต.",
    permissions: [
      { key: "central_review", label: "ตรวจสำนวน 4 ลำดับชั้น", desc: "ผอ.ฝ่าย → รอง ผอ.สำนัก → ผอ.สำนัก → ลธ." },
      { key: "subcommittee_meeting", label: "บริหารคณะอนุวินิจฉัย", desc: "นัดประชุมและบันทึกความเห็น" },
    ],
  },
  {
    id: "commission_ruling",
    name: "4. การวินิจฉัยชี้ขาดและจัดทำคำวินิจฉัย (Ruling & Decree)",
    description: "อำนาจ กกต. และ เลขาธิการ กกต.",
    permissions: [
      { key: "commission_ruling", label: "กกต. วินิจฉัยชี้ขาด", desc: "วินิจฉัยยกคำร้อง/เลือกตั้งใหม่/เพิกถอนสิทธิ" },
      { key: "prepare_decree", label: "จัดทำคำวินิจฉัย", desc: "จัดทำร่างคำวินิจฉัย กกต. (ข้อ 84)" },
      { key: "notify_result", label: "แจ้งมติและปิดเรื่อง", desc: "แจ้ง ผอ.กกต.จว. และคู่กรณี" },
    ],
  },
  {
    id: "data_scope",
    name: "5. ขอบเขตข้อมูล (Data Scope)",
    description: "การมองเห็นข้อมูลตามพื้นที่รับผิดชอบ",
    permissions: [
      { key: "view_province_only", label: "เห็นเฉพาะจังหวัดสังกัด", desc: "จำกัดการเข้าถึงเฉพาะจังหวัดตนเอง" },
      { key: "view_nationwide", label: "เห็นข้อมูลทั่วประเทศ", desc: "เข้าถึงสำนวนได้ทุกจังหวัด" },
    ],
  },
  {
    id: "admin_governance",
    name: "6. การบริหารระบบและความปลอดภัย (Admin & Governance)",
    description: "สิทธิ์เฉพาะผู้ดูแลระบบ (System Admin)",
    permissions: [
      { key: "manage_users", label: "จัดการบัญชีผู้ใช้", desc: "เพิ่ม แก้ไข ระงับ ปลดล็อค รีเซ็ตรหัส" },
      { key: "manage_rbac", label: "กำหนดสิทธิ์ RBAC", desc: "ปรับปรุงตารางสิทธิ์ตามบทบาท" },
      { key: "manage_security", label: "นโยบายความปลอดภัย", desc: "ตั้งค่า 2FA, Auto-logout, Data masking" },
      { key: "manage_workflow_sla", label: "จัดการ Workflow/SLA", desc: "ปรับแก้ SLA และออก Version ใหม่" },
      { key: "manage_master_data", label: "จัดการข้อมูลพื้นฐาน", desc: "จังหวัด เขตเลือกตั้ง ข้อกล่าวหา" },
      { key: "view_audit_trail", label: "ดู Audit Trail Logs", desc: "ตรวจสอบประวัติการเข้าถึงและการสั่งการ" },
      { key: "export_audit_log", label: "ส่งออก Audit Logs", desc: "Export ข้อมูล ROPA/Audit เป็น CSV/JSON" },
    ],
  },
];

// Default Matrix configuration per role
export const DEFAULT_ROLE_PERMISSIONS: Record<SystemRoleId, PermissionKey[]> = {
  intake: ["complaint_intake", "complaint_review", "request_correction", "view_province_only"],
  "review-1": ["complaint_review", "request_correction", "view_province_only"],
  "review-2": ["complaint_review", "request_correction", "view_province_only"],
  director: ["complaint_review", "request_correction", "provincial_order", "assign_investigator", "request_extension", "view_province_only"],
  investigation: ["conduct_investigation", "request_extension", "view_province_only"],
  sequential: ["central_review", "view_nationwide"],
  subcommittee: ["subcommittee_meeting", "view_nationwide"],
  commission: ["commission_ruling", "view_nationwide"],
  secretary: ["prepare_decree", "notify_result", "view_nationwide"],
  admin: [
    "complaint_intake",
    "complaint_review",
    "request_correction",
    "provincial_order",
    "assign_investigator",
    "conduct_investigation",
    "request_extension",
    "central_review",
    "subcommittee_meeting",
    "commission_ruling",
    "prepare_decree",
    "notify_result",
    "view_nationwide",
    "manage_users",
    "manage_rbac",
    "manage_security",
    "manage_workflow_sla",
    "manage_master_data",
    "view_audit_trail",
    "export_audit_log",
  ],
  citizen: ["view_province_only"],
};

// ==========================================
// 3. USER ACCOUNT MODEL & MOCK USERS
// ==========================================

export type UserStatus = "ACTIVE" | "SUSPENDED" | "LOCKED";

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  roleId: SystemRoleId;
  province: string;
  section: string;
  email: string;
  phone: string;
  status: UserStatus;
  lastLogin: string;
  twoFactorEnabled: boolean;
  loginAttempts: number;
  avatarInitials: string;
  customPermissions?: PermissionKey[];
}

export const INITIAL_USERS: UserAccount[] = [
  {
    id: "usr-001",
    username: "varakorn_cmi",
    name: "วรากร กรณีศึกษา011",
    roleId: "intake",
    province: "เชียงใหม่",
    section: "สนง.กกต.จว. เชียงใหม่",
    email: "varakorn.c@ect.go.th",
    phone: "053-112-184",
    status: "ACTIVE",
    lastLogin: "2026-08-27 11:42",
    twoFactorEnabled: true,
    loginAttempts: 0,
    avatarInitials: "วก",
  },
  {
    id: "usr-002",
    username: "review1_cmi",
    name: "นางสาวศิริพร ตรวจสอบ",
    roleId: "review-1",
    province: "เชียงใหม่",
    section: "สนง.กกต.จว. เชียงใหม่",
    email: "siriporn.t@ect.go.th",
    phone: "053-112-185",
    status: "ACTIVE",
    lastLogin: "2026-08-27 09:15",
    twoFactorEnabled: true,
    loginAttempts: 0,
    avatarInitials: "ศพ",
  },
  {
    id: "usr-003",
    username: "director_somsak",
    name: "ผอ.สมศักดิ์ บริหารงาน",
    roleId: "director",
    province: "เชียงใหม่",
    section: "สนง.กกต.จว. เชียงใหม่",
    email: "somsak.b@ect.go.th",
    phone: "053-112-180",
    status: "ACTIVE",
    lastLogin: "2026-08-27 10:30",
    twoFactorEnabled: true,
    loginAttempts: 0,
    avatarInitials: "สศ",
  },
  {
    id: "usr-004",
    username: "invest_wichai",
    name: "พ.ต.อ.วิชัย สืบสวน",
    roleId: "investigation",
    province: "เชียงใหม่",
    section: "กลุ่มงานสืบสวน สนง.กกต.จว. เชียงใหม่",
    email: "wichai.s@ect.go.th",
    phone: "053-112-188",
    status: "ACTIVE",
    lastLogin: "2026-08-26 16:45",
    twoFactorEnabled: true,
    loginAttempts: 0,
    avatarInitials: "วช",
  },
  {
    id: "usr-005",
    username: "central_pichet",
    name: "นายพิเชษฐ์ ตรวจสำนวน",
    roleId: "sequential",
    province: "ส่วนกลาง",
    section: "สำนักกฎหมายและคดี สนง.กกต.",
    email: "pichet.k@ect.go.th",
    phone: "02-141-8120",
    status: "ACTIVE",
    lastLogin: "2026-08-27 08:50",
    twoFactorEnabled: true,
    loginAttempts: 0,
    avatarInitials: "พช",
  },
  {
    id: "usr-006",
    username: "subcom_chairat",
    name: "นายชัยรัตน์ อนุวินิจฉัย",
    roleId: "subcommittee",
    province: "ส่วนกลาง",
    section: "กลุ่มงานคณะอนุกรรมการวินิจฉัย สนง.กกต.",
    email: "chairat.a@ect.go.th",
    phone: "02-141-8155",
    status: "ACTIVE",
    lastLogin: "2026-08-27 11:10",
    twoFactorEnabled: true,
    loginAttempts: 0,
    avatarInitials: "ชร",
  },
  {
    id: "usr-007",
    username: "comm_winij",
    name: "ศ.ดร.วินิจฉัย ชี้ขาด (กกต.)",
    roleId: "commission",
    province: "ส่วนกลาง",
    section: "คณะกรรมการการเลือกตั้ง",
    email: "commissioner1@ect.go.th",
    phone: "02-141-8001",
    status: "ACTIVE",
    lastLogin: "2026-08-27 09:40",
    twoFactorEnabled: true,
    loginAttempts: 0,
    avatarInitials: "วช",
  },
  {
    id: "usr-008",
    username: "sec_thanakorn",
    name: "นายธนากร จัดทำคำวินิจฉัย",
    roleId: "secretary",
    province: "ส่วนกลาง",
    section: "สำนักวินิจฉัยและคดี สนง.กกต.",
    email: "thanakorn.t@ect.go.th",
    phone: "02-141-8200",
    status: "ACTIVE",
    lastLogin: "2026-08-26 17:20",
    twoFactorEnabled: true,
    loginAttempts: 0,
    avatarInitials: "ธน",
  },
  {
    id: "usr-009",
    username: "admin_root",
    name: "GIT Admin (System Administrator)",
    roleId: "admin",
    province: "ส่วนกลาง",
    section: "ศูนย์เทคโนโลยีสารสนเทศ สนง.กกต.",
    email: "sysadmin@ect.go.th",
    phone: "02-141-8888",
    status: "ACTIVE",
    lastLogin: "2026-08-27 12:05",
    twoFactorEnabled: true,
    loginAttempts: 0,
    avatarInitials: "GA",
  },
  {
    id: "usr-010",
    username: "kkn_director",
    name: "ผอ.เกียรติศักดิ์ ขอนแก่น",
    roleId: "director",
    province: "ขอนแก่น",
    section: "สนง.กกต.จว. ขอนแก่น",
    email: "kiattisak.k@ect.go.th",
    phone: "043-221-190",
    status: "ACTIVE",
    lastLogin: "2026-08-25 14:10",
    twoFactorEnabled: true,
    loginAttempts: 0,
    avatarInitials: "กศ",
  },
  {
    id: "usr-011",
    username: "bkk_intake",
    name: "นายอนุชา รับเรื่อง กทม.",
    roleId: "intake",
    province: "กรุงเทพมหานคร",
    section: "สนง.กกต.จว. กรุงเทพมหานคร",
    email: "anucha.b@ect.go.th",
    phone: "02-142-9900",
    status: "LOCKED",
    lastLogin: "2026-08-20 10:11",
    twoFactorEnabled: true,
    loginAttempts: 5,
    avatarInitials: "อช",
  },
];

// ==========================================
// 4. AUDIT LOG MODEL & INITIAL AUDIT EVENTS
// ==========================================

export type AuditActionType =
  | "AUTH_LOGIN"
  | "AUTH_LOGOUT"
  | "AUTH_FAILED"
  | "CASE_VIEW"
  | "CASE_INTAKE"
  | "CASE_CORRECTION_REQUESTED"
  | "CASE_DIRECTOR_ORDER"
  | "CASE_ASSIGN_OFFICER"
  | "CASE_EXTENSION_REQUESTED"
  | "CASE_INVESTIGATION_SUBMIT"
  | "CASE_CENTRAL_REVIEW"
  | "CASE_SUBCOMMITTEE_MEET"
  | "CASE_COMMISSION_RULING"
  | "CASE_DECREE_PREPARED"
  | "CASE_NOTIFY_RESULT"
  | "USER_CREATE"
  | "USER_UPDATE"
  | "USER_UPDATE_ROLE"
  | "USER_DELETE"
  | "USER_SUSPEND"
  | "USER_UNLOCK"
  | "USER_RESET_PASSWORD"
  | "SECURITY_POLICY_UPDATE"
  | "WORKFLOW_SLA_UPDATE"
  | "MASTER_DATA_UPDATE";

export type AuditStatus = "SUCCESS" | "WARNING" | "FAILED" | "ALERT";

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: SystemRoleId;
  userRoleLabel: string;
  action: AuditActionType;
  actionLabel: string;
  caseNumber?: string;
  province?: string;
  ipAddress: string;
  userAgent?: string;
  status: AuditStatus;
  details: string;
}

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: "aud-001",
    timestamp: "2026-08-27 12:05:14",
    userId: "usr-009",
    userName: "GIT Admin",
    userRole: "admin",
    userRoleLabel: "ผู้ดูแลระบบ",
    action: "AUTH_LOGIN",
    actionLabel: "เข้าสู่ระบบ (2FA Verified)",
    ipAddress: "192.168.1.10",
    status: "SUCCESS",
    details: "เข้าสู่ระบบผ่าน Hardware Token + Password สำเร็จ",
  },
  {
    id: "aud-002",
    timestamp: "2026-08-27 11:42:15",
    userId: "usr-001",
    userName: "วรากร กรณีศึกษา011",
    userRole: "intake",
    userRoleLabel: "พนักงานรับคำร้อง",
    action: "CASE_INTAKE",
    actionLabel: "บันทึกรับคำร้องใหม่ (สตว.1)",
    caseNumber: "MP-CMI-2569-001",
    province: "เชียงใหม่",
    ipAddress: "192.168.10.45",
    status: "SUCCESS",
    details: "ออกเลขรับคำร้อง MP-CMI-2569-001 ตรวจสอบผู้ร้องผ่าน ThaID และ DOPA Linkage แล้ว",
  },
  {
    id: "aud-003",
    timestamp: "2026-08-27 11:30:00",
    userId: "usr-003",
    userName: "ผอ.สมศักดิ์ บริหารงาน",
    userRole: "director",
    userRoleLabel: "ผอ.สนง.กกต.จว.",
    action: "CASE_DIRECTOR_ORDER",
    actionLabel: "สั่งรับคำร้องและแต่งตั้ง คกก.สืบสวน",
    caseNumber: "MP-CMI-2569-002",
    province: "เชียงใหม่",
    ipAddress: "192.168.10.12",
    status: "SUCCESS",
    details: "มีคำสั่งรับคำร้องข้อกล่าวหาซื้อเสียง มอบหมาย พ.ต.อ.วิชัย เป็นหัวหน้าคณะสืบสวน",
  },
  {
    id: "aud-004",
    timestamp: "2026-08-27 10:15:22",
    userId: "citizen-077",
    userName: "นายศุภชัย ทดสอบ077 (ประชาชน)",
    userRole: "citizen",
    userRoleLabel: "ผู้ร้องเรียน",
    action: "CASE_VIEW",
    actionLabel: "สืบค้นและติดตามสถานะคำร้อง",
    caseNumber: "MP-CMI-2569-001",
    province: "เชียงใหม่",
    ipAddress: "182.232.14.88",
    status: "SUCCESS",
    details: "ตรวจสอบ Timeline ผ่าน Citizen Portal (ยืนยัน ThaID เรียบร้อย)",
  },
  {
    id: "aud-005",
    timestamp: "2026-08-27 09:50:11",
    userId: "system-engine",
    userName: "System SLA Engine",
    userRole: "admin",
    userRoleLabel: "ระบบอัตโนมัติ",
    action: "CASE_VIEW",
    actionLabel: "คำนวณและแจ้งเตือน SLA Warning",
    caseNumber: "MP-KKN-2569-004",
    province: "ขอนแก่น",
    ipAddress: "127.0.0.1",
    status: "ALERT",
    details: "สำนวนเหลือเวลา 2 วันก่อนครบกำหนดขั้นตอนสืบสวน ส่งแจ้งเตือน ผอ.กกต.จว.ขอนแก่น",
  },
  {
    id: "aud-006",
    timestamp: "2026-08-27 09:12:44",
    userId: "usr-011",
    userName: "นายอนุชา รับเรื่อง กทม.",
    userRole: "intake",
    userRoleLabel: "พนักงานรับคำร้อง",
    action: "AUTH_FAILED",
    actionLabel: "รหัสผ่านผิดเกินกำหนด (บัญชีถูกระงับ)",
    ipAddress: "192.168.20.105",
    status: "FAILED",
    details: "พยายามล็อกอินผิดพลาด 5 ครั้ง บัญชีถูกล็อคตาม Security Policy 2.4",
  },
  {
    id: "aud-007",
    timestamp: "2026-08-26 16:30:19",
    userId: "usr-007",
    userName: "ศ.ดร.วินิจฉัย ชี้ขาด (กกต.)",
    userRole: "commission",
    userRoleLabel: "กกต.",
    action: "CASE_COMMISSION_RULING",
    actionLabel: "บันทึกมติ กกต. วินิจฉัยชี้ขาด",
    caseNumber: "SEN-BKK-2569-003",
    province: "กรุงเทพมหานคร",
    ipAddress: "192.168.1.55",
    status: "SUCCESS",
    details: "มติที่ประชุม กกต. สั่งยกคำร้อง เนื่องจากพยานหลักฐานไม่เพียงพอ ส่งต่อ ลธ.กกต. จัดทำคำวินิจฉัย",
  },
];

// ==========================================
// 5. SECURITY POLICY CONFIGURATION
// ==========================================

export interface SecurityPolicyConfig {
  enforceTwoFactorAll: boolean;
  enforceTwoFactorAdminOnly: boolean;
  autoLogoutMinutes: number;
  dataMaskingEnabled: boolean;
  maxFailedLoginAttempts: number;
  passwordMinLength: number;
  passwordRequireSpecial: boolean;
  passwordExpireDays: number;
  ipWhitelistEnabled: boolean;
  retentionYears: number;
}

export const DEFAULT_SECURITY_POLICY: SecurityPolicyConfig = {
  enforceTwoFactorAll: true,
  enforceTwoFactorAdminOnly: false,
  autoLogoutMinutes: 15,
  dataMaskingEnabled: true,
  maxFailedLoginAttempts: 5,
  passwordMinLength: 8,
  passwordRequireSpecial: true,
  passwordExpireDays: 90,
  ipWhitelistEnabled: false,
  retentionYears: 10,
};

// ==========================================
// 6. WORKFLOW VERSIONING CONFIGURATION
// ==========================================

export interface WorkflowVersion {
  version: string;
  name: string;
  effectiveDate: string;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
  ruleReference: string;
  totalSlaDays: number;
  publishedBy: string;
  notes: string;
}

export const WORKFLOW_VERSIONS: WorkflowVersion[] = [
  {
    version: "v1.3",
    name: "ระเบียบ กกต. ว่าด้วยการสืบสวนและไต่สวน พ.ศ. ๒๕๖๖ (ฉบับที่ ๓)",
    effectiveDate: "2569-01-01",
    status: "ACTIVE",
    ruleReference: "ข้อ ๒๒-ข้อ ๘๕ (ราชกิจจานุเบกษา)",
    totalSlaDays: 290,
    publishedBy: "GIT Admin (กกต.ส่วนกลาง)",
    notes: "ปรับปรุงกรอบเวลาคณะอนุวินิจฉัยเป็น 90 วัน และเพิ่มขั้นตอนแจ้งผู้ร้องแก้ไขเพิ่มเติมตามข้อ 26(2)",
  },
  {
    version: "v1.4",
    name: "ร่างประกาศขั้นตอนเร่งรัดคดีเลือกตั้งท้องถิ่น พ.ศ. ๒๕๖๙",
    effectiveDate: "2569-10-01",
    status: "DRAFT",
    ruleReference: "ร่างระเบียบวาระที่ ๒",
    totalSlaDays: 180,
    publishedBy: "สำนักกฎหมายและคดี",
    notes: "ลดเวลาตรวจสำนวนส่วนกลางจาก 60 วัน เหลือ 30 วัน",
  },
  {
    version: "v1.2",
    name: "ระเบียบ กกต. ว่าด้วยการสืบสวนฯ พ.ศ. ๒๕๖๑ (เดิม)",
    effectiveDate: "2561-12-28",
    status: "ARCHIVED",
    ruleReference: "ระเบียบเดิม พ.ศ. ๒๕๖๑",
    totalSlaDays: 360,
    publishedBy: "System Archive",
    notes: "ยกเลิกและแทนที่ด้วยฉบับที่ ๓",
  },
];

// ==========================================
// 7. INTEGRATIONS CONFIGURATION
// ==========================================

export interface IntegrationSystem {
  id: string;
  name: string;
  shortName: string;
  agency: string;
  endpointUrl: string;
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  latencyMs: number;
  certValidUntil: string;
  certIssuer: string;
  retryMax: number;
  timeoutMs: number;
  lastPing: string;
  description: string;
  authType: string;
}

export const INITIAL_INTEGRATIONS: IntegrationSystem[] = [
  {
    id: "dxc",
    name: "ฐานข้อมูลทะเบียนราษฎรและสิทธิเลือกตั้ง",
    shortName: "DXC / Linkage Center",
    agency: "กรมการปกครอง (DOPA)",
    endpointUrl: "https://api.dxc.dopa.go.th/v2/citizens/verify",
    status: "ONLINE",
    latencyMs: 128,
    certValidUntil: "2027-05-15",
    certIssuer: "Government Root CA - G1",
    retryMax: 3,
    timeoutMs: 5000,
    lastPing: "เมื่อสักครู่",
    description: "ตรวจสอบตัวตน 13 หลัก, ตรวจสอบผู้มีสิทธิเลือกตั้งในเขต (ข้อ 23), และดึงรูปพรรณ",
    authType: "Mutual TLS + JWT Bearer",
  },
  {
    id: "esaraban",
    name: "ระบบสารบรรณอิเล็กทรอนิกส์กลาง",
    shortName: "e-Saraban",
    agency: "สำนักงาน กกต. ส่วนกลาง",
    endpointUrl: "https://saraban.ect.go.th/api/v1/dispatch",
    status: "ONLINE",
    latencyMs: 214,
    certValidUntil: "2026-11-30",
    certIssuer: "ECT Internal Authority",
    retryMax: 5,
    timeoutMs: 8000,
    lastPing: "เมื่อสักครู่",
    description: "รับ-ส่งหนังสือราชการ ออกเลขหนังสืออัตโนมัติ และส่งสำนวนคำวินิจฉัยระหว่างจังหวัดกับส่วนกลาง",
    authType: "API Key + Secret Token",
  },
  {
    id: "praxticol",
    name: "ระบบฐานข้อมูลการเลือกตั้งและผลคะแนน",
    shortName: "PRAXTICOL",
    agency: "สำนักบริหารการเลือกตั้ง สนง.กกต.",
    endpointUrl: "https://praxticol.ect.go.th/services/candidates",
    status: "ONLINE",
    latencyMs: 176,
    certValidUntil: "2027-02-28",
    certIssuer: "Government Root CA - G2",
    retryMax: 3,
    timeoutMs: 4000,
    lastPing: "เมื่อสักครู่",
    description: "ตรวจสอบสถานะผู้สมัครรับเลือกตั้ง พิกัดหน่วยเลือกตั้ง ข้อมูลเขตเลือกตั้ง และผลคะแนนเลือกตั้ง",
    authType: "OAuth 2.0 / Client Credentials",
  },
];

// ==========================================
// 8. DATA SCOPE FILTER HELPER
// ==========================================

export function getScopedCases<T extends { province: string }>(userProvince: string, userRole: SystemRoleId, cases: T[]): T[] {
  if (userRole === "admin" || userProvince === "ส่วนกลาง" || ["sequential", "subcommittee", "commission", "secretary"].includes(userRole)) {
    return cases;
  }
  return cases.filter((item) => item.province === userProvince);
}

// ==========================================
// 9. LOCAL STORAGE PERSISTENCE HOOKS
// ==========================================

const USERS_STORAGE_KEY = "oect-users-v2";
const AUDIT_STORAGE_KEY = "oect-audit-v2";
const SECURITY_STORAGE_KEY = "oect-security-v2";
const PERMISSIONS_STORAGE_KEY = "oect-permissions-v2";

export function useUsersStore() {
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        setUsers(JSON.parse(stored));
      } else {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      }
    } catch {
      // fallback
    }
    setIsLoaded(true);
  }, []);

  const saveUsers = (updater: UserAccount[] | ((prev: UserAccount[]) => UserAccount[])) => {
    setUsers((prev) => {
      const updated = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  return [users, saveUsers, isLoaded] as const;
}

export function useAuditLogStore() {
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (stored) {
        setAuditLogs(JSON.parse(stored));
      } else {
        localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      }
    } catch {
      // fallback
    }
  }, []);

  const appendAuditLog = (event: Omit<AuditEvent, "id" | "timestamp">) => {
    const newLog: AuditEvent = {
      ...event,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
    };
    setAuditLogs((prev) => {
      const updated = [newLog, ...prev];
      try {
        localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  return [auditLogs, appendAuditLog] as const;
}

export function useSecurityPolicyStore() {
  const [policy, setPolicy] = useState<SecurityPolicyConfig>(DEFAULT_SECURITY_POLICY);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SECURITY_STORAGE_KEY);
      if (stored) {
        setPolicy(JSON.parse(stored));
      } else {
        localStorage.setItem(SECURITY_STORAGE_KEY, JSON.stringify(DEFAULT_SECURITY_POLICY));
      }
    } catch {
      // fallback
    }
  }, []);

  const savePolicy = (newPolicy: SecurityPolicyConfig) => {
    setPolicy(newPolicy);
    try {
      localStorage.setItem(SECURITY_STORAGE_KEY, JSON.stringify(newPolicy));
    } catch {
      // ignore
    }
  };

  return [policy, savePolicy] as const;
}

export function useRolePermissionsStore() {
  const [rolePermissions, setRolePermissions] = useState<Record<SystemRoleId, PermissionKey[]>>(DEFAULT_ROLE_PERMISSIONS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
      if (stored) {
        setRolePermissions(JSON.parse(stored));
      } else {
        localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(DEFAULT_ROLE_PERMISSIONS));
      }
    } catch {
      // fallback
    }
  }, []);

  const togglePermission = (roleId: SystemRoleId, permissionKey: PermissionKey) => {
    setRolePermissions((prev) => {
      const current = prev[roleId] ?? [];
      const updated = current.includes(permissionKey)
        ? current.filter((k) => k !== permissionKey)
        : [...current, permissionKey];
      const nextMatrix = { ...prev, [roleId]: updated };
      try {
        localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(nextMatrix));
      } catch {
        // ignore
      }
      return nextMatrix;
    });
  };

  const resetToDefault = () => {
    setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
    try {
      localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(DEFAULT_ROLE_PERMISSIONS));
    } catch {
      // ignore
    }
  };

  return [rolePermissions, togglePermission, resetToDefault] as const;
}
