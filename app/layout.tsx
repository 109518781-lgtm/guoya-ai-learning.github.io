import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "赢未来国雅 AI自适应学习平台",
  description: "英语自适应闯关学习系统高保真网页原型"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
