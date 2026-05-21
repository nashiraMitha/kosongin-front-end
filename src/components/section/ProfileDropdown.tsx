"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Key } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ProfileDropdown() {
  const router = useRouter();
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("user@gmail.com");
  const [isReminderActive, setIsReminderActive] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("user_name");
    const savedEmail = localStorage.getItem("user_email");
    if (savedName) setUserName(savedName);
    if (savedEmail) setUserEmail(savedEmail);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    window.location.href = "/login";
  };

  const displayUsername = userName.toLowerCase().replace(/\s/g, "");

  return (
    <Card className="w-[300px] p-6 bg-[#FFFCF9] rounded-[24px] shadow-2xl border-none absolute right-0 mt-3 z-50 animate-in fade-in zoom-in duration-200">
      {/* Profil Header Tanpa Foto */}
      <div className="flex flex-col mb-4">
        <h4 className="font-bold text-[#1A3C34] text-xl leading-tight truncate">
          {userName}
        </h4>
        <p className="text-[11px] text-gray-500 truncate mt-1">
          @{displayUsername} · {userEmail}
        </p>
      </div>

      <hr className="border-pink-100/30 mb-5" />

      {/* Email Reminder Section */}
      <div className="space-y-4 mb-6">
        <h5 className="text-[10px] font-bold text-[#5E8B7E] tracking-[0.15em] uppercase">Email Reminder</h5>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#1A3C34] font-semibold">Terima email reminder</span>
          <button 
            onClick={() => setIsReminderActive(!isReminderActive)}
            className={`w-10 h-5 rounded-full transition-all duration-300 relative ${
              isReminderActive ? 'bg-[#5E8B7E]' : 'bg-gray-300'
            }`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${
              isReminderActive ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[#1A3C34] font-semibold">Jam pengiriman</span>
          <span className="text-[12px] font-bold bg-[#FFE4E6] text-[#1A3C34] px-3 py-1 rounded-lg">
            20 : 00
          </span>
        </div>
      </div>

      <hr className="border-pink-100/30 mb-5" />

      {/* Action Buttons */}
      <div className="space-y-1">
        <button className="flex items-center gap-3 w-full text-[#1A3C34] hover:bg-gray-50 p-3 rounded-xl transition-all group">
          <Key size={18} className="text-gray-400 group-hover:text-[#1A3C34]" />
          <span className="text-sm font-bold">Ganti password</span>
        </button>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-[#9B2C2C] hover:bg-red-50 p-3 rounded-xl transition-all"
        >
          <LogOut size={18} />
          <span className="text-sm font-bold">Logout</span>
        </button>
      </div>
    </Card>
  );
}