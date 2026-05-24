"use client";

import React, { useState, useEffect } from "react";
import LoginNavbar from "@/components/section/LoginNavbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldAlert, ArrowRight, ClipboardList, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getWishlist } from "@/api";
import { client } from "@/lib/api-client";
import Cookies from "js-cookie";

export default function ImpulseShieldPage() {
  const router = useRouter();
  
  // State form bawaan layout asli kamu
  const [formData, setFormData] = useState({
    itemName: "",
    category: "Lainnya",
    price: "1000",
    link: "",
    reason: "",
    duration: "3 Hari"
  });

  const [shieldList, setShieldList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ cancelledCount: 0, savedAmount: 0, successRate: 0 });

  // 1. Fungsi Ambil Data & Normalisasi Skema API Server vs UI Lokal
  const refreshShieldData = async () => {
    try {
      const token = Cookies.get("token") || localStorage.getItem("user_session");
      if (!token) return;

      const res = await getWishlist({ client });
      const rawData = res.data?.data ?? (res as any).data ?? [];
      
      if (Array.isArray(rawData)) {
        // Normalisasi objek data dari backend agar serasi dengan ekspektasi komponen UI kamu
        const normalized = rawData.map((it: any) => {
          const id = it.id ?? it._id ?? Date.now();
          
          // Deteksi status gabungan dari database, paksa ke format huruf kapital ("Waiting", "Cancelled", "Bought")
          const statusRaw = (it.wishlistStatus || it.status || "").toString().toLowerCase();
          let statusMap = "Waiting";
          if (statusRaw === "rejected" || statusRaw === "cancelled") {
            statusMap = "Cancelled";
          } else if (statusRaw === "approved" || statusRaw === "bought") {
            statusMap = "Bought";
          }

          // FIX TS LINE 51: Memberikan kurung pembungkus yang benar agar tidak bentrok operator ?? dan ||
          const rawDuration = it.waitingDays ?? it.duration;
          const durationDays = rawDuration ? parseInt(String(rawDuration)) || 3 : 3;

          return {
            id: typeof id === "number" ? id : String(id),
            itemName: it.itemName || it.name || it.title || "Item",
            category: it.itemCategory || it.category || "Lainnya",
            price: String(it.estimatePrice || it.price || 0),
            link: it.link || it.productUrl || "",
            reason: it.notes || it.reason || "",
            duration: `${durationDays} Hari`,
            dateAdded: it.createdAt ? new Date(it.createdAt).toLocaleDateString("id-ID") : (it.dateAdded || "-"),
            status: statusMap
          };
        });

        setShieldList(normalized);

        // Hitung ulang statistik berdasarkan data ter-normalisasi yang valid
        const cancelled = normalized.filter((item: any) => item.status === "Cancelled");
        const totalSaved = cancelled.reduce((acc: number, curr: any) => acc + Number(curr.price || 0), 0);
        const rate = normalized.length > 0 ? Math.round((cancelled.length / normalized.length) * 100) : 0;

        setStats({ cancelledCount: cancelled.length, savedAmount: totalSaved, successRate: rate });
        
        // Backup opsional ke localStorage agar sinkronisasi offline aman
        try { localStorage.setItem("shield_data", JSON.stringify(normalized)); } catch (e) {}
      }
    } catch (err) {
      console.error("Gagal sinkronisasi data dengan server shield:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userSession = localStorage.getItem("user_session");
    if (!userSession) { 
      router.push("/login"); 
      return; 
    }
    refreshShieldData();
  }, [router]);

  // 2. Fungsi Kirim Data Baru (POST /wishlists)
  const handleAddToWaitingList = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(formData.price || 0);
    if (!formData.itemName) return;
    if (!priceNum || priceNum < 1000) {
      alert("Harga minimal Rp 1.000. Masukkan angka yang valid.");
      return;
    }

    // Ambil angka murni dari string durasi ("3 Hari" -> 3)
    const parsedDays = parseInt(formData.duration) || 3;

    try {
      setIsLoading(true);
      await client.post({
        url: "/wishlists",
        data: {
          itemName: formData.itemName,
          estimatePrice: priceNum,
          waitingDays: parsedDays,
          notes: formData.reason || ""
        }
      } as any);

      alert("Barang berhasil ditambahkan ke Impulse Shield!");
      
      // Reset input form ke semula
      setFormData({ itemName: "", category: "Lainnya", price: "1000", link: "", reason: "", duration: "3 Hari" });
      await refreshShieldData();
    } catch (err) {
      console.error("Gagal menyimpan item ke server:", err);
      alert("Gagal terhubung dengan server database.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Fungsi Ambil Keputusan (PATCH /wishlists/{id})
  const updateStatus = async (id: any, newStatus: "Cancelled" | "Bought") => {
    try {
      setIsLoading(true);
      // Ubah kembali string status lokal ke bentuk contract asli backend (approved / rejected)
      const backendStatus = newStatus === "Cancelled" ? "rejected" : "approved";

      await client.patch({
        url: `/wishlists/${id}`,
        data: { status: backendStatus }
      } as any);

      await refreshShieldData();
    } catch (err) {
      console.error("Gagal memperbarui status item:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col font-sans pb-20">
      <LoginNavbar />
      
      <main className="px-6 md:px-12 lg:px-20 mt-10 space-y-10 animate-in fade-in duration-700">
        <section>
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-8 h-8 text-[#06322b]" />
            <h1 className="text-4xl font-heading font-bold text-[#06322b]">Impulse Shield</h1>
          </div>
          <p className="text-gray-500">Rem digitalku sebelum checkout. Tunda, pikir dua kali.</p>
        </section>

        {/* INSIGHT CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InsightCard title="Berhasil dibatalkan" value={stats.cancelledCount.toString()} sub="item tidak jadi dibeli" />
          <InsightCard title="Estimasi dihemat" value={`Rp ${stats.savedAmount.toLocaleString('id-ID')}`} sub="Total penghematan" />
          <InsightCard title="Success rate" value={`${stats.successRate}%`} sub="Persentase disiplin" />
        </section>

        {/* FORM TAMBAH ITEM */}
        <Card className="p-8 rounded-[32px] border border-gray-200/60 shadow-sm bg-white">
          <h3 className="font-bold text-[#06322b] text-xl mb-6">Tambahkan Item ke Waiting List</h3>
          <form onSubmit={handleAddToWaitingList} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#06322b]">Nama Item</label>
              <Input 
                value={formData.itemName}
                onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                placeholder="Contoh: Adidas Cheongsam..." 
                className="rounded-xl border-gray-200 py-6" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#06322b]">Kategori</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:outline-[#5E8B7E] bg-white"
                >
                  <option>Lainnya</option>
                  <option>Fashion</option>
                  <option>Gadget</option>
                  <option>Hobi</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#06322b]">Harga (Rp)</label>
                <Input 
                  type="number" 
                  min={1000}
                  value={formData.price}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const n = Number(raw);
                    if (raw === '' || n < 0) {
                      setFormData({...formData, price: ''});
                    } else {
                      setFormData({...formData, price: String(Math.trunc(n)) });
                    }
                  }}
                  placeholder="1000" 
                  className="rounded-xl border-gray-200 py-6" 
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
               <label className="text-sm font-bold text-[#06322b]">Kenapa mau beli? (opsional)</label>
               <textarea 
                 value={formData.reason}
                 onChange={(e) => setFormData({...formData, reason: e.target.value})}
                 className="w-full p-4 rounded-xl border border-gray-200 text-sm min-h-[100px] focus:outline-[#5E8B7E] resize-none"
                 placeholder="Tulis alasanmu..."
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#06322b]">Link produk (opsional)</label>
                <Input 
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  placeholder="https://..." 
                  className="rounded-xl border-gray-200 py-6" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#06322b]">Durasi tunggu</label>
                <select 
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:outline-[#5E8B7E] bg-white"
                >
                  <option>3 Hari</option>
                  <option>7 Hari</option>
                  <option>14 Hari</option>
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#5E8B7E] hover:bg-[#43645a] text-white font-bold py-7 rounded-xl border-none shadow-sm transition-all">
              Tambahkan ke Waiting List
            </Button>
          </form>
        </Card>

        {/* GRID LAYOUT LIST BAWAH (Stroke Tipis Elegan) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* WAITING LIST BLOCK */}
          <div className="space-y-4">
            <h3 className="font-bold text-[#06322b] text-xl flex items-center gap-2">
               <ClipboardList className="w-5 h-5 text-[#5E8B7E]" /> Waiting List
            </h3>
            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
              {isLoading && shieldList.length === 0 ? (
                <p className="text-gray-400 italic text-sm py-4">Memuat data dari server...</p>
              ) : shieldList.filter(i => i.status === "Waiting").length > 0 ? (
                shieldList.filter(i => i.status === "Waiting").map((item) => (
                  <WaitingItem 
                    key={item.id} 
                    item={item} 
                    onCancel={() => updateStatus(item.id, "Cancelled")} 
                    onBuy={() => updateStatus(item.id, "Bought")} 
                  />
                ))
              ) : (
                 <p className="text-gray-400 italic text-sm py-4">Belum ada item yang ditunda.</p>
              )}
            </div>
          </div>
          
          {/* RIWAYAT KEPUTUSAN BLOCK */}
          <Card className="p-6 rounded-[24px] border border-gray-200/60 shadow-sm bg-white min-h-[350px]">
            <h3 className="font-bold text-[#06322b] text-xl mb-6">Riwayat Keputusan</h3>
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
               {shieldList.filter(i => i.status !== "Waiting").length > 0 ? (
                  shieldList.filter(i => i.status !== "Waiting").map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 border border-gray-200/40 rounded-2xl bg-gray-50/50">
                      <div>
                         <p className="text-sm font-bold text-[#06322b] truncate max-w-[180px]">{item.itemName}</p>
                         <p className="text-[10px] text-gray-400">{item.category} · {item.dateAdded}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                         <p className="text-xs font-bold text-[#06322b]">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                         <span className={`text-[9px] font-bold px-3 py-1 rounded-full border ${
                            item.status === "Cancelled" ? "bg-red-50 text-red-500 border-red-100" : "bg-green-50 text-green-500 border-green-100"
                         }`}>
                            {item.status === "Cancelled" ? "Dibatalkan" : "Dibeli"}
                         </span>
                      </div>
                    </div>
                  ))
               ) : (
                  <p className="text-center text-gray-400 py-14 text-sm">Belum ada riwayat keputusan.</p>
               )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

function InsightCard({ title, value, sub }: any) {
  return (
    <Card className="p-6 rounded-[24px] border border-gray-200/60 shadow-sm bg-[#F8FAFA]">
      <p className="text-[12px] font-bold text-gray-400 mb-4 uppercase tracking-wider">{title}</p>
      <p className="text-4xl font-bold text-[#06322b] mb-2">{value}</p>
      <p className="text-[12px] text-gray-400 font-medium">{sub}</p>
    </Card>
  );
}

function WaitingItem({ item, onCancel, onBuy }: any) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const handleConfirm = () => {
    setConfirmOpen(false);
    onBuy?.();
  };

  const productHref = item.link 
    ? item.link.startsWith("http") ? item.link : `https://${item.link}`
    : "#";

  return (
    <Card className="p-6 rounded-[24px] border border-gray-200/60 shadow-sm bg-[#F8FAFA] hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-[#06322b] text-lg truncate max-w-[220px]">{item.itemName}</h4>
        <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">{item.duration} lagi</span>
      </div>
      <p className="text-xs font-semibold text-gray-400 mb-4">{item.category} — Rp {Number(item.price).toLocaleString('id-ID')}</p>

      {item.link && (
        <p className="text-xs mb-3">
          <a href={productHref} target="_blank" rel="noopener noreferrer" className="text-[#568F87] font-bold underline">
            🔗 Lihat produk
          </a>
        </p>
      )}

      <p className="text-[11px] text-gray-500 mb-5 italic bg-white p-3 rounded-xl border border-gray-100 leading-relaxed">
        "{item.reason || 'Sabar dulu, pikir-pikir lagi.'}"
      </p>
      
      <div className="flex gap-3">
        <Button onClick={onCancel} variant="outline" className="flex-1 rounded-xl text-xs font-bold py-5 border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all">
          Batalkan <ArrowRight className="w-3 h-3 ml-2" />
        </Button>
        <Button onClick={() => setConfirmOpen(true)} variant="outline" className="flex-1 rounded-xl text-xs font-bold py-5 border-gray-200 text-gray-500 hover:bg-green-50 hover:text-green-600 transition-all">
          Tetap Beli
        </Button>
      </div>

      {/* CONFIRMATION WARNING MODAL */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] p-8 w-full max-w-md mx-4 shadow-xl border border-gray-100 text-center">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-[#06322b] text-lg mb-2">Kamu yakin mau impulsif beli sesuatu?</h4>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">Pikirin dulu, ini beneran butuh atau cuma pengen doang?</p>
            <div className="flex gap-3 w-full">
              <button 
                type="button" 
                onClick={() => setConfirmOpen(false)} 
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Tahan Dulu
              </button>
              <button 
                type="button" 
                onClick={handleConfirm} 
                className="flex-1 py-3 rounded-xl bg-[#5E8B7E] text-white font-bold transition-all shadow-sm"
              >
                Saya yakin
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}