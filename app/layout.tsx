import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yao-001.github.io"),
  title: "YAO / 001 — Embodied Intelligence Research",
  description:
    "中科院自动化所研究实习生，关注具身智能与世界模型、机器人学习与强化学习，以及面向 Agentic 的下一代具身智能架构。",
  applicationName: "YAO / 001",
  authors: [{ name: "YAO / 001", url: "https://github.com/YAO-001" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "YAO / 001 — Embodied Intelligence Research",
    description:
      "Embodied intelligence, world models, robot learning and agentic systems.",
    type: "website",
    locale: "zh_CN",
    url: "/",
    images: [
      {
        url: "/og.png",
        width: 1728,
        height: 909,
        alt: "YAO / 001 — Embodied Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YAO / 001 — Embodied Intelligence Research",
    description:
      "World models · robot learning · reinforcement learning · agentic systems",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
