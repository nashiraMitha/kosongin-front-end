"use client";

<<<<<<< HEAD
import React, { useState, useEffect } from "react";
=======
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

>>>>>>> 30b3e28 (landing page fix)
import LoginNavbar from "@/components/section/LoginNavbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Calendar as CalendarIcon, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useRouter } from "next/navigation";
import { getConsumptionLogs, getDashboardInsight } from "@/api";
import { client } from "@/lib/api-client";
import Cookies from "js-cookie";

export default function TrackingPage() {
  const router = useRouter();
<<<<<<< HEAD
  const [consumptionData, setConsumptionData] = useState<any[]>([]);
  const [insightData, setInsightData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
=======
  const [data, setData] = useState<Consumption[]>([]);
  // Set default awal ke "monthly" agar grafiknya langsung mode bulanan
  const [filter, setFilter] = useState<"weekly" | "monthly">("monthly");
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const { data: response, error } = await getConsumptionLogs({
        client,
      });
>>>>>>> 30b3e28 (landing page fix)

  // Default grafik diatur langsung mengunci ke Bulanan (monthly)
  const [graphPeriod, setGraphPeriod] = useState<"weekly" | "monthly">("monthly");

  // State Form Input Pengeluaran
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Lainnya");
  const [customCategory, setCustomCategory] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
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

<<<<<<< HEAD
      if (insightRes.data?.success) {
        setInsightData(insightRes.data.data);
=======
      if (response?.success && Array.isArray(response.data)) {
        const mappedData: Consumption[] = response.data.map((log: ConsumptionLog) => {
          const categoryDisplayMapping: Record<string, string> = {
            "makanan & minuman": "Makanan & Minuman",
            "fashion": "Fashion",
            "elektronik": "Elektronik",
            "perawatan diri": "Perawatan Diri",
            "hiburan": "Hiburan",
            "lainnya": "Lainnya"
          };

          return {
            id: log.id || "",
            name: log.itemName || "",
            category: categoryDisplayMapping[log.itemCategory || ""] || "Lainnya",
            amount: Number(log.amount) || 0,
            date: log.consumedAt ? new Date(log.consumedAt).toISOString().split('T')[0] : "",
          };
        });
        setData(mappedData);
>>>>>>> 30b3e28 (landing page fix)
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

  const handleSaveConsumption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !price) {
      alert("Harap isi nama barang dan harga!");
      return;
    }

<<<<<<< HEAD
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
=======
    fetchLogs();
  }, [router]);

  const now = new Date();

  // --- FILTER DATA BERDASARKAN SELEKSI ---
  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.date);
    if (filter === "weekly") {
      const startOfWeek = new Date(now);
      const day = now.getDay();
      const diff = day === 0 ? 6 : day - 1;
      startOfWeek.setDate(now.getDate() - diff);
      startOfWeek.setHours(0, 0, 0, 0);
      return itemDate >= startOfWeek && itemDate <= now;
    }
    if (filter === "monthly") {
      return (
        itemDate.getMonth() === now.getMonth() &&
        itemDate.getFullYear() === now.getFullYear()
      );
    }
    return true;
  });

  const total = filteredData.reduce((sum, item) => sum + item.amount, 0);

  const categorySummary = filteredData.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = 0;
    acc[item.category] += item.amount;
    return acc;
  }, {} as Record<string, number>);

  // --- LOGIKA MAPPING GRAFIK (DINAMIS MENGIKUTI FILTER MINGGUAN / BULANAN) ---
  const getWeekNumber = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const chartData = [];

  if (filter === "weekly") {
    const weeklySummary = data.reduce((acc, item) => {
      const date = new Date(item.date);
      const weekNum = getWeekNumber(date);
      const year = date.getFullYear();
      const key = `${year}-W${weekNum}`;
      
      if (!acc[key]) acc[key] = 0;
      acc[key] += item.amount;
      return acc;
    }, {} as Record<string, number>);

    for (let i = 3; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - (i * 7));
      const weekNum = getWeekNumber(d);
      const year = d.getFullYear();
      const key = `${year}-W${weekNum}`;
      
      chartData.push({
        label: i === 0 ? "Minggu Ini" : `${i} Mgg Lalu`,
        amount: weeklySummary[key] || 0
      });
    }
  } else {
    // KONDISI BULANAN: Mengelompokkan total data 4 bulan terakhir ke sumbu X chart
    const monthlySummary = data.reduce((acc, item) => {
      const date = new Date(item.date);
      const m = date.getMonth();
      const y = date.getFullYear();
      const key = `${y}-${m}`;
      
      if (!acc[key]) acc[key] = 0;
      acc[key] += item.amount;
      return acc;
    }, {} as Record<string, number>);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    
    for (let i = 3; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const m = d.getMonth();
      const y = d.getFullYear();
      const key = `${y}-${m}`;
      
      chartData.push({
        label: i === 0 ? "Bulan Ini" : monthNames[m],
        amount: monthlySummary[key] || 0
      });
    }
  }

  const handleAdd = async (item: Consumption) => {
    try {
      const categoryMapping: Record<string, string> = {
        "Makanan & Minuman": "makanan & minuman",
        "Fashion": "fashion",
        "Elektronik": "elektronik",
        "Perawatan Diri": "perawatan diri",
        "Hiburan": "hiburan",
        "Lainnya": "lainnya"
      };

      const mappedCategory = categoryMapping[item.category] || "lainnya";
      
      const { data: response, error } = await postConsumptionLogs({
        client,
        body: {
          itemName: item.name,
          itemCategory: mappedCategory as any,
          ...(mappedCategory === "lainnya" 
            ? { itemCategoryCustom: item.category === "Lainnya" ? "Umum" : item.category } 
            : {}),
          amount: item.amount,
          consumedAt: new Date(item.date).toISOString(),
          notes: item.note,
>>>>>>> 30b3e28 (landing page fix)
        }
      } as any);

<<<<<<< HEAD
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
=======
      if (error) {
        console.error("Gagal menambah log konsumsi:", error);
        const errorData = error as any;
        const msg = errorData.message || (errorData.errors?.[0]?.message) || "Gagal menyimpan ke server.";
        alert(msg);
        return;
      }

      if (response?.success) {
        fetchLogs();
      }
    } catch (err) {
      console.error("Terjadi kesalahan saat menambah data:", err);
    }
  };

  // --- PERHITUNGAN PERIODE LALU ---
  const previousData = data.filter((item) => {
    const itemDate = new Date(item.date);
    if (filter === "weekly") {
      const day = now.getDay() || 7;
      const startThisWeek = new Date(now);
      startThisWeek.setDate(now.getDate() - day + 1);
      startThisWeek.setHours(0, 0, 0, 0);
      const startLastWeek = new Date(startThisWeek);
      startLastWeek.setDate(startThisWeek.getDate() - 7);
      const endLastWeek = new Date(startThisWeek);
      endLastWeek.setMilliseconds(-1);
      return itemDate >= startLastWeek && itemDate <= endLastWeek;
    }
    if (filter === "monthly") {
      const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      return itemDate >= startLastMonth && itemDate <= endLastMonth;
    }
    return false;
  });
