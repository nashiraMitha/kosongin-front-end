"use client";

import React, { useState, useEffect } from "react";
import LoginNavbar from "@/components/section/LoginNavbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Trophy, 
  ArrowRight,
  Users,
  ClipboardList
} from "lucide-react";
import { useRouter } from "next/navigation";
import { client } from "@/api/client.gen"; // Pastikan path client api kamu benar

export default function DashboardPage() {
  const router = useRouter();
  const [userName] = useState("nawra");
  const [challenges, setChallenges] = useState<any[]>([]);
  const [shieldList, setShieldList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // FETCH DATA KOMUNITAS (DARI ADMIN BACKEND)
  const fetchAdminChallenges = async () => {
    try {
      const res: any = await client.get({ url: '/challenges' } as any);
      const data = res?.data?.data ?? res?.data ?? [];
      if (Array.isArray(data)) {
        const mapped = data.slice(0, 2).map((item: any, index: number) => ({
          id: item.id ?? item._id ?? index,
          title: item.title || "Tantangan Kolektif",
          tag: item.challengesCategory || "General",
          participants: item.participantsCount ?? 0,
          imageUrl: item.imageUrl || ""
        }));
        setChallenges(mapped);
      }
    } catch (error) {
      console.error("Gagal ambil data komunitas:", error);
    }
  };

  // FETCH DATA SHIELD (LOCALSTORAGE)
  const refreshShieldData = () => {
    const saved = localStorage.getItem("shield_data");
    if (saved) {
      setShieldList(JSON.parse(saved).filter((item: any) => item.status === "Waiting"));
    }
  };

  useEffect(() => {
    fetchAdminChallenges();
    refreshShieldData();
    setIsLoading(false);
  }, []);

  // LOGIC KEPUTUSAN SINKRON DENGAN PAGE SHIELD
  const updateStatus = (id: number, newStatus: "Cancelled" | "Bought") => {
    const saved = localStorage.getItem("shield_data");
    if (saved) {
      const parsed = JSON.parse(saved);
      const updated = parsed.map((item: any) => item.id === id ? { ...item, status: newStatus } : item);
      localStorage.setItem("shield_data", JSON.stringify(updated));
      refreshShieldData();
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col font-sans pb-20">
      <LoginNavbar />

      <main className="px-6 md:px-12 lg:px-20 mt-10 space-y-10 animate-in fade-in duration-700">
        
        {/* HEADER DASHBOARD */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold text-[#06322b]">Hi, {userName}! 👋</h1>
            <p className="text-gray-400 text-sm mt-1">Ini ringkasan perjalanan hematmu hari ini.</p>
          </div>
          <Button 
            onClick={() => router.push("/tracking")}
            className="bg-[#5E8B7E] hover:bg-[#486b61] text-white px-6 py-6 rounded-xl font-bold flex items-center gap-2 shadow-sm border-none"
          >
            <Plus className="w-5 h-5" /> Catat Pengeluaran
          </Button>
        </div>

        {/* INSIGHT CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <InsightSmallCard title="Total Belanja" value="Rp 320.000" sub="Periode ini" color="text-[#06322b]" />
          <InsightSmallCard title="Impulse Shield" value={shieldList.length.toString()} sub="Item ditunda" color="text-amber-600" />
          <InsightSmallCard title="Challenge" value={challenges.length.toString()} sub="Sedang diikuti" color="text-[#06322b]" />
          <InsightSmallCard title="Streak" value="1" sub="Hari berturut-turut" color="text-emerald-600" />
        </section>

        {/* MAIN SECTION: GRAPH & WAITING LIST */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* GRAFIK KONSUMSI MINGGUAN */}
          <Card className="lg:col-span-2 p-8 rounded-[32px] border-gray-100 shadow-sm bg-white space-y-6">
            <h4 className="font-bold text-[#06322b] text-base">Grafik Konsumsi Mingguan</h4>
            <div className="h-44 flex items-end justify-between px-2 pt-4 border-b border-gray-100 relative">
                <BarChartItem height="15%" label="3 Minggu Lalu" active={false} />
                <BarChartItem height="8%" label="2 Minggu Lalu" active={false} />
                <BarChartItem height="85%" label="1 Minggu Lalu" active={true} />
                <BarChartItem height="70%" label="Minggu Ini" active={true} />
            </div>
          </Card>

          {/* WAITING LIST */}
          <Card className="p-6 rounded-[32px] border-gray-100 shadow-sm bg-white flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#06322b] text-sm flex items-center gap-2">
                <ClipboardList className="w-4 h-4" /> Waiting List
              </h3>
              <span onClick={() => router.push("/shield")} className="text-[10px] font-bold text-[#5E8B7E] cursor-pointer hover:underline uppercase">Lihat Semua</span>
            </div>
            
            <div className="space-y-4 overflow-y-auto max-h-[220px] pr-2 custom-scrollbar">
              {shieldList.length > 0 ? (
                shieldList.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-[#F8FAFA] border border-gray-50 space-y-3">
                    <div className="flex justify-between items-start">
                        <p className="text-xs font-bold text-[#06322b]">{item.itemName}</p>
                        <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">{item.duration}</span>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => updateStatus(item.id, "Cancelled")} className="flex-1 py-2 rounded-lg bg-white border border-gray-200 text-[10px] font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all">Batalkan</button>
                        <button type="button" onClick={() => updateStatus(item.id, "Bought")} className="flex-1 py-2 rounded-lg bg-[#9bbab1] text-white text-[10px] font-bold hover:bg-[#8aa79e] transition-all">Tetap Beli</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                    <p className="text-[11px] text-gray-400 italic">Belum ada barang ditunda.</p>
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* COMMUNITY SECTIONS */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-[#06322b] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> Community Challenge Terkini
            </h3>
            <span onClick={() => router.push("/komunitas")} className="text-[11px] font-bold text-[#5E8B7E] cursor-pointer hover:underline uppercase">Jelajah Semua</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.length > 0 ? challenges.map((item) => (
              <div key={item.id} className="cursor-pointer group" onClick={() => router.push("/komunitas")}>
                <Card className="p-4 rounded-[24px] border-gray-100 bg-white shadow-sm hover:shadow-md transition-all flex gap-4">
                  <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                    {item.imageUrl ? (
                      <img src={item.imageUrl.startsWith('http') ? item.imageUrl : `https://kosongin-backend-production.up.railway.app${item.imageUrl}`} className="w-full h-full object-cover" alt={item.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🖼️</div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <span className="text-[9px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 uppercase">
                        {item.tag}
                      </span>
                      <h4 className="font-bold text-[#06322b] text-sm mt-2 line-clamp-1">[{item.title}]</h4>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-medium">
                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {item.participants.toLocaleString('id-ID')} peserta</span>
                      <span className="text-[#5E8B7E] flex items-center gap-1">Detail <ArrowRight size={12} /></span>
                    </div>
                  </div>
                </Card>
              </div>
            )) : (
                <p className="text-sm text-gray-400 italic">Memuat tantangan terbaru...</p>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}

function BarChartItem({ height, label, active }: any) {
    return (
        <div className="flex flex-col items-center space-y-2 w-1/4">
            <div className={`w-full max-w-[50px] rounded-t-lg transition-all duration-500 ${active ? 'bg-red-300' : 'bg-red-200/40'}`} style={{ height: height }}></div>
            <span className="text-[9px] text-gray-400 whitespace-nowrap">{label}</span>
        </div>
    );
}

function InsightSmallCard({ title, value, sub, color }: any) {
    return (
        <Card className="p-6 rounded-[24px] border-gray-100 shadow-sm bg-white">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
            <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
            <p className="text-[11px] text-gray-400 mt-1">{sub}</p>
        </Card>
    );
}