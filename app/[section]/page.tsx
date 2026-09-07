import Persona, { type View } from "../persona";

export function generateStaticParams() {
  return ["about", "resume", "socials", "sideproj"].map((section) => ({ section }));
}
export const dynamicParams = false;

export default async function Section({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  return <Persona initialView={section as View} />;
}
