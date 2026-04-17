"use client";

import { Film, MapPin, Users, Ticket, Camera, Check, ChevronRight, X } from "lucide-react";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { createClient } from "../utils/supabase/client"; 
import { useState } from "react";
import { useRouter } from "next/navigation";

const sectionTitle = "font-heading text-2xl sm:text-4xl font-bold tracking-tight text-teal-900";

export default function HomePage() {
  const supabase = createClient();
  const router = useRouter();

  // --- State สำหรับจัดการ Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<any>(null);

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  // ข้อมูลเนื้อหาสำหรับ Explore Story (เด้งขึ้นมาเมื่อกดปุ่ม)
  const storyDetails: any = {
    "Dear Dakanda (2005)": {
      location: "Chiang Mai & Uthai Thani",
      description: "สัมผัสความทรงจำ 'เพื่อนสนิท' ผ่านคณะวิจิตรศิลป์ มช. และความสงบของริมน้ำสะแกกรังที่ไข่ย้อยไปพักใจ",
      highlights: ["คณะวิจิตรศิลป์ มช.", "อ่างแก้ว", "ริมน้ำสะแกกรัง"],
      color: "bg-orange-500"
    },
    "แปลรักฉันด้วยใจเธอ": {
      location: "Phuket Old Town",
      description: "ดื่มด่ำกับบรรยากาศเมืองเก่าภูเก็ต ย่านซอยรมณีย์ และความหมายของ 'เต๋-โอ้เอ๋ว' ผ่านสถานที่ถ่ายทำสไตล์ชิโนโปรตุกีส",
      highlights: ["ซอยรมณีย์", "ร้านโกปี้เตี่ยม", "แหลมพรหมเทพ"],
      color: "bg-teal-600"
    },
    "หนังไทย......แฟนฉัน (พ.ศ. 2546)": {
      location: "Phetchaburi & Songkhla",
      description: "ย้อนวันวานวัยเด็กไปกับมิตรภาพของน้อยหน่าและเจี๊ยบ ในย่านเมืองเก่าที่ยังคงความอบอุ่นยุค 80s",
      highlights: ["ตลาดเก่าริมน้ำ", "ร้านตัดผมโบราณ", "ย่านเมืองเก่าสงขลา"],
      color: "bg-blue-500"
    }
  };

  const handleExplore = (title: string) => {
    const detail = storyDetails[title];
    if (detail) {
      setSelectedStory({ title, ...detail });
      setIsModalOpen(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewId(id);
    }
  };

  const handleCheckIn = async (locationId: number, title: string) => {
    if (!selectedFile || previewId !== title) {
      alert("📸 กรุณาอัปโหลดรูปถ่ายเพื่อยืนยันการเช็คอินก่อนรับแต้มครับ");
      return;
    }

    setLoadingId(title);
    
    try {
      const currentUserId = "655848e9-1e5d-4bb4-b76c-3a478493750a"; 

      if (!currentUserId) {
        alert("Error: No User ID");
        return;
      }

      const fileExt = selectedFile!.name.split('.').pop();
      const fileName = `${currentUserId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('checkin-images')
        .upload(fileName, selectedFile!);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('checkin-images')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase.from("check_ins").insert([
        { user_id: currentUserId, location_id: locationId, user_image_url: publicUrl }
      ]);

      if (dbError) throw dbError;

      const { data: profile } = await supabase
        .from("profiles")
        .select("points")
        .eq("id", currentUserId)
        .single();

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ points: (profile?.points || 0) + 150 })
        .eq("id", currentUserId);

      if (updateError) throw updateError;

      alert(`เช็คอินสำเร็จที่ ${title}! \nคุณได้รับ +150 แต้มสะสมเรียบร้อยแล้ว 🏆`);
      router.refresh();
      setSelectedFile(null);
      setPreviewId(null);

    } catch (error: any) {
      console.error("Check-in Error:", error.message);
      alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDF9F0]">
      <Navbar />
      <Hero />

      {/* --- Section: Movies --- */}
      <section id="movies" className="border-t border-cream-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-12">
            <h2 className={sectionTitle}>Movies</h2>
            <p className="mt-4 text-teal-900/60 text-lg">Browse cinematic stories and the places that inspired them.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { title: "Dear Dakanda (2005)", img: "https://f.ptcdn.info/253/088/000/mbmglualiMkldpxglU5-o.jpg", desc: "Soft light routes and photo-ready streets." },
              { title: "แปลรักฉันด้วยใจเธอ", img: "https://upload.wikimedia.org/wikipedia/th/a/ab/I_Told_Sunset_About_You_poster.jpg", desc: "Deep teal nights, vintage cafes, old cinemas." },
              { title: "หนังไทย......แฟนฉัน (พ.ศ. 2546)", img: "https://f.ptcdn.info/964/010/000/1381836361-a1JPG-o.jpg", desc: "Small towns, quiet piers, and scenic stops." },
            ].map((x) => (
              <div key={x.title} className="group overflow-hidden rounded-[2.5rem] border border-cream-200 bg-cream-50/50 shadow-sm transition-all hover:shadow-xl hover:border-orange-200">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={x.img} alt={x.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-8">
                  <h3 className="font-heading text-xl font-bold text-teal-900">{x.title}</h3>
                  <p className="mt-3 text-sm text-teal-900/60 mb-6">{x.desc}</p>
                  <button 
                    onClick={() => handleExplore(x.title)}
                    className="flex items-center gap-2 font-bold text-teal-900 hover:text-orange-600 transition-colors"
                  >
                    Explore Story <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Modal แสดงรายละเอียด Story --- */}
      {isModalOpen && selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FDF9F0] w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white rounded-full text-teal-900 hover:rotate-90 transition-all z-20"
            >
              <X size={24} />
            </button>
            <div className={`h-4 w-full ${selectedStory.color}`} />
            <div className="p-10">
              <span className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-4">
                {selectedStory.location}
              </span>
              <h2 className="font-heading text-3xl font-bold text-teal-900 mb-4">{selectedStory.title}</h2>
              <p className="text-teal-900/70 mb-8 leading-relaxed">{selectedStory.description}</p>
              
              <div className="space-y-4">
                <h4 className="font-bold text-teal-900 flex items-center gap-2">
                  <MapPin size={18} className="text-orange-500" /> Key Locations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStory.highlights.map((h: string) => (
                    <span key={h} className="bg-white px-4 py-2 rounded-xl text-sm border border-cream-200 text-teal-800 font-medium">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full mt-10 py-4 bg-teal-900 text-white font-bold rounded-2xl hover:bg-orange-500 shadow-lg transition-colors"
              >
                Let's go!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Section: Secondary Cities --- */}
      <section id="secondary-cities" className="border-t border-cream-200 bg-cream-50/50">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-12 text-center md:text-left">
            <h2 className={sectionTitle}>Secondary Cities</h2>
            <p className="mt-4 text-teal-900/60 text-lg">Discover quieter destinations where stories breathe.</p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {[
              { id: 6, title: "Khiri Wong", img: "https://cms.dmpcdn.com/travel/2020/02/18/058bbce0-521b-11ea-8fac-d321c6efd459_original.jpg", meta: "Sunset · cafes · shoreline" },
              { id: 8, title: "Koh Phayam", img: "https://cms.dmpcdn.com/travel/2020/02/18/4fb3cec0-521b-11ea-a6c6-adb7bf04b087_original.jpg", meta: "Golden hour · calm streets" },
              { id: 9, title: "Wat Tha Sung", img: "https://cms.dmpcdn.com/travel/2020/02/18/8ee33130-521b-11ea-a6c6-adb7bf04b087_original.jpg", meta: "Golden Sparkles · Cinematic Architecture · Serene River" },
              { id: 7, title: "Phra Prang Sam Yot", img: "https://cms.dmpcdn.com/travel/2020/02/18/f5de90a0-521b-11ea-b4a0-631ea126a728_original.jpg", meta: "Ancient Ruins · Wildlife Frames · Hidden History" },
            ].map((x) => (
              <div key={x.title} className="group overflow-hidden rounded-[3rem] border border-cream-200 bg-white shadow-premium transition-all">
                <div className="aspect-video w-full overflow-hidden">
                  <img src={x.img} alt={x.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-heading text-2xl font-bold text-teal-900">{x.title}</h3>
                      <p className="text-teal-900/50">{x.meta}</p>
                    </div>
                    <div className="bg-teal-50 p-3 rounded-2xl text-teal-900 shadow-sm"><MapPin size={24} /></div>
                  </div>

                  <div className="mb-8">
                    <input 
                      type="file" accept="image/*" id={`file-${x.title}`} className="hidden" 
                      onChange={(e) => handleFileChange(e, x.title)} 
                    />
                    <label 
                      htmlFor={`file-${x.title}`}
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-cream-200 rounded-[2rem] cursor-pointer bg-cream-50/50 hover:bg-cream-100/50 transition-all overflow-hidden"
                    >
                      {previewId === x.title ? (
                        <div className="flex items-center gap-2 text-green-600 font-bold">
                          <Check size={20} /> Photo Selected
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-teal-900/30">
                          <Camera size={28} className="mb-2" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Upload Verification</span>
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="flex items-center justify-between gap-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-teal-900/30 uppercase tracking-widest">Rewards</span>
                      <span className="text-orange-600 font-bold flex items-center gap-1">
                        <Ticket size={16} /> +150 Pts
                      </span>
                    </div>
                    <button 
                      onClick={() => handleCheckIn(x.id, x.title)}
                      disabled={loadingId === x.title}
                      className="flex-1 rounded-2xl bg-[#0F2922] py-4 text-sm font-bold text-white shadow-xl hover:bg-orange-500 transition-all disabled:bg-gray-200"
                    >
                      {loadingId === x.title ? "Verifying..." : "Check-in Now"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-cream-200 py-16 text-center">
        <div className="mx-auto max-w-6xl px-4">
          <div className="font-heading text-2xl font-bold text-teal-900 mb-4 italic">Nostalgia</div>
          <p className="text-teal-900/40 text-sm max-w-md mx-auto mb-8">
            Connecting movie memories with hidden gems in secondary cities.
          </p>
          <div className="h-px w-20 bg-orange-500 mx-auto mb-8"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-900/30">
            © 2026 Nostalgia Travel. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}