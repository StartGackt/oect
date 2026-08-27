"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Database,
  Globe,
  Key,
  Lock,
  RefreshCw,
  Server,
  Shield,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { INITIAL_INTEGRATIONS, type IntegrationSystem } from "@/components/oect/rbacDomain";

interface AdminIntegrationsViewProps {
  onNotify?: (text: string) => void;
}

export default function AdminIntegrationsView({ onNotify }: AdminIntegrationsViewProps) {
  const [integrations, setIntegrations] = useState<IntegrationSystem[]>(INITIAL_INTEGRATIONS);
  const [pingingId, setPingingId] = useState<string | null>(null);
  const [editingSystem, setEditingSystem] = useState<IntegrationSystem | null>(null);

  const notify = (msg: string) => {
    if (onNotify) onNotify(msg);
  };

  const handlePing = (id: string, name: string) => {
    setPingingId(id);
    window.setTimeout(() => {
      const randomLatency = Math.floor(95 + Math.random() * 80);
      setIntegrations((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, latencyMs: randomLatency, lastPing: "เมื่อสักครู่", status: "ONLINE" }
            : item
        )
      );
      setPingingId(null);
      notify(`ทดสอบเชื่อมต่อ ${name} สำเร็จ (${randomLatency} ms)`);
    }, 850);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSystem) return;
    setIntegrations((prev) =>
      prev.map((item) => (item.id === editingSystem.id ? editingSystem : item))
    );
    notify(`อัปเดตการตั้งค่าระบบ ${editingSystem.shortName} สำเร็จ`);
    setEditingSystem(null);
  };

  return (
    <div className="space-y-6 pb-14">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-1.5 rounded-full bg-[#1B3F8B]" />
            <h2 className="text-base font-bold text-slate-900">
              การเชื่อมโยงระบบภายนอกและบูรณาการข้อมูล (Government Data Exchange)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            กำกับดูแล API Endpoint, Mutual TLS Certificate, นโยบาย Retry และสถานะการเชื่อมต่อแบบเรียลไทม์
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            integrations.forEach((item) => handlePing(item.id, item.shortName));
          }}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#1B3F8B] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#15326f]"
        >
          <RefreshCw className={`h-4 w-4 ${pingingId ? "animate-spin" : ""}`} />
          <span>ทดสอบการเชื่อมต่อทุกระบบ</span>
        </button>
      </div>

      {/* Integration Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {integrations.map((sys) => {
          const isPinging = pingingId === sys.id;
          return (
            <article
              key={sys.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#1B3F8B]">
                    <Database className="h-6 w-6" />
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    {sys.status}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-bold text-slate-900">{sys.name}</h3>
                  <div className="text-xs font-bold text-blue-700 mt-0.5">{sys.shortName}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{sys.agency}</div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {sys.description}
                  </p>
                </div>

                <div className="mt-4 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-400">Endpoint URL</span>
                    <span className="font-mono text-slate-700 truncate max-w-[170px]" title={sys.endpointUrl}>
                      {sys.endpointUrl}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-400">การยืนยันตัวตน</span>
                    <span className="font-semibold text-slate-800">{sys.authType}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-400">Certificate หมดอายุ</span>
                    <span className="font-mono text-emerald-700 font-bold">{sys.certValidUntil}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400">Response Time</span>
                    <span className="font-kanit font-bold text-base text-slate-900">{sys.latencyMs} ms</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSystem(sys)}
                  className="rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  ตั้งค่าพารามิเตอร์
                </button>
                <button
                  type="button"
                  onClick={() => handlePing(sys.id, sys.shortName)}
                  disabled={isPinging}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1B3F8B] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#15326f] disabled:opacity-60"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isPinging ? "animate-spin" : ""}`} />
                  <span>{isPinging ? "กำลังเช็ค..." : "ทดสอบ Ping"}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Security Banner */}
      <div className="rounded-2xl border border-blue-200 bg-[#1B3F8B] p-6 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-sm font-bold">Government Integration Security Standard</h3>
              <p className="text-xs text-blue-100/80 mt-1 max-w-2xl leading-relaxed">
                ทุกคำร้องขอเชื่อมโยงภายนอกจะส่งผ่าน Secure API Gateway มีการลงนาม Digital Signature
                และบันทึก Correlation Event ทุกครั้งตามกรอบความมั่นคงปลอดภัยไซเบอร์แห่งชาติ
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 border-t border-white/10 pt-3 md:border-t-0 md:pt-0">
            <div className="text-right">
              <div className="text-[10px] text-blue-200 uppercase font-bold">Uptime เฉลี่ย</div>
              <div className="text-xl font-bold text-emerald-400">99.98%</div>
            </div>
          </div>
        </div>
      </div>

      {/* PARAMETER CONFIGURATION MODAL */}
      {editingSystem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                ตั้งค่าการเชื่อมต่อ: {editingSystem.shortName}
              </h3>
              <button
                type="button"
                onClick={() => setEditingSystem(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  API Endpoint URL
                </label>
                <input
                  type="url"
                  required
                  value={editingSystem.endpointUrl}
                  onChange={(e) =>
                    setEditingSystem({ ...editingSystem, endpointUrl: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-mono text-xs outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    ประเภทการยืนยันตัวตน
                  </label>
                  <input
                    type="text"
                    value={editingSystem.authType}
                    onChange={(e) =>
                      setEditingSystem({ ...editingSystem, authType: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    วันหมดอายุ Certificate
                  </label>
                  <input
                    type="date"
                    value={editingSystem.certValidUntil}
                    onChange={(e) =>
                      setEditingSystem({ ...editingSystem, certValidUntil: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    จำนวน Retry สูงสุด (ครั้ง)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={editingSystem.retryMax}
                    onChange={(e) =>
                      setEditingSystem({ ...editingSystem, retryMax: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-center font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Request Timeout (มิลลิวินาที)
                  </label>
                  <input
                    type="number"
                    min={1000}
                    max={30000}
                    step={500}
                    value={editingSystem.timeoutMs}
                    onChange={(e) =>
                      setEditingSystem({ ...editingSystem, timeoutMs: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-center font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSystem(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#1B3F8B] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#15326f]"
                >
                  บันทึกการตั้งค่า
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
