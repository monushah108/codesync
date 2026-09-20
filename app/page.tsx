import Demo from "@/components/home/Demo";
import Features from "@/components/home/features";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import Hero from "@/components/home/hero";
import HowWorks from "@/components/home/howWorks";
import Testimonial from "@/components/home/testimonial";
import { Metadata } from "next";

import Script from "next/script";

export const metadata: Metadata = {
  title: "codesync",
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CodeSync",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "CodeSync is a real-time collaborative coding workspace where developers can code, communicate, and build together."
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <Hero />
      <Testimonial />
      <Features />
      <HowWorks />

      <Demo />
      <Footer />
    </>
  );
}
