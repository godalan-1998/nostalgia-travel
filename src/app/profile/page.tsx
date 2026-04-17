"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "../../utils/supabase/client";
import { Navbar } from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { Trophy, MapPin, LogOut, Star, Image as ImageIcon, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [checkins, setCheckins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // --- ฟังก์ชันดึงข้อมูลทั้งหมด (ดึงใหม่เมื่อถูกเรียก) ---
  const fetchData = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || "655848e9-1e5d-4bb4-b76c-3a478493750a"; // Fallback ID ของคุณ

    if (userId) {
      // 1. ดึงข้อมูลโปรไฟล์ (ไม่ใช้ Cache)
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (profileData) setProfile(profileData);

      // 2. ดึงประวัติการเช็คอิน
      const { data: checkinData } = await supabase
        .from("check_ins")
        .select(`*, locations(name)`)
        .eq("user_id", userId)
        .order('created_at', { ascending: false });
      setCheckins(checkinData || []);

      // 3. ดึง Leaderboard ล่าสุด
      const { data: leaders } = await supabase
        .from("profiles")
        .select("username, points")
        .order("points", { ascending: false })
        .limit(3);
      setLeaderboard(leaders || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchData();

    // --- ระบบ Real-time: ฟังการอัปเดตจาก Database ---
    const { data: { session } } = supabase.auth.onAuthStateChange((_event, session) => {
       if (session) fetchData();
    });

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'profiles' 
      }, () => {
        fetchData(); // เมื่อมีการ Update ในตาราง profiles ให้ดึงข้อมูลใหม่ทันที
      })
      .subscribe();

    // --- ไม้ตาย: ดึงข้อมูลใหม่ทุกครั้งที่สลับแท็บกลับมาดู (Focus) ---
    window.addEventListener("focus", fetchData);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("focus", fetchData);
    };
  }, [supabase, fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF9F0] flex flex-col items-center justify-center font-heading text-teal-900">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="text-lg">กำลังโหลดข้อมูลการเดินทางของคุณ...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDF9F0]">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-12">
        
        {/* Profile Card */}
        <div className="bg-white rounded-[2.5rem] shadow-premium p-8 border border-cream-200 mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="size-32 bg-teal-900 rounded-full flex items-center justify-center text-cream-50 text-5xl font-bold border-4 border-orange-100 shadow-lg">
              {profile?.username?.[0]?.toUpperCase() || "G"}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="font-heading text-4xl font-bold text-teal-900 mb-1">
                {profile?.username || "godton"}
              </h1>
              <p className="text-teal-800/60 mb-6 flex items-center justify-center md:justify-start gap-2">
                <Star size={16} className="text-orange-500 fill-orange-500" />
                Cinephile Explorer Level {Math.floor((profile?.points || 0) / 500) + 1}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="bg-orange-500 px-8 py-4 rounded-2xl shadow-lg transform transition hover:scale-105">
                  <span className="block text-[10px] text-white/80 uppercase font-black tracking-widest mb-1">Total Points</span>
                  <span className="text-3xl font-black text-white flex items-center gap-2">
                    <Trophy size={24} /> {profile?.points?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="bg-teal-50 px-8 py-4 rounded-2xl border border-teal-100 flex flex-col justify-center">
                  <span className="block text-[10px] text-teal-800/50 uppercase font-black tracking-widest mb-1">Status</span>
                  <span className="text-xl font-bold text-teal-900">Premium Member</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery & Leaderboard Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          
          {/* Journey Gallery */}
          <section className="bg-white/60 backdrop-blur p-8 rounded-[2.5rem] border border-cream-200 shadow-sm">
            <h3 className="font-heading text-xl font-bold text-teal-900 mb-6 flex items-center gap-2">
              <ImageIcon size={22} className="text-orange-500" /> Journey Gallery
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {checkins.length > 0 ? (
                checkins.map((c, i) => (
                  <div key={i} className="group aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-md relative">
                    <img 
                      src={c.user_image_url} 
                      alt="Visit" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                       <p className="text-[10px] text-white font-bold">{c.locations?.name}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-12 text-center text-teal-900/40 text-sm border-2 border-dashed border-cream-200 rounded-[2rem]">
                  ยังไม่มีรูปภาพจากการเช็คอิน
                </div>
              )}
            </div>
          </section>

          {/* Leaderboard */}
          <section className="bg-teal-900 p-8 rounded-[2.5rem] text-cream-50 shadow-xl">
            <h3 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
              <Trophy size={22} className="text-orange-400" /> Leaderboard
            </h3>
            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                    user.username === profile?.username ? 'bg-orange-500 shadow-lg scale-105' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`size-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-400 text-teal-900' : 'bg-teal-800'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-bold">{user.username} {user.username === profile?.username && "(You)"}</span>
                  </div>
                  <span className={`font-black ${user.username === profile?.username ? 'text-white' : 'text-orange-400'}`}>
                    {user.points.toLocaleString()} pts
                  </span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}