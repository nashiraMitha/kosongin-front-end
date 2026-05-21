"use client";

import React, { useState, useEffect } from "react";
import LoginNavbar from "@/components/section/LoginNavbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldAlert, ArrowRight, ClipboardList, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ImpulseShieldPage() {
  const router = useRouter();
  
  // State khusus untuk form input
  const [formData, setFormData] = useState({
    itemName: "",
    category: "Lainnya",
    price: "",
    link: "",
    reason: "",
    duration: "3 Hari"
  });

  // State untuk list dan statistik
  const [shieldList, setShieldList] = useState<any[]>([]);
  const [stats, setStats] = useState({ cancelledCount: 0, savedAmount: 0, successRate: 0 });

  // Fungsi refresh data agar UI reaktif
  const refreshShieldData = () => {
    const saved = localStorage.getItem("shield_data");
    if (saved) {
      const parsed = JSON.parse(saved);
      setShieldList(parsed);

      const cancelled = parsed.filter((item: any) => item.status === "Cancelled");
      const totalSaved = cancelled.reduce((acc: number, curr: any) => acc + Number(curr.price || 0), 0);
      const rate = parsed.length > 0 ? Math.round((cancelled.length / parsed.length) * 100) : 0;

      setStats({ cancelledCount: cancelled.length, savedAmount: totalSaved, successRate: rate });
    }
  };

  useEffect(() => {
    const userSession = localStorage.getItem("user_session");
    if (!userSession) { router.push("/login"); return; }
    refreshShieldData();
  }, [router]);

  const handleAddToWaitingList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemName || !formData.price) return;

    const newItem = {
      ...formData,
      id: Date.now(),
      dateAdded: new Date().toLocaleDateString("id-ID"),
      status: "Waiting"
    };

    const updatedList = [newItem, ...shieldList];
    localStorage.setItem("shield_data", JSON.stringify(updatedList));
    
    setFormData({ itemName: "", category: "Lainnya", price: "", link: "", reason: "", duration: "3 Hari" });
    refreshShieldData();
  };

  const updateStatus = (id: number, newStatus: "Cancelled" | "Bought") => {
    const updated = shieldList.map(item => item.id === id ? { ...item, status: newStatus } : item);
    localStorage.setItem("shield_data", JSON.stringify(updated));
    refreshShieldData();
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
        <Card className="p-8 rounded-[32px] border-gray-100 shadow-sm bg-white">
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
                  className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:outline-[#5E8B7E]"
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
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="0" 
                  className="rounded-xl border-gray-200 py-6" 
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
               <label className="text-sm font-bold text-[#06322b]">Kenapa mau beli? (opsional)</label>
               <textarea 
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full p-4 rounded-xl border border-gray-200 text-sm min-h-[100px] focus:outline-[#5E8B7E]"
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
                  className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:outline-[#5E8B7E]"
                >
                  <option>3 Hari</option>
                  <option>7 Hari</option>
                  <option>14 Hari</option>
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#9bbab1] hover:bg-[#8aa79e] text-white font-bold py-7 rounded-xl border-none">
              Tambahkan ke Waiting List
            </Button>
          </form>
        </Card>

        {/* LIST SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Waiting List */}
          <div className="space-y-4">
            <h3 className="font-bold text-[#06322b] text-xl flex items-center gap-2">
               <ClipboardList className="w-5 h-5" /> Waiting List
            </h3>
            {shieldList.filter(i => i.status === "Waiting").length > 0 ? (
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
          
          {/* Riwayat Keputusan */}
          <Card className="p-6 rounded-[32px] border-gray-100 shadow-sm bg-white min-h-[300px]">
            <h3 className="font-bold text-[#06322b] text-xl mb-6">Riwayat Keputusan</h3>
            <div className="space-y-3">
               {shieldList.filter(i => i.status !== "Waiting").length > 0 ? (
                  shieldList.filter(i => i.status !== "Waiting").map((item) => (
                     <div key={item.id} className="flex justify-between items-center p-4 border border-gray-50 rounded-2xl bg-gray-50/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div>
                           <p className="text-sm font-bold text-[#06322b]">{item.itemName}</p>
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
                  <p className="text-center text-gray-400 py-10 text-sm">Belum ada riwayat keputusan.</p>
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
    <Card className="p-6 rounded-[24px] border-gray-50 shadow-sm bg-[#F8FAFA]">
      <p className="text-[12px] font-bold text-[#06322b] mb-4 uppercase tracking-wider">{title}</p>
      <p className="text-4xl font-bold text-[#06322b] mb-2">{value}</p>
      <p className="text-[12px] text-gray-500">{sub}</p>
    </Card>
  );
}

function WaitingItem({ item, onCancel, onBuy }: any) {
  return (
    <Card className="p-6 rounded-[24px] border-gray-50 shadow-sm bg-[#F8FAFA] hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-[#06322b] text-lg">{item.itemName}</h4>
        <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md">{item.duration} lagi</span>
      </div>
      <p className="text-xs font-semibold text-gray-500 mb-1">{item.category} — Rp {Number(item.price).toLocaleString('id-ID')}</p>
      <p className="text-[10px] text-gray-400 mb-5 italic leading-relaxed">"{item.reason || 'Sabar dulu, pikir-pikir lagi.'}"</p>
      <div className="flex gap-3">
        <Button onClick={onCancel} variant="outline" className="flex-1 rounded-xl text-xs font-bold py-5 border-gray-300 hover:bg-red-50 hover:text-red-600 transition-all">
          Batalkan <ArrowRight className="w-3 h-3 ml-2" />
        </Button>
        <Button onClick={onBuy} variant="outline" className="flex-1 rounded-xl text-xs font-bold py-5 border-gray-300 hover:bg-green-50 hover:text-green-600 transition-all">
          Tetap Beli
        </Button>
      </div>
    </Card>
  );
}