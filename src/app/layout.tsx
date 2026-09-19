import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://getfluxiq.com"),
  title: "FluxIQ",
  description: "FluxIQ is a domain-neutral automation framework.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased">
      <body className="bg-[#03001c] text-slate-200">{children}</body>
    </html>
  );
}
