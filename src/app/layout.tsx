import "@/lib/api-client";
// @ts-ignore: allow side-effect import of CSS in Next.js app directory
import "./index.css";
import { Fraunces } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata = {
  title: "Kosongin",
  description: "Rem digital sebelum checkout",
  icons: {
    icon: "/Logo1.svg",
  },
  // KODE VERIFIKASI DITARUH DI DALAM SINI:
  verification: {
    google: "b_1umSjzRcok8EmgiGKkuQa-PD5u0tcfcwuN9-LEJnM",
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