"use client";

import { Navbar } from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Film, MapPin, ArrowRight, ChevronLeft, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

const cities = [
  {
    name: "Phuket",
    location: "Southern",
    description: "Sino-Portuguese architecture meets the turquoise Andaman sea in a city of heritage.",
    movies: ["I Told Sunset About You", "The Beach"],
    img: "https://f.ptcdn.info/674/071/000/qk2sj16n5ih72DAZJaMn-o.png",
    id: "01"
  },
  {
    name: "Surat Thani",
    location: "Southern",
    description: "An island of hidden gems and emerald canopies, echoing the raw beauty and cinematic charm of the southern sea.",
    movies: ["Dear Dakanda"],
    img: "https://scontent.fhdy3-1.fna.fbcdn.net/v/t39.30808-6/558190277_1209938287843698_8274338423703379552_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=107&ccb=1-7&_nc_sid=13d280&_nc_ohc=Amef04OS9NIQ7kNvwGf0ZCN&_nc_oc=AdrS__zhyriKtlDZHwpe-G_opvQO21QHoRUlGRIAst0XEqIoh-eYR14NDdBu7cxi6Zo&_nc_zt=23&_nc_ht=scontent.fhdy3-1.fna&_nc_gid=4Roa8iPEKgc9VbS2REIqkQ&_nc_ss=7a3a8&oh=00_Af2mQGCZ8cYNznA_qjp6I0d0ykVy7GWUdUuEhZWnoCBYlQ&oe=69E97F4E",
    id: "02"
  },
  {
    name: "Chiang Mai",
    location: "Northern",
    description: "The cultural heart of the north, surrounded by misty mountains and sacred temples.",
    movies: ["Dear Dakanda", "Lost in Thailand"],
    img: "https://img.sanishtech.com/u/4bec10efb9592b6536e52f7f213a2ab7.png",
    id: "03"
  },
  {
    name: "Phetchaburi",
    location: "Central",
    description: "A historic city of kings and salt farms, carrying the nostalgic charm of the coast.",
    movies: ["My Girl", "A Little Thing Called Love"],
    img: "https://scontent.fhdy3-1.fna.fbcdn.net/v/t39.30808-6/557785479_1207136791457181_8228638937455748909_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=109&ccb=1-7&_nc_sid=13d280&_nc_ohc=R1mGmAVNP7AQ7kNvwGcL7LC&_nc_oc=AdpGRmjVLhVoU2-uKvzeiHYu1mEwGnTKyHsw907Ulh-cHSyVigtcG2Wk_0byiBKVG4Y&_nc_zt=23&_nc_ht=scontent.fhdy3-1.fna&_nc_gid=xvdTGLWmurINRbHYp2bfvw&_nc_ss=7a3a8&oh=00_Af22dPSxdqTxWtlIxtx2qmilnC9vU5TiDbc3O1g-9FD83A&oe=69E96B01",
    id: "04"
  }
];

