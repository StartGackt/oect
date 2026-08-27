"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Download,
  Edit2,
  FileCheck2,
  FileText,
  Gavel,
  Layers,
  MapPin,
  Plus,
  Search,
  Settings2,
  Trash2,
  Vote,
} from "lucide-react";

type MasterTab = "provinces" | "constituencies" | "elections" | "allegations" | "forms";

interface ProvinceItem {
  code: string;
  name: string;
  region: string;
  districtsCount: number;
  officeName: string;
  phone: string;
}

const INITIAL_PROVINCES: ProvinceItem[] = [
  { code: "CMI", name: "เชียงใหม่", region: "ภาคเหนือ (ภาค 5)", districtsCount: 25, officeName: "สนง.กกต.จว. เชียงใหม่", phone: "053-112-184" },
  { code: "BKK", name: "กรุงเทพมหานคร", region: "ส่วนกลาง", districtsCount: 50, officeName: "สนง.กกต.จว. กรุงเทพมหานคร", phone: "02-142-9900" },
  { code: "KKN", name: "ขอนแก่น", region: "ภาคตะวันออกเฉียงเหนือ (ภาค 4)", districtsCount: 26, officeName: "สนง.กกต.จว. ขอนแก่น", phone: "043-221-190" },
  { code: "NMA", name: "นครราชสีมา", region: "ภาคตะวันออกเฉียงเหนือ (ภาค 3)", districtsCount: 32, officeName: "สนง.กกต.จว. นครราชสีมา", phone: "044-245-120" },
  { code: "SKA", name: "สงขลา", region: "ภาคใต้ (ภาค 9)", districtsCount: 16, officeName: "สนง.กกต.จว. สงขลา", phone: "074-311-250" },
  { code: "SNI", name: "สุราษฎร์ธานี", region: "ภาคใต้ (ภาค 8)", districtsCount: 19, officeName: "สนง.กกต.จว. สุราษฎร์ธานี", phone: "077-281-900" },
  { code: "UBN", name: "อุบลราชธานี", region: "ภาคตะวันออกเฉียงเหนือ (ภาค 3)", districtsCount: 25, officeName: "สนง.กกต.จว. อุบลราชธานี", phone: "045-241-300" },
];

const INITIAL_ELECTIONS = [
  { id: "MP", label: "สมาชิกสภาผู้แทนราษฎร (สส.)", rule: "พ.ร.ป. ว่าด้วยการเลือกตั้ง สส. ๒๕๖๑", slaBasis: "มาตรา ๑๒๗ / ๑๓๘" },
  { id: "SEN", label: "สมาชิกวุฒิสภา (สว.)", rule: "พ.ร.ป. ว่าด้วยการได้มาซึ่ง สว. ๒๕๖๑", slaBasis: "มาตรา ๕๕ / ๖๒" },
  { id: "PAO", label: "องค์การบริหารส่วนจังหวัด (อบจ.)", rule: "พ.ร.บ. การเลือกตั้งสมาชิกสภาท้องถิ่น ๒๕๖๒", slaBasis: "มาตรา ๙๘" },
  { id: "MUN", label: "เทศบาล (นคร/เมือง/ตำบล)", rule: "พ.ร.บ. การเลือกตั้งสมาชิกสภาท้องถิ่น ๒๕๖๒", slaBasis: "มาตรา ๙๘" },
  { id: "SAO", label: "องค์การบริหารส่วนตำบล (อบต.)", rule: "พ.ร.บ. การเลือกตั้งสมาชิกสภาท้องถิ่น ๒๕๖๒", slaBasis: "มาตรา ๙๘" },
  { id: "BKK", label: "ผู้ว่าฯ และสมาชิกสภากรุงเทพมหานคร", rule: "พ.ร.บ. ระเบียบบริหารราชการ กทม. ๒๕๒๘", slaBasis: "มาตรา ๑๐๔" },
  { id: "REF", label: "การออกเสียงประชามติ", rule: "พ.ร.บ. ว่าด้วยการออกเสียงประชามติ ๒๕๖๔", slaBasis: "มาตรา ๕๙" },
];

