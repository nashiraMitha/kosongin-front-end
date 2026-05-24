"use client";

import React, { useState, useEffect } from "react";
import LoginNavbar from "@/components/section/LoginNavbar";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Plus, ShieldCheck, ClipboardList, Target } from "lucide-react";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
import { getConsumptionLogs, getWishlist, getChallengesMe, getDashboardInsight, getProfile } from "@/api";
=======
import { getConsumptionLogs, getWishlist, getDashboardInsight, getProfile } from "@/api";
>>>>>>> 30b3e28 (landing page fix)
import { client } from "@/lib/api-client";

export default function DashboardPage() {
  const router = useRouter();
  const [consumptionData, setConsumptionData] = useState<any[]>([]);
  const [insightData, setInsightData] = useState<any>(null);
  const [shieldData, setShieldData] = useState<any[]>([]);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [consRes, wishRes, insightRes, profileRes] = await Promise.all([
        getConsumptionLogs({ client }),
        getWishlist({ client }),
        getDashboardInsight({ client }),
        getProfile({ client })
      ]);

      if (profileRes.data?.success && profileRes.data?.data) {
        const fetchedName = profileRes.data.data.nickName || profileRes.data.data.fullName || "User";
        setUserName(fetchedName);
        localStorage.setItem("user_name", fetchedName);
      } else {
        setUserName(localStorage.getItem("user_name") || "User");
      }

      if (consRes.data?.success) {
        setConsumptionData(consRes.data.data || []);
      }

      if (wishRes.data?.success || (wishRes as any).success) {
        const rawWish = wishRes.data?.data ?? (wishRes as any).data ?? [];
        const activeWishlist = rawWish.filter(
          (item: any) => item.wishlistStatus === "waiting" || item.status === "waiting"
        );
        setShieldData(activeWishlist);
      }

      if (insightRes.data?.success) {
        setInsightData(insightRes.data.data);
      }

    } catch (err) {
      console.error("Gagal memuat data dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userSession = localStorage.getItem("user_session");
    if (!userSession) {
      router.replace("/login");
      return;
    }
<<<<<<< HEAD

    setUserName(localStorage.getItem("user_name") || "User");
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Parallel fetching for performance
        const [consRes, wishRes, insightRes, profileRes] = await Promise.all([
          getConsumptionLogs({ client }),
          getWishlist({ client }),
          getDashboardInsight({ client }),
          getProfile({ client })
        ]);

        if (profileRes.data?.success && profileRes.data?.data) {
          const fetchedName = profileRes.data.data.nickName || profileRes.data.data.fullName || "User";
          setUserName(fetchedName);
          localStorage.setItem("user_name", fetchedName);
        }

        if (consRes.data?.success) {
          setConsumptionData(consRes.data.data || []);
        }

        const wishData = wishRes.data;
        if (wishData?.success) {
          const rawData = wishData?.data || [];
          const activeWishlist = rawData.filter(
            (item: any) => item.whislistStatus === "waiting"
          );
          setShieldData(activeWishlist);
        }

        if (insightRes.data?.success) {
          setInsightData(insightRes.data.data);
        }

      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

=======
>>>>>>> 30b3e28 (landing page fix)
    fetchData();

    // Listen for shield updates triggered from Shield page to refresh dashboard live
    const onShieldUpdated = () => { fetchData(); };
    window.addEventListener('shield-updated', onShieldUpdated);
    return () => window.removeEventListener('shield-updated', onShieldUpdated);
  }, [router]);

<<<<<<< HEAD
  const totalExpense = consumptionData.reduce((acc: number, curr: any) => acc + Number(curr.amount || 0), 0);
=======
  const totalExpense = consumptionData.reduce((acc, curr) => acc + Number(curr.amount || curr.price || 0), 0);

  // --- LOGIKA HITUNG TREN MINGGUAN DINAMIS AGAR GRAFIK MUNCUL ---
  const getWeekNumber = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const weeklySummary = consumptionData.reduce((acc, item) => {
    const dStr = item.consumedAt || item.date;
    if (!dStr) return acc;
    const date = new Date(dStr);
    const weekNum = getWeekNumber(date);
    const key = `${date.getFullYear()}-W${weekNum}`;
    acc[key] = (acc[key] || 0) + Number(item.amount || item.price || 0);
    return acc;
  }, {} as Record<string, number>);

  const chartData = [];
  for (let i = 3; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - (i * 7));
    const weekNum = getWeekNumber(d);
    const key = `${d.getFullYear()}-W${weekNum}`;
    chartData.push({
      label: i === 0 ? "Minggu Ini" : `${i} Minggu Lalu`,
      total: weeklySummary[key] || 0
    });
  }
