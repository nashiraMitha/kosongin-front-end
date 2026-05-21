"use client";

import React, {
  useState,
} from "react";

import Image from "next/image";

export default function AdminNavbar() {

  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false);

  /* SCROLL FUNCTION */
  const scrollToSection = (
    sectionId: string
  ) => {

    const section =
      document.getElementById(
        sectionId
      );

    if (section) {

      section.scrollIntoView({
        behavior: "smooth",
      });

    }
  };

  const navLinks = [
    {
      name: "Overview",
      sectionId:
        "overview",
    },
    {
      name:
        "Monitoring Aktivitas",
      sectionId:
        "monitoring",
    },
    {
      name:
        "Data Pengguna",
      sectionId:
        "users",
    },
    {
      name:
        "Manajemen Challenge",
      sectionId:
        "challenges",
    },
  ];

  return (
    <nav className="w-full bg-[#FFFAF9] border-b border-gray-200 px-6 md:px-10 py-4 flex items-center justify-between sticky top-0 z-50">

      {/* LOGO */}
      <button
        onClick={() =>
          scrollToSection(
            "top"
          )
        }
        className="text-3xl font-bold text-[#1F3A37] font-heading"
      >
        Kosongin
      </button>

      {/* MENU + PROFILE */}
      <div className="flex items-center gap-8">

        {/* MENU */}
        <div className="hidden md:flex items-center gap-8">

          {navLinks.map(
            (link) => {

              return (
                <button
                  key={link.name}
                  onClick={() =>
                    scrollToSection(
                      link.sectionId
                    )
                  }
                  className="text-sm transition-all duration-200 text-black hover:text-[#568F87]"
                >
                  {link.name}
                </button>
              );
            }
          )}

        </div>

        {/* PROFILE */}
        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setIsDropdownOpen(
                !isDropdownOpen
              )
            }
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#F97316]"
          >

            <div className="relative w-full h-full">

              <Image
                src="/profile.png"
                alt="Admin"
                fill
                className="object-cover"
              />

            </div>

          </button>

          {/* DROPDOWN */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-14 w-[220px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">

              <div className="p-4 border-b">

                <p className="font-bold text-[#1F3A37]">
                  Admin
                </p>

                <p className="text-sm text-gray-500">
                  admin@kosongin.com
                </p>

              </div>

              <button
                className="w-full text-left px-4 py-3 hover:bg-gray-50 text-red-500 font-medium"
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>
    </nav>
  );
}