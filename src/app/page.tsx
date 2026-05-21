import Navbar from "@/components/section/Navbar";
import Hero from "@/components/section/HeroSection";
import About from "@/components/section/AboutSection";
import Features from "@/components/section/FeatureSection";
import HowItWorks from "@/components/section/HowItWorksSection";
import Community from "@/components/section/Community";
import CTA from "@/components/section/CTA";
import Footer from "@/components/section/Footer";

export default function Home() {
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