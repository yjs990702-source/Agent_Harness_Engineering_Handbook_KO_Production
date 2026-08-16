import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "업무요청 트래커 · Agent Harness Lab",
  description: "Agent Harness Engineering Handbook KO 3주차 실습",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
