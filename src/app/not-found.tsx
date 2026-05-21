"use client";

import LoginNavbar from "@/components/section/LoginNavbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fefefe] flex flex-col font-sans overflow-hidden">
      {/* Navbar tetap muncul agar user bisa navigasi balik */}
      <LoginNavbar />

      <main className="flex-1 flex items-center justify-center p-6 relative">
        {/* Glow background pink lembut sesuai desain */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-50/50 blur-[100px] rounded-full -z-10"></div>

        <Card className="w-full max-w-xl p-10 md:p-16 bg-white rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center text-center">
          
          {/* Angka 404 dengan Font Fraunces */}
          <h1 className="font-heading text-[120px] leading-none mb-8 text-[#06322b] tracking-tighter italic">
            404
          </h1>

          {/* Judul Pesan */}
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#06322b] leading-tight max-w-[400px]">
            Waduh, halaman ini kayaknya udah kamu kosongin
          </h2>
          
          {/* Deskripsi */}
          <p className="text-gray-500 text-sm md:text-base mb-10 max-w-[450px] leading-relaxed">
            Halaman yang kamu cari nggak ada, sudah dipindah, atau memang nggak pernah ada. Tapi tenang — kamu masih bisa balik ke home!
          </p>

          {/* Grup Tombol Action */}
          <div className="flex items-center gap-6">
            <Button 
              asChild
              className="bg-[#5E8B7E] hover:bg-[#4d7268] text-white font-bold px-8 py-6 rounded-[16px] transition-all active:scale-95 border-none shadow-none"
            >
              <Link href="/dashboard">Balik ke Home</Link>
            </Button>

            <button 
              onClick={() => router.back()}
              className="text-[#032119] font-bold hover:underline underline-offset-4 transition-all"
            >
              Kembali
            </button>
          </div>
        </Card>
      </main>
    </div>
  );
}