>>>>>>> 30b3e28 (landing page fix)

  if (loading) return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col font-sans">
      <LoginNavbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#9bbab1] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#06322b] font-medium">Memuat dashboard...</p>
        </div>
      </main>
    </div>
  );

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
            className="bg-[#5E8B7E] hover:bg-[#4d7268] text-white font-bold rounded-2xl px-6 py-4 flex items-center gap-2 border-none shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-5 h-5" /> Catat Pengeluaran
          </button>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Belanja" value={`Rp ${totalExpense.toLocaleString('id-ID')}`} sub="Periode ini" color="bg-pink-50" />
          <StatCard title="Impulse Shield" value={(insightData?.wishlist_count || shieldData.length || 0).toString()} sub="Item ditunda" color="bg-teal-50" />
          <StatCard title="Challenge" value={(insightData?.active_challenge || 0).toString()} sub="Sedang diikuti" color="bg-blue-50" />
          <StatCard title="Streak" value={(insightData?.streak || 1).toString()} sub="Hari berturut-turut" color="bg-orange-50" />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-8 rounded-[32px] border border-gray-200/60 shadow-sm bg-white">
            <h3 className="font-bold text-[#06322b] mb-8 flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-[#5E8B7E]" /> Tren Konsumsi (4 Minggu Terakhir)
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                  <Tooltip 
                    cursor={{fill: '#f9f9f9'}} 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                    formatter={(value: any) => [`Rp ${Number(value || 0).toLocaleString('id-ID')}`, 'Total Konsumsi']}
                  />
                  <Bar dataKey="total" fill="#9bbab1" radius={[8, 8, 8, 8]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-8 rounded-[32px] border border-gray-200/60 shadow-sm bg-white border-t-4 border-t-[#5E8B7E]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#06322b] text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#5E8B7E]" /> Waiting List
              </h3>
              <button onClick={() => router.push("/shield")} className="text-[10px] font-bold text-[#5E8B7E] uppercase hover:underline">Lihat Semua</button>
            </div>
            <div className="space-y-4">
              {shieldData.length > 0 ? (
                shieldData.slice(0, 3).map((item: any, idx: number) => (
<<<<<<< HEAD
                  <div key={idx} className="p-4 bg-[#F8FAFA] rounded-[20px] border border-gray-50 group hover:border-[#5E8B7E] transition-all">
                    <p className="text-sm font-bold text-[#06322b] truncate">{item.itemName}</p>
                                      <div className="flex justify-between items-center mt-1">
                                        <p className="text-[10px] text-gray-400">Rp {Number(item.estimatePrice).toLocaleString('id-ID')}</p>
                                        <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">{item.waitingDays} Hari</span>
                                      </div>
                                    </div>
=======
                  <div key={idx} className="p-4 bg-[#F8FAFA] rounded-[20px] border border-gray-100/50 flex flex-col justify-between group hover:border-[#5E8B7E]/40 transition-all">
                    <p className="text-sm font-bold text-[#06322b] truncate">{item.itemName || item.name}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-[11px] text-gray-400 font-semibold">Rp {Number(item.estimatePrice || item.price || 0).toLocaleString('id-ID')}</p>
                      <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{item.waitingDays || 3} Hari</span>
                    </div>
                  </div>
>>>>>>> 30b3e28 (landing page fix)
                ))
              ) : (
                <div className="py-14 text-center">
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

function StatCard({ title, value, sub, color }: any) {
  return (
    <Card className={`p-6 rounded-[28px] border-none shadow-sm ${color}`}>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-bold text-[#06322b] mt-2 mb-1">{value}</p>
      <p className="text-[10px] font-medium text-gray-400">{sub}</p>
    </Card>
  );
}