import "@/lib/api-client";
import "./index.css";
import { Fraunces } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

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