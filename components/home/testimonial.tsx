"use client";

import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Sparkles, CheckCircle, Quote } from "lucide-react";
import { Testimonials } from "../constant/main-constant";

export default function Testimonial() {
  return (
    <section
      id="testimonials"
      className="px-4 sm:px-6 lg:px-8 py-24 bg-slate-50/50 dark:bg-[#080b11]/50 border-t border-slate-200/60 dark:border-white/5 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Love</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Trusted by Developers Worldwide
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            See how engineering teams and solo builders use CodeSync to collaborate and ship faster.
          </p>

          {/* Social Proof Rating Banner */}
          <div className="inline-flex items-center gap-2 pt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="font-bold text-slate-900 dark:text-white">4.9/5</span>
            <span>from 2,500+ developers</span>
          </div>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3 w-full">
          {Testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: "easeOut",
              }}
              whileHover={{
                y: -6,
                transition: { duration: 0.2 },
              }}
              className="rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/10 p-7 shadow-lg shadow-slate-950/5 flex flex-col justify-between relative group hover:border-indigo-500/30 transition-all duration-300"
            >
              {/* Quote Icon Background */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-200 dark:text-white/[0.04] pointer-events-none" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array(testimonial.rating)
                    .fill(0)
                    .map((_, i) => (
                      <Star key={i} className="fill-amber-400 text-amber-400 w-4 h-4" />
                    ))}
                </div>

                {/* Quote text */}
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100 dark:border-white/[0.08]">
                <Avatar className="w-11 h-11 rounded-full border border-slate-200 dark:border-white/10">
                  <AvatarImage
                    className="object-cover"
                    src={testimonial.avatar}
                    alt={testimonial.name}
                  />
                  <AvatarFallback className="bg-indigo-600 text-white font-semibold text-xs">
                    {testimonial.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {testimonial.name}
                    </span>
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {testimonial.role} • <span className="text-indigo-600 dark:text-indigo-400">@{testimonial.company}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
