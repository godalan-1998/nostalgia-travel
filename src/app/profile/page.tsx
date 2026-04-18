"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "../../utils/supabase/client";
import { Navbar } from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { 
  Trophy, Star, Image as ImageIcon, Loader2, 
  Camera, Award, Pencil, Check, History, Sparkles, ListOrdered, X
} from "lucide-react";
import { motion } from "framer-motion"; // เพิ่ม Framer Motion

// --- Animation Variants ---
const containerVars = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVars = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [checkins, setCheckins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");

  const router = useRouter();
  const supabase = createClient();

  // --- 1. Fetch Data ---
  const fetchData = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      const userId = session.user.id;

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", userId).single();
      if (profileData) {
        setProfile(profileData);
        setEditName(profileData.username || "");
        setEditBio(profileData.bio || "");
      }

      const { data: checkinData } = await supabase
        .from("check_ins")
        .select(`id, user_image_url, created_at, location_id, locations(name)`)
        .eq("user_id", userId)
        .order('created_at', { ascending: false });
      setCheckins(checkinData || []);

      const { data: leaders } = await supabase.from("profiles").select("username, points").order("points", { ascending: false }).limit(3);
      setLeaderboard(leaders || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [supabase, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // --- 2. Logic คำนวณต่างๆ ---
  const rankInfo = useMemo(() => {
    const pts = profile?.points || 0;
    if (pts >= 1501) return { title: "Nostalgia Legend", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" };
    if (pts >= 501) return { title: "Film Explorer", color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200" };
    return { title: "Cinematic Newbie", color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-200" };
  }, [profile]);

  const { currentLevel, progressPercentage, pointsNeededNextLevel } = useMemo(() => {
    const points = profile?.points || 0;
    const pointsPerLevel = 500;
    const level = Math.floor(points / pointsPerLevel) + 1;
    const pointsInThisLevel = points % pointsPerLevel;
    return { 
      currentLevel: level, 
      progressPercentage: (pointsInThisLevel / pointsPerLevel) * 100, 
      pointsNeededNextLevel: pointsPerLevel - pointsInThisLevel 
    };
  }, [profile]);

  const badgeList = useMemo(() => [
    { id: 'first-checkin', name: 'First Check-in', unlocked: checkins.length > 0, icon: "🎬", desc: "เริ่มต้นการเดินทางครั้งแรก" },
    { id: 'movie-buff', name: 'Movie Buff', unlocked: (profile?.points || 0) >= 500, icon: "🍿", desc: "สะสมแต้มครบ 500 คะแนน" },
    { id: 'city-explorer', name: 'City Explorer', unlocked: new Set(checkins.map(c => c.location_id)).size >= 3, icon: "🌍", desc: "สำรวจสถานที่ถ่ายทำครบ 3 แห่ง" }
  ], [profile, checkins]);

  // --- 3. Actions ---
  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      setUploading(true);
      const file = event.target.files[0];
      const fileName = `${profile.id}-${Date.now()}.${file.name.split('.').pop()}`;
      await supabase.storage.from('AVATAR').upload(fileName, file);
      const { data: { publicUrl } } = supabase.storage.from('AVATAR').getPublicUrl(fileName);
      await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", profile.id);
      fetchData();
    } catch (error: any) { alert(error.message); } finally { setUploading(false); }
  }

  async function handleUpdateProfile() {
    try {
      const { error } = await supabase.from("profiles").update({ username: editName, bio: editBio }).eq("id", profile.id);
      if (error) throw error;
      setProfile({ ...profile, username: editName, bio: editBio });
      setIsEditing(false);
    } catch (error) { alert("บันทึกไม่สำเร็จ"); }
  }

  if (loading) return <div className="min-h-screen bg-[#FDF9F0] flex items-center justify-center font-black italic text-teal-900"><Loader2 className="animate-spin mr-2" /> LOADING...</div>;

  return (
    <main className="min-h-screen bg-[#FDF9F0] pb-20 font-sans">
      <Navbar />
      
      <div className="mx-auto max-w-5xl px-4 py-12">
        
        {/* --- Profile Header Card --- */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3.5rem] shadow-xl p-10 md:p-14 border border-white mb-8 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 size-64 bg-orange-100/50 blur-[100px] rounded-full" />
          
          <div className="flex flex-col md:flex-row items-center gap-14 relative z-10">
            <div className="relative group shrink-0">
              <div className="size-48 bg-teal-900 rounded-[3.5rem] flex items-center justify-center border-[10px] border-white shadow-2xl overflow-hidden rotate-2 group-hover:rotate-0 transition-all duration-500">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="size-full object-cover" />
                ) : ( 
                  <span className="text-cream-50 text-7xl font-black italic">{profile?.username?.[0]?.toUpperCase()}</span> 
                )}
              </div>
              <label htmlFor="avatar-input" className="absolute -bottom-2 -right-2 size-12 bg-orange-500 text-white shadow-xl rounded-2xl flex items-center justify-center cursor-pointer z-20 hover:scale-110 transition-transform">
                {uploading ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}
                <input id="avatar-input" type="file" className="hidden" accept="image/*" onChange={uploadAvatar} disabled={uploading} />
              </label>
            </div>

            <div className="flex-1 text-center md:text-left space-y-8">
              <div className="space-y-4 text-left">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl border ${rankInfo.border} ${rankInfo.bg} ${rankInfo.color} text-[10px] font-black uppercase tracking-widest`}>
                  <Sparkles size={12} className={profile?.points >= 1501 ? "fill-orange-500" : ""} /> {rankInfo.title}
                </div>

                <div className="flex items-center justify-center md:justify-start gap-4">
                  {isEditing ? (
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} className="text-5xl font-black text-teal-900 bg-teal-50/50 border-b-4 border-orange-400 outline-none italic tracking-tighter w-full" />
                  ) : (
                    <h1 className="text-5xl font-black text-teal-900 tracking-tighter italic leading-none">{profile?.username || "Guest"}</h1>
                  )}
                  <button onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)} className="size-10 flex items-center justify-center bg-teal-50 rounded-xl text-teal-600 hover:bg-teal-900 hover:text-white transition-all shadow-sm shrink-0">
                    {isEditing ? <Check size={20} /> : <Pencil size={18} />}
                  </button>
                </div>
                <p className="text-xl text-teal-800/60 font-medium italic">
                   {profile?.bio ? `“${profile.bio}”` : "Exploring the nostalgia of cinema..."}
                </p>
              </div>

              <div className="max-w-md mx-auto md:mx-0 bg-teal-50/30 p-6 rounded-[2rem] border border-teal-100/50 shadow-inner text-left">
                <div className="flex justify-between items-end mb-2 text-[11px] font-black uppercase tracking-widest text-teal-900">
                  <span>EXP Progress</span>
                  <span className="text-orange-600 font-bold">{pointsNeededNextLevel} PTS TO LEVEL {currentLevel + 1}</span>
                </div>
                <div className="w-full h-4 bg-white rounded-full p-1 shadow-sm overflow-hidden border border-teal-100/50">
                  <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 🏆 Trophy & Awards Stats --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-orange-500 rounded-[3rem] p-8 text-white shadow-xl flex items-center justify-between group overflow-hidden relative">
            <Trophy className="absolute -right-4 -bottom-4 size-32 opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="size-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner"><Trophy size={32} /></div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-black opacity-60 tracking-widest">Total Points</p>
                <p className="text-4xl font-black italic">{(profile?.points || 0).toLocaleString()}</p>
              </div>
            </div>
            <button onClick={() => setShowHistory(true)} className="relative z-10 size-12 bg-white/20 hover:bg-white/40 rounded-2xl flex items-center justify-center transition-colors">
              <History size={20} />
            </button>
          </div>

          <div className="bg-teal-900 rounded-[3rem] p-8 text-white shadow-xl flex items-center gap-6 group overflow-hidden relative">
             <Award className="absolute -right-4 -bottom-4 size-32 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
             <div className="size-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                <Award size={32} className="text-orange-400" />
             </div>
             <div className="text-left">
                <p className="text-[10px] uppercase font-black opacity-40 tracking-widest">Badges Earned</p>
                <p className="text-4xl font-black italic">{badgeList.filter(b => b.unlocked).length} <span className="text-xl opacity-30">/ {badgeList.length}</span></p>
             </div>
          </div>
        </div>

        {/* --- 🏆 Achievement Showcase (Animated) --- */}
        <motion.section 
          variants={containerVars} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="bg-white rounded-[3.5rem] p-10 border border-cream-200 shadow-sm mb-12 text-left"
        >
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-heading text-2xl font-bold text-teal-900 flex items-center gap-3 italic uppercase tracking-tighter">
              <Award size={28} className="text-orange-500" /> Achievement Showcase
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {badgeList.map((badge) => (
              <motion.div 
                key={badge.id} variants={itemVars} whileHover={{ scale: 1.05 }}
                className={`p-8 rounded-[3rem] border-2 relative overflow-hidden transition-all duration-500 ${badge.unlocked ? 'border-orange-100 bg-white shadow-lg' : 'border-transparent bg-gray-50 opacity-40 grayscale'}`}
              >
                {badge.unlocked && <motion.div animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute inset-0 bg-orange-100 blur-2xl" />}
                <div className="text-5xl mb-6 relative z-10">{badge.icon}</div>
                <h4 className="text-xl font-black text-teal-900 uppercase italic mb-2 tracking-tighter relative z-10">{badge.name}</h4>
                <p className="text-xs text-teal-800/60 font-medium leading-relaxed mb-6 relative z-10">{badge.desc}</p>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden relative z-10">
                   <motion.div initial={{ width: 0 }} whileInView={{ width: badge.unlocked ? "100%" : "15%" }} transition={{ duration: 1, delay: 0.5 }} className={`h-full ${badge.unlocked ? 'bg-orange-500' : 'bg-gray-300'}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* --- Travel Gallery & Sidebar --- */}
        <div className="grid md:grid-cols-5 gap-10">
          <section className="md:col-span-3 bg-white/50 backdrop-blur rounded-[3.5rem] p-10 border border-white shadow-sm min-h-[450px]">
            <h3 className="text-2xl font-black text-teal-900 mb-8 flex items-center gap-3 text-left"><ImageIcon className="text-orange-500" /> Travel Gallery</h3>
            {checkins.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {checkins.map((c, i) => (
                    <div key={i} className="aspect-[3/4] rounded-3xl overflow-hidden border-[10px] border-white shadow-xl hover:scale-105 transition-all group relative cursor-pointer">
                      <img src={c.user_image_url} alt="Check-in" className="size-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                        <p className="text-[10px] text-white font-black truncate tracking-widest uppercase">{c.locations?.name || "Cinema Spot"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-6">
                  <div className="size-24 bg-teal-50 rounded-[2.5rem] flex items-center justify-center text-teal-200 shadow-inner rotate-3"><Camera size={48} /></div>
                  <p className="font-heading text-xl font-bold text-teal-900/40 italic uppercase tracking-widest">No Memories Logged</p>
                  <button onClick={() => router.push('/')} className="px-8 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg">Start Exploring</button>
                </div>
              )}
          </section>

          <div className="md:col-span-2 space-y-10">
            <section className="bg-white rounded-[3rem] p-10 border border-cream-200 shadow-sm relative overflow-hidden text-left">
              <h3 className="text-xl font-black text-teal-900 mb-8 flex items-center gap-3 uppercase italic tracking-tighter"><History size={24} /> Recent Activity</h3>
              <div className="space-y-8 relative">
                {checkins.slice(0, 3).map((log, i) => (
                  <div key={i} className="flex gap-5 relative group">
                    <div className="size-3 bg-orange-500 rounded-full mt-1.5 shrink-0 shadow-[0_0_12px_rgba(249,115,22,0.6)]" />
                    <div>
                      <p className="text-sm text-teal-900 font-bold leading-tight mb-1">Checked-in at <span className="text-orange-600 underline decoration-2">{log.locations?.name || " Cinema Spot"}</span></p>
                      <p className="text-[10px] text-teal-800/40 font-black uppercase tracking-widest">{new Date(log.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* --- 👑 Global Rank (Animated) --- */}
            <section className="bg-teal-900 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden group min-h-[450px] flex flex-col justify-between">
              <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none"><Trophy size={200} /></div>
              <div>
                <h3 className="text-xl font-black mb-10 flex items-center gap-3 relative z-10 italic uppercase tracking-tighter text-left"><Trophy size={24} className="text-orange-400" /> Global Rank</h3>
                <motion.div variants={containerVars} initial="hidden" animate="visible" className="space-y-6 relative z-10 text-left">
                  {leaderboard.map((user, i) => {
                    const isFirst = i === 0;
                    return (
                      <motion.div 
                        key={i} variants={itemVars}
                        {...(isFirst ? { animate: { y: [0, -5, 0] }, transition: { repeat: Infinity, duration: 4 } } : {})}
                        className={`flex items-center justify-between p-6 rounded-[2rem] transition-all duration-500 relative overflow-hidden ${isFirst ? 'bg-gradient-to-r from-yellow-500 via-yellow-200 to-yellow-600 text-teal-900 scale-105 shadow-2xl ring-2 ring-yellow-400' : user.username === profile?.username ? 'bg-orange-500 shadow-xl ring-4 ring-orange-500/20' : 'bg-white/5 hover:bg-white/10'}`}
                      >
                        {isFirst && <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12" />}
                        <div className="flex items-center gap-4 relative z-10">
                          <span className={`text-2xl font-black italic ${isFirst ? 'text-teal-900' : 'opacity-20'}`}>{i + 1}</span>
                          <span className="font-bold text-lg truncate max-w-[100px]">{user.username} {isFirst && "👑"}</span>
                        </div>
                        <span className={`font-black text-xl italic relative z-10 ${isFirst ? 'text-teal-950' : 'text-orange-400'}`}>{user.points?.toLocaleString()} <span className="text-[10px] uppercase opacity-60">pts</span></span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
              <p className="text-center text-[10px] font-black opacity-30 mt-10 tracking-[0.4em] uppercase relative z-10 italic">Nostalgia Cinematic Log</p>
            </section>
          </div>
        </div>
      </div>

      {/* Modal และ Point History... (โค้ดส่วนเดิมของคุณ) */}
      {showHistory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-teal-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-teal-900 italic uppercase">Point History</h3>
              <button onClick={() => setShowHistory(false)} className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 max-h-[400px] overflow-y-auto space-y-4">
              {checkins.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-cream-50/50 rounded-[2rem] border border-cream-100 text-left">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-white rounded-xl flex items-center justify-center shadow-sm">🎬</div>
                    <div>
                      <p className="text-sm font-bold text-teal-900">{item.locations?.name}</p>
                      <p className="text-[10px] text-teal-900/30 uppercase font-black">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-orange-600 font-black">+150</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}