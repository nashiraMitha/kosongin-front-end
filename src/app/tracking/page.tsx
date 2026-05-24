"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import LoginNavbar from "@/components/section/LoginNavbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, TrendingUp } from "lucide-react";
import { getConsumptionLogs, getDashboardInsight } from "@/api";
import { client } from "@/lib/api-client";
import Cookies from "js-cookie";

export default function TrackingPage() {
  const router = useRouter();
  
  // State manajemen data tracking harian
  const [consumptionData, setConsumptionData] = useState<any[]>([]);
  const [insightData, setInsightData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Mengunci default filter aktif grafik langsung ke Bulanan (monthly)
  const [graphPeriod, setGraphPeriod] = useState<"weekly" | "monthly">("monthly");

  // State Form Input Pengeluaran
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Lainnya");
  const [customCategory, setCustomCategory] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil data gabungan dari server API
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token") || localStorage.getItem("user_session");
      if (!token) return;

      const [logsRes, insightRes] = await Promise.all([
        getConsumptionLogs({ client }),
        getDashboardInsight({ client })
      ]);

      if (logsRes.data?.success) {
        const rawData = logsRes.data.data || [];
        const mappedData = rawData.map((item: any) => ({
          ...item,
          amount: item.amount ?? item.price ?? item.nominal ?? 0
        }));
        setConsumptionData(mappedData);
      }

      if (insightRes.data?.success) {
        setInsightData(insightRes.data.data);
      }
    } catch (err) {
      console.error("Gagal memuat data tracking:", err);
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
    fetchData();
  }, [router]);

  // Aksi Menyimpan Catatan Konsumsi Baru (POST /consumption-logs)
  const handleSaveConsumption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !price) {
      alert("Harap isi nama barang dan harga!");
      return;
    }

    try {
      setIsSubmitting(true);
      await client.post({
        url: "/consumption-logs",
        data: {
          name: itemName,
          amount: Number(price),
          category: category === "Lainnya" ? customCategory : category,
          date: date ? new Date(date).toISOString() : new Date().toISOString(),
          notes: notes
        }
      } as any);

      alert("Catatan konsumsi berhasil disimpan!");
      setItemName("");
      setPrice("");
      setCustomCategory("");
      setNotes("");
      await fetchData();
    } catch (error) {
      console.error("Gagal menyimpan catatan konsumsi:", error);
      alert("Gagal menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalExpense = consumptionData.reduce((acc: number, curr: any) => acc + Number(curr.amount || 0), 0);
  const previousExpense = insightData?.previous_period_total || 0;

  // Sinkronisasi data tren chart secara dinamis sesuai state filter aktif
  const chartData = graphPeriod === "monthly" 
    ? (insightData?.monthly_trend || []) 
    : (insightData?.weekly_trend || []);

  return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col font-sans pb-20">
      <LoginNavbar />
      
      <main className="px-6 md:px-12 lg:px-20 mt-10 space-y-12">
        
        {/* LAYOUT GRID UTAS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* KOLOM KIRI: FORM INPUT */}
          <div className="lg:col-span-2 space-y-6">
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-[#06322b]">Consumption Tracker</h1>
            </div>

            <Card className="p-6 md:p-8 bg-white rounded-[28px] border border-gray-200/60 shadow-sm w-full">
              <form onSubmit={handleSaveConsumption} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#06322b]">Nama Item</label>
                  <input 
                    type="text" 
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="Contoh: Adidas Cheongsam..." 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#5E8B7E]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#06322b]">Kategori</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none"
                  >
                    <option value="Makanan & Minuman">Makanan & Minuman</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {category === "Lainnya" && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#06322b]">Nama Kategori Kustom</label>
                    <input 
                      type="text" 
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Sebutkan kategori (misal: Hobi, Donasi...)" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#06322b]">Harga (Rp)</label>
                    <input 
                      type="number" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#06322b]">Tanggal</label>
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none bg-white text-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#06322b]">Catatan (opsional)</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Sale, self reward, repeat order..." 
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 mt-2 rounded-xl bg-[#5E8B7E] hover:bg-[#4d7268] text-white font-bold border-none"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan catatan"}
                </Button>
              </form>
            </Card>
          </div>

          {/* KOLOM KANAN: GRAPH & INSIGHT */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#06322b] uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={16} className="text-[#5E8B7E]" /> Insight Visual
              </h3>
              
              <div className="bg-gray-100 p-1 rounded-xl flex gap-1 border border-gray-200/40">
                <button 
                  type="button"
                  onClick={() => setGraphPeriod("weekly")}
                  className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                    graphPeriod === "weekly" ? "bg-white text-[#06322b] shadow-sm" : "text-gray-400 hover:text-black"
                  }`}
                >
                  Mingguan
                </button>
                <button 
                  type="button"
                  onClick={() => setGraphPeriod("monthly")}
                  className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                    graphPeriod === "monthly" ? "bg-white text-[#06322b] shadow-sm" : "text-gray-400 hover:text-black"
                  }`}
                >
                  Bulanan
                </button>
              </div>
            </div>

            <Card className="p-5 rounded-[24px] border border-gray-200/60 bg-white shadow-sm space-y-4">
              <div className="grid grid-cols-2 gap-2 border-b border-gray-50 pb-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Periode Ini</p>
                  <p className="text-base font-bold text-[#06322b] mt-1">Rp {totalExpense.toLocaleString('id-ID')}</p>
                </div>
                <div className="border-l border-gray-100 pl-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Periode Lalu</p>
                  <p className="text-base font-bold text-red-400 mt-1">Rp {previousExpense.toLocaleString('id-ID')}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#06322b] mb-1.5">
                  <span>Fashion</span>
                  <span>Rp {totalExpense.toLocaleString('id-ID')}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#5E8B7E] rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
            </Card>

            <Card className="p-5 rounded-[24px] border border-gray-200/60 bg-white shadow-sm">
              <h4 className="text-xs font-bold text-[#06322b] mb-4">
                Grafik Konsumsi {graphPeriod === "monthly" ? "Bulanan" : "Mingguan"}
              </h4>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis 
                      dataKey="label" 
                      axisLine={false}
                      tickLine={false}
                      tick={{fontSize: 10, fill: '#9CA3AF'}}
                    />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{fill: '#f9f9f9'}} 
                      contentStyle={{borderRadius: '12px', border: 'none', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                      formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Konsumsi']}
                    />
                    <Bar dataKey="total" fill="#fbc4b6" radius={[6, 6, 6, 6]} barSize={35} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

        </div>

        {/* --- AREA BAWAH: RIWAYAT KONSUMSI --- */}
        <div className="space-y-4 pt-2">
          <h3 className="text-lg font-bold text-[#06322b] flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-[#5E8B7E]" /> Riwayat Konsumsi
          </h3>

          <Card className="p-6 md:p-8 rounded-[24px] border border-gray-200/60 shadow-sm bg-white min-h-[150px] flex flex-col justify-center">
            {loading ? (
              <div className="text-center text-gray-400 italic text-sm">
                Memuat riwayat belanja...
              </div>
            ) : consumptionData.length > 0 ? (
              <div className="space-y-3 w-full">
                {consumptionData.map((item, idx) => (
                  <div 
                    key={item.id ?? idx} 
                    className="p-4 bg-[#F8FAFA] rounded-[16px] border border-gray-200/40 flex items-center justify-between hover:border-[#5E8B7E]/40 transition-all shadow-sm"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-[#06322b]">{item.name || item.itemName}</p>
                      <p className="text-[11px] text-gray-400 font-medium">
                        {item.date ? new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-[#06322b]">
                      Rp {Number(item.amount).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 text-sm">
                Belum ada catatan konsumsi
              </div>
            )}
          </Card>
        </div>

      </main>
    </div>
  );
}