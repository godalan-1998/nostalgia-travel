"use client";

import { motion } from "framer-motion";
import { Film, MapPin, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-glow">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cream-200 bg-cream-100/70 px-4 py-2 text-sm font-semibold text-teal-900/85">
            <Sparkles className="size-4 text-orange-600" aria-hidden />
            Curated movie locations, beautifully mapped
          </div>

          <h1 className="mt-6 font-heading text-4xl font-semibold leading-tight tracking-tight text-teal-900 sm:text-5xl md:text-6xl">
            Relive the Memories...
            <span className="block text-orange-600">In Real Locations</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-teal-900/75 sm:text-lg">
            Nostalgia is a premium travel guide for cinema lovers—discover iconic
            scenes, step into the frame, and collect moments worth keeping.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#secondary-cities"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-900 px-6 py-3 text-sm font-semibold text-cream-50 shadow-premium transition hover:bg-teal-800"
            >
              <MapPin className="size-4" aria-hidden />
              Explore secondary cities
            </a>
            <a
              href="#movies"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-200 bg-cream-50 px-6 py-3 text-sm font-semibold text-teal-900 transition hover:bg-cream-100"
            >
              <Film className="size-4" aria-hidden />
              Browse movies
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 text-xs text-teal-900/70">
            <span className="rounded-full bg-cream-100 px-3 py-1.5">
              Warm cream palette
            </span>
            <span className="rounded-full bg-cream-100 px-3 py-1.5">
              Deep teal accents
            </span>
            <span className="rounded-full bg-cream-100 px-3 py-1.5">
              Vintage orange highlights
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.05 }}
          className="relative"
        >
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-cream-100 via-cream-50 to-transparent blur-2xl" />
          <div className="rounded-[2rem] border border-cream-200 bg-cream-50 p-6 shadow-premium">
            <div className="flex items-center justify-between">
              <div className="font-heading text-lg font-semibold text-teal-900">
                Featured route
              </div>
              <div className="rounded-full bg-cream-100 px-3 py-1 text-xs font-semibold text-orange-600">
                This week
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                { title: "Sunset Pier", meta: "Romance · 2km walk" },
                { title: "Old Town Cinema", meta: "Classic · Street food nearby" },
                { title: "Rainy Station", meta: "Drama · Night shots" },
              ].map((x) => (
                <div
                  key={x.title}
                  className="flex items-start gap-3 rounded-2xl border border-cream-200 bg-cream-100/60 p-4"
                >
                  <span className="grid size-10 place-items-center rounded-2xl bg-teal-900 text-cream-50">
                    <MapPin className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-teal-900">
                      {x.title}
                    </div>
                    <div className="mt-0.5 text-sm text-teal-900/70">
                      {x.meta}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between text-sm">
              <div className="text-teal-900/70">
                Save spots, share check-ins, earn points.
              </div>
              <div className="rounded-full bg-orange-600/10 px-3 py-1 font-semibold text-orange-600">
                Premium
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

