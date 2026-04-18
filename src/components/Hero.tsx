"use client";

import { motion } from "framer-motion";
import { Film, MapPin, Sparkles, Navigation } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FDF9F0]">
      {/* เอฟเฟกต์แสงพื้นหลังนุ่มๆ */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-orange-100/20 to-transparent blur-3xl pointer-events-none" />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Badge ใหม่ */}
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/50 px-4 py-2 text-sm font-semibold text-orange-700 mb-6">
            <Navigation className="size-4 animate-pulse" aria-hidden />
            Explore 15+ Hidden Cinematic Gems
          </div>

          {/* --- หัวข้อชุดใหม่ (ฟอนต์เดิม) --- */}
          <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-teal-900 sm:text-5xl md:text-6xl">
            Step Beyond <br />
            The Screen...
            <span className="block text-orange-600">Discover Silent Stories</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-teal-900/75 sm:text-lg">
            Uncover the quiet charm of Thailand's secondary cities through the lens 
            of your favorite films. From hidden alleys to nostalgic waterfronts, 
            your next journey is a scene waiting to be lived.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#secondary-cities"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-900 px-8 py-3.5 text-sm font-semibold text-cream-50 shadow-premium transition hover:bg-teal-800"
            >
              <Navigation className="size-4" aria-hidden />
              Start Your Journey
            </a>
            <a
              href="#movies"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-900/10 bg-white px-8 py-3.5 text-sm font-semibold text-teal-900 transition hover:bg-teal-50"
            >
              <Film className="size-4" aria-hidden />
              Location Archives
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 text-xs text-teal-900/60 font-medium">
            <span className="flex items-center gap-1.5"><Sparkles size={12} className="text-orange-400" /> Exclusive Spots</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-900/10" />
            <span>Community Verified</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-900/10" />
            <span>Cinematic Points Reward</span>
          </div>
        </motion.div>

     <motion.div
  initial={{ opacity: 0, y: 18 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
  className="relative"
>
  {/* เอฟเฟกต์แสงฟุ้งด้านหลัง */}
  <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-orange-100/20 via-cream-50 to-transparent blur-2xl" />
  
  {/* Card Container แบบ Glassmorphism สไตล์ดั้งเดิม */}
  <div className="rounded-[2.5rem] border border-white bg-white/70 backdrop-blur-xl p-8 shadow-xl relative overflow-hidden">
    
    <div className="flex items-center justify-between mb-8">
      {/* ฟอนต์หัวมน เรียบหรู ตามแบบ 024732 */}
      <div className="font-heading text-lg font-semibold text-teal-900 uppercase tracking-tight">
        Live Journey Feed
      </div>
      <div className="rounded-full bg-orange-500 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">
        Live
      </div>
    </div>

    <div className="mt-6 grid gap-4 text-left">
      {[
        { name: "tonsobad", place: "Phuket Old Town", time: "JUST NOW", icon: "🏮" },
        { name: "godton", place: "Sakae Krang River", time: "12M AGO", icon: "🛶" },
        { name: "cinema_fan", place: "Doi Samer Dao", time: "1H AGO", icon: "🏔️" },
      ].map((log, idx) => (
        <div
          key={idx}
          className="flex items-center gap-4 rounded-2xl border border-cream-100 bg-white/80 p-4 shadow-sm hover:shadow-md transition-all cursor-default"
        >
          {/* Icon Box แบบนุ่มนวล */}
          <span className="grid size-12 place-items-center rounded-xl bg-teal-50 text-xl shadow-inner shrink-0">
            {log.icon}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="truncate font-bold text-teal-900 text-sm">
                {log.name}
              </div>
              <div className="text-[9px] font-bold text-teal-900/20 uppercase tracking-tighter">
                • {log.time}
              </div>
            </div>
            {/* ฟอนต์ข้อมูลสถานที่แบบ 024732 */}
            <div className="mt-0.5 text-[11px] font-medium text-teal-900/50 uppercase tracking-wide truncate">
              Checked-in at {log.place}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Footer ภายใน Card */}
    <div className="mt-8 pt-6 border-t border-teal-900/5 flex items-center justify-between text-[11px] font-black text-teal-900/30 uppercase tracking-[0.2em]">
      <span>Nostalgia Journal</span>
      <div className="flex gap-1">
        <div className="size-1.5 rounded-full bg-orange-400" />
        <div className="size-1.5 rounded-full bg-teal-900/10" />
        <div className="size-1.5 rounded-full bg-teal-900/10" />
      </div>
    </div>
  </div>
</motion.div>
      </div>
    </section>
  );
}