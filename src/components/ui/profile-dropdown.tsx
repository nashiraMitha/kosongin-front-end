"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#f5f5f3] border-b">
      <div className="w-full px-6 md:px-12 lg:px-20 flex justify-between items-center py-10">

        {/* LOGO */}
        <Link href="/">
          <Image
            src="/Kosongin.svg"
            alt="Kosongin Logo"
            width={240}
            height={80}
            className="object-contain cursor-pointer"
          />
        </Link>

        {/* MENU + BUTTON */}
        <div className="flex items-center gap-10">
          <nav className="hidden md:flex gap-12 text-2xl">
            <Link href="#fitur" className="hover:text-[#568F87]">Fitur</Link>
            <Link href="#cara-kerja" className="hover:text-[#568F87]">Cara Kerja</Link>
            <Link href="#komunitas" className="hover:text-[#568F87]">Komunitas</Link>
            <Link href="/register" className="hover:text-[#568F87]">Daftar</Link>
          </nav>

          <Link href="/login">
            <button className="bg-[#568F87] text-white font-bold px-6 py-4 rounded-lg text-xl hover:bg-[#4a7a73] transition-all">
              Mulai Sekarang ⮕
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}