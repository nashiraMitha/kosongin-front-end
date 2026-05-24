"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import ProfileDropdown from "@/components/ui/profile-dropdown";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  const router = useRouter();
  const pathname = usePathname();
  const isLanding = pathname === '/' || pathname === '' || typeof pathname === 'undefined';

  // Cek sesi login user
  useEffect(() => {
    const session = localStorage.getItem("user_session");
    const savedName = localStorage.getItem("user_name");
    
    if (session === "true") {
      setIsLoggedIn(true);
      if (savedName) setUserName(savedName);
    }
  }, []);

  // Fungsi pengaman sinkronisasi state agar tidak memicu infinite loop
  const syncActiveSection = useCallback((hashValue: string) => {
    if (activeSection !== hashValue) {
      setActiveSection(hashValue);
    }
  }, [activeSection]);

  // Sinkronisasi status tab aktif berdasarkan rute/hash URL saat ini
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      syncActiveSection(hash);
    } else if (pathname === '/') {
      syncActiveSection('');
    }

    const onHashChange = () => {
      const h = window.location.hash.replace('#', '');
      syncActiveSection(h);
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [pathname, syncActiveSection]);

  // Listener scroll untuk mendeteksi efek blur pada header navbar — once activated, tetap on (persist)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isLanding) return; // only on landing page

    const onScroll = () => {
      // Once becomes true, keep it true (persist) so blur stays on after first scroll past threshold
      setIsScrolled(prev => prev || window.scrollY > 20);
    };

    // initialize based on current scroll position (e.g., on refresh)
    setIsScrolled(window.scrollY > 20);

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLanding]);

  // Handler scroll mulus menuju target elemen section di landing page
  const handleScroll = (sectionId: string) => {
    if (typeof window === 'undefined') return;
    
    syncActiveSection(sectionId);
    setIsMobileMenuOpen(false);
    
    if (pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      router.push('/#' + sectionId);
    }
  };

  return (
    <>
      {/* ELEMEN PENGGANTI (SPACER) - Disesuaikan tingginya agar sinkron dengan tinggi bar navbar */}
      <div className="w-full h-[76px]" />

      {/* HEADER NAVBAR - Diberi h-[76px] dan items-center agar vertikalnya pas di tengah */}
      <header 
        className={`fixed top-0 left-0 w-full h-[76px] z-[100] flex items-center transition-all duration-300 ${
          isScrolled 
            ? "bg-white/80 backdrop-blur-md border-b border-gray-100/50 shadow-sm" 
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="w-full px-6 md:px-12 flex items-center justify-between">
          
          {/* LOGO KOSONGIN */}
          <Link href="/" className="hover:opacity-80 transition-opacity flex items-center gap-3">
            <Image 
              src="/Logo1.svg" 
              alt="Logo" 
              width={35} 
              height={35} 
              className="w-[35px] h-[35px] object-contain" 
            />
            <span className="hidden md:block text-2xl font-heading font-bold text-[#06322b] tracking-tight">
              Kosongin
            </span>
          </Link>

          {/* MENU NAVIGASI DESKTOP */}
          <div className="hidden md:flex items-center gap-6 md:gap-10">
            <nav className="flex items-center gap-8">
              <button type="button" onClick={() => handleScroll('fitur')} className={`text-sm transition-colors ${activeSection === 'fitur' ? 'text-black font-bold border-b-2 border-[#568F87] pb-1' : 'text-gray-400 font-medium hover:text-[#568F87]'}`}>Fitur</button>
              <button type="button" onClick={() => handleScroll('cara-kerja')} className={`text-sm transition-colors ${activeSection === 'cara-kerja' ? 'text-black font-bold border-b-2 border-[#568F87] pb-1' : 'text-gray-400 font-medium hover:text-[#568F87]'}`}>Cara Kerja</button>
              <button type="button" onClick={() => handleScroll('komunitas')} className={`text-sm transition-colors ${activeSection === 'komunitas' ? 'text-black font-bold border-b-2 border-[#568F87] pb-1' : 'text-gray-400 font-medium hover:text-[#568F87]'}`}>Komunitas</button>
            </nav>

            {/* Opsi Sesi Login Akun di Desktop / Tombol Mulai Sekarang */}
            {isLanding ? (
              <Link href="/login">
                <button className="bg-[#568F87] hover:bg-[#4a7a73] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all">
                  Mulai Sekarang
                </button>
              </Link>
            ) : isLoggedIn ? (
              <div className="relative flex items-center">
                <button 
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-[#D4E4BC] border-2 border-white shadow-sm overflow-hidden flex items-center justify-center transition-all active:scale-95"
                >
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} 
                    alt="profile" 
                    className="w-full h-full object-cover"
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-[120%] z-[60]">
                     <ProfileDropdown />
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <button className="bg-[#568F87] hover:bg-[#4a7a73] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all">
                  Mulai Sekarang
                </button>
              </Link>
            )}
          </div>

          {/* TOMBOL MENU HAMBURGER MOBILE */}
          <button type="button" className="md:hidden text-[#06322b] p-1 flex items-center justify-center focus:outline-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* MENU DROPDOWN MOBILE */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[76px] left-0 w-full bg-white border-t border-gray-100 p-6 shadow-xl flex flex-col gap-6 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col items-end gap-5 w-full">
              <button type="button" onClick={() => handleScroll('fitur')} className={`w-full text-right py-2 text-sm font-medium ${activeSection === 'fitur' ? 'text-[#568F87] font-bold' : 'text-gray-600'}`}>Fitur</button>
              <button type="button" onClick={() => handleScroll('cara-kerja')} className={`w-full text-right py-2 text-sm font-medium ${activeSection === 'cara-kerja' ? 'text-[#568F87] font-bold' : 'text-gray-600'}`}>Cara Kerja</button>
              <button type="button" onClick={() => handleScroll('komunitas')} className={`w-full text-left py-2 text-sm font-medium ${activeSection === 'komunitas' ? 'text-[#568F87] font-bold' : 'text-gray-600'}`}>Komunitas</button>
            </nav>

            <div className="border-t border-gray-100 pt-4 w-full flex justify-end">
              {(isLanding || !isLoggedIn) ? (
                <Link href="/login" className="w-full text-right" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full bg-[#568F87] hover:bg-[#4a7a73] text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-sm">
                    Mulai Sekarang
                  </button>
                </Link>
              ) : (
                <div className="space-y-4 w-full flex flex-col items-end">
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl w-full justify-end">
                    <div className="w-10 h-10 rounded-full bg-[#D4E4BC] overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Masuk sebagai</p>
                      <p className="text-sm font-bold text-[#06322b]">{userName}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); router.push("/dashboard"); }} 
                    className="w-full bg-[#568F87] hover:bg-[#4a7a73] text-white rounded-xl py-3 text-sm font-bold transition-all"
                  >
                    Buka Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}