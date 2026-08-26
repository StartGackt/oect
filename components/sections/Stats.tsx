"use client";

const stats = [
  {
    num: "15",
    suffix: "+",
    label: "ปีแห่งประสบการณ์แพทย์เฉพาะทาง",
    sub: "Years of Medical Expertise",
  },
  {
    num: "5,000",
    suffix: "+",
    label: "เคสที่ให้ความไว้วางใจ",
    sub: "Treated Patient Cases",
  },
  {
    num: "96",
    suffix: "%",
    label: "ความพึงพอใจในผลการรักษา",
    sub: "Patient Satisfaction Rate",
  },
  {
    num: "4.9",
    suffix: "★",
    label: "คะแนนรีวิว Google Verified",
    sub: "Verified Google Rating",
  },
];

export default function Stats() {
  return (
    <section className="bg-white border-b border-[#E8E3DA] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-[#E8E3DA]">
          {stats.map((s, i) => (
            <div key={i} className={`text-center ${i > 0 ? "pt-6 lg:pt-0" : ""}`}>
              <div
                style={{ fontFamily: "var(--font-display)" }}
                className="text-4xl sm:text-5xl font-light text-[#12151E] leading-none tracking-tight"
              >
                {s.num}
                <span className="text-[#C5A880] text-3xl font-normal ml-0.5">{s.suffix}</span>
              </div>
              <div className="text-xs sm:text-sm font-medium text-[#12151E] mt-2.5">
                {s.label}
              </div>
              <div className="text-[11px] text-[#9CA3AF] font-light mt-0.5 tracking-wider uppercase">
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}