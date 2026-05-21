"use client";

import React, { useState, useEffect } from "react";
import LoginNavbar from "@/components/section/LoginNavbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Plus, ShieldCheck, Users, ArrowRight, ClipboardList, ImageIcon, Target } from "lucide-react";
import Link from "next/navigation"; // Pastikan import ini benar atau gunakan 'next/link'
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [consumptionData, setConsumptionData] = useState<any[]>([]);
  const [shieldData, setShieldData] = useState<any[]>([]);
  const [joinedChallenges, setJoinedChallenges] = useState<number[]>([]);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);

  const ALL_CHALLENGES = [
    { id: 1, title: "Zero Plastic Weekend", tag: "Zero Waste" },
    { id: 2, title: "Belanja Sadar", tag: "No Impulse" },
    { id: 3, title: "Selasa Kendalikan Emisi", tag: "Zero Waste" },
  ];

  useEffect(() => {
    const userSession = localStorage.getItem("user_session");
    if (!userSession) {
      router.replace("/login");
      return;
    }

    setUserName(localStorage.getItem("user_name") || "User");
    
    const savedCons = localStorage.getItem("consumption_data");
    const savedShield = localStorage.getItem("shield_data");
    const savedChall = localStorage.getItem("joined_challenges");

    if (savedCons) setConsumptionData(JSON.parse(savedCons));
    if (savedShield) {
      const parsed = JSON.parse(savedShield);
      setShieldData(parsed.filter((item: any) => item.status === "Waiting"));
    }
    if (savedChall) setJoinedChallenges(JSON.parse(savedChall));
    
    setLoading(false);
  }, [router]);

  const totalExpense = consumptionData.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  if (loading) return null;

  // --- VIEW: EMPTY STATE (GAMBAR P SUDAH DIHAPUS) ---
  if (consumptionData.length === 0) {
    return (
      <div className="min-h-screen bg-[#FEFEFE] flex flex-col font-sans">
        <LoginNavbar />
        <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-50/50 blur-[120px] rounded-full -z-10" />
          
          <Card className="w-full max-w-xl p-10 md:p-16 bg-white rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center text-center">
            {/* Bagian Daun Tanpa Badge P */}
            <div className="mb-10">
              <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center bg-[#F8FAFA] rounded-full">
                <img src="/daun.png" alt="Leaf" className="w-24 md:w-28 object-contain" />
              </div>
            </div>

            <h1 className="font-heading text-3xl font-bold mb-4 text-[#06322b]">
              Belum ada catatan konsumsi
            </h1>
            <p className="text-gray-400 mb-10 max-w-[350px] leading-relaxed">
              Yuk, mulai catat konsumsi pertamamu hari ini — nggak harus sempurna, yang penting mulai!
            </p>

            <button 
              onClick={() => router.push("/tracking")}
              className="bg-[#9bbab1] hover:bg-[#8aa79e] text-white font-bold px-12 py-5 rounded-[20px] text-lg border-none transition-all hover:scale-105 shadow-lg shadow-teal-900/10"
            >
              Catat Konsumsi Pertama
            </button>
          </Card>
        </main>
      </div>
    );
  }

  // --- VIEW: NORMAL DASHBOARD (Jika ada data) ---
  return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col font-sans pb-20">
      <LoginNavbar />
      <main className="px-6 md:px-12 lg:px-20 mt-10 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold text-[#06322b]">Hi, {userName}! 👋</h1>
            <p className="text-gray-400 mt-1">Ini ringkasan perjalanan hematmu hari ini.</p>
          </div>
          <button 
            onClick={() => router.push("/tracking")}
            className="bg-[#5E8B7E] hover:bg-[#4d7268] text-white font-bold rounded-2xl px-6 py-4 flex items-center gap-2 border-none"
          >
            <Plus className="w-5 h-5" /> Catat Pengeluaran
          </button>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Belanja" value={`Rp ${totalExpense.toLocaleString('id-ID')}`} sub="Periode ini" color="bg-pink-50" />
          <StatCard title="Impulse Shield" value={shieldData.length.toString()} sub="Item ditunda" color="bg-teal-50" />
          <StatCard title="Challenge" value={joinedChallenges.length.toString()} sub="Sedang diikuti" color="bg-blue-50" />
          <StatCard title="Daily Tracking" value={consumptionData.length.toString()} sub="Catatan aktif" color="bg-orange-50" />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-8 rounded-[32px] border-gray-100 shadow-sm bg-white">
            <h3 className="font-bold text-[#06322b] mb-8 flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-[#5E8B7E]" /> Tren Konsumsi
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consumptionData}>
                  <XAxis dataKey="date" hide />
                  <Tooltip cursor={{fill: '#f9f9f9'}} contentStyle={{borderRadius: '16px', border: 'none'}} />
                  <Bar dataKey="amount" fill="#9bbab1" radius={[8, 8, 8, 8]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-8 rounded-[32px] border-gray-100 shadow-sm bg-white border-t-4 border-t-[#5E8B7E]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#06322b] text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Waiting List
              </h3>
              <button onClick={() => router.push("/shield")} className="text-[10px] font-bold text-[#5E8B7E] uppercase hover:underline">Lihat Semua</button>
            </div>
            <div className="space-y-4">
              {shieldData.length > 0 ? (
                shieldData.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="p-4 bg-[#F8FAFA] rounded-[20px] border border-gray-50 group hover:border-[#5E8B7E] transition-all">
                    <p className="text-sm font-bold text-[#06322b] truncate">{item.itemName}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-[10px] text-gray-400">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                      <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">{item.duration}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center">
                  <ClipboardList className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-xs text-gray-400 italic">Belum ada barang ditunda.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, sub, color }: any) {
  return (
    <Card className={`p-6 rounded-[28px] border-none shadow-sm ${color}`}>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-bold text-[#06322b] mt-2 mb-1">{value}</p>
      <p className="text-[10px] font-medium text-gray-400">{sub}</p>
    </Card>
  );
}