"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileCheck,
  FileClock,
  FileSpreadsheet,
  Filter,
  Key,
  Lock,
  LockKeyhole,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  User,
  XCircle,
} from "lucide-react";
import {
  useAuditLogStore,
  useSecurityPolicyStore,
  type AuditActionType,
  type AuditEvent,
  type AuditStatus,
  type SecurityPolicyConfig,
} from "@/components/oect/rbacDomain";

interface AdminSecurityAuditViewProps {
  onNotify?: (text: string) => void;
}

export default function AdminSecurityAuditView({ onNotify }: AdminSecurityAuditViewProps) {
  const [auditLogs] = useAuditLogStore();
  const [policy, savePolicy] = useSecurityPolicyStore();

  const [activeTab, setActiveTab] = useState<"audit" | "policy">("audit");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [actionFilter, setActionFilter] = useState<string>("ALL");
  const [selectedLog, setSelectedLog] = useState<AuditEvent | null>(null);

  // Policy Form State
  const [formData, setFormData] = useState<SecurityPolicyConfig>({ ...policy });

  const notify = (msg: string) => {
    if (onNotify) onNotify(msg);
  };

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchQuery =
        !searchQuery ||
        `${log.userName} ${log.actionLabel} ${log.caseNumber || ""} ${log.ipAddress} ${log.details}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "ALL" || log.status === statusFilter;
      const matchAction = actionFilter === "ALL" || log.action === actionFilter;
      return matchQuery && matchStatus && matchAction;
    });
  }, [auditLogs, searchQuery, statusFilter, actionFilter]);

  const successCount = auditLogs.filter((l) => l.status === "SUCCESS").length;
  const alertCount = auditLogs.filter((l) => l.status === "ALERT" || l.status === "WARNING").length;
  const failedCount = auditLogs.filter((l) => l.status === "FAILED").length;

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    savePolicy(formData);
    notify("บันทึกการปรับปรุงนโยบายความมั่นคงปลอดภัย (Security Policy) เรียบร้อยแล้ว");
  };

  const handleExport = (format: "csv" | "json") => {
    if (format === "csv") {
      const headers = "ID,Timestamp,User,Role,Action,CaseNumber,Province,IPAddress,Status,Details\n";
      const rows = filteredLogs
        .map(
          (l) =>
            `"${l.id}","${l.timestamp}","${l.userName}","${l.userRoleLabel}","${l.actionLabel}","${l.caseNumber || "-"}","${l.province || "-"}","${l.ipAddress}","${l.status}","${l.details}"`
        )
        .join("\n");
      const blob = new Blob(["\uFEFF" + headers + rows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `oect_audit_log_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      notify("ส่งออกรายงาน Audit Log รูปแบบ CSV สำเร็จ");
    } else {
      const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `oect_audit_log_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      notify("ส่งออกรายงาน Audit Log รูปแบบ JSON สำเร็จ");
    }
  };

  return (
    <div className="space-y-6 pb-14">
      {/* Top Stat Metrics */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-slate-400">
            <span>บันทึกประวัติ (Audit Events)</span>
            <FileClock className="h-4 w-4 text-blue-700" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{auditLogs.length}</span>
            <span className="text-xs text-slate-500">เหตุการณ์</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400">บันทึกแบบ Append-only ไม่สามารถแก้ไขได้</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-emerald-600">
            <span>ดำเนินการสำเร็จ</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">{successCount}</span>
            <span className="text-xs text-emerald-600">รายการ</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-600">การเข้าถึงและสั่งการผ่านเกณฑ์สิทธิ์</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-amber-600">
            <span>การแจ้งเตือน & SLA</span>
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-700">{alertCount}</span>
            <span className="text-xs text-amber-600">ครั้ง</span>
          </div>
          <div className="mt-2 text-[10px] text-amber-600">การคำนวณและแจ้งเตือนกรอบเวลา</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-rose-600">
            <span>ถูกปฏิเสธ / ล็อกอินผิด</span>
            <XCircle className="h-4 w-4" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-700">{failedCount}</span>
            <span className="text-xs text-rose-600">ครั้ง</span>
          </div>
          <div className="mt-2 text-[10px] text-rose-600">ดักจับตาม Security Policy</div>
        </div>
      </div>

      {/* Main View Container */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Navigation Tabs */}
        <div className="flex flex-col border-b border-slate-200 bg-slate-50/70 p-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("audit")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                activeTab === "audit"
                  ? "bg-[#1B3F8B] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>บันทึกการใช้งาน Audit Trail Logs ({auditLogs.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("policy")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                activeTab === "policy"
                  ? "bg-[#1B3F8B] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <LockKeyhole className="h-4 w-4" />
              <span>ตั้งค่านโยบายความปลอดภัย (Security Policies)</span>
            </button>
          </div>

          {activeTab === "audit" && (
            <div className="mt-3 flex items-center gap-2 sm:mt-0">
              <button
                type="button"
                onClick={() => handleExport("csv")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={() => handleExport("json")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
              >
                <Download className="h-4 w-4 text-blue-700" />
                <span>Export JSON</span>
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: AUDIT TRAIL LOGS */}
        {activeTab === "audit" && (
          <div>
            {/* Filter Bar */}
            <div className="grid gap-3 border-b border-slate-100 p-4 sm:grid-cols-[1fr_auto_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาผู้ใช้, เลขที่สำนวน, IP Address, หรือรายละเอียด..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="ALL">ทุกผลลัพธ์ (All Status)</option>
                <option value="SUCCESS">สำเร็จ (SUCCESS)</option>
                <option value="ALERT">แจ้งเตือน (ALERT)</option>
                <option value="FAILED">ล้มเหลว (FAILED)</option>
              </select>

              {/* Action filter */}
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="ALL">ทุกประเภท Action</option>
                <option value="AUTH_LOGIN">เข้าสู่ระบบ (AUTH_LOGIN)</option>
                <option value="AUTH_FAILED">ล็อกอินผิด (AUTH_FAILED)</option>
                <option value="CASE_INTAKE">รับคำร้อง (CASE_INTAKE)</option>
                <option value="CASE_DIRECTOR_ORDER">สั่งการ ผอ. (CASE_DIRECTOR_ORDER)</option>
                <option value="CASE_COMMISSION_RULING">กกต. วินิจฉัย (CASE_COMMISSION_RULING)</option>
                <option value="CASE_VIEW">ดูข้อมูล (CASE_VIEW)</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5">วัน-เวลา (Timestamp)</th>
                    <th className="px-4 py-3.5">ผู้กระทำ (Actor)</th>
                    <th className="px-4 py-3.5">การกระทำ (Action)</th>
                    <th className="px-4 py-3.5">เลขที่สำนวน / จังหวัด</th>
                    <th className="px-4 py-3.5">IP Address</th>
                    <th className="px-4 py-3.5 text-center">สถานะ</th>
                    <th className="px-5 py-3.5 text-right">รายละเอียด</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-xs text-slate-400">
                        ไม่พบบันทึก Audit Log ตามเงื่อนไขที่ระบุ
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">
                          {log.timestamp}
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900">{log.userName}</div>
                          <div className="text-[10px] text-slate-400">{log.userRoleLabel}</div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-slate-800">{log.actionLabel}</div>
                          <div className="font-mono text-[9px] text-slate-400">{log.action}</div>
                        </td>

                        <td className="px-4 py-3.5">
                          {log.caseNumber ? (
                            <div>
                              <span className="font-kanit font-semibold text-[#1B3F8B]">{log.caseNumber}</span>
                              <div className="text-[10px] text-slate-400">{log.province}</div>
                            </div>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 font-mono text-[11px] text-slate-600">
                          {log.ipAddress}
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          {log.status === "SUCCESS" && (
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                              SUCCESS
                            </span>
                          )}
                          {log.status === "ALERT" && (
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800">
                              ALERT
                            </span>
                          )}
                          {log.status === "FAILED" && (
                            <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-bold text-rose-800">
                              FAILED
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedLog(log)}
                            className="inline-flex items-center gap-1 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-700"
                            title="ดูรายละเอียดเชิงลึก"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3 text-[10px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>บันทึก Audit Log ปฏิบัติตามมาตรฐาน ROPA, PDPA และ ISO/IEC 27001 (แก้ไขย้อนหลังไม่ได้)</span>
              </div>
              <div>แสดง {filteredLogs.length} รายการ</div>
            </div>
          </div>
        )}

        {/* TAB 2: SECURITY POLICIES FORM */}
        {activeTab === "policy" && (
          <form onSubmit={handleSavePolicy} className="p-6 space-y-6">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#1B3F8B]" />
                  นโยบายการยืนยันตัวตนและความปลอดภัยของระบบ (Security & Access Controls)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  กำกับความปลอดภัยของเซสชัน นโยบายรหัสผ่าน และการปกป้องข้อมูลส่วนบุคคล
                </p>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-[#1B3F8B] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#15326f]"
              >
                <CheckCircle2 className="h-4 w-4" />
                บันทึกนโยบายความปลอดภัย
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* 2FA Policy */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Smartphone className="h-4 w-4 text-blue-700" />
                  การยืนยันตัวตนสองขั้นตอน (Two-Factor Authentication)
                </div>
                <p className="text-xs text-slate-500">
                  เพิ่มความปลอดภัยด้วยการบังคับส่งรหัส OTP ทางมือถือ หรือ Hardware Token
                </p>

                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enforceTwoFactorAll}
                      onChange={(e) => setFormData({ ...formData, enforceTwoFactorAll: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded text-[#1B3F8B]"
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-800">บังคับใช้ 2FA สำหรับเจ้าหน้าที่ทุกคน 100%</div>
                      <div className="text-[10px] text-slate-400">รวมถึงระดับจังหวัดและส่วนกลางทุกขั้นตอน</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.dataMaskingEnabled}
                      onChange={(e) => setFormData({ ...formData, dataMaskingEnabled: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded text-[#1B3F8B]"
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-800">เปิดใช้งาน PDPA Data Masking อัตโนมัติ</div>
                      <div className="text-[10px] text-slate-400">ซ่อนเลขบัตร ปชช. 13 หลัก และข้อมูลอ่อนไหวสำหรับผู้ใช้ทั่วไป</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Session Policy */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Clock className="h-4 w-4 text-blue-700" />
                  การจัดการเซสชันและการหมดเวลา (Session Management)
                </div>
                <p className="text-xs text-slate-500">
                  กำหนดระยะเวลาตัดการเชื่อมต่ออัตโนมัติเมื่อไม่มีการใช้งาน (Idle Timeout)
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      ระยะเวลาตัดเซสชันอัตโนมัติ (Auto Logout)
                    </label>
                    <select
                      value={formData.autoLogoutMinutes}
                      onChange={(e) => setFormData({ ...formData, autoLogoutMinutes: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-blue-500"
                    >
                      <option value={15}>15 นาที (แนะนำตามมาตรฐานภาครัฐ)</option>
                      <option value={30}>30 นาที</option>
                      <option value={60}>60 นาที (1 ชั่วโมง)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      จำนวนครั้งที่อนุญาตให้ล็อกอินผิดก่อนล็อคบัญชี
                    </label>
                    <select
                      value={formData.maxFailedLoginAttempts}
                      onChange={(e) => setFormData({ ...formData, maxFailedLoginAttempts: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-blue-500"
                    >
                      <option value={3}>3 ครั้ง (เข้มงวด)</option>
                      <option value={5}>5 ครั้ง (มาตรฐาน)</option>
                      <option value={10}>10 ครั้ง</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Password Policy */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs md:col-span-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Key className="h-4 w-4 text-blue-700" />
                  นโยบายความซับซ้อนของรหัสผ่าน (Password Policy)
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">ความยาวรหัสผ่านขั้นต่ำ</label>
                    <input
                      type="number"
                      min={8}
                      max={32}
                      value={formData.passwordMinLength}
                      onChange={(e) => setFormData({ ...formData, passwordMinLength: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">อายุรหัสผ่าน (วัน)</label>
                    <input
                      type="number"
                      min={30}
                      max={365}
                      value={formData.passwordExpireDays}
                      onChange={(e) => setFormData({ ...formData, passwordExpireDays: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">ระยะเวลาจัดเก็บ Log (ปี)</label>
                    <input
                      type="number"
                      min={5}
                      max={20}
                      value={formData.retentionYears}
                      onChange={(e) => setFormData({ ...formData, retentionYears: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </section>

      {/* DETAIL MODAL FOR AUDIT LOG */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">รายละเอียดบันทึก Audit Trail Event</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Event ID</div>
                  <div className="font-mono text-slate-800">{selectedLog.id}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">วัน-เวลา</div>
                  <div className="font-mono text-slate-800">{selectedLog.timestamp}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">ผู้กระทำ</div>
                  <div className="font-semibold text-slate-900">{selectedLog.userName}</div>
                  <div className="text-[10px] text-slate-500">{selectedLog.userRoleLabel}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">IP Address</div>
                  <div className="font-mono text-slate-800">{selectedLog.ipAddress}</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">การกระทำ (Action)</div>
                <div className="font-semibold text-slate-900">{selectedLog.actionLabel}</div>
                <div className="font-mono text-[10px] text-blue-700">{selectedLog.action}</div>
              </div>

              {selectedLog.caseNumber && (
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">เลขที่สำนวน / จังหวัด</div>
                  <div className="font-semibold text-blue-900">{selectedLog.caseNumber} ({selectedLog.province})</div>
                </div>
              )}

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">รายละเอียดบันทึก</div>
                <div className="mt-1 rounded-xl bg-slate-100 p-3 leading-relaxed text-slate-700">
                  {selectedLog.details}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
