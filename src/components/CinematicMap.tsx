"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Navigation, Film, ArrowUpRight } from "lucide-react";
import { useState } from "react";

const locations = [
  { id: 1, name: "Phuket Old Town", movie: "แปลรักฉันด้วยใจเธอ", x: "35%", y: "85%", img: "https://upload.wikimedia.org/wikipedia/th/a/ab/I_Told_Sunset_About_You_poster.jpg", lat: "7.8849° N", lng: "98.3914° E" },
  { id: 2, name: "Sakae Krang River", movie: "Dear Dakanda", x: "48%", y: "45%", img: "https://cms.dmpcdn.com/travel/2020/02/18/058bbce0-521b-11ea-8fac-d321c6efd459_original.jpg", lat: "15.3781° N", lng: "100.0261° E" },
  { id: 3, name: "Chiang Mai University", movie: "Dear Dakanda", x: "40%", y: "20%", img: "https://f.ptcdn.info/253/088/000/mbmglualiMkldpxglU5-o.jpg", lat: "18.8044° N", lng: "98.9548° E" },
  { id: 4, name: "Phetchaburi Old Town", movie: "แฟนฉัน", x: "46%", y: "58%", img: "https://f.ptcdn.info/964/010/000/1381836361-a1JPG-o.jpg", lat: "13.1112° N", lng: "99.9443° E" },
];

export function CinematicMap() {
  const [selectedPin, setSelectedPin] = useState<any>(null);

  return (
    <section className="bg-white py-24 border-t border-cream-100 overflow-hidden text-left">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-16">
          <span className="text-orange-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Interactive Guide</span>
          <h2 className="font-heading text-4xl sm:text-5xl font-black text-teal-900 tracking-tighter italic uppercase">Cinematic <span className="font-light opacity-40">Map</span></h2>
          <p className="mt-4 text-teal-900/50 font-medium italic text-lg">Trace the footsteps of timeless stories across the kingdom.</p>
        </div>

        <div className="relative bg-[#FDF9F0] rounded-[4rem] border border-cream-200 overflow-hidden shadow-premium h-[750px] flex items-center justify-center group">
          
          {/* Background Decor */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />

          {/* Map Image */}
          <div className="relative h-[90%] aspect-[1/2] opacity-20 grayscale brightness-110 pointer-events-none transition-all duration-1000 group-hover:opacity-30 group-hover:scale-105">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Thailand_location_map.svg/800px-Thailand_location_map.svg.png" className="h-full object-contain" alt="Thailand Map" />
          </div>

          {/* Pins Loop */}
          {locations.map((loc) => (
            <motion.div
              key={loc.id}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              style={{ left: loc.x, top: loc.y }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            >
               <button
                 onClick={() => setSelectedPin(loc)}
                 className={`relative p-2.5 rounded-full shadow-2xl transition-all duration-500 border-2 ${selectedPin?.id === loc.id ? 'bg-orange-500 border-white text-white scale-125' : 'bg-white border-orange-500 text-orange-600 hover:bg-orange-50 hover:scale-110'}`}
               >
                 {selectedPin?.id === loc.id && (
                   <motion.span layoutId="active-glow" className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-30" />
                 )}
                 <MapPin size={20} className="relative z-10" />
               </button>
            </motion.div>
          ))}

          {/* Location Info Card */}
          <AnimatePresence>
            {selectedPin && (
              <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                className="absolute z-30 bottom-10 right-4 left-4 md:left-auto md:right-10 md:w-80 bg-white/80 backdrop-blur-2xl border border-white rounded-[3rem] shadow-premium p-6 overflow-hidden"
              >
                <button onClick={() => setSelectedPin(null)} className="absolute top-6 right-6 z-40 size-10 bg-teal-900/5 hover:bg-teal-900/10 rounded-full flex items-center justify-center text-teal-900 transition-colors"><X size={18} /></button>
                
                <div className="aspect-[4/3] rounded-[2rem] overflow-hidden mb-6 shadow-lg">
                  <motion.img 
                    key={selectedPin.img}
                    initial={{ scale: 1.2 }} animate={{ scale: 1 }}
                    src={selectedPin.img} className="size-full object-cover" 
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-2">
                      <Film size={10} /> {selectedPin.movie}
                    </span>
                    <h4 className="text-teal-900 font-bold text-2xl tracking-tighter leading-none italic uppercase">{selectedPin.name}</h4>
                  </div>
                  
                  <div className="flex gap-4 border-y border-teal-900/5 py-4">
                     <div className="flex-1 text-[9px] font-black text-teal-900/30 uppercase tracking-widest">
                        Lat <p className="text-teal-900 text-xs mt-1">{selectedPin.lat}</p>
                     </div>
                     <div className="flex-1 text-[9px] font-black text-teal-900/30 uppercase tracking-widest border-l border-teal-900/5 pl-4">
                        Lng <p className="text-teal-900 text-xs mt-1">{selectedPin.lng}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-4 bg-teal-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg active:scale-95">
                      <Navigation size={12} /> Maps
                    </button>
                    <button className="py-4 bg-white text-teal-900 border border-teal-900/10 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-teal-50 transition-all active:scale-95">
                       Story <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Coordinate Overlay */}
          <div className="absolute top-12 left-12 hidden lg:block pointer-events-none">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-teal-900/20 uppercase tracking-[0.3em]">System.Initializing...</p>
              <p className="text-[10px] font-black text-teal-900/40 uppercase tracking-[0.2em] italic">
                {selectedPin ? `Target_Locked: ${selectedPin.name}` : 'Scanning_Cinematic_Universe'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}