"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { client } from "@/api/client.gen";
import { getChallengesMe } from "@/api/sdk.gen";
import Cookies from "js-cookie";

function LocalLoginNavbar() {
  const router = useRouter();
  return (
    <nav className="w-full bg-white border-b border-gray-100 px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
        <span className="text-xl font-heading font-bold text-[#06322b] tracking-tight">kosongin.</span>
      </div>
      <div className="flex items-center gap-6 text-xs font-bold text-[#06322b]">
        <span className="cursor-pointer hover:text-[#5E8B7E] transition-colors" onClick={() => router.push("/tracking")}>Tracking</span>
        <span className="cursor-pointer hover:text-[#5E8B7E] transition-colors" onClick={() => router.push("/shield")}>Impulse Shield</span>
        <span className="text-[#5E8B7E] cursor-pointer border-b-2 border-[#5E8B7E] pb-1">Komunitas</span>
      </div>
      <button 
        onClick={() => {
          localStorage.clear();
          Cookies.remove("token");
          router.push("/login");
        }}
        className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors bg-red-50 px-3 py-2 rounded-xl"
      >
        Keluar
      </button>
    </nav>
  );
}

export default function KomunitasPage() {
  const router = useRouter();
  const [allChallenges, setAllChallenges] = useState<any[]>([]);
  const [myJoinedChallenges, setMyJoinedChallenges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCommunityData = async () => {
    try {
      setIsLoading(true);
      
      // 🔥 FIX SINKRONISASI TOKEN: Sesuaikan dengan key token halaman tracking/shield kelompokmu
      const token = Cookies.get("token") || localStorage.getItem("user_session") || localStorage.getItem("access_token");
      if (token) {
        client.setConfig({ headers: { Authorization: `Bearer ${token}` } });
      }

      // 1. Ambil Semua Tantangan Global
      const resAll: any = await client.get({ url: '/challenges' } as any);
      // Amankan pembacaan data jika nested di resAll.data.data.data atau resAll.data
      const dataAll = resAll?.data?.data?.data ?? resAll?.data?.data ?? resAll?.data ?? [];
      const listAll = Array.isArray(dataAll) ? dataAll : [];

      // 2. Ambil Tantangan yang Sedang Diikuti User Aktif
      let listJoined: any[] = [];
      try {
        const resMe: any = await getChallengesMe();
        listJoined = resMe?.data?.data?.data ?? resMe?.data?.data ?? resMe?.data ?? [];
      } catch (err) {
        console.warn("Belum ada tantangan yang diikuti:", err);
      }

      const safeAll = Array.isArray(listAll) ? listAll : [];
      const safeJoined = Array.isArray(listJoined) ? listJoined : [];

      // Ekstrak ID tantangan yang sudah diikuti agar tidak duplikat di bawah
      const joinedIds = safeJoined.map((c: any) => {
        const idTarget = c.id ?? c.challengeId ?? c.challenge?.id ?? c.challenge?._id;
        return idTarget ? String(idTarget) : null;
      }).filter(Boolean);

      // Filter tantangan yang tersedia (belum diikuti)
      const availableChallenges = safeAll.filter((c: any) => {
        const id = String(c.id || c._id || c.challengeId);
        return !joinedIds.includes(id);
      });

      setMyJoinedChallenges(safeJoined);
      setAllChallenges(availableChallenges);
    } catch (error) {
      console.error("Gagal memuat dashboard data komunitas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userSession = localStorage.getItem("user_session");
    if (!userSession) {
      router.replace("/login");
      return;
    }
    fetchCommunityData();
  }, [router]);

  const handleJoinChallenge = async (challengeId: any) => {
    try {
      await client.post({ url: `/challenges/${challengeId}/join` } as any);
      alert("Berhasil mengikuti challenge baru! Tetap disiplin ya.");
      await fetchCommunityData();
    } catch (err) {
      console.error("Gagal mengikuti challenge:", err);
      alert("Gagal mengikuti tantangan.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col font-sans pb-20">
      <LocalLoginNavbar />

      <main className="px-6 md:px-12 lg:px-20 mt-10 space-y-12">
        <section>
          <h1 className="text-4xl font-heading font-bold text-[#06322b]">Community Challenges</h1>
          <p className="text-gray-500 mt-1">Tantangan kolektif untuk konsumsi yang lebih bertanggung jawab.</p>
        </section>

        {/* --- BAGIAN 1: CHALLENGE YANG KAMU IKUTI --- */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#06322b]">Challenge yang Kamu Ikuti</h3>
          {isLoading ? (
            <p className="text-sm text-gray-400 italic">Memuat tantanganmu...</p>
          ) : myJoinedChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myJoinedChallenges.map((item: any, idx: number) => {
                const c = item.challenge || item;
                return (
                  <Card key={item.id || item._id || idx} className="p-5 border border-gray-100 bg-white rounded-2xl shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="inline-block bg-[#EEF4F3] text-[#5E8B7E] font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider mb-3">
                        {c.challengesCategory || c.category || "General"}
                      </span>
                      <h4 className="font-bold text-[#06322b] text-base mb-1.5">{c.title || "Tantangan Kosong"}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">"{c.description || "-"}"</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-50 pt-3 mt-2">
                      <span className="text-xs font-bold text-gray-400">{c.durationDays || c.duration || 3} Hari</span>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">Aktif Berjalan</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 italic text-xs py-2">Belum ada tantangan aktif yang kamu ikuti.</p>
          )}
        </div>

        {/* --- BAGIAN 2: SEMUA CHALLENGE AKTIF (YANG BELUM DIIKUTI) --- */}
        <div className="space-y-4 pt-4">
          <h3 className="text-xl font-bold text-[#06322b]">Semua Challenge Aktif</h3>
          {isLoading ? (
            <p className="text-sm text-gray-400 italic">Memuat semua daftar tantangan...</p>
          ) : allChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allChallenges.map((item: any, idx: number) => (
                <Card key={item.id || item._id || idx} className="p-5 border border-gray-200/50 bg-white rounded-2xl shadow-sm flex flex-col justify-between hover:border-[#5E8B7E]/40 transition-all">
                  <div>
                    <span className="inline-block border border-[#5E8B7E] text-[#5E8B7E] font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider mb-3">
                      {item.challengesCategory || item.category || "General"}
                    </span>
                    <h4 className="font-bold text-[#06322b] text-base mb-1.5">{item.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mb-4">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-2">
                    <span className="text-xs font-bold text-gray-400">{item.durationDays || item.duration || 3} Hari</span>
                    <button
                      type="button"
                      onClick={() => handleJoinChallenge(item.id || item._id || item.challengeId)}
                      className="text-xs font-bold bg-[#5E8B7E] hover:bg-[#4d7268] text-white px-4 py-2 rounded-xl transition-all active:scale-95 shadow-sm"
                    >
                      Ikuti Challenge
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic text-xs py-2">Semua tantangan dari admin telah kamu ikuti!</p>
          )}
        </div>

      </main>
    </div>
  );
}