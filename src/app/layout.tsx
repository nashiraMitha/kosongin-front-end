import "@/lib/api-client";
// @ts-ignore: allow side-effect import of CSS in Next.js app directory
import "./index.css";
import { Fraunces } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

// 🔥 TAMBAHKAN METADATA MANUAL DI SINI UNTUK MEMAKSA BROWSER MEMBACA Logo1.svg
export const metadata = {
  title: "Kosongin",
  description: "Rem digital sebelum checkout",
  icons: {
    icon: "/Logo1.svg", // Mengarah langsung ke public/Logo1.svg
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fraunces.variable}>
      <body className="bg-[#f5f5f3] text-[#0f2e2a]">
        {children}
      </body>
    </html>
  );
}