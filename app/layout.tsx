import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "나의 옷장 다이어리",
  description: "내 옷으로 찾는 오늘의 코디",
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