export default function CitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeRegion, setActiveRegion] = useState("All");

  const regions = ["All", "Northern", "Central", "Southern"];

  const filteredCities = useMemo(() => {
    return cities.filter(city => {
      const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = activeRegion === "All" || city.location === activeRegion;
      return matchesSearch && matchesRegion;
    });
  }, [searchTerm, activeRegion]);

  return (
    <main className="min-h-screen bg-[#FDF9F0] selection:bg-orange-100 overflow-x-hidden text-left relative">
      <Navbar />

      {/* --- 1. Ambient Background Decor (Grain & Glow) --- */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="fixed -top-24 -left-24 size-96 bg-orange-100/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 pt-40 pb-20 relative z-10">
        
        {/* --- 2. Header Section --- */}
        <div className="mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-orange-600 font-bold text-[10px] uppercase tracking-[0.5em] block leading-none">
                Archive Discovery
              </span>
              <Sparkles size={12} className="text-orange-600/40" />
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-teal-900 leading-[0.9] mb-8 relative">
              Explore <br />
              <span className="italic font-light text-orange-600/90 relative">
                Cinematic
                <span className="absolute -right-6 bottom-4 size-2.5 bg-orange-600 rounded-full blur-[1px] hidden md:block" />
              </span> Cities
            </h1>
            
            <div className="flex gap-10 border-l border-teal-900/10 pl-8 mt-4 text-teal-900/30 font-sans text-[10px] uppercase tracking-[0.3em] font-bold">
              <div className="flex flex-col gap-1">
                <span className="text-teal-900 text-2xl font-serif italic leading-none">{cities.length}</span>
                <span>Active Records</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-teal-900 text-2xl font-serif italic leading-none">03</span>
                <span>Regions</span>
              </div>
            </div>
          </motion.div>

          <Link href="/map" className="group flex items-center gap-3 text-teal-900/40 hover:text-teal-900 transition-all font-bold uppercase text-[10px] tracking-[0.2em] border-b border-teal-900/10 pb-2">
            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Map
          </Link>
        </div>

        {/* --- 3. Control Bar: Search & Filter --- */}
        <div className="mb-20 flex flex-col md:flex-row gap-8 items-center justify-between border-b border-teal-900/5 pb-10">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-teal-900/20" size={20} />
            <input 
              type="text"
              placeholder="Search by city name..."
              className="w-full bg-transparent py-4 pl-10 focus:outline-none text-teal-900 placeholder:text-teal-900/20 font-sans text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-8 overflow-x-auto w-full md:w-auto pb-4 md:pb-0 scrollbar-hide">
            {regions.map(region => (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                  activeRegion === region ? 'text-orange-600' : 'text-teal-900/20 hover:text-teal-900'
                }`}
              >
                {region}
                {activeRegion === region && (
                  <motion.div layoutId="underline" className="absolute -bottom-3 left-0 right-0 h-0.5 bg-orange-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* --- 4. Cities List Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          <AnimatePresence mode="popLayout">
            {filteredCities.map((city) => (
              <motion.div
                key={city.name}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5 }}
                className="group flex flex-col gap-10"
              >
                {/* Image Wrap (Grayscale to Color Interaction) */}
                <div className="relative aspect-[16/11] rounded-[2.5rem] overflow-hidden shadow-2xl bg-teal-900/5">
                  <img 
                    src={city.img} 
                    alt={city.name} 
                    className="size-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-teal-900/10 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-700" />
                  <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg">
                    <span className="text-[10px] font-bold text-teal-900 uppercase tracking-[0.2em]">{city.location} Thailand</span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="px-4">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-5xl font-serif text-teal-900 group-hover:text-orange-600 transition-colors duration-500">{city.name}</h2>
                    <span className="text-4xl font-serif text-teal-900/10 italic select-none group-hover:text-teal-900/20 transition-colors">{city.id}</span>
                  </div>
                  
                  <p className="text-teal-900/60 font-sans text-base leading-relaxed mb-10 max-w-md h-12 line-clamp-2">
                    {city.description}
                  </p>

                  <div className="flex flex-wrap gap-3 mb-10 h-8">
                    {city.movies.map(movie => (
                      <div key={movie} className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-teal-900/5 shadow-sm hover:border-orange-200 transition-colors cursor-default">
                        <Film size={14} className="text-orange-600" />
                        <span className="text-[10px] font-bold text-teal-900/60 uppercase tracking-tight">{movie}</span>
                      </div>
                    ))}
                  </div>

                  <Link 
                    href="/map" 
                    className="flex items-center justify-between group/link border-t border-teal-900/10 pt-8"
                  >
                    <span className="text-[12px] font-bold text-teal-900 uppercase tracking-[0.3em] group-hover/link:text-orange-600 transition-colors">Locate in Archive</span>
                    <div className="size-12 rounded-full bg-teal-900 text-white flex items-center justify-center transition-all group-hover/link:bg-orange-600 group-hover/link:translate-x-3 shadow-xl shadow-teal-900/10">
                      <ArrowRight size={20} />
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- 5. Empty State --- */}
        {filteredCities.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-40 border-t border-teal-900/5"
          >
            <p className="text-teal-900/20 font-serif text-4xl italic mb-6">Archive record not found.</p>
            <button 
              onClick={() => {setSearchTerm(""); setActiveRegion("All");}}
              className="px-8 py-3 bg-teal-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-teal-900/10"
            >
              Reset Filters
            </button>
          </motion.div>
        )}

        {/* --- 6. Decoration: Footer Ref Code --- */}
        <div className="mt-40 text-center opacity-10 pointer-events-none">
          <span className="text-[9px] font-black tracking-[1em] text-teal-900 uppercase">
            Nostalgia_Archive_Ref: 2026_TH_CINEMA
          </span>
        </div>
      </div>
    </main>
  );
}