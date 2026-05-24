"use client";

import React, { useState, useEffect } from "react";
import LoginNavbar from "@/components/section/LoginNavbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, ArrowRight, ImageIcon, Trophy, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { client } from "@/api/client.gen"; 
import { getChallengesMe } from "@/api/sdk.gen";
import Cookies from "js-cookie";

export default function CommunityPage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [joinedChallenges, setJoinedChallenges] = useState<any[]>([]); 
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Ambil data tantangan dari Admin Backend
  const fetchAdminChallenges = async () => {
    try {
      setIsLoading(true);
      const res: any = await client.get({ url: '/challenges' } as any);
      const data = res?.data?.data ?? res?.data ?? [];
      
      if (Array.isArray(data)) {
        const mappedData = data.map((item: any, index: number) => {
          const rawId = item.id ?? item._id ?? item.challengeId ?? index;
          return {
            id: typeof rawId === "number" ? rawId : String(rawId),
            title: item.title || "Tantangan Tanpa Judul",
            tag: item.challengesCategory || item.category || "General",
            participants: item.participantsCount ?? item.participants ?? 0,
            duration: item.durationDays ? `${item.durationDays} Hari` : (item.duration || "-"),
            dateEnd: item.endDate || item.dateEnd || "Selama Aktif",
            desc: item.description || item.desc || "Tidak ada deskripsi.",
            imageUrl: item.imageUrl || "",
            instagramLink: item.instagramLink || item.link || "https://instagram.com/kosongin"
          };
        });
        setChallenges(mappedData);
      }
    } catch (error) {
      console.error("Gagal memuat data tantangan dari admin:", error);
      // Fallback data jika backend tidak merespons
      setChallenges([
        { id: "1", title: "Zero Plastic Weekend", tag: "Zero Waste", participants: 1240, duration: "2 Hari", dateEnd: "13 Mei 2026", desc: "Tantangan kolektif untuk tidak menggunakan plastik sekali pakai selama akhir pekan.", instagramLink: "https://instagram.com" },
        { id: "2", title: "Belanja Sadar", tag: "No Impulse", participants: 856, duration: "7 Hari", dateEnd: "13 Mei 2026", desc: "7 hari penuh tanpa klik 'Beli Sekarang' tanpa pikir panjang.", instagramLink: "https://instagram.com" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Ambil data tantangan yang sudah diikuti oleh user saat ini (Aman dari typo 'n')
  const fetchUserJoinedChallenges = async () => {
    const token = Cookies.get("token") || localStorage.getItem("user_session");
    if (!token) return;
    
    try {
      const meRes: any = await getChallengesMe();
      const myData = meRes?.data?.data ?? meRes?.data ?? [];
      if (Array.isArray(myData)) {
        const ids = myData.map((c: any) => String(c.id ?? c.challengeId ?? c.challenge?.id)).filter(Boolean);
        setJoinedChallenges(ids);
      }
    } catch (err) {
      console.warn('Failed fetching user joined challenges:', err);
    }
  };

  useEffect(() => {
    fetchAdminChallenges();
    fetchUserJoinedChallenges();
  }, []);

  // 3. Fungsi mengikuti tantangan nyata ke rute POST /challenges/{id}/join milik Swagger
  const handleJoin = async (id: any, instagramLink: string) => {
    const normalizedId = String(id);
    if (joinedChallenges.includes(normalizedId)) return;

    try {
      await client.post({
        url: `/challenges/${normalizedId}/join`,
      } as any);

      const updated = [...joinedChallenges, normalizedId];
      setJoinedChallenges(updated);
      
      if (selectedChallenge && String(selectedChallenge.id) === normalizedId) {
        setSelectedChallenge({
          ...selectedChallenge,
          participants: selectedChallenge.participants + 1
        });
      }

      if (instagramLink) {
        window.open(instagramLink, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("Gagal mengirim aksi join ke server:", error);
      alert("Gagal mengikuti tantangan, silakan coba lagi.");
    }
  };

  const isUserJoined = (id: any) => {
    return joinedChallenges.includes(String(id));
  };

  return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col font-sans pb-20">
      <LoginNavbar />
      <main className="px-6 md:px-12 lg:px-20 mt-10 space-y-12 animate-in fade-in duration-700">
        <section id="komunitas">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-[#06322b]" />
            <h1 className="text-4xl font-heading font-bold text-[#06322b]">Community Challenges</h1>
          </div>
          <p className="text-gray-500">Tantangan kolektif untuk konsumsi yang lebih bertanggung jawab.</p>
        </section>

        {isLoading ? (
          <div className="text-center py-20 text-gray-400 italic text-sm">
            Menghubungkan data dengan Admin backend...
          </div>
        ) : (
          <>
            {/* SECTION 1: CHALLENGE YANG DIIKUTI */}
            <section className="space-y-6">
              <h3 className="text-xl font-bold text-[#06322b]">Challenge yang Kamu Ikuti</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {challenges.filter(c => isUserJoined(c.id)).length > 0 ? (
                  challenges.filter(c => isUserJoined(c.id)).map((item) => (
                    <ChallengeCard key={item.id} data={item} isJoined={true} onClick={() => setSelectedChallenge(item)} />
                  ))
                ) : (
                  <p className="text-gray-400 italic text-sm col-span-3 py-4">Belum ada tantangan aktif yang kamu ikuti.</p>
                )}
              </div>
            </section>

            {/* SECTION 2: SEMUA CHALLENGE AKTIF */}
            <section className="space-y-6">
              <h3 className="text-xl font-bold text-[#06322b]">Semua Challenge Aktif</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {challenges.filter(c => !isUserJoined(c.id)).length > 0 ? (
                  challenges.filter(c => !isUserJoined(c.id)).map((item) => (
                    <ChallengeCard key={item.id} data={item} isJoined={false} onClick={() => setSelectedChallenge(item)} />
                  ))
                ) : (
                  <p className="text-gray-400 italic text-sm col-span-2 py-4">Semua tantangan dari admin telah kamu ikuti!</p>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* MODAL DETAIL */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <Card className="w-full max-w-4xl bg-white rounded-[32px] overflow-hidden relative shadow-2xl">
            <button type="button" onClick={() => setSelectedChallenge(null)} className="absolute right-6 top-6 text-gray-400 hover:text-black z-10">
              <X size={24} />
            </button>
            
            <div className="p-12">
              <h2 className="text-4xl font-bold text-[#06322b] mb-8">[{selectedChallenge.title}]</h2>
              
              <div className="flex flex-col md:flex-row gap-10 bg-[#F8FAFA] p-8 rounded-[24px] border border-gray-100">
                <div className="w-full md:w-1/2 aspect-square bg-white border border-dashed border-gray-200 rounded-[16px] flex items-center justify-center text-gray-200 overflow-hidden relative">
                  {selectedChallenge.imageUrl ? (
                    <img 
                      src={selectedChallenge.imageUrl.startsWith("http") ? selectedChallenge.imageUrl : `https://kosongin-backend-production.up.railway.app${selectedChallenge.imageUrl}`} 
                      alt={selectedChallenge.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={64} />
                  )}
                </div>

                <div className="flex flex-col justify-center space-y-6 flex-1">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border w-fit ${
                    selectedChallenge.tag === 'Zero Waste' ? 'text-green-600 border-green-100 bg-green-50' : 'text-red-600 border-red-100 bg-red-50'
                  }`}>
                    {selectedChallenge.tag}
                  </span>
                  
                  <div>
                    <h4 className="font-bold text-[#568F87] text-sm mb-2">Deskripsi Challenge:</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedChallenge.desc}</p>
                  </div>

                  <div className="space-y-2 text-[11px] text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                      <Users size={14} /> {selectedChallenge.participants.toLocaleString('id-ID')} peserta | Durasi: {selectedChallenge.duration}
                    </div>
                    <div className="text-gray-400">Batas akhir pendaftaran: {selectedChallenge.dateEnd}</div>
                  </div>

                  {isUserJoined(selectedChallenge.id) ? (
                    <Button 
                      type="button"
                      onClick={() => window.open(selectedChallenge.instagramLink, "_blank", "noopener,noreferrer")}
                      className="w-full py-7 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 text-[#06322b] font-bold text-lg transition-colors"
                    >
                      Dialihkan
                    </Button>
                  ) : (
                    <Button 
                      type="button"
                      onClick={() => handleJoin(selectedChallenge.id, selectedChallenge.instagramLink)}
                      className="w-full py-7 rounded-xl bg-[#5E8B7E] text-white font-bold text-lg border-none shadow-sm transition-transform active:scale-95"
                    >
                      Ikuti Challenge
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// FORMAT SINTAKS KARTU (Aman dari patah string Tailwind CSS)
function ChallengeCard({ data, isJoined, onClick }: any) {
  return (
    <div onClick={onClick} className="cursor-pointer group">
      <Card className="p-5 rounded-[32px] border-gray-100 shadow-sm bg-white hover:shadow-md transition-all h-full flex flex-col justify-between">
        <div>
          <div className="aspect-video bg-[#F8FAFA] rounded-[24px] mb-4 flex items-center justify-center border border-gray-100 text-gray-300 overflow-hidden relative">
            {data.imageUrl ? (
              <img 
                src={data.imageUrl.startsWith("http") ? data.imageUrl : `https://kosongin-backend-production.up.railway.app${data.imageUrl}`} 
                alt={data.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <ImageIcon className="w-10 h-10 group-hover:scale-110 transition-transform" />
            )}
          </div>

          <span className={`text-[10px] font-bold px-3 py-1 rounded-full border mb-4 inline-block ${
            data.tag === 'Zero Waste' ? 'text-green-600 border-green-100 bg-green-50' : 'text-red-600 border-red-100 bg-red-50'
          }`}>
            {data.tag}
          </span>

          <h4 className="font-bold text-[#06322b] text-lg mb-1">{data.title}</h4>
          <p className="text-[11px] text-gray-400 mb-4 line-clamp-2 leading-relaxed">{data.desc}</p>
        </div>

        <div>
          <div className="flex items-center gap-4 text-[10px] text-gray-500 font-medium mb-6">
            <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {data.participants.toLocaleString('id-ID')}</div>
            <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {data.duration}</div>
          </div>

          <div className={`w-full py-3 rounded-xl font-bold text-[10px] flex items-center justify-center transition-colors ${
            isJoined ? "bg-[#EDEAE8] text-gray-600" : "bg-[#5E8B7E] text-white"
          }`}>
            {isJoined ? "Lihat detail" : "Ikuti Challenge"} <ArrowRight className="w-3.5 h-3.5 ml-2" />
          </div>
        </div>
      </Card>
    </div>
  );
}