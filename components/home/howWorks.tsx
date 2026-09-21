"use client";

import { motion } from "motion/react";
import { UserPlus, Search, Code2, ArrowRight, Sparkles } from "lucide-react";
import { Steps } from "../constant/main-constant.js";

const STEP_ICONS = [UserPlus, Search, Code2];

export default function HowWorks() {
  return (
    <section id="how-it-works" className="relative px-4 sm:px-6 lg:px-8 py-20 bg-[#f8f8f8] dark:bg-[#1f1f1f] border-y border-[#cecece] dark:border-[#333333] transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium bg-[#007acc]/10 text-[#007acc] border border-[#007acc]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Onboarding</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1e1e1e] dark:text-[#ffffff] tracking-tight">
            How CodeSync Works
          </h2>
          <p className="text-base sm:text-lg text-[#616161] dark:text-[#969696]">
            Get from zero to active collaborative coding in less than 30 seconds. No complex local setups or port forwarding.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector Line on Desktop */}
          <div className="hidden md:block absolute top-24 left-[15%] right-[15%] h-px bg-[#cecece] dark:bg-[#333333] -z-0" />

          {Steps.map((step, index) => {
            const Icon = STEP_ICONS[index] || Code2;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -3 }}
                className="relative z-10 rounded-lg p-6 bg-[#ffffff] dark:bg-[#252526] border border-[#cecece] dark:border-[#333333] shadow-xs flex flex-col items-center text-center transition-colors"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-3 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-[#007acc] text-white">
                  Step {step.number}
                </div>

                {/* Icon Container */}
                <div className="w-12 h-12 rounded-md bg-[#007acc]/10 border border-[#007acc]/20 flex items-center justify-center text-[#007acc] mb-4">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-base font-bold text-[#1e1e1e] dark:text-[#ffffff] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#616161] dark:text-[#969696] leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
