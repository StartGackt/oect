import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  subsets: ["latin", "thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-kanit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ระบบบริหารจัดการเรื่องร้องเรียนและการดำเนินการตามกระบวนการยุติธรรม | สนง.กกต.",
  description: "ระบบบริหารจัดการเรื่องร้องเรียนและการดำเนินการตามกระบวนการยุติธรรม สำนักงานคณะกรรมการการเลือกตั้ง (Office of The Election Commission of Thailand - Case Management System)",
  icons: {
    icon: "/oect-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={kanit.variable}>
      <body className="font-kanit antialiased bg-[#F8FAFC] text-[#0F172A] selection:bg-[#FFD600] selection:text-[#1B3F8B]">
        {children}
      </body>
    </html>
  );
}
