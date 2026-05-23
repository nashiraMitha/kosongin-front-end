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
    <main>
      <Navbar />
      <Hero />
      <About />
      <Features />
      <HowItWorks />
      <Community />
      <CTA />
      <Footer />
    </main>
  );
}