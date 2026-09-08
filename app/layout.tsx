import type { Metadata } from "next";
import localFont from "next/font/local";
import { PreferencesProvider } from "./preferences";
import "./globals.css";

const anton = localFont({ src: "./fonts/anton.woff2", variable: "--font-anton", display: "swap", weight: "400" });
const bebas = localFont({ src: "./fonts/bebas.woff2", variable: "--font-bebas", display: "swap", weight: "400", preload: false });
const barlow = localFont({ src: [{ path: "./fonts/barlow.woff2", weight: "400" }, { path: "./fonts/barlow-bold.woff2", weight: "700" }], variable: "--font-barlow", display: "swap", preload: false });
const montserrat = localFont({ src: "./fonts/montserrat.woff2", variable: "--font-montserrat", display: "swap", weight: "300", preload: false });

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
