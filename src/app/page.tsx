"use client";
import React, { useEffect } from "react"; 
import { client } from "@/api/client.gen"; 

import Navbar from "@/components/section/Navbar";
import Hero from "@/components/section/HeroSection";
import About from "@/components/section/AboutSection";
import Features from "@/components/section/FeatureSection";
import HowItWorks from "@/components/section/HowItWorksSection";
import Community from "@/components/section/Community";
import CTA from "@/components/section/CTA";
import Footer from "@/components/section/Footer";

export default function Home() {
  
  useEffect(() => {
    client.setConfig({
      baseUrl: "https://kosongin-backend-production.up.railway.app",
    });
  }, []);

  return (
    // PENTING: Struktur pembungkus utama diatur relative untuk mengamankan posisi sticky navbar
    <div className="relative min-h-screen bg-white flex flex-col w-full">
      {/* NAVBAR */}
      <Navbar />
      
      {/* SECTION 1: HERO UTAMA (DIKUNCI PUTIH SOLID TOTAL) */}
      <section className="relative z-20 bg-white block w-full">
        <Hero />
      </section>
      
      {/* SECTION 2: ABOUT SECTION / REM DIGITAL (DENGAN BACKGROUND) */}
      <section className="relative z-10 w-full bg-white block">
        <About />
      </section>
      
      {/* SECTION 3: FITUR UTAMA */}
      <section id="fitur" className="relative z-20 bg-white block">
        <Features />
      </section>

      {/* SECTION 4: CARA KERJA */}
      <section id="cara-kerja" className="relative z-20 bg-white block">
        <HowItWorks />
      </section>

      {/* SECTION 5: COMMUNITY CHALLENGES */}
      <section id="komunitas" className="relative z-20 bg-white block">
        <Community />
      </section>

      {/* CTA & FOOTER */}
      <div className="relative z-20 bg-white block">
        <CTA />
        <Footer />
      </div>
    </div>
  );
}