const INITIAL_ALLEGATIONS = [
  { id: "ALG-01", category: "ซื้อเสียง/ให้เงินหรือทรัพย์สิน", lawSection: "มาตรา ๗๓(๑)", penalty: "จำคุก ๑-๑๐ ปี และเพิกถอนสิทธิ ๒๐ ปี" },
  { id: "ALG-02", category: "จัดเลี้ยง/ให้ประโยชน์อันอาจคำนวณเป็นเงินได้", lawSection: "มาตรา ๗๓(๔)", penalty: "จำคุก ๑-๑๐ ปี และเพิกถอนสิทธิ ๒๐ ปี" },
  { id: "ALG-03", category: "หาเสียงใส่ร้าย/หลอกลวงด้วยข้อมูลอันเป็นเท็จ", lawSection: "มาตรา ๗๓(๕)", penalty: "จำคุก ๑-๑๐ ปี และเพิกถอนสิทธิ ๒๐ ปี" },
  { id: "ALG-04", category: "คุณสมบัติ/ลักษณะต้องห้ามของผู้สมัคร", lawSection: "มาตรา ๔๒, ๙๘", penalty: "สั่งถอนชื่อ / เพิกถอนสิทธิสมัคร" },
  { id: "ALG-05", category: "ข่มขู่/ใช้อิทธิพลคุกคามผู้มีสิทธิเลือกตั้ง", lawSection: "มาตรา ๗๓(๒)", penalty: "จำคุก ๑-๑๐ ปี และปรับ ๒๐,๐๐๐-๒๐๐,๐๐๐ บาท" },
  { id: "ALG-06", category: "ฝ่าฝืนระเบียบการจัดทำป้ายและเอกสารหาเสียง", lawSection: "มาตรา ๘๓", penalty: "ตักเตือน / สั่งแก้ไขปลดป้าย" },
];

const INITIAL_FORMS = [
  { code: "สตว. ๑", name: "คำร้องคัดค้านการเลือกตั้ง / การออกเสียงประชามติ", type: "คำร้อง", format: "PDF / Online" },
  { code: "สตว. ๑/๑", name: "หนังสือมอบอำนาจให้ยื่นคำร้องคัดค้านการเลือกตั้ง", type: "หนังสือมอบอำนาจ", format: "PDF / Online" },
  { code: "สตว. ๒", name: "บันทึกถ้อยคำของผู้ร้องเรียน / ผู้ให้ถ้อยคำ", type: "พยานหลักฐาน", format: "PDF" },
  { code: "สส. ๔/๑", name: "คำสั่งรับคำร้องและแต่งตั้งคณะกรรมการสืบสวนและไต่สวน", type: "คำสั่งทางราชการ", format: "e-Saraban" },
];

