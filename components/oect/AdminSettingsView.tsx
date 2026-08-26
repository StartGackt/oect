"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  Lock, 
  Users, 
  Sliders, 
  Key, 
  Server, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  FileText,
  RefreshCw,
  Cpu
} from "lucide-react";

export default function AdminSettingsView() {
  const [activeTab, setActiveTab] = useState<"roles" | "sla" | "security" | "integrations">("roles");

  const rolesMatrix = [
    { role: "1. พนักงานส่วนภูมิภาค", intake: "✓", approve: "✗", ruling: "✗", viewGlobal: "✗", trackOwn: "✓", admin: "✗" },
    { role: "2. ผอ.สนง.กกต.จว.", intake: "✓", approve: "✓", ruling: "✗", viewGlobal: "เฉพาะจังหวัด", trackOwn: "✓", admin: "✗" },
    { role: "3. กกต./ลธ.กกต. ส่วนกลาง", intake: "✓", approve: "✓", ruling: "✓", viewGlobal: "✓ (ทั่วประเทศ)", trackOwn: "✓", admin: "✗" },
    { role: "4. ผู้ร้องเรียน (ประชาชน)", intake: "ยื่นคำร้อง", approve: "✗", ruling: "✗", viewGlobal: "✗", trackOwn: "✓", admin: "✗" },
    { role: "5. ผู้ดูแลระบบ (Admin)", intake: "✓", approve: "✓", ruling: "✓", viewGlobal: "✓", trackOwn: "✓", admin: "✓" },
  ];

  const auditLogs = [
    { id: 1, time: "2026-08-26 11:42:15", user: "วรากร กรณีศึกษา011", action: "บันทึกรับคำร้องใหม่", caseNum: "MP-CMI-2569-001", ip: "192.168.10.45", status: "SUCCESS" },
    { id: 2, time: "2026-08-26 11:30:00", user: "ผอ.สมศักดิ์ บริหารงาน", action: "อนุมัติคำสั่งรับคำร้อง (สว./ตส.)", caseNum: "MP-CMI-2569-002", ip: "192.168.10.12", status: "SUCCESS" },
    { id: 3, time: "2026-08-26 10:15:22", user: "นายศุภชัย ทดสอบ (ประชาชน)", action: "สืบค้นสถานะสำนวนผ่าน ThaID", caseNum: "MP-CMI-2569-001", ip: "182.232.14.88", status: "SUCCESS" },
    { id: 4, time: "2026-08-26 09:50:11", user: "System Auto-Engine", action: "คำนวณ SLA Warning แจ้งเตือน", caseNum: "MP-KKN-2569-004", ip: "127.0.0.1", status: "ALERT" },
  ];

  return (
    <div className="space-y-6 pb-14">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#173B6B] rounded-full" />
            <h2 className="text-base sm:text-lg font-semibold text-[#1A202C]">
              การจัดการระบบ ความปลอดภัย และการเชื่อมโยงข้อมูล (Admin & Governance)
            </h2>
          </div>
          <p className="text-xs text-[#718096] mt-0.5">
            ควบคุมสิทธิ์การเข้าถึง 5 ระดับ, ตรวจสอบความปลอดภัยตาม OWASP/PDPA และการเชื่อมโยงระบบภายนอก
          </p>
        </div>

        {/* Subtab Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: "roles", label: "👥 สิทธิ์ผู้ใช้ (5 ระดับ)" },
            { id: "sla", label: "⏱️ ตั้งค่า SLA" },
            { id: "security", label: "🔒 ความปลอดภัย & Logs" },
            { id: "integrations", label: "🔗 เชื่อมโยงระบบภายนอก" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#173B6B] text-white shadow-xs"
                  : "bg-[#F7FAFC] text-[#4A5568] hover:bg-[#EDF2F7]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUBTAB 1: ROLES & PERMISSION MATRIX */}
      {activeTab === "roles" && (
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xs p-6 space-y-4 animate-in fade-in-50 duration-150">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1A202C] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#1E4E8C]" />
              <span>ตารางสิทธิ์การเข้าถึงตามบทบาท (Role-Based Access Control - RBAC)</span>
            </h3>
            <span className="text-xs text-[#718096]">5 ระดับผู้ใช้งาน</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#E2E8F0] rounded-2xl overflow-hidden">
              <thead className="bg-[#F7FAFC] text-[#4A5568] border-b border-[#E2E8F0]">
                <tr>
                  <th className="p-3.5 font-semibold">ระดับผู้ใช้งาน</th>
                  <th className="p-3.5 font-semibold text-center">บันทึกรับคำร้อง</th>
                  <th className="p-3.5 font-semibold text-center">สั่งรับ/ไม่รับ</th>
                  <th className="p-3.5 font-semibold text-center">วินิจฉัยชี้ขาด</th>
                  <th className="p-3.5 font-semibold text-center">Dashboard ภาพรวม</th>
                  <th className="p-3.5 font-semibold text-center">ติดตามสถานะ</th>
                  <th className="p-3.5 font-semibold text-center">จัดการระบบ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF2F7]">
                {rolesMatrix.map((r, i) => (
                  <tr key={i} className="hover:bg-[#F7FAFC]">
                    <td className="p-3.5 font-medium text-[#1A202C]">{r.role}</td>
                    <td className="p-3.5 text-center">{r.intake}</td>
                    <td className="p-3.5 text-center">{r.approve}</td>
                    <td className="p-3.5 text-center">{r.ruling}</td>
                    <td className="p-3.5 text-center font-medium text-[#1E4E8C]">{r.viewGlobal}</td>
                    <td className="p-3.5 text-center text-emerald-600">{r.trackOwn}</td>
                    <td className="p-3.5 text-center">{r.admin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SLA CONFIGURATION */}
      {activeTab === "sla" && (
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xs p-6 space-y-4 animate-in fade-in-50 duration-150">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1A202C] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#1E4E8C]" />
              <span>การตั้งค่ากรอบเวลาและระยะเวลา SLA ในแต่ละขั้นตอน</span>
            </h3>
            <button className="px-3 py-1 bg-[#173B6B] text-white text-xs rounded-lg font-medium">
              บันทึกการเปลี่ยนแปลง
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#F7FAFC] border border-[#E2E8F0] space-y-1.5">
              <span className="text-[10px] text-[#718096] uppercase font-bold">1. ตรวจคำร้อง (สนง.กกต.จว.)</span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#2D3748]">ระยะเวลา SLA:</span>
                <input type="number" defaultValue={3} className="w-16 p-1 text-xs bg-white border border-[#E2E8F0] rounded text-center font-bold" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7FAFC] border border-[#E2E8F0] space-y-1.5">
              <span className="text-[10px] text-[#718096] uppercase font-bold">2. ผอ.กกต.จว. สั่งรับ/ไม่รับ</span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#2D3748]">ระยะเวลา SLA:</span>
                <input type="number" defaultValue={3} className="w-16 p-1 text-xs bg-white border border-[#E2E8F0] rounded text-center font-bold" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7FAFC] border border-[#E2E8F0] space-y-1.5">
              <span className="text-[10px] text-[#718096] uppercase font-bold">3. สืบสวน/ไต่สวน (สนง.กกต.จว.)</span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#2D3748]">ระยะเวลา SLA:</span>
                <input type="number" defaultValue={90} className="w-16 p-1 text-xs bg-white border border-[#E2E8F0] rounded text-center font-bold" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7FAFC] border border-[#E2E8F0] space-y-1.5">
              <span className="text-[10px] text-[#718096] uppercase font-bold">4. ตรวจสำนวนส่วนกลาง</span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#2D3748]">ระยะเวลา SLA:</span>
                <input type="number" defaultValue={60} className="w-16 p-1 text-xs bg-white border border-[#E2E8F0] rounded text-center font-bold" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7FAFC] border border-[#E2E8F0] space-y-1.5">
              <span className="text-[10px] text-[#718096] uppercase font-bold">5. คณะอนุวินิจฉัย มีความเห็น</span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#2D3748]">ระยะเวลา SLA:</span>
                <input type="number" defaultValue={90} className="w-16 p-1 text-xs bg-white border border-[#E2E8F0] rounded text-center font-bold" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7FAFC] border border-[#E2E8F0] space-y-1.5">
              <span className="text-[10px] text-[#718096] uppercase font-bold">6. กกต. วินิจฉัยชี้ขาด</span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#2D3748]">ระยะเวลา SLA:</span>
                <input type="number" defaultValue={90} className="w-16 p-1 text-xs bg-white border border-[#E2E8F0] rounded text-center font-bold" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: SECURITY & AUDIT TRAIL LOGS */}
      {activeTab === "security" && (
        <div className="space-y-6 animate-in fade-in-50 duration-150">
          
          {/* Security Protocols Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>PDPA Data Masking (เปิดใช้งาน)</span>
              </div>
              <p className="text-xs text-[#718096] font-light">
                ระบบซ่อนหมายเลขบัตรประชาชน 13 หลัก และข้อมูลส่วนบุคคลอ่อนไหวสำหรับผู้ใช้ทั่วไป
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold">
                <Lock className="w-4 h-4" />
                <span>AES-256 & TLS 1.3 Encryption</span>
              </div>
              <p className="text-xs text-[#718096] font-light">
                เข้ารหัสฐานข้อมูลและช่องทางการรับส่งข้อมูลตามมาตรฐานความปลอดภัยขั้นสูงของภาครัฐ
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold">
                <Key className="w-4 h-4" />
                <span>ThaID / OTP 2FA Authentication</span>
              </div>
              <p className="text-xs text-[#718096] font-light">
                รองรับการยืนยันตัวตนดิจิทัลผ่านแอปพลิเคชัน ThaID (DOPA) และรหัส OTP สองขั้นตอน
              </p>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#1A202C] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#1E4E8C]" />
                <span>บันทึกประวัติการเข้าถึงข้อมูล (Audit Trail & Activity Logs - ROPA)</span>
              </h3>
              <span className="text-xs text-[#718096]">บันทึกไม่สามารถลบล้างได้</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7FAFC] text-[#4A5568] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="p-3 font-semibold">วัน-เวลา</th>
                    <th className="p-3 font-semibold">ผู้ใช้งาน</th>
                    <th className="p-3 font-semibold">การกระทำ (Action)</th>
                    <th className="p-3 font-semibold">เลขที่สำนวน</th>
                    <th className="p-3 font-semibold">IP Address</th>
                    <th className="p-3 font-semibold text-center">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDF2F7]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#F7FAFC]">
                      <td className="p-3 text-[#718096]">{log.time}</td>
                      <td className="p-3 font-medium text-[#1A202C]">{log.user}</td>
                      <td className="p-3 text-[#2D3748]">{log.action}</td>
                      <td className="p-3 font-semibold text-[#1E4E8C]">{log.caseNum}</td>
                      <td className="p-3 text-[#718096]">{log.ip}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.status === "SUCCESS" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 4: EXTERNAL INTEGRATIONS */}
      {activeTab === "integrations" && (
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xs p-6 space-y-4 animate-in fade-in-50 duration-150">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1A202C] flex items-center gap-2">
              <Server className="w-4 h-4 text-[#1E4E8C]" />
              <span>สถานะการเชื่อมโยงระบบภายนอก (External System Integrations)</span>
            </h3>
            <span className="text-xs text-emerald-600 font-medium">● ระบบทำงานปกติทุกช่องทาง</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            <div className="p-5 rounded-2xl bg-[#F7FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A202C]">1. ฐานข้อมูลทะเบียนราษฎร</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[11px] text-[#718096]">
                ระบบ DXC / Linkage Center (กรมการปกครอง)
              </div>
              <div className="text-xs text-[#2D3748] bg-white p-3 rounded-xl border border-[#EDF2F7]">
                ✓ ตรวจสอบเลขประจำตัวประชาชน 13 หลัก และสิทธิเลือกตั้งในเขต (ข้อ 23)
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A202C]">2. สารบรรณอิเล็กทรอนิกส์</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[11px] text-[#718096]">
                ระบบสารบรรณกลาง สนง.กกต. (e-Saraban)
              </div>
              <div className="text-xs text-[#2D3748] bg-white p-3 rounded-xl border border-[#EDF2F7]">
                ✓ ออกเลขรับ-ส่งหนังสือราชการและส่งต่อสำนวนคำวินิจฉัยอัตโนมัติ
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A202C]">3. ระบบข้อมูลการเลือกตั้ง</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[11px] text-[#718096]">
                ระบบจัดการข้อมูลการเลือกตั้ง (PRAXTICOL)
              </div>
              <div className="text-xs text-[#2D3748] bg-white p-3 rounded-xl border border-[#EDF2F7]">
                ✓ ซิงค์ข้อมูลผู้สมัครรับเลือกตั้ง, พิกัดหน่วยเลือกตั้ง และผลคะแนนเลือกตั้ง
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
