"use client";

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

import LoginNavbar from "@/components/section/LoginNavbar";
import ConsumptionForm from "@/components/tracking/ConsumptionForm";
import ConsumptionList from "@/components/tracking/ConsumptionList";
import EmptyState from "@/components/tracking/EmptyState";
import { Consumption } from "@/types/consumption";
import { getConsumptionLogs, postConsumptionLogs } from "@/api";
import { client } from "@/lib/api-client";
import { ConsumptionLog } from "@/api/types.gen";

export default function TrackingPage() {
  const router = useRouter();
  const [data, setData] = useState<Consumption[]>([]);
  const [filter, setFilter] = useState<"weekly" | "monthly">("weekly");
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const { data: response, error } = await getConsumptionLogs({
        client,
      });

      if (error) {
        console.error("Gagal mengambil log konsumsi:", error);
        return;
      }

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
      }
    } catch (err) {
      console.error("Terjadi kesalahan saat memuat data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 1. LOGIKA PROTEKSI SARKAS & PEMUATAN DATA ---
  useEffect(() => {
    const userSession = localStorage.getItem("user_session");
    if (!userSession) {
      router.push("/login");
      return;
    }

    fetchLogs();
  }, [router]);

  // --- 2. LOGIKA FILTERING PERIODE BERJALAN ---
  const now = new Date();

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

  const dailySummary = filteredData.reduce((acc, item) => {
    const day = new Date(item.date).toLocaleDateString("id-ID", {
      weekday: "short",
    });
    if (!acc[day]) acc[day] = 0;
    acc[day] += item.amount;
    return acc;
  }, {} as Record<string, number>);

  // MAPPING MINGGUAN (4 Minggu Terakhir)
  const getWeekNumber = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const weeklySummary = data.reduce((acc, item) => {
    const date = new Date(item.date);
    const weekNum = getWeekNumber(date);
    const year = date.getFullYear();
    const key = `${year}-W${weekNum}`;
    
    if (!acc[key]) acc[key] = 0;
    acc[key] += item.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = [];
  for (let i = 3; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - (i * 7));
    const weekNum = getWeekNumber(d);
    const year = d.getFullYear();
    const key = `${year}-W${weekNum}`;
    
    chartData.push({
      label: i === 0 ? "Minggu Ini" : `${i} Minggu Lalu`,
      amount: weeklySummary[key] || 0
    });
  }

  // --- 3. LOGIKA TAMBAH LOG KONSUMSI KE RAILWAY ---
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
        }
      });

      if (error) {
        console.error("Gagal menambah log konsumsi:", error);
        const errorData = error as any;
        const msg = errorData.message || (errorData.errors?.[0]?.message) || "Gagal menyimpan ke server.";
        alert(msg);
        return;
      }

      if (response?.success) {
        fetchLogs(); // Ambil ulang data segar dari server agar langsung update
      }
    } catch (err) {
      console.error("Terjadi kesalahan saat menambah data:", err);
    }
  };

  // --- 4. PERHITUNGAN PERIODE LALU ---
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

  const previousTotal = previousData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col font-sans">
      <LoginNavbar />

      <div className="px-6 md:px-12 lg:px-20 mt-10">
        <h1 className="text-4xl font-heading font-bold text-[#06322b]">
          Consumption Tracking
        </h1>
        <p className="text-gray-600 mt-2">
          Catat dan lihat ringkasan konsumsi harianmu secara visual.
        </p>
      </div>

      <main className="px-6 md:px-12 lg:px-20 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
        <div className="lg:col-span-2 space-y-6">
          <ConsumptionForm onAdd={handleAdd} />
          <div>
            <h3 className="font-semibold mb-2 text-[#06322b]">Riwayat Konsumsi</h3>
            {isLoading ? (
              <div className="text-center py-10">Memuat data...</div>
            ) : filteredData.length === 0 ? ( // 🔥 DIUBAH: Mengecek data yang terfilter biar sinkron
              <EmptyState />
            ) : (
              <ConsumptionList data={filteredData} /> // 🔥 DIUBAH: Hanya melempar data periode terpilih ke tabel list bawah
            )}
          </div>
        </div>

        {/* SIDEBAR INSIGHT */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#06322b]">Insight Visual</h3>
              <div className="bg-[#EDEAE8] p-1 rounded-xl flex text-sm font-medium">
                <button
                  onClick={() => setFilter("weekly")}
                  className={`px-4 py-1 rounded-lg transition ${
                    filter === "weekly" ? "bg-white shadow text-black" : "text-gray-500"
                  }`}
                >
                  Mingguan
                </button>
                <button
                  onClick={() => setFilter("monthly")}
                  className={`px-4 py-1 rounded-lg transition ${
                    filter === "monthly" ? "bg-white shadow text-black" : "text-gray-500"
                  }`}
                >
                  Bulanan
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#F8FAFA] p-4 rounded-lg border border-gray-50 shadow-sm">
                <p className="text-[10px] font-bold text-[#06322b] uppercase tracking-wider">Periode Ini</p>
                <p className="text-lg font-bold">Rp {total.toLocaleString('id-ID')}</p>
              </div>
              <div className="bg-[#F8FAFA] p-4 rounded-lg border border-gray-50 shadow-sm">
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Periode Lalu</p>
                <p className="text-lg font-bold">Rp {previousTotal.toLocaleString('id-ID')}</p>
              </div>
            </div>

            <div className="space-y-3">
              {Object.entries(categorySummary).map(([category, amount]) => (
                <div key={category} className="bg-[#F8FAFA] p-4 rounded-xl border border-gray-50 shadow-sm">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold">{category}</span>
                    <span className="font-bold text-[#4E827B]">Rp {amount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded">
                    <div
                      className="h-1.5 bg-[#06322b] rounded transition-all duration-300"
                      style={{ width: total > 0 ? `${(amount / total) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-50">
            <h3 className="font-semibold mb-4 text-[#06322b]">Grafik Konsumsi Mingguan</h3>
            {chartData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10 italic">Belum ada data</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: '#f9f9f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="amount" fill="#F7C8C9" radius={[4, 4, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}