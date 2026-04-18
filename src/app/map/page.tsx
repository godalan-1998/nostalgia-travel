"use client";

import { Navbar } from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Navigation, Film } from "lucide-react";
import { useState } from "react";

const locations = [
  { 
    id: 1, 
    name: "Phuket Old Town", 
    movie: "I Told Sunset About You", 
    x: "35.5%", 
    y: "75.5%", 
    img: "https://s.isanook.com/mv/0/ud/22/112581/phujet.jpg?ip/resize/w728/q80/jpg", 
    lat: "7.8849° N", 
    lng: "98.3914° E",
    maps: "https://maps.app.goo.gl/eefCZBCDSotLE3qq9" 
  },
  { 
    id: 2, 
    name: "Koh Phangan", 
    movie: "Dear Dakanda", 
    x: "38.7%", 
    y: "69.5%", 
    img: "https://www.tripgether.com/wp-content/uploads/tripgetter/Pungnga_friend_2.jpg", 
    lat: "15.3781° N", 
    lng: "100.0261° E",
    maps: "https://maps.app.goo.gl/jntEXUrfRLdeMWx27"
  },
  { 
    id: 3, 
    name: "Huay Kaew Arboretum", 
    movie: "Dear Dakanda", 
    x: "37.5%", 
    y: "16.5%", 
    img: "https://image.bangkokbiznews.com/uploads/images/contents/w1024/2025/06/eaM5FMqbXmwhTdxS3wJ9.webp?x-image-process=style/lg-webp", 
    lat: "18.8044° N", 
    lng: "98.9548° E",
    maps: "https://maps.app.goo.gl/ivTr9mmoaHuA5xL69r5"
  },
  { 
    id: 4, 
    name: "Phetchaburi Old Town", 
    movie: "My Girl", 
    x: "40.9%", 
    y: "48.2%", 
    img: "https://scontent.fhdy3-1.fna.fbcdn.net/v/t39.30808-6/557626201_1207136804790513_6145265939959433854_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=101&ccb=1-7&_nc_sid=13d280&_nc_ohc=dyCtEM7vioUQ7kNvwHO9Mt_&_nc_oc=Adoop-niDAwYOh9ipyTtJxj_ElwgpKwwPzojMyFZ0XJlbihdwpMJHazs6FNGoE4--_8&_nc_zt=23&_nc_ht=scontent.fhdy3-1.fna&_nc_gid=uyK4nkLqn11dqYVjaNRd0g&_nc_ss=7a3a8&oh=00_Af0hgorzy0fytjHmfH3BlyIVd0dgkjdgkDDWqoKNlD0zdw&oe=69E96E76", 
    lat: "13.1112° N", 
    lng: "99.9443° E",
    maps: "https://maps.app.goo.gl/ct7VDto8FJbUWVDUA"
  },
];

