import type { Metadata } from "next";
import "./globals.css";
import { APP_NAME } from "@/lib/constants";
import { fetchRedMasaiProfile } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await fetchRedMasaiProfile().catch(() => null);
  const name = profile?.displayName ?? APP_NAME;
  return {
    title: {
      default: `${name} — Concept Preview`,
      template: `%s | ${name}`,
    },
    description:
      profile?.shortDescription ??
      "A functional hospitality concept preview awaiting owner review.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
