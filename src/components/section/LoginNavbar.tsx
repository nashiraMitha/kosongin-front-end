"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileDropdown from "./ProfileDropdown";

export default function LoginNavbar() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "User",
    image: "/profile.png"
  });

  // Ambil nama user dari localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("user_name");
    if (storedName) {
      setUserProfile((prev) => ({ ...prev, name: storedName }));
    }
  }, []);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Tracking", href: "/tracking" },
    { name: "Impulse Shield", href: "/shield" },
    { name: "Komunitas", href: "/komunitas" },
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-100 px-6 md:px-12 py-5 flex items-center justify-between sticky top-0 z-50">
      {/* KIRI: LOGO */}
      <Link 
        href="/dashboard" 
        className="text-2xl font-bold text-[#06322b] font-heading tracking-tight hover:opacity-80 transition-opacity"
      >
        Kosongin
      </Link>

      {/* KANAN: MENU NAVIGASI + FOTO PROFIL */}
      <div className="flex items-center gap-6 md:gap-10">
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm transition-all duration-200 relative pb-1 ${
                  isActive 
                    ? "text-black font-bold border-b-2 border-[#568F87]" 
                    : "text-gray-400 font-medium hover:text-[#568F87]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* FOTO PROFIL DENGAN DROPDOWN */}
        <div className="relative">
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className={`flex items-center gap-2 p-1 rounded-full border-2 transition-all shadow-sm focus:outline-none ${
              isDropdownOpen ? "border-[#568F87]" : "border-transparent hover:border-[#568F87]"
            }`}
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden relative bg-gray-100">
              <Image 
                src={userProfile.image} 
                alt="User Profile"
                fill
                className="object-cover"
                priority
              />
            </div>
          </button>
          
          {/* LOGIKA DROPDOWN */}
          {isDropdownOpen && (
            <>
              {/* Overlay transparan */}
              <div 
                className="fixed inset-0 z-40 bg-transparent" 
                onClick={() => setIsDropdownOpen(false)} 
              />
              
              {/* Box Dropdown - SEKARANG BERSIH TANPA HEADER AKUN ANDA */}
              <div className="absolute right-0 top-12 z-50 min-w-[280px] animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-white border border-gray-100 rounded-[24px] shadow-2xl overflow-hidden p-1">
                  <ProfileDropdown />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}