export default function MapPage() {
  const [selectedPin, setSelectedPin] = useState<any>(null);

  //  Google Maps new tap
  const handleOpenMaps = (url: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-[#FDF9F0] font-sans selection:bg-orange-100 overflow-x-hidden text-left">
      <Navbar />
      
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        
        {/* --- Header Section --- */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <span className="text-orange-600 font-medium text-[11px] uppercase block mb-4">Interactive Guide</span>
          <h1 className="text-5xl md:text-6xl font-bold text-teal-900 tracking-tight leading-[1.1] uppercase mb-6">
            Cinematic Map
          </h1>
          <p className="text-teal-900/40 font-normal text-lg max-w-2xl leading-relaxed">
            Trace the steps of timeless cinema through an interactive journey. 
            Discover the filming locations that brought Thailand's greatest stories to life.
          </p>
        </motion.div>

        {/* --- Map Container --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[4rem] shadow-premium border border-cream-200 h-[900px] relative overflow-hidden group mb-16"
        >
          {/* 1. Blueprint Grid & Cinematic Glows */}
          <div className="absolute inset-0 bg-[#FBF9F4] flex items-center justify-center p-12">
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:80px_80px]" />
             
             {/*  Ambient Glow  */}
             <div className="absolute -top-24 -left-24 size-96 bg-orange-100/30 blur-[100px] rounded-full pointer-events-none" />
             <div className="absolute -bottom-24 -right-24 size-96 bg-teal-100/30 blur-[100px] rounded-full pointer-events-none" />

             <img 
               src="/images/thailand-map.svg" 
               className="h-full w-auto opacity-[0.25] grayscale pointer-events-none mix-blend-multiply transition-transform duration-1000 group-hover:scale-[1.01]" 
               alt="Thailand Map"
               style={{ filter: 'drop-shadow(0px 15px 35px rgba(0,0,0,0.02))' }}
             />
          </div>

          {/* 2. Camera Viewfinder Corners (UI Decor) */}
          <div className="absolute top-10 left-10 size-12 border-t-2 border-l-2 border-teal-900/10 rounded-tl-2xl pointer-events-none" />
          <div className="absolute top-10 right-10 size-12 border-t-2 border-r-2 border-teal-900/10 rounded-tr-2xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 size-12 border-b-2 border-l-2 border-teal-900/10 rounded-bl-2xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 size-12 border-b-2 border-r-2 border-teal-900/10 rounded-br-2xl pointer-events-none" />

          {/* Marker Pins */}
          {locations.map((loc) => (
            <motion.div
              key={loc.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ zIndex: 50 }}
              style={{ left: loc.x, top: loc.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            >
               {/* Pulse  */}
               {selectedPin?.id === loc.id && (
                 <motion.div 
                   initial={{ scale: 0.5, opacity: 0 }}
                   animate={{ scale: 2.2, opacity: 0 }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute inset-0 size-full border border-orange-400 rounded-full pointer-events-none"
                 />
               )}

               <button
                 onClick={() => setSelectedPin(loc)}
                 className={`group relative p-2.5 rounded-full transition-all duration-300 shadow-xl border ${
                   selectedPin?.id === loc.id 
                   ? 'bg-orange-500 text-white border-white scale-125' 
                   : 'bg-white text-orange-500 border-orange-100 hover:scale-110'
                 }`}
               >
                 <MapPin size={22} fill={selectedPin?.id === loc.id ? "white" : "none"} />
                 
                 <AnimatePresence>
                   {selectedPin?.id === loc.id && (
                     <motion.span 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 35 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute left-full whitespace-nowrap bg-teal-900 text-white text-[10px] px-4 py-2 rounded-full font-bold uppercase shadow-2xl pointer-events-none"
                     >
                       {loc.name}
                     </motion.span>
                   )}
                 </AnimatePresence>
               </button>
            </motion.div>
          ))}

          {/* --- Detail Preview Card --- */}
          <AnimatePresence>
            {selectedPin && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                className="absolute z-40 bottom-12 right-12 w-[340px] bg-white/95 backdrop-blur-xl border border-cream-100 rounded-[3rem] shadow-premium p-7"
              >
                <button 
                  onClick={() => setSelectedPin(null)} 
                  className="absolute top-5 right-5 p-2 bg-gray-50/50 hover:bg-gray-100 rounded-full text-teal-900 transition-all z-50 shadow-sm"
                >
                  <X size={18} />
                </button>
                
                <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-6 shadow-inner border border-cream-100">
                  <motion.img 
                    key={selectedPin.img}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    src={selectedPin.img} 
                    className="size-full object-cover" 
                    alt={selectedPin.name} 
                  />
                </div>

                <div className="text-left px-1 font-sans">
                  <div className="flex items-center gap-1.5 text-orange-600 mb-2 font-bold">
                    <Film size={14} />
                    <span className="text-[10px] font-medium uppercase tracking-wider">{selectedPin.movie}</span>
                  </div>
                  <h4 className="text-teal-900 font-bold text-2xl tracking-tight mb-6 uppercase leading-tight">
                    {selectedPin.name}
                  </h4>
                  
                  <div className="flex gap-8 mb-8 border-t border-cream-100 pt-6">
                     <div>
                        <p className="text-[9px] font-bold text-teal-900/20 uppercase mb-1 tracking-widest">Lat</p>
                        <p className="text-teal-900/60 text-[12px] font-medium">{selectedPin.lat}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-bold text-teal-900/20 uppercase mb-1 tracking-widest">Lng</p>
                        <p className="text-teal-900/60 text-[12px] font-medium">{selectedPin.lng}</p>
                     </div>
                  </div>

                  {/*  Google Maps */}
                  <button 
                    onClick={() => handleOpenMaps(selectedPin.maps)}
                    className="w-full py-5 bg-teal-900 text-white rounded-2xl text-[11px] font-bold uppercase flex items-center justify-center gap-3 hover:bg-orange-600 transition-all active:scale-95 shadow-xl"
                  >
                    <Navigation size={15} /> Open in Google Maps
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Operational Status Label */}
          <div className="absolute top-12 left-12 text-left pointer-events-none opacity-20 hidden md:block uppercase font-bold text-[10px] tracking-[0.4em] text-teal-900 leading-relaxed">
            Data_Set: Nostalgia_Archive<br />
            System_Status: Operational
          </div>
        </motion.div>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <button 
              onClick={() => setSelectedPin(null)}
              className="bg-teal-900 text-white px-14 py-5 rounded-full font-bold text-[12px] shadow-2xl hover:bg-orange-600 transition-all uppercase active:scale-95 shadow-teal-900/20"
            >
               Reset View
            </button>
            <button 
              onClick={() => window.location.href = '/cities'}
              className="bg-white text-teal-900 px-14 py-5 rounded-full font-bold text-[12px] shadow-sm border border-cream-200 hover:border-teal-900 transition-all uppercase active:scale-95"
            >
               Explore City 
            </button> 
        </div>
      </div>
    </main>
  );
}