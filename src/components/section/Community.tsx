"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { client } from "@/api/client.gen";
import { getChallengeMe } from "@/api/sdk.gen";
import Cookies from "js-cookie";

export default function Community() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [joinedIds, setJoinedIds] = useState<Array<string | number>>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        // 1. PERBAIKAN: Menembak endpoint khusus landing page yang bebas gembok/public dari Andika
        const res: any = await client.get({ url: '/challenges/landing-page-challenge' } as any);
        const data = res?.data?.data ?? res?.data ?? [];
        const publicList = Array.isArray(data) ? data : [];
        setChallenges(publicList);

        const token = (typeof window !== 'undefined')
          ? (localStorage.getItem('access_token') || localStorage.getItem('user_token') || Cookies.get('access_token') || Cookies.get('token'))
          : null;

        if (token) {
          client.setConfig({ headers: { Authorization: `Bearer ${token}` } });
          try {
            const meRes: any = await getChallengeMe();
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

    fetchChallenges();
  }, []);

  const handleCardClick = (item: any) => {
    // Jika diklik card-nya, arahkan ke login agar mereka masuk ke ekosistem aplikasi dulu
    router.push('/login');
  };

  const handleJoinClick = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    // 2. PERBAIKAN: Mengubah redirect dari '/register' menjadi '/login' sesuai maumu!
    router.push('/login');
  };

  return (
    <section id="komunitas" className="py-16 md:py-24 bg-[#f5f5f3]">
      <div className="px-4 md:px-16 lg:px-24">
        <h2 className="text-2xl md:text-4xl font-bold mb-10 md:mb-16">Community Preview</h2>

        <div className="flex gap-5 md:gap-8 overflow-x-auto pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden">
          {challenges.map((item, i) => {
            const id = item.id ?? item._id ?? item.challengeId ?? i;
            const joined = joinedIds.includes(id) || joinedIds.includes(String(id)) || joinedIds.includes(Number(id));
            return (
              <div
                key={id}
                onClick={() => handleCardClick(item)}
                className="bg-white rounded-2xl md:rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition w-[clamp(220px,28vw,340px)] flex-shrink-0 flex flex-col cursor-pointer"
              >
                {/* 3. PERBAIKAN: Menghubungkan URL Image dengan base URL database biar gambarnya gak pecah */}
                <Image
                  src={item.imageUrl ? `https://kosongin-backend-production.up.railway.app${item.imageUrl}` : '/community.png'}
                  alt={item.title || 'Challenge'}
                  width={600}
                  height={600}
                  className="w-full aspect-square object-cover"
                />

                <div className="p-3 md:p-5 flex flex-col flex-1">
                  <span className="inline-block border border-[#568F87] text-[#568F87] px-3 py-1 rounded-full text-[10px] md:text-sm w-fit">
                    {item.challengesCategory || item.category || 'General'}
                  </span>

                  <h3 className="mt-3 md:mt-5 text-base md:text-lg font-bold h-[60px] md:h-[70px]">{item.title}</h3>

                  <p className="text-xs md:text-[12px] text-black mt-3 leading-relaxed h-[60px] md:h-[70px]">{item.description}</p>

                  <div className="mt-auto pt-5 md:pt-8">
                    <div className="flex items-center gap-2 text-xs md:text-[12px] text-black mb-3 md:mb-4">
                      <Image src="/user.png" alt="user" width={12} height={12} className="w-3 h-3 md:w-4 md:h-4" />
                      <span>Peserta aktif</span>
                      <span>|</span>
                      <span>{item.durationDays ?? item.duration ?? '-'} hari</span>
                    </div>

                    <div className="flex justify-start">
                      <button
                        onClick={(e) => handleJoinClick(e, item)}
                        className={`w-fit font-semibold px-4 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-[12px] transition active:scale-95 ${joined ? 'bg-gray-200 text-gray-600 cursor-default' : 'bg-[#90BAB7] hover:bg-[#4a7a73] text-white'}`}
                        disabled={joined}
                      >
                        <div className="flex items-center justify-center gap-2 font-bold">
                          <span>{joined ? 'Sudah Ikut' : 'Ikuti Challenge'}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}