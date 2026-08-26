"use client";

import { useState } from "react";
import { 
  Sparkles, 
  TrendingUp, 
  Activity, 
  BarChart2, 
  BookOpen, 
  Send, 
  Mic, 
  Plus, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowRight,
  Shield,
  Layers,
  ChevronRight
} from "lucide-react";

interface ComplaintItem {
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
  slaStatus: string;
}

interface AiAssistantViewProps {
  cases: ComplaintItem[];
  onSelectCase: (c: ComplaintItem) => void;
  onNavigateTab: (tab: string) => void;
  openNewModal: () => void;
  userName: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  widgetType?: "stats" | "overdue_list" | "province_list" | "workflow_summary" | "allegation_chart";
  data?: any;
}

export default function AiAssistantView({
  cases,
  onSelectCase,
  onNavigateTab,
  openNewModal,
  userName,
}: AiAssistantViewProps) {
  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Quick prompt cards
  const quickCards = [
    {
      title: "วิเคราะห์ภาพรวม & สถิติ 300 เรื่อง",
      desc: "สรุปสถานะ SLA, กลุ่มภารกิจ 5 กลุ่ม, และข้อกล่าวหายอดนิยมแบบ Real-time",
      icon: TrendingUp,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      prompt: "สรุปภาพรวมเรื่องร้องเรียนทั้งหมด 300 เรื่องให้หน่อย",
      action: "stats",
    },
    {
      title: "คดีเกินกำหนดเวลา & ใกล้ครบ SLA",
      desc: "ตรวจสอบสำนวนที่ค้างเกิน 90 วัน หรือเหลือเวลาน้อยกว่า 5 วันที่ต้องเร่งรัด",
      icon: Activity,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      prompt: "แสดงรายการเรื่องร้องเรียนที่เกินกำหนดเวลาและใกล้ครบกำหนด SLA",
      action: "overdue",
    },
    {
      title: "สถิติเรื่องร้องเรียนรายจังหวัด (Top 10)",
      desc: "เปรียบเทียบจำนวนคดี เชียงใหม่, ขอนแก่น, กทม. และจังหวัดที่มีความหนาแน่นสูง",
      icon: BarChart2,
      color: "text-purple-600 bg-purple-50 border-purple-100",
      prompt: "สรุปจังหวัดที่มีเรื่องร้องเรียนสูงสุด 10 อันดับแรก",
      action: "provinces",
    },
    {
      title: "คู่มือกระบวนการสืบสวน & กรอบเวลา",
      desc: "สืบค้นระเบียบ กกต. ข้อ 22–84, ขั้นตอนระดับจังหวัด 90 วัน และส่วนกลาง",
      icon: BookOpen,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      prompt: "อธิบายขั้นตอน Workflow การสืบสวนระดับจังหวัดและส่วนกลางตามระเบียบ กกต.",
      action: "workflow",
    },
  ];

  const handleSendPrompt = (promptText: string, cardAction?: string) => {
    if (!promptText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: promptText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt("");
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse: ChatMessage;

      const lower = promptText.toLowerCase();

      if (cardAction === "overdue" || lower.includes("เกิน") || lower.includes("sla") || lower.includes("เร่งรัด")) {
        const overdueItems = cases.filter((c) => c.slaStatus === "OVERDUE" || c.slaStatus === "NEAR_DUE").slice(0, 5);
        aiResponse = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: `พบเรื่องร้องเรียนที่เกินกำหนดเวลา SLA ทั้งหมด ${cases.filter((c) => c.slaStatus === "OVERDUE").length} เรื่อง และใกล้ครบกำหนด (< 5 วัน) อีก ${cases.filter((c) => c.slaStatus === "NEAR_DUE").length} เรื่อง นี่คือรายการสำคัญที่ต้องเร่งรัดครับ:`,
          widgetType: "overdue_list",
          data: overdueItems,
        };
      } else if (cardAction === "provinces" || lower.includes("จังหวัด") || lower.includes("top 10")) {
        const counts: { [key: string]: number } = {};
        cases.forEach((c) => {
          counts[c.province] = (counts[c.province] || 0) + 1;
        });
        const topProvinces = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
        aiResponse = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: `สถิติ 5 จังหวัดที่มีเรื่องร้องเรียนสูงสุดในระบบ ได้แก่:`,
          widgetType: "province_list",
          data: topProvinces,
        };
      } else if (cardAction === "workflow" || lower.includes("ขั้นตอน") || lower.includes("ระเบียบ") || lower.includes("workflow")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: `กระบวนการดำเนินงานประเภทร้องคัดค้านการเลือกตั้งตามระเบียบ กกต. (ฉบับที่ ๓) แบ่งเป็น 2 ระดับหลัก:`,
          widgetType: "workflow_summary",
        };
      } else {
        // Default Stats
        aiResponse = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: `สรุปภาพรวมฐานข้อมูลเรื่องร้องเรียน สนง.กกต. (300 เรื่อง):`,
          widgetType: "stats",
          data: {
            total: cases.length,
            normal: cases.filter((c) => c.slaStatus === "NORMAL").length,
            nearDue: cases.filter((c) => c.slaStatus === "NEAR_DUE").length,
            overdue: cases.filter((c) => c.slaStatus === "OVERDUE").length,
            completed: cases.filter((c) => c.slaStatus === "COMPLETED").length,
          },
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-140px)] justify-between pb-6 pt-4">
      
      {/* Content Body */}
      <div className="space-y-8 flex-1">
        
        {/* If no chat messages, show Big Clean Minimalist Welcome Screen */}
        {messages.length === 0 ? (
          <div className="space-y-8 animate-in fade-in-50 duration-200 pt-4">
            
            {/* Big Friendly Hero Typography */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#006C4C] tracking-tight">
                สวัสดี, {userName || "พนักงาน สนง.กกต."}
              </h1>
              <p className="text-2xl sm:text-3xl md:text-4xl font-light text-[#A0AEC0] tracking-tight">
                วันนี้ต้องการให้ AI ช่วยจัดการเรื่องร้องเรียน หรือตรวจสอบสำนวนใดบ้าง?
              </p>
            </div>

            {/* 4 Clean Action Cards (Exact Layout & Look like Screenshot) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendPrompt(card.prompt, card.action)}
                    className="bg-[#F8FAFC] hover:bg-white hover:shadow-lg border border-[#E2E8F0] hover:border-[#CBD5E1] p-5 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between h-44 group"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-[#1A202C] group-hover:text-[#006C4C] transition-colors leading-snug">
                        {card.title}
                      </h3>
                      <p className="text-xs text-[#718096] font-light mt-2 leading-relaxed line-clamp-3">
                        {card.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] text-[#A0AEC0] font-medium group-hover:text-[#006C4C] flex items-center gap-1">
                        <span>คลิกเพื่อดูสรุป</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${card.color} shadow-2xs group-hover:scale-110 transition-transform`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Helper Shortcuts Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs text-[#718096]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium text-[#1A202C]">พร้อมใช้งาน: ฐานข้อมูลเรื่องร้องเรียน 300 เรื่อง</span>
                <span>(เชื่อมต่อ DXC / PRAXTICOL เรียบร้อย)</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigateTab("cases")}
                  className="text-[#006C4C] font-semibold hover:underline flex items-center gap-1"
                >
                  <span>ดูตารางเรื่องทั้งหมด 300 รายการ →</span>
                </button>
                <button
                  onClick={openNewModal}
                  className="px-3 py-1 bg-[#006C4C] text-white rounded-lg font-medium hover:bg-[#005239] transition-colors"
                >
                  + บันทึกคำร้องใหม่
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* Conversational Messages Stream */
          <div className="space-y-6 animate-in fade-in-50 duration-150">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="w-9 h-9 rounded-2xl bg-[#006C4C] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4 text-[#ECC94B]" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-3xl p-5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#006C4C] text-white rounded-br-xs shadow-xs"
                      : "bg-white border border-[#E2E8F0] text-[#1A202C] rounded-bl-xs shadow-xs space-y-4"
                  }`}
                >
                  <div>{msg.text}</div>

                  {/* Widget: Stats KPI */}
                  {msg.widgetType === "stats" && msg.data && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                      <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] text-center">
                        <div className="text-xl font-bold text-[#1A202C]">{msg.data.total}</div>
                        <div className="text-[10px] text-[#718096]">เรื่องทั้งหมด</div>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                        <div className="text-xl font-bold text-emerald-700">{msg.data.normal}</div>
                        <div className="text-[10px] text-emerald-800">ปกติใน SLA</div>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                        <div className="text-xl font-bold text-amber-700">{msg.data.nearDue}</div>
                        <div className="text-[10px] text-amber-800">ใกล้ครบ (&lt; 5 วัน)</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-2xl border border-red-100 text-center">
                        <div className="text-xl font-bold text-red-700">{msg.data.overdue}</div>
                        <div className="text-[10px] text-red-800">เกินกำหนดเวลา</div>
                      </div>
                    </div>
                  )}

                  {/* Widget: Overdue List */}
                  {msg.widgetType === "overdue_list" && msg.data && (
                    <div className="space-y-2 pt-2">
                      {msg.data.map((c: ComplaintItem) => (
                        <div
                          key={c.id}
                          onClick={() => onSelectCase(c)}
                          className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#006C4C] hover:bg-white transition-all cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <div className="font-semibold text-xs text-[#1A202C]">{c.caseNumber} (จ.{c.province})</div>
                            <div className="text-[11px] text-[#718096]">{c.allegation} · {c.currentStage}</div>
                          </div>
                          <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold ${c.slaStatus === "OVERDUE" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}`}>
                            {c.slaStatus === "OVERDUE" ? `เกิน ${Math.abs(c.remainingDays)} วัน` : `เหลือ ${c.remainingDays} วัน`}
                          </span>
                        </div>
                      ))}
                      <button
                        onClick={() => onNavigateTab("cases")}
                        className="w-full py-2 bg-[#EBF8FF] text-[#1E4E8C] rounded-xl text-xs font-semibold hover:bg-blue-100 transition-colors text-center block mt-2"
                      >
                        เปิดดูตารางเรื่องทั้งหมดใน Case Management →
                      </button>
                    </div>
                  )}

                  {/* Widget: Top Provinces */}
                  {msg.widgetType === "province_list" && msg.data && (
                    <div className="space-y-2 pt-2">
                      {msg.data.map(([prov, count]: [string, number], idx: number) => (
                        <div key={prov} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                          <span className="font-medium">{idx + 1}. จ.{prov}</span>
                          <span className="px-2 py-0.5 rounded-full bg-white font-bold text-[#006C4C] border border-[#E2E8F0]">{count} เรื่อง</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Widget: Workflow Summary */}
                  {msg.widgetType === "workflow_summary" && (
                    <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] text-xs space-y-2">
                      <div>• <strong>ระดับจังหวัด (สนง.กกต.จว.):</strong> ตรวจคำร้อง (3 วัน) $\rightarrow$ ผอ.สั่งรับ/ไม่รับ (3 วัน) $\rightarrow$ สืบสวน (20+15+15 วัน รวม 90 วัน)</div>
                      <div>• <strong>ระดับส่วนกลาง & กกต.:</strong> ตรวจสำนวน (60 วัน) $\rightarrow$ ลธ. (9 วัน) $\rightarrow$ คณะอนุวินิจฉัย (90 วัน) $\rightarrow$ กกต. วินิจฉัยชี้ขาด (90 วัน) $\rightarrow$ จัดทำคำวินิจฉัย (60 วัน)</div>
                      <button
                        onClick={() => onNavigateTab("workflow")}
                        className="text-[#006C4C] font-semibold underline block pt-2"
                      >
                        เปิดดูแผนผัง Workflow 2 หน้าแบบเต็ม →
                      </button>
                    </div>
                  )}

                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3.5 items-center text-xs text-[#718096] bg-white p-3.5 rounded-2xl border border-[#E2E8F0] w-48">
                <Sparkles className="w-4 h-4 text-[#006C4C] animate-spin" />
                <span>AI กำลังวิเคราะห์ข้อมูล...</span>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Bottom Floating Interactive Search / Prompt Input Bar (Like Screenshot) */}
      <div className="sticky bottom-2 z-20 pt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt(inputPrompt);
          }}
          className="bg-[#EDF2F7] p-2 sm:p-2.5 rounded-3xl border border-[#CBD5E1] shadow-lg space-y-2"
        >
          {/* Text Input Row */}
          <div className="px-3 pt-1">
            <input
              type="text"
              placeholder="ถาม ECT-AI เกี่ยวกับเรื่องร้องเรียน, ตรวจสอบ SLA, ค้นหาคดีซื้อเสียง, หรือพิมพ์ @..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-[#1A202C] focus:outline-none placeholder-[#718096]"
            />
          </div>

          {/* Action Tools & Model Pills Row */}
          <div className="flex items-center justify-between pt-1 px-2 text-xs">
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={openNewModal}
                className="w-7 h-7 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-[#4A5568] shadow-2xs"
                title="สร้างคำร้องใหม่"
              >
                <Plus className="w-4 h-4" />
              </button>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#006C4C] font-medium text-[11px] border border-[#CBD5E1] shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#ECC94B]" />
                <span>ECT-AI 2.5 Pro</span>
              </span>

              <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-white text-[#4A5568] font-light text-[11px] border border-[#CBD5E1]">
                Legal & Investigation Specialist
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => alert("ระบบรองรับการค้นหาด้วยคำสั่งเสียง (Voice Command)")}
                className="p-1.5 text-[#718096] hover:text-[#1A202C]"
                title="สั่งงานด้วยเสียง"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="submit"
                className="w-8 h-8 rounded-full bg-[#006C4C] text-white hover:bg-[#005239] flex items-center justify-center shadow-xs transition-colors"
                title="ส่งคำสั่ง"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>

        <div className="text-center text-[10px] text-[#A0AEC0] mt-2 font-light">
          ระบบ AI บริหารจัดการเรื่องร้องเรียน สนง.กกต. · ข้อมูลได้รับการเข้ารหัสและคุ้มครองตาม พ.ร.บ. PDPA
        </div>
      </div>

    </div>
  );
}
