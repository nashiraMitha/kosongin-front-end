"use client";

import React, { useState, useEffect } from "react";
import LoginNavbar from "@/components/section/LoginNavbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldAlert, ArrowRight, ClipboardList, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

<<<<<<< HEAD
export default function ImpulseShieldPage() {
=======
import { client } from "@/api/client.gen";
import { getChallengesMe } from "@/api/sdk.gen";
import Cookies from "js-cookie";

export default function Community() {
>>>>>>> 4722bc00a2f5104df26d7545e2923de7c29da9e4
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
  const [stats, setStats] = useState({ cancelledCount: 0, savedAmount: 0, successRate: 0 });

  const refreshShieldData = () => {
    const saved = localStorage.getItem("shield_data");
    if (saved) {
      const parsed = JSON.parse(saved);
      setShieldList(parsed);

<<<<<<< HEAD
      const cancelled = parsed.filter((item: any) => item.status === "Cancelled");
      const totalSaved = cancelled.reduce((acc: number, curr: any) => acc + Number(curr.price || 0), 0);
      const rate = parsed.length > 0 ? Math.round((cancelled.length / parsed.length) * 100) : 0;
=======
        if (token) {
          client.setConfig({ headers: { Authorization: `Bearer ${token}` } });
          try {
            const meRes: any = await getChallengesMe();
            const myData = meRes?.data?.data ?? meRes?.data ?? [];
            const ids = myData.map((c: any) => c.id ?? c.challengeId ?? c.challenge?.id).filter(Boolean);
            setJoinedIds(ids);
          } catch (err) {
            console.warn('Failed fetching user joined challenges:', err);
            setJoinedIds([]);
          }
        } else {
          setJoinedIds([]);
        }
      } catch (error) {
        console.error('Failed fetch public challenges:', error);
        setChallenges([]);
      }
    };
>>>>>>> 4722bc00a2f5104df26d7545e2923de7c29da9e4

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
    const priceNum = Number(formData.price || 0);
    if (!formData.itemName) return;
    if (!priceNum || priceNum < 1000) {
      alert('Harga minimal Rp 1.000. Masukkan angka yang valid.');
      return;
    }

    const newItem = {
      ...formData,
      id: Date.now(),
      dateAdded: new Date().toLocaleDateString("id-ID"),
      status: "Waiting"
    };

    const updatedList = [newItem, ...shieldList];
    localStorage.setItem("shield_data", JSON.stringify(updatedList));
    
    setFormData({ itemName: "", category: "Lainnya", price: "1000", link: "", reason: "", duration: "3 Hari" });
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
            
            {/* 1. KOTAK NAMA ITEM */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#06322b]">Nama Item</label>
              <Input 
                value={formData.itemName}
                onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                placeholder="Contoh: Adidas Cheongsam..." 
                className="rounded-xl border-[#5E8B7E] py-6 focus:outline-none focus:border-[#4d7268] focus:ring-1 focus:ring-[#4d7268] transition-all bg-[#FEFEFE]" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 2. KOTAK KATEGORI */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#06322b]">Kategori</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full h-12 rounded-xl border border-[#5E8B7E] px-4 text-sm focus:outline-none focus:border-[#4d7268] focus:ring-1 focus:ring-[#4d7268] transition-all bg-[#FEFEFE] text-[#06322b]"
                >
                  <option>Lainnya</option>
                  <option>Fashion</option>
                  <option>Gadget</option>
                  <option>Hobi</option>
                </select>
              </div>

              {/* 3. KOTAK HARGA */}
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
                  className="rounded-xl border-[#5E8B7E] py-6 focus:outline-none focus:border-[#4d7268] focus:ring-1 focus:ring-[#4d7268] transition-all bg-[#FEFEFE]" 
                />
              </div>
            </div>

            {/* 4. KOTAK ALASAN (TEXTAREA) */}
            <div className="space-y-2 text-left">
               <label className="text-sm font-bold text-[#06322b]">Kenapa mau beli? (opsional)</label>
               <textarea 
                 value={formData.reason}
                 onChange={(e) => setFormData({...formData, reason: e.target.value})}
                 className="w-full p-4 rounded-xl border border-[#5E8B7E] text-sm min-h-[100px] focus:outline-none focus:border-[#4d7268] focus:ring-1 focus:ring-[#4d7268] transition-all bg-[#FEFEFE] text-[#06322b] placeholder-gray-300 resize-none"
                 placeholder="Tulis alasanmu..."
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 5. KOTAK LINK PRODUK */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#06322b]">Link produk (opsional)</label>
                <Input 
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  placeholder="https://..." 
                  className="rounded-xl border-[#5E8B7E] py-6 focus:outline-none focus:border-[#4d7268] focus:ring-1 focus:ring-[#4d7268] transition-all bg-[#FEFEFE]" 
                />
              </div>

              {/* 6. KOTAK DURASI TUNGGU */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#06322b]">Durasi tunggu</label>
                <select 
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full h-12 rounded-xl border border-[#5E8B7E] px-4 text-sm focus:outline-none focus:border-[#4d7268] focus:ring-1 focus:ring-[#4d7268] transition-all bg-[#FEFEFE] text-[#06322b]"
                >
                  <option>3 Hari</option>
                  <option>7 Hari</option>
                  <option>14 Hari</option>
                </select>
              </div>
            </div>

            {/* TOMBOL AKSI UTAMA */}
            <Button type="submit" className="w-full bg-[#5E8B7E] hover:bg-[#4d7268] text-white font-bold py-7 rounded-xl border-none transition-all active:scale-95 shadow-sm">
              Tambahkan ke Waiting List
            </Button>
          </form>
        </Card>

        {/* LIST SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Waiting List */}
          <div className="space-y-4">
            <h3 className="font-bold text-[#06322b] text-xl flex items-center gap-2">
               <ClipboardList className="w-5 h-5 text-[#5E8B7E]" /> Waiting List
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
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirm = () => {
    setConfirmOpen(false);
    onBuy?.();
  };

  const productHref = item.link 
    ? item.link.startsWith("http") ? item.link : `https://${item.link}`
    : "#";

  return (
    <Card className="p-6 rounded-[24px] border-gray-50 shadow-sm bg-[#F8FAFA] hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-[#06322b] text-lg">{item.itemName}</h4>
        <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md">{item.duration} lagi</span>
      </div>
      <p className="text-xs font-semibold text-gray-500 mb-1">{item.category} — Rp {Number(item.price || 0).toLocaleString('id-ID')}</p>

      {item.link ? (
        <p className="text-sm mb-2">
          <a 
            href={productHref} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={(e) => e.stopPropagation()} 
            className="text-[#568F87] font-semibold underline hover:text-[#426b64] transition-colors"
          >
            🔗 Lihat produk
          </a>
        </p>
      ) : null}

      <p className="text-[10px] text-gray-400 mb-5 italic leading-relaxed">"{item.reason || 'Sabar dulu, pikir-pikir lagi.'}"</p>
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="flex-1 rounded-xl text-xs font-bold py-3 border border-gray-300 hover:bg-red-50 hover:text-red-600 transition-all bg-white text-gray-600">
          Batalkan
        </button>
        <button type="button" onClick={() => setConfirmOpen(true)} className="flex-1 rounded-xl text-xs font-bold py-3 border border-gray-300 hover:bg-green-50 hover:text-green-600 transition-all bg-white text-gray-600">
          Tetap Beli
        </button>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] p-8 w-full max-w-md mx-4 shadow-xl text-center">
            <h4 className="font-bold text-[#06322b] text-lg mb-2">Kamu yakin mau impulsif beli sesuatu?</h4>
            <p className="text-sm text-gray-500 mb-6">Pikirin dulu, ini beneran butuh atau cuma pengen doang?</p>
            <div className="flex gap-3 w-full">
              <button type="button" onClick={() => setConfirmOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 bg-white">
                Tahan Dulu
              </button>
              <button type="button" onClick={handleConfirm} className="flex-1 py-3 rounded-xl bg-[#5E8B7E] text-sm text-white font-bold">
                Saya yakin
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}