export default function AdminMasterDataView({ onNotify }: { onNotify?: (text: string) => void }) {
  const [activeTab, setActiveTab] = useState<MasterTab>("provinces");
  const [search, setSearch] = useState("");
  const [provinces, setProvinces] = useState<ProvinceItem[]>(INITIAL_PROVINCES);

  const notify = (msg: string) => {
    if (onNotify) onNotify(msg);
  };

  return (
    <div className="space-y-6 pb-14">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-1.5 rounded-full bg-[#1B3F8B]" />
            <h2 className="text-base font-bold text-slate-900">
              การจัดการข้อมูลพื้นฐานระบบ (Master Data Governance)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ดูแลจังหวัด อำเภอ เขตเลือกตั้ง ประเภทการเลือกตั้ง ข้อกล่าวหา และแบบฟอร์มมาตรฐานตามกฎหมาย กกต.
          </p>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: "provinces" as const, label: "📍 จังหวัดและอำเภอ" },
            { id: "elections" as const, label: "🗳️ ประเภทการเลือกตั้ง" },
            { id: "allegations" as const, label: "⚖️ ฐานข้อมูลข้อกล่าวหา" },
            { id: "forms" as const, label: "📄 แบบฟอร์มมาตรฐาน" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === t.id
                  ? "bg-[#1B3F8B] text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: PROVINCES & DISTRICTS */}
      {activeTab === "provinces" && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">ฐานข้อมูล สนง.กกต.ประจำจังหวัด (77 จังหวัด)</h3>
              <p className="text-xs text-slate-500">รหัสย่อจังหวัด รหัสหน่วยงาน และจำนวนอำเภอสำหรับ Data Scope Filter</p>
            </div>
            <button
              type="button"
              onClick={() => notify("เปิดฟอร์มเพิ่มข้อมูลจังหวัดใหม่")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1B3F8B] px-3.5 py-2 text-xs font-semibold text-white shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>เพิ่มจังหวัด</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                <tr>
                  <th className="px-5 py-3">รหัส</th>
                  <th className="px-4 py-3">จังหวัด</th>
                  <th className="px-4 py-3">ภาค / เขตพื้นที่</th>
                  <th className="px-4 py-3">จำนวนอำเภอ</th>
                  <th className="px-4 py-3">ชื่อสำนักงาน</th>
                  <th className="px-4 py-3">โทรศัพท์</th>
                  <th className="px-5 py-3 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {provinces.map((p) => (
                  <tr key={p.code} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-mono font-bold text-[#1B3F8B]">{p.code}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">{p.name}</td>
                    <td className="px-4 py-3.5 text-slate-600">{p.region}</td>
                    <td className="px-4 py-3.5 text-slate-700 font-semibold">{p.districtsCount} อำเภอ</td>
                    <td className="px-4 py-3.5 text-slate-600">{p.officeName}</td>
                    <td className="px-4 py-3.5 text-slate-500 font-mono">{p.phone}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => notify(`แก้ไขข้อมูล ${p.name}`)}
                        className="rounded-lg p-1 text-slate-400 hover:text-blue-700"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 2: ELECTIONS */}
      {activeTab === "elections" && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">ประเภทการเลือกตั้งและฐานอำนาจกฎหมาย</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INITIAL_ELECTIONS.map((e) => (
              <div key={e.id} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#1B3F8B] bg-blue-100 px-2 py-0.5 rounded-md">
                    {e.id}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                    ใช้งาน
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{e.label}</h4>
                <div className="text-[11px] text-slate-500">{e.rule}</div>
                <div className="text-[10px] text-blue-700 font-semibold border-t border-slate-200 pt-2 mt-2">
                  ฐานข้อกฎหมาย SLA: {e.slaBasis}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: ALLEGATIONS */}
      {activeTab === "allegations" && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4">
            <h3 className="text-sm font-bold text-slate-900">ฐานข้อมูลประเภทข้อกล่าวหาแห่งการคัดค้าน</h3>
            <p className="text-xs text-slate-500">อ้างอิงตามบทบัญญัติใน พ.ร.ป. ว่าด้วยการเลือกตั้ง สส. และ พ.ร.ป. ที่เกี่ยวข้อง</p>
          </div>
          <div className="divide-y divide-slate-100">
            {INITIAL_ALLEGATIONS.map((alg) => (
              <div key={alg.id} className="p-4 grid gap-3 sm:grid-cols-[100px_1fr_180px_auto] sm:items-center">
                <span className="font-mono text-xs font-bold text-slate-500">{alg.id}</span>
                <div>
                  <div className="text-xs font-bold text-slate-900">{alg.category}</div>
                  <div className="text-[10px] text-slate-400">บทกำหนดโทษ: {alg.penalty}</div>
                </div>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg w-fit">
                  {alg.lawSection}
                </span>
                <button
                  type="button"
                  onClick={() => notify(`แก้ไข ${alg.category}`)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-blue-700 justify-self-end"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 4: STANDARD FORMS */}
      {activeTab === "forms" && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">แบบฟอร์มมาตรฐานตามระเบียบ กกต.</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {INITIAL_FORMS.map((form) => (
              <div key={form.code} className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1B3F8B] font-bold text-xs">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div>
                    <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      แบบ {form.code}
                    </span>
                    <div className="text-xs font-bold text-slate-900 mt-1">{form.name}</div>
                    <div className="text-[10px] text-slate-400">{form.type} · รูปแบบ {form.format}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => notify(`ดาวน์โหลดแม่แบบ ${form.code}`)}
                  className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                  title="ดาวน์โหลดแม่แบบ"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
