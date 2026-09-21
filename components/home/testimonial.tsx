"use client";

import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Sparkles, CheckCircle, Quote } from "lucide-react";
import { Testimonials } from "../constant/main-constant";

export default function Testimonial() {
  return (
    <section
      id="testimonials"
      className="px-4 sm:px-6 lg:px-8 py-24 bg-white dark:bg-[#1e1e1e] border-t border-[#cecece] dark:border-[#333333] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md text-xs font-semibold bg-[#007acc]/10 text-[#007acc] dark:text-[#3794ff] border border-[#007acc]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Love</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1e1e1e] dark:text-white tracking-tight">
            Trusted by Developers Worldwide
          </h2>

          <p className="text-base sm:text-lg text-[#616161] dark:text-[#9d9d9d]">
            See how engineering teams and solo builders use CodeSync to collaborate and ship faster.
          </p>

          {/* Social Proof Rating Banner */}
          <div className="inline-flex items-center gap-2 pt-2 text-xs font-medium text-[#616161] dark:text-[#9d9d9d]">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <span className="font-bold text-[#1e1e1e] dark:text-white">4.9/5</span>
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
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{
                y: -4,
                transition: { duration: 0.2 },
              }}
              className="rounded-lg bg-white dark:bg-[#252526] border border-[#cecece] dark:border-[#333333] p-6 shadow-sm flex flex-col justify-between relative group hover:border-[#007acc] transition-all duration-200"
            >
              {/* Quote Icon Background */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-[#cecece]/40 dark:text-[#333333] pointer-events-none" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array(testimonial.rating)
                    .fill(0)
                    .map((_, i) => (
                      <Star key={i} className="fill-amber-500 text-amber-500 w-4 h-4" />
                    ))}
                </div>

                {/* Quote text */}
                <p className="text-[#1e1e1e] dark:text-[#cccccc] text-sm leading-relaxed mb-6 font-normal">
                  "{testimonial.quote}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-[#cecece]/50 dark:border-[#333333]">
                <Avatar className="w-10 h-10 rounded-full border border-[#cecece] dark:border-[#333333]">
                  <AvatarImage
                    className="object-cover"
                    src={testimonial.avatar}
                    alt={testimonial.name}
                  />
                  <AvatarFallback className="bg-[#007acc] text-white font-semibold text-xs">
                    {testimonial.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-[#1e1e1e] dark:text-white truncate">
                      {testimonial.name}
                    </span>
                    <CheckCircle className="w-3.5 h-3.5 text-[#007acc] shrink-0" />
                  </div>
                  <div className="text-xs text-[#616161] dark:text-[#9d9d9d] truncate">
                    {testimonial.role} • <span className="text-[#007acc] dark:text-[#3794ff]">@{testimonial.company}</span>
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
