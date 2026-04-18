"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Navigation, Film } from "lucide-react";
import { useState } from "react";

const locations = [
  { id: 1, name: "Phuket Old Town", movie: "แปลรักฉันด้วยใจเธอ", x: "35%", y: "85%", img: "https://upload.wikimedia.org/wikipedia/th/a/ab/I_Told_Sunset_About_You_poster.jpg" },
  { id: 2, name: "Sakae Krang River", movie: "Dear Dakanda", x: "48%", y: "45%", img: "https://cms.dmpcdn.com/travel/2020/02/18/058bbce0-521b-11ea-8fac-d321c6efd459_original.jpg" },
  { id: 3, name: "Chiang Mai University", movie: "Dear Dakanda", x: "40%", y: "20%", img: "https://f.ptcdn.info/253/088/000/mbmglualiMkldpxglU5-o.jpg" },
  { id: 4, name: "Phetchaburi Old Town", movie: "แฟนฉัน", x: "46%", y: "58%", img: "https://f.ptcdn.info/964/010/000/1381836361-a1JPG-o.jpg" },
];

export function CinematicMap() {
  const [selectedPin, setSelectedPin] = useState<any>(null);

  return (
    <section className="bg-white py-24 border-t border-cream-100 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="text-left">
            <span className="text-orange-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Interactive Guide</span>
            <h2 className="font-heading text-4xl font-semibold text-teal-900 tracking-tight italic">Cinematic Map</h2>
            <p className="mt-4 text-teal-900/50 font-medium italic">Explore filming locations across Thailand’s hidden gems.</p>
          </div>
        </div>

        <div className="relative bg-[#FDF9F0] rounded-[4rem] border border-cream-200 p-8 md:p-12 shadow-inner h-[700px] flex items-center justify-center">
          {/* แผนที่ประเทศไทย (จำลองด้วยรูปทรงเพื่อความ Nostalgic) */}
          <div className="relative h-full aspect-[1/2] opacity-20 grayscale brightness-125 pointer-events-none">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Thailand_location_map.svg/800px-Thailand_location_map.svg.png" className="h-full object-contain" alt="Thailand Map" />
          </div>

          {/* หมุดพิกัดบนแผนที่ */}
          {locations.map((loc) => (
            <motion.button
              key={loc.id}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => setSelectedPin(loc)}
              className="absolute z-10 p-2 bg-white rounded-full shadow-xl border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors cursor-pointer"
              style={{ left: loc.x, top: loc.y }}
            >
              <MapPin size={20} />
            </motion.button>
          ))}

          {/* Card เล็กๆ ที่จะเด้งขึ้นมาเมื่อกดหมุด */}
          <AnimatePresence>
            {selectedPin && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute z-20 bottom-10 md:right-10 w-72 bg-white/90 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-2xl p-4 overflow-hidden"
              >
                <button onClick={() => setSelectedPin(null)} className="absolute top-4 right-4 z-30 size-8 bg-black/10 rounded-full flex items-center justify-center text-black hover:bg-black/20"><X size={14} /></button>
                <div className="aspect-video rounded-[1.5rem] overflow-hidden mb-4">
                  <img src={selectedPin.img} className="size-full object-cover" />
                </div>
                <div className="px-2 pb-2 text-left">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-1 mb-1">
                    <Film size={10} /> {selectedPin.movie}
                  </span>
                  <h4 className="text-teal-900 font-bold text-lg leading-tight">{selectedPin.name}</h4>
                  <button className="mt-4 w-full py-3 bg-teal-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-500 transition-colors">
                    <Navigation size={12} /> Get Directions
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ตารางบอกพิกัดจางๆ ด้านข้าง (Decorative) */}
          <div className="absolute top-10 left-10 hidden md:block text-[10px] font-black text-teal-900/20 uppercase leading-relaxed tracking-[0.2em]">
            LAT: 13.7563° N <br />
            LNG: 100.5018° E <br />
            SCENE_ID: 024732
          </div>
        </div>
      </div>
    </section>
  );
}