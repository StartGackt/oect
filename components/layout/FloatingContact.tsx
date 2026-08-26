"use client";

import { MessageCircle, Phone, Calendar, ArrowUp } from "lucide-react";

export default function FloatingContact() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-5 sm:right-6 z-40 flex flex-col items-end gap-2.5">
      {/* LINE Contact Action */}
      <a
        href="https://line.me"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#06C755] text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-xs font-semibold border-2 border-white"
        title="ส่งรูปปรึกษาคุณหมอทาง LINE"
      >
        <MessageCircle className="w-4 h-4 fill-white text-[#06C755]" />
        <span className="hidden sm:inline">ปรึกษาทาง LINE (ฟรี)</span>
        <span className="sm:hidden">LINE</span>
      </a>

      {/* Appointment CTA */}
      <a
        href="#booking"
        className="flex items-center gap-2 bg-[#12151E] text-[#EADCB9] pl-3.5 pr-4 py-2.5 rounded-full shadow-lg hover:bg-[#C5A880] hover:text-[#12151E] transition-all text-xs font-medium border border-[#C5A880]/50"
      >
        <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
        <span>นัดตรวจแพทย์</span>
      </a>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className="w-8 h-8 rounded-full bg-white text-[#4B5563] hover:text-[#12151E] shadow-md border border-[#E8E3DA] flex items-center justify-center transition-all opacity-80 hover:opacity-100"
      >
        <ArrowUp className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
