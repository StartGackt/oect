import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
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
    <html lang="th" className={prompt.variable}>
      <body className="font-prompt antialiased bg-[#F4F7FA] text-[#1A202C] selection:bg-[#173B6B] selection:text-white">
        {children}
      </body>
    </html>
  );
}