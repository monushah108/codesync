import Demo from "@/components/home/Demo";
import Features from "@/components/home/features";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import Hero from "@/components/home/hero";
import HowWorks from "@/components/home/howWorks";
import Testimonial from "@/components/home/testimonial";
import CtaSection from "@/components/home/CtaSection";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "CodeSync — Real-Time Collaborative Coding & AI Pair Programming",
  description:
    "CodeSync is a next-generation real-time collaborative coding workspace where developers pair program, harness AI co-pilots, and build software together.",
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CodeSync",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "CodeSync is a real-time collaborative coding workspace where developers can code, communicate, and build together.",
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#07090e] text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white antialiased transition-colors duration-200">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <Features />
        <HowWorks />
        <Demo />
        <Testimonial />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
