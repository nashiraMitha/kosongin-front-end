"use client";

import React, { useState, useEffect } from "react";
import LoginNavbar from "@/components/section/LoginNavbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowRight, ClipboardList, AlertTriangle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getWishlist } from "@/api";
import { client } from "@/lib/api-client";
import Cookies from "js-cookie";

export default function ImpulseShieldPage() {
  const router = useRouter();
  
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
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  const showNotification = (msg: string) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 4000);
  };

  const calculateStats = (list: any[]) => {
    if (!Array.isArray(list)) return;
    const cancelled = list.filter((item: any) => {
      if (!item) return false;
      const st = String(item.status).toLowerCase();
      return st === "cancelled" || st === "rejected";
    });
    const totalSaved = cancelled.reduce((acc: number, curr: any) => acc + Number(curr.price || 0), 0);
    const rate = list.length > 0 ? Math.round((cancelled.length / list.length) * 100) : 0;
    setStats({ cancelledCount: cancelled.length, savedAmount: totalSaved, successRate: rate });
  };

  const refreshShieldData = async () => {
    try {
      const token = Cookies.get("token") || localStorage.getItem("user_session");
      if (!token) return;
n      const res = await getWishlist({ client });
      const rawData = res.data?.data ?? (res as any).data ?? [];
      
      if (Array.isArray(rawData)) {
        const normalized = rawData.map((it: any) => {
          if (!it) return null;
          const id = it.id ?? it._id ?? Math.random().toString();
          
          const statusRaw = (it.wishlistStatus || it.status || "").toString().toLowerCase();
          let statusMap = "Waiting";
          if (statusRaw === "rejected" || statusRaw === "cancelled") {
            statusMap = "Cancelled";
          } else if (statusRaw === "approved" || statusRaw === "bought") {
            statusMap = "Bought";
          }

          const rawDuration = it.waitingDays ?? it.duration;
          const durationDays = rawDuration ? parseInt(String(rawDuration)) || 3 : 3;

          return {
            id: String(id),
            itemName: it.itemName || it.name || "Item Tanpa Nama",
            category: it.itemCategory || it.category || "Lainnya",
            price: String(it.estimatePrice || it.price || 0),
            link: it.link || it.productUrl || "",
            reason: it.notes || it.reason || "",
            duration: `${durationDays} Hari`,
            dateAdded: it.createdAt ? new Date(it.createdAt).toLocaleDateString("id-ID") : new Date().toLocaleDateString("id-ID"),
            status: statusMap
          };
        }).filter(Boolean);
n        // Preserve optimistic temporary items added locally so they don't disappear on refresh
        const preservedTemps = Array.isArray(shieldList) ? shieldList.filter((i: any) => typeof i?.id === 'string' && i.id.startsWith('temp-')) : [];
n        // Load persisted history (decisions previously made) and merge if server doesn't return them
        let persistedHistory: any[] = [];
        try { persistedHistory = JSON.parse(localStorage.getItem('shield_history') || '[]') || []; } catch (e) { persistedHistory = []; }
n        // Merge server-normalized items with preserved temps and local history (dedupe by id)
        const merged: any[] = [
          ...preservedTemps,
          ...normalized
        ];
n        persistedHistory.forEach((h: any) => {
          if (!merged.some((m: any) => String(m.id) === String(h.id))) merged.push(h);
        });
n        setShieldList(merged);
        calculateStats(merged);

        // backup of server snapshot (optional)
        try { localStorage.setItem('shield_data', JSON.stringify(normalized)); } catch (e) {}
      }
    } catch (err) {
      console.error("Gagal sinkronisasi data Impulse Shield:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userSession = localStorage.getItem("user_session");
    if (!userSession) { router.push("/login"); return; }
    refreshShieldData();
  }, [router]);

  const handleAddToWaitingList = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(formData.price || 0);
    if (!formData.itemName.trim()) {
      alert("Nama item tidak boleh kosong!");
      return;
    }
    if (!priceNum || priceNum < 1000) {
      alert("Harga minimal Rp 1.000.");
      return;
    }

    const newItem = {
      id: `temp-${Date.now()}`,
      itemName: formData.itemName.trim(),
      category: formData.category,
      price: String(priceNum),
      link: formData.link,
      reason: formData.reason,
      duration: formData.duration,
      dateAdded: new Date().toLocaleDateString("id-ID"),
      status: "Waiting"
    };

    const currentList = Array.isArray(shieldList) ? shieldList : [];
    const updatedList = [newItem, ...currentList];
    setShieldList(updatedList);
    calculateStats(updatedList);
    showNotification("Barang berhasil ditambahkan ke Impulse Shield!");

    setFormData({ itemName: "", category: "Lainnya", price: "1000", link: "", reason: "", duration: "3 Hari" });

    try {
      await client.post({
        url: "/wishlists",
        data: {
          itemName: newItem.itemName,
          estimatePrice: priceNum,
          waitingDays: parseInt(newItem.duration) || 3,
          notes: newItem.reason || ""
        }
      } as any);
      await refreshShieldData();
    } catch (err) {
      console.error(err);
      await refreshShieldData();
    }
  };

  const updateStatus = async (id: any, newStatus: "Cancelled" | "Bought") => {
    const sid = String(id);
    const currentList = Array.isArray(shieldList) ? shieldList : [];
    const updatedList = currentList.map((item) => {
      if (item && String(item.id) === sid) {
        return { ...item, status: newStatus };
      }
      return item;
    });
n    // Optimistic update
    setShieldList(updatedList);
    calculateStats(updatedList);
    showNotification(`Keputusan disimpan: Item berhasil ${newStatus === "Cancelled" ? "Dibatalkan" : "Dibeli"}`);
n    try {
      const backendStatus = newStatus === "Cancelled" ? "rejected" : "approved";
      await client.patch({
        url: `/wishlists/${sid}`,
        data: { status: backendStatus }
      } as any);
n      // Persist decision locally so riwayat tetap ada even if server doesn't return it
      try {
        const raw = localStorage.getItem('shield_history') || '[]';
        const hist = JSON.parse(raw) || [];
        const itemObj = currentList.find((i: any) => String(i.id) === sid) || { id: sid, itemName: '', price: 0, category: '' };
        const filtered = hist.filter((h: any) => String(h.id) !== sid);
        filtered.unshift({ ...itemObj, status: newStatus });
        localStorage.setItem('shield_history', JSON.stringify(filtered.slice(0, 100)));
      } catch (e) { /* ignore */ }
n      await refreshShieldData();
    } catch (err) {
      console.error(err);
      await refreshShieldData();
    }
  };

  const safeShieldList = Array.isArray(shieldList) ? shieldList : [];
  const waitingItems = safeShieldList.filter(i => i && String(i.status).toLowerCase() === "waiting");
  const historyItems = safeShieldList.filter(i => i && ["cancelled", "bought", "rejected", "approved"].includes(String(i.status).toLowerCase()));

  return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col font-sans pb-20 relative">
      <LoginNavbar />

      {toast.show && (
        <div className="fixed top-24 right-6 z-50 bg-[#E8F5E9] border border-green-200 px-5 py-3.5 rounded-xl shadow-lg flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-xs font-bold text-green-800">{toast.message}</span>
        </div>
      )}
      
      <main className="px-6 md:px-12 lg:px-20 mt-10 space-y-10">
        <section>
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-8 h-8 text-[#06322b]" />
            <h1 className="text-4xl font-heading font-bold text-[#06322b]">Impulse Shield</h1>
          </div>
          <p className="text-gray-500">Rem digitalku sebelum checkout. Tunda, pikir dua kali.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InsightCard title="Berhasil dibatalkan" value={stats.cancelledCount.toString()} sub="item tidak jadi dibeli" />
          <InsightCard title="Estimasi dihemat" value={`Rp ${stats.savedAmount.toLocaleString('id-ID')}`} sub="Total penghematan" />
          <InsightCard title="Success rate" value={`${stats.successRate}%`} sub="Persentase disiplin" />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          
          <div className="space-y-8 h-auto">
            <Card className="p-6 md:p-8 rounded-[32px] border border-gray-200/60 shadow-sm bg-white">
              <h3 className="font-bold text-[#06322b] text-xl mb-5">Tambahkan Item ke Waiting List</h3>
              
              <form onSubmit={handleAddToWaitingList} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#06322b] block">Nama Item</label>
                  <input 
                    type="text"
                    required
                    value={formData.itemName}
                    onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                    placeholder="Contoh: Adidas Cheongsam..." 
                    className="w-full bg-[#FEFEFE] border border-[#5E8B7E] rounded-xl p-3 text-xs text-[#06322b] placeholder-gray-300 focus:outline-none focus:border-[#4d7268] focus:ring-1 focus:ring-[#4d7268] transition-all" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#06322b] block">Kategori</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full h-10 rounded-xl border border-[#5E8B7E] px-3 text-xs focus:outline-none focus:border-[#4d7268] focus:ring-1 focus:ring-[#4d7268] transition-all bg-[#FEFEFE] text-[#06322b]"
                    >
                      <option value="Lainnya">Lainnya</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Gadget">Gadget</option>
                      <option value="Hobi">Hobi</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#06322b] block">Harga (Rp)</label>
                    <input 
                      type="number" 
                      min={1000}
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-[#FEFEFE] border border-[#5E8B7E] rounded-xl p-3 text-xs text-[#06322b] placeholder-gray-300 focus:outline-none focus:border-[#4d7268] focus:ring-1 focus:ring-[#4d7268] transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                   <label className="text-xs font-bold text-[#06322b] block">Kenapa mau beli? (opsional)</label>
                   <textarea 
                     value={formData.reason}
                     onChange={(e) => setFormData({...formData, reason: e.target.value})}
                     className="w-full p-3 rounded-xl border border-[#5E8B7E] text-xs min-h-[70px] focus:outline-none focus:border-[#4d7268] focus:ring-1 focus:ring-[#4d7268] transition-all bg-[#FEFEFE] text-[#06322b] placeholder-gray-300 resize-none"
                     placeholder="Tulis alasanmu menunda pembelian..."
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#06322b] block">Link produk</label>
                    <input 
                      type="text"
                      value={formData.link}
                      onChange={(e) => setFormData({...formData, link: e.target.value})}
                      placeholder="https://..." 
                      className="w-full bg-[#FEFEFE] border border-[#5E8B7E] rounded-xl p-3 text-xs text-[#06322b] placeholder-gray-300 focus:outline-none focus:border-[#4d7268] focus:ring-1 focus:ring-[#4d7268] transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#06322b] block">Durasi tunggu</label>
                    <select 
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full h-10 rounded-xl border border-[#5E8B7E] px-3 text-xs focus:outline-none focus:border-[#4d7268] focus:ring-1 focus:ring-[#4d7268] transition-all bg-[#FEFEFE] text-[#06322b]"
                    >
                      <option value="3 Hari">3 Hari</option>
                      <option value="7 Hari">7 Hari</option>
                      <option value="14 Hari">14 Hari</option>
                    </select>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-[#5E8B7E] hover:bg-[#43645a] text-white font-bold py-5 rounded-xl border-none shadow-sm text-xs transition-all active:scale-95">
                  Tambahkan ke Waiting List
                </Button>
              </form>
            </Card>

            <div className="space-y-4">
              <h3 className="font-bold text-[#06322b] text-xl flex items-center gap-2">
                 <ClipboardList className="w-5 h-5 text-[#5E8B7E]" /> Waiting List
              </h3>
              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
                {isLoading && waitingItems.length === 0 ? (
                  <p className="text-gray-400 italic text-sm py-2">Memuat data...</p>
                ) : waitingItems.length > 0 ? (
                  waitingItems.map((item) => (
                    <WaitingItem 
                      key={item.id} 
                      item={item} 
                      onCancel={() => updateStatus(item.id, "Cancelled")} 
                      onBuy={() => updateStatus(item.id, "Bought")} 
                    />
                  ))
                ) : (
                   <p className="text-gray-400 italic text-xs py-2">Belum ada item yang ditunda.</p>
                )}
              </div>
            </div>
          </div>
          
          <Card className="p-6 rounded-[32px] border border-gray-200/60 shadow-sm bg-white min-h-[580px] flex flex-col">
            <h3 className="font-bold text-[#06322b] text-xl mb-6">Riwayat Keputusan</h3>
            <div className="space-y-3 flex-1 overflow-y-auto pr-1 max-h-[700px]">
               {historyItems.length > 0 ? (
                  historyItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 border border-gray-200/40 rounded-2xl bg-gray-50/50 animate-in fade-in duration-200">
                      <div>
                         <p className="text-sm font-bold text-[#06322b] truncate max-w-[160px]">{item.itemName}</p>
                         <p className="text-[10px] text-gray-400">{item.category} · {item.dateAdded}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                         <p className="text-xs font-bold text-[#06322b]">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                         <span className={`text-[9px] font-bold px-3 py-1 rounded-full border ${
                            ["cancelled", "rejected"].includes(String(item.status).toLowerCase())
                              ? "bg-red-50 text-red-500 border-red-100" 
                              : "bg-green-50 text-green-500 border-green-100"
                         }`}>
                            {["cancelled", "rejected"].includes(String(item.status).toLowerCase()) ? "Dibatalkan" : "Dibeli"}
                         </span>
                      </div>
                    </div>
                  ))
               ) : (
                  <p className="text-center text-gray-400 py-24 text-xs italic my-auto">Belum ada riwayat keputusan.</p>
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
    <Card className="p-5 rounded-[24px] border border-gray-200/60 shadow-sm bg-[#F8FAFA]">
      <p className="text-[11px] font-bold text-gray-400 mb-3 uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-bold text-[#06322b] mb-1.5">{value}</p>
      <p className="text-[11px] text-gray-400 font-medium">{sub}</p>
    </Card>
  );
}

function WaitingItem({ item, onCancel, onBuy }: any) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const productHref = item.link ? (item.link.startsWith("http") ? item.link : `https://${item.link}`) : "#";

  return (
    <Card className="p-5 rounded-[24px] border border-gray-200/60 shadow-sm bg-[#F8FAFA] hover:shadow-md transition-all animate-in slide-in-from-top-2 duration-200">
      <div className="flex justify-between items-start mb-1.5">
        <h4 className="font-bold text-[#06322b] text-base truncate max-w-[200px]">{item.itemName}</h4>
        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{item.duration} lagi</span>
      </div>
      <p className="text-xs font-semibold text-gray-400 mb-3">{item.category} — Rp {Number(item.price).toLocaleString('id-ID')}</p>

      {item.link && (
        <p className="text-xs mb-2.5">
          <a href={productHref} target="_blank" rel="noopener noreferrer" className="text-[#568F87] font-bold underline text-xs">🔗 Lihat produk</a>
        </p>
      )}

      <p className="text-[11px] text-gray-500 mb-4 italic bg-white p-3 rounded-xl border border-gray-100 leading-relaxed">
        "{item.reason || 'Sabar dulu, pikir-pikir lagi.'}"
      </p>
      
      <div className="flex gap-3">
        <Button onClick={onCancel} variant="outline" className="flex-1 rounded-xl text-xs font-bold py-4 border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all bg-white">
          Batalkan <ArrowRight className="w-3 h-3 ml-1.5" />
        </Button>
        <Button onClick={() => setConfirmOpen(true)} variant="outline" className="flex-1 rounded-xl text-xs font-bold py-4 border-gray-200 text-gray-500 hover:bg-green-50 hover:text-green-600 transition-all bg-white">
          Tetap Beli
        </Button>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] p-6 w-full max-w-sm mx-4 shadow-xl border border-gray-100 text-center animate-in scale-in duration-150">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-[#06322b] text-base mb-1">Kamu yakin mau impulsif beli sesuatu?</h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-5">Pikirin dulu, ini beneran butuh atau cuma pengen doang?</p>
            <div className="flex gap-2.5 w-full">
              <button type="button" onClick={() => setConfirmOpen(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all bg-white">Tahan Dulu</button>
              <button type="button" onClick={() => { setConfirmOpen(false); onBuy?.(); }} className="flex-1 py-2.5 rounded-xl bg-[#5E8B7E] text-white text-xs font-bold transition-all shadow-sm">Saya yakin</button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}