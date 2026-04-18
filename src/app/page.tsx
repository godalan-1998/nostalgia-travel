"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Film, MapPin, Navigation, Sparkles, ChevronRight, Camera, Ticket, Loader2, Check, X, Heart, Volume2, VolumeX, Share2, MessageCircle, Facebook, Clock } from "lucide-react";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client"; 
import { useRouter } from "next/navigation";
import imageCompression from 'browser-image-compression';

const sectionTitle = "font-heading text-2xl sm:text-4xl font-bold tracking-tight text-teal-900 text-left uppercase tracking-tighter italic";

export default function HomePage() {
  const supabase = createClient();
  const router = useRouter();

  // --- States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [userCheckins, setUserCheckins] = useState<any[]>([]); // 🟢 เก็บประวัติเพื่อล็อคปุ่ม
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- (Locking System) ---
  const fetchStatus = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase
        .from("check_ins")
        .select("location_id, created_at")
        .eq("user_id", session.user.id);
      setUserCheckins(data || []);
    }
  }, [supabase]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // cooldawn
  const getLockStatus = (locationId: number) => {
    const last = userCheckins
      .filter(c => c.location_id === locationId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

    if (!last) return { isLocked: false, text: "" };

    const nextDate = new Date(new Date(last.created_at).getTime() + (7 * 24 * 60 * 60 * 1000));
    const now = new Date();

    if (now < nextDate) {
      const diff = nextDate.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return { isLocked: true, text: `Locked (อีก ${days}ว ${hours}ชม)` };
    }
    return { isLocked: false, text: "" };
  };

  // --- (Story Details & Cities) ---
  const storyDetails: any = {
    "Dear Dakanda (2005)": {
      location: "Chiang Mai & Uthai Thani",
      description: "สัมผัสความทรงจำ 'เพื่อนสนิท' ผ่านคณะวิจิตรศิลป์ มช. และความสงบของริมน้ำสะแกกรังที่ไข่ย้อยไปพักใจ",
      highlights: ["คณะวิจิตรศิลป์ มช.", "อ่างแก้ว", "ริมน้ำสะแกกรัง"],
      color: "bg-orange-500",
      locationCount: 5,
      audioUrl: "/sounds/dear-dakanda.mp3",
      quotes: "เราไม่ได้เป็นแฟนกันหรอก...เราเป็นเพื่อนสนิทกัน"
    },
    "แปลรักฉันด้วยใจเธอ": {
      location: "Phuket Old Town",
      description: "ดื่มด่ำกับบรรยากาศเมืองเก่าภูเก็ต ย่านซอยรมณีย์ และความหมายของ 'เต๋-โอ้เอ๋ว' ผ่านสถานที่ถ่ายทำสไตล์ชิโนโปรตุกีส",
      highlights: ["ซอยรมณีย์", "ร้านโกปี้เตี่ยม", "แหลมพรหมเทพ"],
      color: "bg-teal-600",
      locationCount: 8,
      isNew: true,
      audioUrl: "/sounds/i-told-sunset.mp3",
      quotes: "ถ้ากูเป็นโอ้เอ๋ว มึงจะชอบกูไหม?"
    },
    "หนังไทย......แฟนฉัน (พ.ศ. 2546)": {
      location: "Phetchaburi & Songkhla",
      description: "ย้อนวันวานวัยเด็กไปกับมิตรภาพของน้อยหน่าและเจี๊ยบ ในย่านเมืองเก่าที่ยังคงความอบอุ่นยุค 80s",
      highlights: ["ตลาดเก่าริมน้ำ", "ร้านตัดผมโบราณ", "ย่านเมืองเก่าสงขลา"],
      color: "bg-blue-500",
      locationCount: 4,
      audioUrl: "/sounds/fan-chan.mp3",
      quotes: "เจี๊ยบ... ตัดยางเราทำไม?"
    }
  };

  const cities = [
    { id: 6, title: "Khiri Wong", img: "https://cms.dmpcdn.com/travel/2020/02/18/058bbce0-521b-11ea-8fac-d321c6efd459_original.jpg", meta: "Sunset · cafes · shoreline" },
    { id: 8, title: "Koh Phayam", img: "https://cms.dmpcdn.com/travel/2020/02/18/4fb3cec0-521b-11ea-a6c6-adb7bf04b087_original.jpg", meta: "Golden hour · calm streets" },
    { id: 9, title: "Wat Tha Sung", img: "https://cms.dmpcdn.com/travel/2020/02/18/8ee33130-521b-11ea-a6c6-adb7bf04b087_original.jpg", meta: "Golden Sparkles · Cinematic Architecture" },
    { id: 7, title: "Phra Prang Sam Yot", img: "https://cms.dmpcdn.com/travel/2020/02/18/f5de90a0-521b-11ea-b4a0-631ea126a728_original.jpg", meta: "Ancient Ruins · Wildlife Frames" },
  ];

  // --- audio share ---
  const playAudio = (url: string) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    const audio = new Audio(url); audio.loop = true; audio.volume = 0.4; audioRef.current = audio;
    if (!isMuted) audio.play().catch(() => {});
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) audioRef.current.pause();
      else if (isModalOpen) audioRef.current.play().catch(() => {});
    }
  }, [isMuted, isModalOpen]);

  useEffect(() => {
    if (!isModalOpen && audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
  }, [isModalOpen]);

  const handleExplore = (title: string) => {
    const detail = storyDetails[title];
    if (detail) {
      setSelectedStory({ title, ...detail });
      setIsModalOpen(true);
      if (detail.audioUrl) playAudio(detail.audioUrl);
    }
  };

  const handleShare = (platform: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `มาตามรอยหนังเรื่อง ${selectedStory?.title} ด้วยกันไหม?`;
    if (platform === 'line') window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    if (platform === 'fb') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  // --- (Check-in Logic) ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) { setSelectedFile(file); setPreviewId(id); }
  };

  const handleCheckIn = async (locationId: number, title: string) => {
    if (loadingId) return;
    if (!selectedFile || previewId !== title) { alert("📸 กรุณาอัปโหลดรูปถ่ายก่อนครับ"); return; }
    
    setLoadingId(title);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { router.push("/login"); return; }
      
      const compressedFile = await imageCompression(selectedFile!, { maxSizeMB: 0.8, maxWidthOrHeight: 1280 });
      const fileName = `${session.user.id}-${Date.now()}.jpg`;
      
      await supabase.storage.from('CHECKIN-IMAGES').upload(fileName, compressedFile);
      const { data: { publicUrl } } = supabase.storage.from('CHECKIN-IMAGES').getPublicUrl(fileName);
      
      const { error: dbError } = await supabase.from("check_ins").insert([{ user_id: session.user.id, location_id: locationId, user_image_url: publicUrl }]);
      
      if (dbError) {
        if (dbError.message.includes("COOLDOWN")) alert("⏳ ติดคูลดาวน์ 7 วันครับ!");
        else throw dbError;
      } else {
        alert(`เช็คอินสำเร็จ! 🏆`);
        setSelectedFile(null); setPreviewId(null);
        fetchStatus(); // refresh
      }
    } catch (err) { alert("เกิดข้อผิดพลาด"); } finally { setLoadingId(null); }
  };

  return (
    <main className="min-h-screen bg-[#FDF9F0] font-sans selection:bg-orange-100 text-left">
      <Navbar />
      <Hero />

      {/* 1. Highlights */}
      <section className="bg-white py-24 border-t border-cream-100">
        <div className="mx-auto max-w-6xl px-4 text-left">
          <span className="text-orange-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Recommended</span>
          <h2 className={sectionTitle}>Current Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
            {/* Khiri Wong Highlight */}
            <div className="group relative aspect-[16/10] overflow-hidden rounded-[3rem] shadow-2xl cursor-pointer" onClick={() => handleExplore("Dear Dakanda (2005)")}>
              <img src="https://cms.dmpcdn.com/travel/2020/02/18/058bbce0-521b-11ea-8fac-d321c6efd459_original.jpg" className="size-full object-cover transition duration-1000 group-hover:scale-110" alt="Highlight" />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/90 via-transparent to-transparent flex flex-col justify-end p-10">
                <span className="text-orange-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Editor's Choice</span>
                <h3 className="text-white text-3xl font-bold italic font-heading tracking-tighter">Sakae Krang Waterfront</h3>
                <p className="text-white/70 text-sm mt-1">Uthai Thani · Dear Dakanda</p>
              </div>
            </div>
            {/* Phuket Highlight */}
            <div className="group relative aspect-[16/10] overflow-hidden rounded-[3rem] shadow-2xl cursor-pointer" onClick={() => handleExplore("แปลรักฉันด้วยใจเธอ")}>
              <img src="https://upload.wikimedia.org/wikipedia/th/a/ab/I_Told_Sunset_About_You_poster.jpg" className="size-full object-cover transition duration-1000 group-hover:scale-110" alt="Highlight" />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/90 via-transparent to-transparent flex flex-col justify-end p-10">
                <span className="text-orange-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Trending</span>
                <h3 className="text-white text-3xl font-bold italic font-heading tracking-tighter">Promthep Cape</h3>
                <p className="text-white/70 text-sm mt-1">Phuket · I Told Sunset About You</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Movies Archives */}
      <section id="movies" className="bg-[#FDF9F0] py-24 border-t border-cream-200">
        <div className="mx-auto max-w-6xl px-4 text-left">
          <div className="mb-16">
            <span className="text-orange-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Archives</span>
            <h2 className={sectionTitle}>Movies Archives</h2>
            <p className="mt-4 text-teal-900/60 text-lg italic">Browse cinematic stories and the places that inspired them.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {Object.keys(storyDetails).map((title) => (
              <div key={title} className="group relative bg-white rounded-[2.5rem] border border-cream-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="aspect-[4/3] overflow-hidden relative">
                   <img src={title === "Dear Dakanda (2005)" ? "https://f.ptcdn.info/253/088/000/mbmglualiMkldpxglU5-o.jpg" : title === "แปลรักฉันด้วยใจเธอ" ? "https://upload.wikimedia.org/wikipedia/th/a/ab/I_Told_Sunset_About_You_poster.jpg" : "https://f.ptcdn.info/964/010/000/1381836361-a1JPG-o.jpg"} className="h-full w-full object-cover group-hover:scale-105 group-hover:blur-sm transition-all duration-700" alt={title} />
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-teal-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8 text-center backdrop-blur-[2px]">
                      <p className="text-white italic text-lg font-medium mb-4 leading-relaxed">"{storyDetails[title].quotes}"</p>
                      <button onClick={() => handleExplore(title)} className="px-6 py-2 bg-orange-500 text-white rounded-full font-bold text-[10px] uppercase tracking-widest shadow-lg hover:bg-white hover:text-orange-600 transition-all">Discover Story</button>
                   </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-1.5 mb-4 text-[10px] font-black text-teal-900/30 uppercase tracking-widest text-left"><MapPin size={12} className="text-orange-500" /> {storyDetails[title].locationCount} Locations</div>
                  <h3 className="font-heading text-xl font-bold text-teal-900 mb-2 italic tracking-tighter uppercase">{title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. EXPERIENCE FLOW */}
      <section className="bg-[#0F2922] py-32 text-center relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 relative z-10">
          <span className="text-orange-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">The Experience</span>
          <h2 className="text-white text-4xl font-semibold mb-20 italic font-heading uppercase tracking-tighter">How to Collect Your Memories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { s: "01", i: <Navigation size={32} />, t: "Discover", d: "Find movie locations." },
              { s: "02", i: <MapPin size={32} />, t: "Visit", d: "Capture moments." },
              { s: "03", i: <Camera size={32} />, t: "Earn", d: "Get EXP and badges." }
            ].map((item, i) => (
              <div key={i} className="space-y-6 group">
                <div className="size-20 bg-white/5 border border-white/10 rounded-[2rem] mx-auto flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 shadow-xl group-hover:rotate-12 group-hover:scale-110">
                  {item.i}
                </div>
                <div>
                   <p className="text-orange-500 font-black text-xs tracking-widest uppercase">{item.s}</p>
                   <h4 className="text-white text-xl font-bold italic uppercase font-heading tracking-tighter">{item.t}</h4>
                   <p className="text-white/40 text-sm mt-2 px-6 italic">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Secondary Cities */}
      <section id="secondary-cities" className="bg-white py-24 border-t border-cream-100">
        <div className="mx-auto max-w-6xl px-4 text-left">
          <span className="text-orange-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Destinations</span>
          <h2 className={sectionTitle}>Secondary Cities</h2>
          <p className="mt-4 text-teal-900/60 text-lg italic mb-16">Discover quieter destinations where stories breathe.</p>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {cities.map((x) => {
              const lock = getLockStatus(x.id);
              const isSelected = previewId === x.title;

              return (
                <div key={x.title} className="group bg-[#FDF9F0]/50 rounded-[3.5rem] border border-cream-200 overflow-hidden shadow-premium hover:shadow-2xl transition-all p-4">
                  <div className="aspect-video overflow-hidden rounded-[2.5rem] relative">
                    <img src={x.img} alt={x.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-8 text-left">
                      <div>
                        <h3 className="text-2xl font-bold text-teal-900 italic font-heading tracking-tighter uppercase">{x.title}</h3>
                        <p className="text-teal-900/40 text-[10px] font-black uppercase mt-1 tracking-widest">{x.meta}</p>
                      </div>
                      <div className={`p-3.5 rounded-2xl shadow-lg rotate-3 ${lock.isLocked ? 'bg-gray-200 text-gray-400' : 'bg-orange-500 text-white shadow-orange-500/20'}`}><Ticket size={24} /></div>
                    </div>
                    
                    <div className="mb-8 text-left">
                      <input 
                        type="file" accept="image/*" id={`file-${x.title}`} className="hidden" 
                        onChange={(e) => handleFileChange(e, x.title)} 
                        disabled={lock.isLocked}
                      />
                  
                      <label 
                        htmlFor={lock.isLocked ? "" : `file-${x.title}`} 
                        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-[2.5rem] transition-all duration-500 ${
                          isSelected 
                          ? 'bg-green-50 border-green-200 shadow-inner' 
                          : lock.isLocked 
                          ? 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-50' 
                          : 'border-cream-200 cursor-pointer bg-white/50 hover:bg-white text-teal-900/30'
                        }`}
                      >
                        {isSelected ? (
                          <div className="text-green-600 font-bold flex items-center gap-2 animate-in fade-in zoom-in">
                            <Check size={20} className="bg-green-600 text-white rounded-full p-0.5" /> 
                            <span>Photo Selected</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            {lock.isLocked ? <Clock size={28} className="mb-2 opacity-30" /> : <Camera size={28} className="mb-2 opacity-50" />}
                            <span className="text-[10px] font-black uppercase tracking-widest">{lock.isLocked ? "Locked" : "Verify Location"}</span>
                          </div>
                        )}
                      </label>
                    </div>

                    <button 
                      onClick={() => handleCheckIn(x.id, x.title)} 
                      disabled={loadingId === x.title || lock.isLocked} 
                      className={`w-full rounded-full py-4 text-sm font-bold shadow-xl transition-all flex items-center justify-center gap-2 ${
                        lock.isLocked 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-[#0F2922] text-white hover:bg-teal-950 active:scale-95'
                      }`}
                    >
                      {loadingId === x.title ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : lock.isLocked ? (
                        lock.text
                      ) : (
                        <>Check-in for +150 Point <ChevronRight size={18} /></>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal - Explore Story */}
      {isModalOpen && selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-900/60 backdrop-blur-sm text-left">
          <div className="bg-[#FDF9F0] w-full max-w-xl rounded-[3.5rem] overflow-hidden shadow-2xl relative animate-in zoom-in duration-300">
            <div className="absolute top-8 right-8 flex items-center gap-2 z-20">
              <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-white rounded-full text-teal-900 shadow-md hover:scale-110 transition-transform">
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="animate-pulse" />}
              </button>
              
              <div className="group relative">
                <button className="p-2.5 bg-white rounded-full text-teal-900 shadow-md">
                  <Share2 size={18} />
                </button>
                <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-2xl shadow-xl border border-cream-100 overflow-hidden p-1 min-w-[120px]">
                    <button onClick={() => handleShare('line')} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-green-50 text-xs font-bold text-green-600 transition-colors text-left"><MessageCircle size={14} /> LINE</button>
                    <button onClick={() => handleShare('fb')} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-xs font-bold text-blue-600 transition-colors text-left"><Facebook size={14} /> Facebook</button>
                  </div>
                </div>
              </div>

              <button onClick={() => setIsModalOpen(false)} className="p-2.5 bg-white rounded-full text-teal-900 hover:rotate-90 transition-all shadow-md"><X size={20} /></button>
            </div>
            <div className={`h-3 w-full ${selectedStory.color}`} />
            <div className="p-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-6">{selectedStory.location}</span>
              <h2 className="font-heading text-4xl font-bold text-teal-900 mb-6 italic tracking-tighter uppercase">{selectedStory.title}</h2>
              <p className="text-teal-900/70 mb-10 leading-relaxed text-lg font-medium italic">“{selectedStory.description}”</p>
              
              <div className="space-y-6">
                <h4 className="font-bold text-teal-900 flex items-center gap-2 uppercase tracking-widest text-[10px] opacity-40">Key Locations & Guide</h4>
                <div className="grid grid-cols-1 gap-3">
                  {selectedStory.highlights.map((h: string) => (
                    <button key={h} onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h + " " + selectedStory.location)}`, '_blank')} className="flex items-center justify-between bg-white px-5 py-4 rounded-2xl border border-cream-200 shadow-sm hover:border-orange-400 transition-all group">
                      <span className="text-teal-800 font-bold text-sm">{h}</span>
                      <Navigation size={14} className="text-orange-500 group-hover:animate-bounce" />
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-full mt-12 py-5 bg-teal-900 text-white font-black rounded-3xl hover:bg-orange-600 shadow-2xl transition-all active:scale-95 text-[12px] uppercase tracking-[0.3em]">Let's go!</button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-cream-200 py-24 text-center">
        <div className="mx-auto max-w-6xl px-4 text-left md:text-center">
          <div className="font-heading text-3xl font-black text-teal-900 mb-6 italic tracking-tighter uppercase">Nostalgia</div>
          <p className="text-teal-900/30 text-xs font-bold tracking-[0.4em] uppercase font-sans">Cinematic Travel Experience © 2026</p>
        </div>
      </footer>
    </main>
  );
}