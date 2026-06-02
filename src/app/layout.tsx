import type { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "SKIA Forum | Seven Knights Idle Adventure",
    template: "%s | SKIA Forum",
  },
  description:
    "Forum diskusi komunitas Seven Knights Idle Adventure untuk guide, build, tanya jawab, guild, dan kabar patch.",
  applicationName: "SKIA Forum",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SKIA Forum | Seven Knights Idle Adventure",
    description:
      "Forum diskusi komunitas Seven Knights Idle Adventure untuk guide, build, tanya jawab, guild, dan kabar patch.",
    url: "/",
    siteName: "SKIA Forum",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/images/skia-forum-hero.png",
        width: 1672,
        height: 941,
        alt: "SKIA Forum komunitas Seven Knights Idle Adventure",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: "summary_large_image",
    title: "SKIA Forum | Seven Knights Idle Adventure",
    description:
      "Forum diskusi komunitas Seven Knights Idle Adventure untuk guide, build, tanya jawab, guild, dan kabar patch.",
    images: ["/images/skia-forum-hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