>>>>>>> 30b3e28 (landing page fix)

  const chartData = graphPeriod === "monthly" 
    ? (insightData?.monthly_trend || []) 
    : (insightData?.weekly_trend || []);

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col font-sans pb-20">
=======
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col font-sans">
>>>>>>> 30b3e28 (landing page fix)
      <LoginNavbar />
      
      <main className="px-6 md:px-12 lg:px-20 mt-10 space-y-12">
        
        {/* LAYOUT GRID ATAS (Kiri: Form Input, Kanan: Grafik Insight) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* KOLOM KIRI: FORM INPUT */}
          <div className="lg:col-span-2 space-y-6">
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-[#06322b]">Consumption Tracker</h1>
            </div>

<<<<<<< HEAD
            <Card className="p-6 md:p-8 bg-white rounded-[28px] border border-gray-100 shadow-sm w-full">
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
=======
      <div className="px-6 md:px-12 lg:px-20 mt-10">
        <h1 className="text-4xl font-heading font-bold text-[#06322b]">
          Consumption Tracking
        </h1>
        <p className="text-gray-400 mt-2">
          Catat dan lihat ringkasan konsumsi harianmu secara visual.
        </p>
      </div>

      <main className="px-6 md:px-12 lg:px-20 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10 pb-12 items-start">
        <div className="lg:col-span-2 space-y-8">
          <ConsumptionForm onAdd={handleAdd} />
          
          <div className="space-y-4">
            <h3 className="font-bold text-xl text-[#06322b]">Riwayat Konsumsi</h3>
            {isLoading ? (
              <div className="text-center py-10 text-gray-400 italic text-sm">Memuat data...</div>
            ) : data.length === 0 ? (
              <EmptyState />
            ) : (
              /* AMAN: Pembungkus list menggunakan border-gray-200/60 biar tipis elegan */
              <div className="p-2 bg-white rounded-[24px] border border-gray-200/60 shadow-sm">
                <ConsumptionList data={data} />
              </div>
            )}
>>>>>>> 30b3e28 (landing page fix)
          </div>

<<<<<<< HEAD
          {/* KOLOM KANAN: GRAPH & INSIGHT (Sintaks Toggle Teks Ditutup Rapi) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#06322b] uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={16} className="text-[#5E8B7E]" /> Insight Visual
              </h3>
              
              <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
                <button 
                  type="button"
                  onClick={() => setGraphPeriod("weekly")}
                  className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                    graphPeriod === "weekly" ? "bg-white text-[#06322b] shadow-sm" : "text-gray-400 hover:text-black"
=======
        {/* SIDEBAR INSIGHT */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-200/60">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#06322b]">Insight Visual</h3>
              <div className="bg-gray-100 p-1 rounded-xl flex text-xs font-bold border border-gray-200/40">
                <button
                  type="button"
                  onClick={() => setFilter("weekly")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    filter === "weekly" ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-black"
>>>>>>> 30b3e28 (landing page fix)
                  }`}
                >
                  Mingguan
                </button>
<<<<<<< HEAD
                <button 
                  type="button"
                  onClick={() => setGraphPeriod("monthly")}
                  className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                    graphPeriod === "monthly" ? "bg-white text-[#06322b] shadow-sm" : "text-gray-400 hover:text-black"
=======
                <button
                  type="button"
                  onClick={() => setFilter("monthly")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    filter === "monthly" ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-black"
>>>>>>> 30b3e28 (landing page fix)
                  }`}
                >
                  Bulanan
                </button>
              </div>
            </div>

<<<<<<< HEAD
            <Card className="p-5 rounded-[24px] border border-gray-100 bg-white shadow-sm space-y-4">
              <div className="grid grid-cols-2 gap-2 border-b border-gray-50 pb-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Periode Ini</p>
                  <p className="text-base font-bold text-[#06322b] mt-1">Rp {totalExpense.toLocaleString('id-ID')}</p>
=======
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#EEF4F3] p-4 rounded-xl border border-teal-100/30">
                <p className="text-[10px] font-bold text-[#568F87] uppercase tracking-wider">Periode Ini</p>
                <p className="text-base font-bold text-[#06322b] mt-1">Rp {total.toLocaleString('id-ID')}</p>
              </div>
              <div className="bg-[#FCEAEA] p-4 rounded-xl border border-red-100/30">
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Periode Lalu</p>
                <p className="text-base font-bold text-red-500 mt-1">Rp {previousTotal.toLocaleString('id-ID')}</p>
              </div>
            </div>

            <div className="space-y-3">
              {Object.entries(categorySummary).map(([category, amount]) => (
                <div key={category} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between text-xs font-bold text-[#06322b] mb-2">
                    <span>{category}</span>
                    <span className="text-[#4E827B]">Rp {amount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#5E8B7E] rounded-full transition-all duration-300"
                      style={{ width: total > 0 ? `${(amount / total) * 100}%` : "0%" }}
                    />
                  </div>
>>>>>>> 30b3e28 (landing page fix)
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

            <Card className="p-5 rounded-[24px] border border-gray-100 bg-white shadow-sm">
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

<<<<<<< HEAD
=======
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-200/60">
            <h3 className="text-xs font-bold text-[#06322b] mb-4">
              Grafik Konsumsi {filter === "monthly" ? "Bulanan" : "Mingguan"}
            </h3>
            {chartData.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-10 italic">Belum ada data</p>
            ) : (
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} />
                    <YAxis hide />
                    <Tooltip cursor={{fill: '#f9f9f9'}} contentStyle={{borderRadius: '12px', border: 'none', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Konsumsi']} />
                    <Bar dataKey="amount" fill="#fbc4b6" radius={[6, 6, 6, 6]} barSize={35} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
>>>>>>> 30b3e28 (landing page fix)
        </div>

        {/* --- AREA BAWAH: STROKE KOTAK RIWAYAT KONSUMSI --- */}
        <div className="space-y-4 pt-2">
          <h3 className="text-lg font-bold text-[#06322b] flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-[#5E8B7E]" /> Riwayat Konsumsi
          </h3>

          <Card className="p-6 md:p-8 rounded-[24px] border border-gray-200 shadow-sm bg-white min-h-[150px] flex flex-col justify-center">
            {loading ? (
              <div className="text-center text-gray-400 italic text-sm">
                Memuat riwayat belanja...
              </div>
            ) : consumptionData.length > 0 ? (
              <div className="space-y-3 w-full">
                {consumptionData.map((item, idx) => (
                  <div 
                    key={item.id ?? idx} 
                    className="p-4 bg-[#F8FAFA] rounded-[16px] border border-gray-200 flex items-center justify-between hover:border-[#5E8B7E]/40 transition-all shadow-sm"
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