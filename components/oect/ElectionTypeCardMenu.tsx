"use client";

import { ELECTION_TYPE_OPTIONS, type ComplaintItem } from "@/components/oect/complaintDomain";

interface ElectionTypeCardMenuProps {
  cases: ComplaintItem[];
  value: string;
  onChange: (value: string) => void;
}

// การ์ดแยกตามประเภทการเลือกตั้ง ตามภาคผนวก ข ข้อ ๔.๒/๔.๓/๔.๔ ส่วนที่ ๑ — ใช้แทน dropdown เดิม
export default function ElectionTypeCardMenu({ cases, value, onChange }: ElectionTypeCardMenuProps) {
  const countFor = (type: string) => (type === "ALL" ? cases.length : cases.filter((item) => item.electionType === type).length);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="เลือกประเภทการเลือกตั้ง">
      <ElectionTypeCard label="ทั้งหมด" active={value === "ALL"} count={countFor("ALL")} onClick={() => onChange("ALL")} />
      {ELECTION_TYPE_OPTIONS.map((option) => (
        <ElectionTypeCard key={option.value} label={option.value} count={countFor(option.value)} active={value === option.value} onClick={() => onChange(option.value)} />
      ))}
    </div>
  );
}

function ElectionTypeCard({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex min-w-[76px] shrink-0 flex-col items-center gap-1 rounded-2xl border px-3.5 py-2.5 text-center transition ${
        active ? "border-[#1B3F8B] bg-[#1B3F8B] text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50/40"
      }`}
    >
      <span className="text-xs font-bold">{label}</span>
      <span className={`text-[10px] ${active ? "text-blue-100" : "text-slate-400"}`}>{count} เรื่อง</span>
    </button>
  );
}
