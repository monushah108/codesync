"use client";

import { Code2, ArrowRight, CheckCircle2 } from "lucide-react";
import { SocialLinks, FooterLinks } from "../constant/main-constant.js";
import { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <footer
      id="footer"
      className="bg-white dark:bg-[#181818] border-t border-[#cecece] dark:border-[#333333] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#007acc] text-white shadow-sm">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-[#1e1e1e] dark:text-white">
                Code<span className="text-[#007acc]">Sync</span>
              </span>
            </Link>

            <p className="text-[#616161] dark:text-[#9d9d9d] text-sm max-w-sm leading-relaxed">
              The real-time collaborative workspace for modern developers.
              Code together, pair with AI, and ship high-velocity software from your browser.
            </p>

            {/* Newsletter Input */}
            <form onSubmit={handleSubscribe} className="max-w-sm space-y-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Subscribe to product updates..."
                  className="w-full h-10 pl-3.5 pr-24 rounded-md bg-white dark:bg-[#252526] border border-[#cecece] dark:border-[#3c3c3c] text-xs text-[#1e1e1e] dark:text-white placeholder:text-[#9d9d9d] focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 px-3 py-1.5 rounded bg-[#007acc] hover:bg-[#0062a3] text-white font-medium text-xs flex items-center gap-1 transition-all"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-[#107c41] dark:text-[#89d185] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Subscribed successfully!
                </p>
              )}
            </form>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-1">
              {SocialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-8 h-8 rounded-md bg-[#f3f3f3] dark:bg-[#252526] hover:bg-[#e8e8e8] dark:hover:bg-[#2d2d2d] border border-[#cecece]/70 dark:border-[#333333] flex items-center justify-center text-[#616161] dark:text-[#cccccc] hover:text-[#007acc] dark:hover:text-white transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1e1e1e] dark:text-white mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              {FooterLinks.product.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-xs text-[#616161] dark:text-[#9d9d9d] hover:text-[#007acc] dark:hover:text-[#3794ff] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1e1e1e] dark:text-white mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {FooterLinks.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-xs text-[#616161] dark:text-[#9d9d9d] hover:text-[#007acc] dark:hover:text-[#3794ff] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1e1e1e] dark:text-white mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {FooterLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-xs text-[#616161] dark:text-[#9d9d9d] hover:text-[#007acc] dark:hover:text-[#3794ff] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Status Badge */}
        <div className="pt-8 border-t border-[#cecece] dark:border-[#333333] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#616161] dark:text-[#9d9d9d]">
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} CodeSync. All rights reserved.</p>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-[#107c41] dark:text-[#89d185] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#89d185]" />
              <span>All Systems Operational</span>
            </div>
          </div>
          <p>
            Engineered with ❤️ for developers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
