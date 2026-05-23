"use client";

import React, { useState, useEffect } from "react";
import LoginNavbar from "@/components/section/LoginNavbar";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Plus, ShieldCheck, Users, ClipboardList, Target } from "lucide-react";
import { useRouter } from "next/navigation";

import { client } from "@/api/client.gen";
import { getDashboardInsight, getConsumptionLogs, getWishlist, getChallengeMe } from "@/api/sdk.gen";
import Cookies from "js-cookie";

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [insight, setInsight] = useState<any | null>(null);
  const [consumptionData, setConsumptionData] = useState<any[]>([]);
  const [shieldData, setShieldData] = useState<any[]>([]);
  const [joinedChallenges, setJoinedChallenges] = useState<Array<string | number>>([]);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const init = async () => {
      const userSession = localStorage.getItem("user_session");
      if (!userSession) {
        router.replace("/login");
        return;
      }

      setUserName(localStorage.getItem("user_name") || "User");

      const token = (typeof window !== "undefined")
        ? (localStorage.getItem("access_token") || localStorage.getItem("user_token") || Cookies.get("access_token") || Cookies.get("token"))
        : null;

      if (token) {
        client.setConfig({ headers: { Authorization: `Bearer ${token}` } });
      }

      setLoading(true);

      try {
        // 1) Dashboard insight (categories, monthly_summary, wishlist_count, active_challenge)
        const insRes: any = await getDashboardInsight();
        const insightData = insRes?.data?.data ?? insRes?.data ?? null;
        setInsight(insightData);

        // 2) Consumption logs (fallback / detailed list)
        try {
          const consRes: any = await getConsumptionLogs();
          const consList = consRes?.data?.data ?? consRes?.data ?? [];
          setConsumptionData(Array.isArray(consList) ? consList : []);
        } catch (e) {
          // fallback: derive consumption from insight.monthly_summary if available
          const monthly = insightData?.monthly_summary ?? [];
          const mapped = Array.isArray(monthly)
            ? monthly.map((m: any) => ({ date: m.category ?? "", amount: m.total ?? 0 }))
            : [];
          setConsumptionData(mapped);
        }

        // 3) Wishlist / shield from backend (if available). If not, fallback to localStorage
        try {
          const wishRes: any = await getWishlist();
          const wishlist = wishRes?.data?.data ?? wishRes?.data ?? [];
          const waiting = Array.isArray(wishlist) ? wishlist.filter((w: any) => (w.whislistStatus ?? w.status ?? "").toLowerCase() === "waiting").slice(0, 3) : [];
          setShieldData(waiting);
        } catch (e) {
          const raw = localStorage.getItem("shield_data");
          try {
            const parsed = raw ? JSON.parse(raw) : [];
            setShieldData(Array.isArray(parsed) ? parsed.filter((i) => i?.status === "Waiting").slice(0, 3) : []);
          } catch {
            setShieldData([]);
          }
        }

        // 4) Joined challenges for user
        if (token) {
          try {
            const meRes: any = await getChallengeMe();
            const myData = meRes?.data?.data ?? meRes?.data ?? [];
            const ids = Array.isArray(myData) ? myData.map((c: any) => c.id ?? c.challengeId ?? c.challenge?.id).filter(Boolean) : [];
            setJoinedChallenges(ids);
          } catch {
            setJoinedChallenges([]);
          }
        } else {
          const saved = localStorage.getItem("joined_challenges");
          if (saved) setJoinedChallenges(JSON.parse(saved));
        }

      } catch (err) {
        console.error("Failed loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  const totalExpense = consumptionData.reduce((acc, curr) => acc + Number(curr.amount ?? curr.estimatePrice ?? 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FEFEFE] flex items-center justify-center">
        <p className="text-gray-500">Memuat dashboard...</p>
      </div>
    );
  }

  // derive stats from insight
  const categories = insight?.category ?? [];
  const itemCount = categories.reduce((acc: number, cur: any) => acc + Number(cur?.total ?? 0), 0);

  const topCategoryRaw = categories.length > 0 ? categories.reduce((best: any, cur: any) => (Number(cur?.total ?? 0) > Number(best?.total ?? 0) ? cur : best), categories[0]) : null;
  const formatTitleCase = (s?: string) => (s ?? "").toString().toLowerCase().split(" ").filter(Boolean).map((w: string) => w[0].toUpperCase() + w.slice(1)).join(" ");
  const topCategory = formatTitleCase(topCategoryRaw?.category);

  const monthly = insight?.monthly_summary ?? (consumptionData.map((c) => ({ category: c.date ?? '', total: Number(c.amount ?? 0) })));

  // Empty state if totalExpense === 0 (as requested)
  if (itemCount === 0 && totalExpense === 0) {
    return (
      <div className="min-h-screen bg-[#FEFEFE] flex flex-col font-sans">
        <LoginNavbar />
        <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-50/50 blur-[120px] rounded-full -z-10" />

          <Card className="w-full max-w-xl p-10 md:p-16 bg-white rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="mb-10">
              <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center bg-[#F8FAFA] rounded-full">
                <img src="/daun.png" alt="Leaf" className="w-24 md:w-28 object-contain" />
              </div>
            </div>

            <h1 className="font-heading text-3xl font-bold mb-4 text-[#06322b]">Belum ada catatan konsumsi</h1>
            <p className="text-gray-400 mb-10 max-w-[350px] leading-relaxed">Yuk, mulai catat konsumsi pertamamu hari ini — nggak harus sempurna, yang penting mulai!</p>

            <button onClick={() => router.push('/tracking')} className="bg-[#9bbab1] hover:bg-[#8aa79e] text-white font-bold px-12 py-5 rounded-[20px] text-lg border-none transition-all hover:scale-105 shadow-lg shadow-teal-900/10">Catat Konsumsi Pertama</button>

          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col font-sans pb-20">
      <LoginNavbar />
      <main className="px-6 md:px-12 lg:px-20 mt-10 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold text-[#06322b]">Hi, {userName}! 👋</h1>
            <p className="text-gray-400 mt-1">Ini ringkasan perjalanan hematmu hari ini.</p>
          </div>
          <button onClick={() => router.push('/tracking')} className="bg-[#5E8B7E] hover:bg-[#4d7268] text-white font-bold rounded-2xl px-6 py-4 flex items-center gap-2 border-none"><Plus className="w-5 h-5" /> Catat Pengeluaran</button>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Item Tercatat" value={String(itemCount)} sub="Total seluruh kategori" color="bg-pink-50" icon={<Users className="w-5 h-5 text-[#9b4260]" />} />
          <StatCard title="Kategori Terbanyak" value={topCategory || '-'} sub="Kategori populer" color="bg-teal-50" icon={<Target className="w-5 h-5 text-[#3b7f78]" />} />
          <StatCard title="Active Challenge" value={String(insight?.active_challenge ?? 0)} sub="Sedang diikuti" color="bg-blue-50" icon={<ShieldCheck className="w-5 h-5 text-[#4b7ea0]" />} />
          <StatCard title="Wishlist Count" value={String(insight?.wishlist_count ?? 0)} sub="Item di wishlist" color="bg-orange-50" icon={<ClipboardList className="w-5 h-5 text-[#b36b3b]" />} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[32px] border-gray-100 shadow-sm p-8">
              <h3 className="font-bold text-[#06322b] mb-6 flex items-center gap-2"><Target className="w-5 h-5 text-[#5E8B7E]" /> Tren Konsumsi</h3>

              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthly}>
                    <XAxis dataKey="category" />
                    <Tooltip cursor={{ fill: '#f9f9f9' }} contentStyle={{ borderRadius: 16, border: 'none' }} />
                    <Bar dataKey="total" fill="#f7b6c2" radius={[8, 8, 8, 8]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div>
            <div className="p-8 rounded-[32px] border-gray-100 shadow-sm bg-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-[#06322b] text-lg flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Waiting List</h3>
                <button onClick={() => router.push('/shield')} className="text-[10px] font-bold text-[#5E8B7E] uppercase hover:underline">Lihat Semua</button>
              </div>

              <div className="space-y-4">
                {shieldData.length > 0 ? (
                  shieldData.map((item: any, idx: number) => (
                    <div key={item.id ?? idx} className="p-4 bg-[#F8FAFA] rounded-[20px] border border-gray-50 group hover:border-[#5E8B7E] transition-all">
                      <p className="text-sm font-bold text-[#06322b] truncate">{item.itemName ?? item.item_name ?? item.name}</p>
                      {item.link ? (<p className="text-[11px] text-[#568F87] truncate"><a href={item.link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="underline">Lihat produk</a></p>) : null}
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-[10px] text-gray-400">Rp {Number(item.price ?? item.estimatePrice ?? 0).toLocaleString('id-ID')}</p>
                        <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">{item.duration ?? item.waitingDays}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center">
                    <ClipboardList className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-xs text-gray-400 italic">Belum ada item yang ditunda.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, sub, color, icon }: any) {
  return (
    <Card className={`p-6 rounded-[28px] shadow-sm ${color}`}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{title}</p>
        <div>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-[#06322b] mt-2 mb-1">{value}</p>
      <p className="text-[10px] text-gray-400">{sub}</p>
    </Card>
  );
}
