"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import ProfileDropdown from "@/components/ui/profile-dropdown";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    const savedName = localStorage.getItem("user_name");
    
    if (session === "true") {
      setIsLoggedIn(true);
      if (savedName) setUserName(savedName);
    }
  }, []);

  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const hash = window.location.hash.replace('#', '');
    if (hash) setActiveSection(hash);

    const onHashChange = () => {
      const h = window.location.hash.replace('#', '');
      setActiveSection(h);
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleScroll = (sectionId: string) => {
    if (typeof window === 'undefined') return;
    
    setActiveSection(sectionId);
    
    if (pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setIsMobileMenuOpen(false);
    } else {
      router.push('/#' + sectionId);
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-white/70 backdrop-blur-md border-b border-gray-100/50 shadow-sm' : 'bg-white border-b border-gray-100'}`}>
      <div className="w-full px-6 md:px-12 py-5 flex items-center justify-between">
        
        {/* LOGO */}
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

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden md:flex items-center gap-6 md:gap-10">
          <nav className="flex items-center gap-8">
            <button type="button" onClick={() => handleScroll('fitur')} className={`text-sm ${activeSection === 'fitur' ? 'text-black font-bold border-b-2 border-[#568F87] pb-1' : 'text-gray-400 font-medium hover:text-[#568F87]'}`}>Fitur</button>
            <button type="button" onClick={() => handleScroll('cara-kerja')} className={`text-sm ${activeSection === 'cara-kerja' ? 'text-black font-bold border-b-2 border-[#568F87] pb-1' : 'text-gray-400 font-medium hover:text-[#568F87]'}`}>Cara Kerja</button>
            <button type="button" onClick={() => handleScroll('komunitas')} className={`text-sm ${activeSection === 'komunitas' ? 'text-black font-bold border-b-2 border-[#568F87] pb-1' : 'text-gray-400 font-medium hover:text-[#568F87]'}`}>Komunitas</button>
          </nav>

          {/* PROFILE / START BUTTON FOR DESKTOP */}
          {pathname === '/' ? (
            <Link href="/login">
              <button className="bg-[#568F87] hover:bg-[#4a7a73] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all">
                Mulai Sekarang
              </button>
            </Link>
          ) : isLoggedIn ? (
            <div className="relative">
              <button 
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-12 h-12 rounded-full bg-[#D4E4BC] border-2 border-white shadow-sm overflow-hidden flex items-center justify-center transition-all active:scale-95"
              >
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} 
                  alt="profile" 
                  className="w-full h-full object-cover"
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-[110%] z-[60]">
                   <ProfileDropdown />
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button className="bg-[#568F87] hover:bg-[#4a7a73] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all">
                Mulai Sekarang
              </button>
            </Link>
          )}
        </div>

        {/* HAMBURGER BUTTON (Hanya Muncul di Mobile) */}
        <button type="button" className="md:hidden text-[#06322b] p-1 focus:outline-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* --- MOBILE DROPDOWN NAV (FIXED & LENGKAP) --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 p-6 shadow-xl flex flex-col gap-6 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col items-start gap-5 w-full">
            <button type="button" onClick={() => handleScroll('fitur')} className={`w-full text-left py-2 text-sm font-medium ${activeSection === 'fitur' ? 'text-[#568F87] font-bold' : 'text-gray-600'}`}>Fitur</button>
            <button type="button" onClick={() => handleScroll('cara-kerja')} className={`w-full text-left py-2 text-sm font-medium ${activeSection === 'cara-kerja' ? 'text-[#568F87] font-bold' : 'text-gray-600'}`}>Cara Kerja</button>
            <button type="button" onClick={() => handleScroll('komunitas')} className={`w-full text-left py-2 text-sm font-medium ${activeSection === 'komunitas' ? 'text-[#568F87] font-bold' : 'text-gray-600'}`}>Komunitas</button>
          </nav>

          <div className="border-t border-gray-100 pt-4 w-full">
            {isLoggedIn ? (
              /* Jika Sudah Login di Mobile: Tampilkan info akun singkat & tombol menu */
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[#D4E4BC] overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="profile" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Masuk sebagai</p>
                    <p className="text-sm font-bold text-[#06322b]">{userName}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => { setIsMobileMenuOpen(false); router.push("/dashboard"); }} 
                  className="w-full bg-[#568F87] hover:bg-[#4a7a73] text-white rounded-xl py-5 text-sm font-bold border-none"
                >
                  Buka Dashboard
                </Button>
              </div>
            ) : (
              /* Jika Belum Login di Mobile: Munculkan tombol Mulai Sekarang */
              <Link href="/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full bg-[#568F87] hover:bg-[#4a7a73] text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-sm">
                  Mulai Sekarang
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}