"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import LoginNavbar from "@/components/section/LoginNavbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, TrendingUp, Image as ImageIcon, X, ImageIcon as FileImageIcon } from "lucide-react";
import { getConsumptionLogs, getDashboardInsight } from "@/api";
import { client } from "@/lib/api-client";
import Cookies from "js-cookie";

export default function TrackingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMountedRef = useRef(true);
  
  const [consumptionData, setConsumptionData] = useState<any[]>([]);
  const [insightData, setInsightData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [graphPeriod, setGraphPeriod] = useState<"weekly" | "monthly">("monthly");

  // State Form Input Pengeluaran + FOTO
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  
  // 🔥 KUNCI UTAMA 1: Default awal langsung ke 'Makanan & Minuman' dari 5 kategori resmi
  const [category, setCategory] = useState("Makanan & Minuman"); 
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mapping string kategori untuk tampilan di tabel riwayat agar rapi
  const categoryDisplayMapping: Record<string, string> = {
    "makanan & minuman": "Makanan & Minuman",
    "fashion": "Fashion",
    "elektronik": "Elektronik",
    "perawatan diri": "Perawatan Diri",
    "hiburan": "Hiburan"
  };

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
        const mappedData = rawData.map((item: any) => {
          const rawCat = (item.itemCategory || item.category || "").toLowerCase();
          return {
            ...item,
            itemName: item.itemName || item.name || "Item Tanpa Nama",
            // 🔥 KUNCI UTAMA 2: Riwayat membaca kategori terstandarisasi dari 5 kategori utama
            categoryMapped: categoryDisplayMapping[rawCat] || item.itemCategory || item.category || "Umum",
            amount: Number(item.amount ?? item.price ?? item.nominal ?? 0),
            date: item.date || item.createdAt || item.dateAdded || item.timestamp || null,
            imageUrl: item.imageUrl || item.image || item.photo || null
          };
        });
        
        const sorted = mappedData.slice().sort((a: any, b: any) => {
          const da = a.date ? new Date(a.date).getTime() : 0;
          const db = b.date ? new Date(b.date).getTime() : 0;
          return db - da;
        });
        setConsumptionData(sorted);
      }
      if (insightRes.data?.success) setInsightData(insightRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    const userSession = localStorage.getItem("user_session");
    if (!userSession) { router.replace("/login"); return; }
    fetchData();
    return () => { isMountedRef.current = false; };
  }, [router]);

  useEffect(() => {
    const iv = setInterval(() => { if (isMountedRef.current) fetchData(); }, 10000);
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'consumption_updated') fetchData();
    };
    window.addEventListener('storage', onStorage);
    return () => { clearInterval(iv); window.removeEventListener('storage', onStorage); };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { alert("Maksimal boks foto adalah 2MB."); return; }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveConsumption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !price) {
      alert("Harap isi nama barang dan harga!");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Mapping ke lowercase agar sesuai dengan format yang diminta database backend tim kamu
      const backendCategoryMapping: Record<string, string> = {
        "Makanan & Minuman": "makanan & minuman",
        "Fashion": "fashion",
        "Elektronik": "elektronik",
        "Perawatan Diri": "perawatan diri",
        "Hiburan": "hiburan"
      };

      const formDataToSend = new FormData();
      formDataToSend.append("name", itemName.trim());
      formDataToSend.append("amount", String(Number(price)));
      formDataToSend.append("category", backendCategoryMapping[category] || "makanan & minuman");
      formDataToSend.append("date", date ? new Date(date).toISOString() : new Date().toISOString());
      formDataToSend.append("notes", notes);
      if (imageFile) formDataToSend.append("image", imageFile);

      await client.post({ url: "/consumption-logs", data: formDataToSend } as any);
      alert("Catatan konsumsi berhasil disimpan!");
      
      setItemName("");
      setPrice("");
      setNotes("");
      setCategory("Makanan & Minuman");
      setDate(new Date().toISOString().split('T')[0]);
      handleRemoveImage();
      await fetchData();
      try { localStorage.setItem('consumption_updated', Date.now().toString()); } catch (e) {}
    } catch (error) {
      console.error(error);
    } finally { setIsSubmitting(false); }
  };

  const totalExpense = consumptionData.reduce((acc: number, curr: any) => acc + Number(curr.amount || 0), 0);
  const previousExpense = insightData?.previous_period_total || 0;

  const aggregateChartFromLogs = (logs: any[], period: "weekly" | "monthly") => {
    if (!Array.isArray(logs)) return [];
    const acc = new Map<string, { label: string; total: number; date: Date }>();
    logs.forEach((it: any) => {
      const rawDate = it.date || it.createdAt || it.dateAdded || it.timestamp;
      const d = rawDate ? new Date(rawDate) : new Date();
      if (isNaN(d.getTime())) return;
      let key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      let label = d.toLocaleString("id-ID", { month: "short", year: "numeric" });
      
      if (period === "weekly") {
        const start = new Date(d);
        start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
        key = start.toISOString().slice(0, 10);
        label = `${start.getDate()} ${start.toLocaleString("id-ID", { month: "short" })}`;
      }
      if (!acc.has(key)) acc.set(key, { label, total: 0, date: d });
      acc.get(key)!.total += Number(it.amount || 0);
    });
    return Array.from(acc.values()).sort((a, b) => a.date.getTime() - b.date.getTime()).map(o => ({ label: o.label, total: o.total }));
  };

  const chartData = graphPeriod === "monthly"
    ? (insightData?.monthly_trend?.length ? insightData.monthly_trend : aggregateChartFromLogs(consumptionData, "monthly"))
    : (insightData?.weekly_trend?.length ? insightData.weekly_trend : aggregateChartFromLogs(consumptionData, "weekly"));

  return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col font-sans pb-20">
      <LoginNavbar />
      <main className="px-6 md:px-12 lg:px-20 mt-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-2xl font-bold text-[#06322b]">Consumption Tracker</h1>
            <Card className="p-6 md:p-8 bg-white rounded-[28px] border border-gray-200/60 shadow-sm w-full">
              <form onSubmit={handleSaveConsumption} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#06322b] block">Nama Item</label>
                  <input 
                    type="text" required value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="Contoh: Kopi Susu, Baju Kemeja..." 
                    className="w-full bg-[#FEFEFE] border border-[#5E8B7E] rounded-xl p-3 text-xs text-[#06322b] placeholder-gray-300 focus:outline-none focus:border-[#4d7268] focus:ring-1 focus:ring-[#4d7268] transition-all"
                  />
                </div>

                {/* 🔥 KUNCI UTAMA 3: Dropdown dibatasi murni hanya 5 kategori utama proyek Kosongin */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#06322b] block">Kategori</label>
                  <select 
                    value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 rounded-xl border border-[#5E8B7E] px-4 text-xs focus:outline-none bg-[#FEFEFE] text-[#06322b]"
                  >
                    <option value="Makanan & Minuman">Makanan & Minuman</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Perawatan Diri">Perawatan Diri</option>
                    <option value="Hiburan">Hiburan</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#06322b] block">Harga (Rp)</label>
                    <input 
                      type="number" required min={1} value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0" className="w-full bg-[#FEFEFE] border border-[#5E8B7E] rounded-xl p-3 text-xs text-[#06322b] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#06322b] block">Tanggal</label>
                    <input 
                      type="date" required value={date} onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[#FEFEFE] border border-[#5E8B7E] rounded-xl p-3 text-xs text-[#06322b] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-sm font-bold text-[#06322b]">Lampirkan Foto Nota / Barang</label>
                  <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageChange} className="hidden" />
                  {!imagePreview ? (
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full py-4 border-2 border-dashed border-[#5E8B7E]/40 rounded-xl flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-[#5E8B7E] hover:text-[#5E8B7E]">
                      <ImageIcon className="w-6 h-6 text-[#5E8B7E]/70" />
                      <span className="text-xs font-semibold">Klik untuk upload foto (Max 2MB)</span>
                    </button>
                  ) : (
                    <div className="relative w-32 h-32 border border-[#5E8B7E] rounded-xl overflow-hidden bg-gray-50">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={handleRemoveImage} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"><X className="w-3 h-3" /></button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#06322b]">Catatan (opsional)</label>
                  <textarea 
                    value={notes} onChange={(e) => setNotes(e.target.value)}
                    placeholder="Sale, self reward..." rows={3}
                    className="w-full bg-[#FEFEFE] border border-[#5E8B7E] rounded-xl p-3 text-xs text-[#06322b] focus:outline-none resize-none"
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full py-4 bg-[#5E8B7E] text-white font-bold border-none transition-all active:scale-95">
                  {isSubmitting ? "Menyimpan..." : "Simpan catatan"}
                </Button>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#06322b] uppercase tracking-wider flex items-center gap-1.5"><TrendingUp size={16} className="text-[#5E8B7E]" /> Insight Visual</h3>
              <div className="bg-gray-100 p-1 rounded-xl flex gap-1 border border-gray-200/40">
                <button type="button" onClick={() => setGraphPeriod("weekly")} className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg ${graphPeriod === "weekly" ? "bg-white text-[#06322b] shadow-sm" : "text-gray-400"}`}>Mingguan</button>
                <button type="button" onClick={() => setGraphPeriod("monthly")} className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg ${graphPeriod === "monthly" ? "bg-white text-[#06322b] shadow-sm" : "text-gray-400"}`}>Bulanan</button>
              </div>
            </div>

            <Card className="p-5 rounded-[24px] border border-gray-200/60 bg-white shadow-sm space-y-4">
              <div className="grid grid-cols-2 gap-2 border-b pb-4">
                <div><p className="text-[10px] font-bold text-gray-400 uppercase">Periode Ini</p><p className="text-base font-bold text-[#06322b] mt-1">Rp {totalExpense.toLocaleString('id-ID')}</p></div>
                <div className="border-l pl-4"><p className="text-[10px] font-bold text-gray-400 uppercase">Periode Lalu</p><p className="text-base font-bold text-red-400 mt-1">Rp {previousExpense.toLocaleString('id-ID')}</p></div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-[#06322b] mb-1.5"><span>Total Terakumulasi</span><span>Rp {totalExpense.toLocaleString('id-ID')}</span></div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#5E8B7E] rounded-full" style={{ width: '100%' }} /></div>
              </div>
            </Card>

            <Card className="p-5 rounded-[24px] border border-gray-200/60 bg-white shadow-sm border-t-4 border-t-[#5E8B7E]">
              <h4 className="text-xs font-bold text-[#06322b] mb-4">Grafik Konsumsi {graphPeriod === "monthly" ? "Bulanan" : "Mingguan"}</h4>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} />
                    <YAxis hide />
                    <Tooltip cursor={{fill: '#f9f9f9'}} contentStyle={{borderRadius: '12px', border: 'none', fontSize: '11px'}} formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Harga']} />
                    <Bar dataKey="total" fill="#5E8B7E" radius={[6, 6, 0, 0]} barSize={35} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

        </div>

        {/* RIWAYAT KONSUMSI BAWAH */}
        <div className="space-y-4 pt-2">
          <h3 className="text-lg font-bold text-[#06322b] flex items-center gap-2"><ClipboardList className="w-5 h-5 text-[#5E8B7E]" /> Riwayat Konsumsi</h3>
          <Card className="p-6 md:p-8 rounded-[24px] border border-gray-200/60 shadow-sm bg-white min-h-[150px] flex flex-col justify-center">
            {loading ? (
              <div className="text-center text-gray-400 italic text-sm">Memuat riwayat belanja...</div>
            ) : consumptionData.length > 0 ? (
              <div className="space-y-3 w-full">
                {consumptionData.map((item, idx) => (
                  <div key={item.id ?? idx} className="p-4 bg-[#F8FAFA] rounded-[16px] border border-gray-200/40 flex items-center justify-between hover:border-[#5E8B7E]/40 transition-all shadow-sm">
                    <div className="flex items-center gap-4">
                      {item.imageUrl ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                          <img src={item.imageUrl} alt={item.itemName} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0"><FileImageIcon className="w-5 h-5" /></div>
                      )}
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-[#06322b]">{item.itemName}</p>
                        {/* 🔥 KUNCI UTAMA 4: Menampilkan label sub-kategori teks resmi di bawah judul item riwayat */}
                        <p className="text-[11px] text-gray-400 font-semibold">{item.categoryMapped} · {item.date ? new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : "-"}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-[#06322b]">Rp {Number(item.amount).toLocaleString('id-ID')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 text-sm">Belum ada catatan konsumsi</div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}