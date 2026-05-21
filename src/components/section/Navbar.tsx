"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import ProfileDropdown from "@/components/ui/profile-dropdown";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="w-full px-6 md:px-12 py-5 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <span className="hidden md:block text-2xl font-heading font-bold text-[#06322b] tracking-tight">
            Kosongin
          </span>
          <Image src="/logo1.svg" alt="Logo" width={35} height={35} className="block md:hidden" />
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6 md:gap-10">
          <nav className="flex items-center gap-8">
            <button type="button" onClick={() => handleScroll('fitur')} className={`text-sm ${activeSection === 'fitur' ? 'text-black font-bold border-b-2 border-[#568F87] pb-1' : 'text-gray-400 font-medium hover:text-[#568F87]'}`}>Fitur</button>
            <button type="button" onClick={() => handleScroll('cara-kerja')} className={`text-sm ${activeSection === 'cara-kerja' ? 'text-black font-bold border-b-2 border-[#568F87] pb-1' : 'text-gray-400 font-medium hover:text-[#568F87]'}`}>Cara Kerja</button>
            <button type="button" onClick={() => handleScroll('komunitas')} className={`text-sm ${activeSection === 'komunitas' ? 'text-black font-bold border-b-2 border-[#568F87] pb-1' : 'text-gray-400 font-medium hover:text-[#568F87]'}`}>Komunitas</button>
          </nav>

          {/* PROFILE / START BUTTON */}
          {pathname === '/' ? (
            <Link href="/login">
              <button className="bg-[#568F87] hover:bg-[#4a7a73] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all">
                Mulai Sekarang
              </button>
            </Link>
          ) : isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                // UKURAN w-12 h-12 & BORDER PUTIH (Sama dengan Dropdown)
                className="w-12 h-12 rounded-full bg-[#D4E4BC] border-2 border-white shadow-sm overflow-hidden flex items-center justify-center transition-all active:scale-95"
              >
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} 
                  alt="profile" 
                  className="w-full h-full object-cover"
                />
              </button>

              {/* TAMPILAN DROPDOWN */}
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

        {/* MOBILE MENU BUTTON */}
        <button className="md:hidden ml-auto text-[#06322b]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE NAV */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t p-6 shadow-2xl animate-in slide-in-from-top">
          <nav className="flex flex-col items-end gap-6">
            <button type="button" onClick={() => handleScroll('fitur')} className={`font-bold ${activeSection === 'fitur' ? 'text-black border-b-2 border-[#568F87] pb-1' : 'text-gray-500'}`}>Fitur</button>
            <button type="button" onClick={() => handleScroll('cara-kerja')} className={`${activeSection === 'cara-kerja' ? 'text-black border-b-2 border-[#568F87] pb-1' : 'text-gray-500'}`}>Cara Kerja</button>
            <button type="button" onClick={() => handleScroll('komunitas')} className={`${activeSection === 'komunitas' ? 'text-black border-b-2 border-[#568F87] pb-1' : 'text-gray-500'}`}>Komunitas</button>
            {!isLoggedIn && (
              <Link href="/login">
                <button className="bg-[#568F87] text-white px-6 py-3 rounded-xl font-bold">Mulai Sekarang</button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}