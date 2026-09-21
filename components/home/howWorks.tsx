"use client";

import { motion } from "motion/react";
import { UserPlus, Search, Code2, ArrowRight, Sparkles } from "lucide-react";
import { Steps } from "../constant/main-constant.js";

const STEP_ICONS = [UserPlus, Search, Code2];

export default function HowWorks() {
  return (
    <section id="how-it-works" className="relative px-4 sm:px-6 lg:px-8 py-24 bg-slate-50/50 dark:bg-[#080b11]/60 border-y border-slate-200/60 dark:border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Onboarding</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How CodeSync Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Get from zero to active collaborative coding in less than 30 seconds. No complex local setups or port forwarding.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line on Desktop */}
          <div className="hidden md:block absolute top-28 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-purple-500/30 -z-0" />

          {Steps.map((step, index) => {
            const Icon = STEP_ICONS[index] || Code2;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -6 }}
                className="relative z-10 rounded-2xl p-8 bg-white dark:bg-[#0e131d] border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-950/5 flex flex-col items-center text-center group"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-3.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
                  Step {step.number}
                </div>

                {/* Icon Container */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 group-hover:border-indigo-500/40 transition-all duration-300">
                  <Icon className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
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
