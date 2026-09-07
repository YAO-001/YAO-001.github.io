import type { Metadata } from "next";
import localFont from "next/font/local";
import { PreferencesProvider } from "./preferences";
import "./globals.css";

const anton = localFont({ src: "./fonts/anton.ttf", variable: "--font-anton", display: "swap", weight: "400" });
const bebas = localFont({ src: "./fonts/bebas.ttf", variable: "--font-bebas", display: "swap", weight: "400" });
const barlow = localFont({ src: [{ path: "./fonts/barlow.ttf", weight: "400" }, { path: "./fonts/barlow-bold.ttf", weight: "700" }], variable: "--font-barlow", display: "swap" });
const montserrat = localFont({ src: "./fonts/montserrat.ttf", variable: "--font-montserrat", display: "swap", weight: "300" });

export const metadata: Metadata = {
  metadataBase: new URL("https://yao-001.github.io"),
  title: "YAO / 001 — Embodied Intelligence Research",
  description:
    "Research intern at CASIA working on embodied intelligence, world models, robot learning, reinforcement learning, and agentic embodied systems.",
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
    locale: "en_US",
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
    <html lang="en">
      <body className={`${anton.variable} ${bebas.variable} ${barlow.variable} ${montserrat.variable}`}><PreferencesProvider>{children}</PreferencesProvider></body>
    </html>
  );
}
