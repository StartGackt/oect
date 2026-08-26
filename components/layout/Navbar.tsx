"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, MessageCircle, Menu, X, MapPin, Clock, Calendar, Sparkles } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "บริการรักษา", href: "#services" },
    { label: "ผลการรักษา", href: "#results" },
    { label: "แพทย์ประจำคลินิก", href: "#doctor" },
    { label: "มาตรฐานคลินิก", href: "#standards" },
    { label: "ขั้นตอนการตรวจ", href: "#process" },
    { label: "สาระน่ารู้", href: "#articles" },
    { label: "ติดต่อคลินิก", href: "#location" },
  ];

  return (
    <>
      {/* Top Clinic Info Bar */}
      <div className="bg-[#12151E] text-white text-[12px] py-2 px-4 border-b border-[#C5A880]/20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-white/80">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>สุขุมวิท กรุงเทพฯ (BTS พร้อมพงษ์ / ทองหล่อ)</span>
            </span>
            <span className="text-white/30 hidden md:inline">|</span>
            <span className="flex items-center gap-1.5 hidden md:flex">
              <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>อังคาร - อาทิตย์ 11:00 - 20:00 น.</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-white/90">
            <a
              href="tel:021234567"
              className="flex items-center gap-1 hover:text-[#C5A880] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>02-123-4567</span>
            </a>
            <span className="text-white/30">|</span>
            <a
              href="https://line.me"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#06C755] font-medium hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>LINE: @piyawatclinic</span>
            </a>
            <span className="text-white/30 hidden sm:inline">|</span>
            <span className="text-[10px] text-[#C5A880] tracking-wider hidden sm:inline">TH · EN</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E8E3DA] py-3.5"
            : "bg-white border-b border-[#E8E3DA] py-4"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Clinic Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#12151E] flex items-center justify-center text-white border border-[#C5A880]/50 transition-transform group-hover:scale-105 shadow-xs">
              <span
                style={{ fontFamily: "var(--font-display)" }}
                className="text-xl font-light text-[#C5A880]"
              >
                P
              </span>
            </div>
            <div className="flex flex-col">
              <span
                style={{ fontFamily: "var(--font-display)" }}
                className="text-2xl text-[#12151E] font-normal tracking-wide leading-none"
              >
                P<span className="text-[#C5A880]">.</span>iyawat Clinic
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#737373] font-light mt-0.5">
                Hair Restoration & Aesthetics
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[13px] text-[#374151] hover:text-[#C5A880] transition-colors font-light tracking-wide relative group py-1"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C5A880] transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://line.me"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs text-[#06C755] bg-[#06C755]/5 border border-[#06C755]/30 rounded-lg hover:bg-[#06C755]/10 transition-colors font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              <span>ปรึกษาทาง LINE</span>
            </a>

            <a
              href="#booking"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#12151E] text-white text-xs rounded-lg hover:bg-[#C5A880] hover:text-[#12151E] transition-all font-medium shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>นัดหมายแพทย์</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-[#12151E]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-[#E8E3DA] px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-2.5">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-[#374151] hover:text-[#C5A880] py-2 border-b border-[#FAF8F5] font-light"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="pt-2 flex flex-col gap-2.5">
              <a
                href="https://line.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#06C755] text-white text-center rounded-xl text-xs font-medium flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>ส่งรูปปรึกษาคุณหมอทาง LINE ฟรี</span>
              </a>
              <a
                href="#booking"
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 bg-[#12151E] text-white text-center rounded-xl text-xs font-medium"
              >
                ลงทะเบียนนัดหมายออนไลน์
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}