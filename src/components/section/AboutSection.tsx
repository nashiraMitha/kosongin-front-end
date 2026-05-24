"use client";

import React from "react";

export default function AboutSection() {
  return (
    // WADAH KONTROL: Ditandai relative dan overflow-hidden agar gambar Bck.png tidak meluber keluar
    <section className="relative w-full pt-20 pb-32 overflow-hidden bg-transparent">
      
      {/* 1. LAYER LATAR BELAKANG: Gambar troli Bck.png diisolasi penuh di sini */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <img 
          src="/Bck.png" 
          alt="Blurred carts background" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. LAYER KONTEN UTAMA: Diberi z-10 agar teks melayang dengan jelas di atas gambar */}
      <div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center">
        
        {/* Logo/Icon Rumah/Keranjang Hijau Kecil */}
        <img src="/Logo1.svg" alt="Kosongin logo" className="w-16 h-16 mb-6 rounded-full object-contain" />

        {/* Judul Komponen */}
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#06322b] max-w-2xl leading-tight">
          Platform “rem digital” untuk Gen Z dan Millenial
        </h2>

        {/* Pembagian Grid Deskripsi Kiri & Kanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-12 max-w-4xl text-left text-sm md:text-base text-gray-600 leading-relaxed">
          <p>
            Kosongin hadir sebagai ruang refleksi konsumsi, membantu menahan hasrat belanja impulsif lewat sistem pencatatan inventaris barang yang intuitif dan menantang pengguna untuk lebih bijak mengelola pengeluaran.
          </p>
          <p>
            Lebih dari 60% Gen Z dan Millenial menyatakan peduli terhadap dampak penumpukan barang tak terpakai. Bersama komunitas, kami membangun kebiasaan hidup minimalis demi masa depan finansial dan lingkungan yang lebih sehat.
          </p>
        </div>

      </div>
    </section>
  );
}