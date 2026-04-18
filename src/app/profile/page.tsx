"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "../../utils/supabase/client";
import { Navbar } from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { Trophy, Image as ImageIcon, Loader2,Camera, Award, Pencil, Check, History, Sparkles, X, Crown, MapPin} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Configuration ---
const locationMap: Record<number, string> = {
  1: "Phuket Old Town",
  2: "Sakae Krang River",
  3: "Chiang Mai University",
  4: "Phetchaburi Old Town"
};

// --- Animation Variants ---
const containerVars = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVars = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      duration: 0.6, 
      ease: "easeOut" // แก้ตรงนี้จาก [0.22, 1, 0.36, 1] เป็น "easeOut"
    } 
  }
};

const badgeGlow = {
  initial: { opacity: 0.1, scale: 0.9 },
  animate: { opacity: [0.1, 0.4, 0.1], scale: [0.9, 1.2, 0.9], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } }
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

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
        setAvatarUrl(profileData.avatar_url ? `${profileData.avatar_url}?t=${Date.now()}` : null);
      }

      const { data: checkinData } = await supabase.from("check_ins").select("*").eq("user_id", userId).order('created_at', { ascending: false });
      setCheckins(checkinData || []);

      const { data: leaders } = await supabase.from("profiles").select("username, points, avatar_url").order("points", { ascending: false }).limit(3);
      setLeaderboard(leaders || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [supabase, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const { currentLevel, progressPercentage, ptsToNext } = useMemo(() => {
    const pts = profile?.points || 0;
    const level = Math.floor(pts / 500) + 1;
    const pointsInLevel = pts % 500;
    return { currentLevel: level, progressPercentage: (pointsInLevel / 500) * 100, ptsToNext: 500 - pointsInLevel };
  }, [profile]);

  const badgeList = useMemo(() => [
    { id: '1', name: 'First Check-in', unlocked: checkins.length > 0, icon: "🎬", desc: "บันทึกความทรงจำครั้งแรกสำเร็จ" },
    { id: '2', name: 'Movie Buff', unlocked: (profile?.points || 0) >= 500, icon: "🍿", desc: "สะสมแต้มครบ 500 คะแนน" },
    { id: '3', name: 'City Explorer', unlocked: new Set(checkins.map(c => c.location_id)).size >= 3, icon: "🌍", desc: "ไปครบ 3 สถานที่ถ่ายทำ" }
  ], [profile, checkins]);

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      const file = event.target.files[0];
      setAvatarUrl(URL.createObjectURL(file));
      setUploading(true);
      const fileName = `${profile.id}-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage.from('AVATAR').upload(`${fileName}`, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('AVATAR').getPublicUrl(`${fileName}`);
      await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", profile.id);
      await fetchData();
    } catch (error: any) { 
      alert("Error: " + error.message);
      setAvatarUrl(profile?.avatar_url); 
    } finally { setUploading(false); }
  }

  async function handleUpdateProfile() {
    try {
      await supabase.from("profiles").update({ username: editName, bio: editBio }).eq("id", profile.id);
      setProfile({ ...profile, username: editName, bio: editBio });
      setIsEditing(false);
    } catch (error) { alert("บันทึกไม่สำเร็จ"); }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#FDF9F0] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-teal-900 mb-4" size={48} />
      <span className="font-black italic text-teal-900 uppercase tracking-widest animate-pulse">Accessing Archives...</span>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FDF9F0] pb-20 font-sans selection:bg-orange-200 overflow-x-hidden">
      <Navbar />
      
      <motion.div initial="hidden" animate="visible" variants={containerVars} className="mx-auto max-w-5xl px-4 py-12">
        
        {/* --- 1. Profile Card --- */}
        <motion.div variants={itemVars} className="bg-white rounded-[4rem] shadow-xl p-10 md:p-14 border border-white mb-8 relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none select-none font-black text-[130px] italic leading-none">Profile</div>
          
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="relative shrink-0">
              <motion.div whileHover={{ scale: 1.05, rotate: 2 }} className="size-52 bg-teal-900 rounded-[3.5rem] flex items-center justify-center border-[8px] border-white shadow-2xl overflow-hidden group relative">
                {avatarUrl ? (
                  <img src={avatarUrl} key={avatarUrl} alt="Profile" className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : ( 
                  <span className="text-white text-7xl font-black italic">{profile?.username?.[0]?.toUpperCase()}</span> 
                )}
                {uploading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10"><Loader2 className="animate-spin text-white" /></div>}
              </motion.div>
              <label htmlFor="avatar-input" className="absolute bottom-2 -right-2 size-12 bg-orange-500 text-white shadow-xl rounded-2xl flex items-center justify-center cursor-pointer z-20 hover:scale-110 active:scale-90 transition-all hover:bg-orange-600">
                <Camera size={22} />
                <input id="avatar-input" type="file" className="hidden" accept="image/*" onChange={uploadAvatar} disabled={uploading} />
              </label>
            </div>

            <div className="flex-1 text-left space-y-6">
              <div className="space-y-3">
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-teal-50 text-teal-600 text-[10px] font-black uppercase tracking-widest border border-teal-100">
                  <Sparkles size={12} className="animate-pulse" /> Film Explorer
                </motion.div>
                <div className="flex items-center gap-4">
                  {isEditing ? (
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} className="text-5xl font-black text-teal-900 bg-teal-50 outline-none italic w-full max-w-sm px-2 border-b-4 border-orange-400" />
                  ) : (
                    <motion.h1 layoutId="username" className="text-6xl font-black text-teal-900 tracking-tighter italic leading-tight">{profile?.username || "Guest"}</motion.h1>
                  )}
                  <button onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)} className="size-10 flex items-center justify-center bg-teal-50 rounded-xl text-teal-600 hover:bg-teal-900 hover:text-white transition-all shadow-sm active:scale-90">
                    {isEditing ? <Check size={22} /> : <Pencil size={18} />}
                  </button>
                </div>
                {isEditing ? (
                  <input value={editBio} onChange={(e) => setEditBio(e.target.value)} className="w-full bg-transparent border-b border-teal-100 italic outline-none text-teal-800 py-1" />
                ) : (
                  <p className="text-2xl text-teal-800/50 font-medium italic">“{profile?.bio || "Exploring the nostalgia of cinema..."}”</p>
                )}
              </div>
              <div className="max-w-md bg-teal-50/50 p-6 rounded-[2.5rem] border border-teal-100 shadow-inner">
                <div className="flex justify-between items-end mb-3 text-[11px] font-black uppercase tracking-widest">
                  <span className="text-teal-900 opacity-60">Level {currentLevel}</span>
                  <span className="text-orange-600 font-bold">{ptsToNext} PTS TO LEVEL {currentLevel + 1}</span>
                </div>
                <div className="w-full h-4 bg-white rounded-full p-1 border border-teal-100 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 1.5, ease: "circOut" }} className="h-full bg-orange-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- 2. Stats Row --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div variants={itemVars} whileHover={{ y: -8 }} className="bg-orange-500 rounded-[3.5rem] p-10 text-white shadow-xl flex items-center justify-between relative overflow-hidden group">
             <Trophy className="absolute -right-4 -bottom-4 size-32 opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
             <div className="flex items-center gap-6 relative z-10 text-left">
                <div className="size-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner"><Trophy size={32} /></div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em]">Ranking Points</p>
                  <p className="text-5xl font-black italic">{(profile?.points || 0).toLocaleString()}</p>
                </div>
             </div>
             <button onClick={() => setShowHistory(true)} className="relative z-10 size-14 bg-white/20 hover:bg-white/40 rounded-2xl flex items-center justify-center transition-colors shadow-lg active:scale-90"><History size={24} /></button>
          </motion.div>

          <motion.div variants={itemVars} whileHover={{ y: -8 }} className="bg-[#0D2620] rounded-[3.5rem] p-10 text-white shadow-xl flex items-center gap-6 relative overflow-hidden group text-left">
             <Award className="absolute -right-4 -bottom-4 size-32 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
             <div className="size-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner"><Award size={32} className="text-orange-400" /></div>
             <div>
                <p className="text-[10px] font-black uppercase opacity-40 tracking-[0.2em]">Memories Logged</p>
                <p className="text-5xl font-black italic">{checkins.length} <span className="text-xl opacity-30 italic uppercase tracking-tighter">Spots</span></p>
             </div>
          </motion.div>
        </div>

        {/* --- 3. Achievement Showcase --- */}
        <motion.section variants={itemVars} className="bg-white rounded-[4rem] p-12 border border-cream-200 shadow-sm mb-12 text-left relative overflow-hidden">
          <h3 className="text-2xl font-black text-teal-900 mb-12 flex items-center gap-3 italic uppercase tracking-tighter relative z-10">
            <Award className="text-orange-500" size={28} /> Achievement Showcase
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {badgeList.map((badge) => (
              <motion.div 
                key={badge.id}
                whileHover={badge.unlocked ? { y: -10, scale: 1.02 } : {}}
                className={`p-8 rounded-[3.5rem] border-2 relative overflow-hidden transition-all duration-500 text-left ${
                  badge.unlocked ? 'border-orange-100 bg-white shadow-lg' : 'opacity-30 grayscale bg-gray-50 border-transparent'
                }`}
              >
                {badge.unlocked && <motion.div variants={badgeGlow} initial="initial" animate="animate" className="absolute inset-0 bg-orange-100/50 blur-3xl -z-10" />}
                <div className="text-6xl mb-6 relative z-10">{badge.icon}</div>
                <h4 className="text-xl font-black text-teal-900 uppercase italic mb-2 relative z-10">{badge.name}</h4>
                <p className="text-xs text-teal-800/60 font-medium leading-relaxed relative z-10 mb-6">{badge.desc}</p>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden relative z-10">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: badge.unlocked ? "100%" : "8%" }} transition={{ duration: 1.5, ease: "easeOut" }} className={`h-full ${badge.unlocked ? 'bg-orange-500' : 'bg-gray-300'}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* --- 4. Travel Gallery & Global Rank (Side-by-Side) --- */}
        <div className="grid md:grid-cols-5 gap-10">
          {/* Gallery Section */}
          <motion.section variants={itemVars} className="md:col-span-3 bg-white rounded-[3.5rem] p-10 border border-cream-200 shadow-sm min-h-[500px] text-left">
              <h3 className="text-2xl font-black text-teal-900 mb-8 flex items-center gap-3 text-left"><ImageIcon className="text-orange-500" /> Travel Gallery</h3>
              {checkins.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {checkins.map((c, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.05, rotate: 1.5 }} className="aspect-[3/4] rounded-2xl overflow-hidden border-4 border-teal-50 shadow-md cursor-pointer group relative">
                      <img src={c.user_image_url} className="size-full object-cover transition-transform group-hover:scale-110" alt="Check-in" />
                      <div className="absolute inset-0 bg-teal-950/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-4 text-center">
                         <MapPin size={22} className="text-orange-400 mb-2" />
                         <p className="text-white text-[10px] font-black uppercase tracking-widest leading-tight">{locationMap[c.location_id] || "Cinema Spot"}</p>
                         <p className="text-white/40 text-[8px] mt-2 font-bold uppercase tracking-tighter">{new Date(c.created_at).toLocaleDateString()}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center opacity-30 flex flex-col items-center justify-center h-full">
                  <ImageIcon size={64} className="mb-4 text-teal-900/20" />
                  <p className="font-bold uppercase tracking-widest text-center text-teal-900/40">No Memories Logged</p>
                </div>
              )}
          </motion.section>

          {/* Global Rank Section (ย้ายมาแทน Activity Log) */}
          <motion.section variants={itemVars} className="md:col-span-2 bg-[#0A1A16] rounded-[4rem] p-10 text-white shadow-2xl relative overflow-hidden text-left flex flex-col">
            <Crown className="absolute right-[-20px] top-[-20px] size-40 opacity-[0.03] -rotate-12 pointer-events-none" />
            <h3 className="text-xl font-black mb-10 flex items-center gap-3 italic uppercase tracking-tighter text-left">
              <Crown className="text-yellow-400 animate-pulse" size={24} /> Global Rank
            </h3>
            <div className="space-y-4 flex-1">
              {leaderboard.map((user, i) => (
                <motion.div key={i} whileHover={{ x: 8, scale: 1.02 }} className={`flex items-center justify-between p-4 rounded-full border transition-all ${
                  i === 0 ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-teal-950 border-none shadow-xl scale-105' : 
                  i === 1 ? 'bg-teal-900/60 border-teal-800 text-white/90' : 'bg-orange-500/20 border-orange-500/40 text-white/70'
                }`}>
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="font-black italic text-xl w-6 opacity-40">#{i + 1}</span>
                    <img src={user.avatar_url || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} className="size-10 rounded-full object-cover border-2 border-white/20" alt="Avatar" />
                    <span className="font-bold text-sm truncate uppercase tracking-tight">{user.username}</span>
                  </div>
                  <span className={`font-black italic text-sm pr-2 ${i === 0 ? 'text-teal-950' : 'text-orange-400'}`}>{user.points?.toLocaleString()}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 pt-6 border-t border-white/5 opacity-20 text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] italic">Archive Records // Ranking Board</p>
            </div>
          </motion.section>
        </div>
      </motion.div>

      {/* Point History Detail Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-teal-900/70 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white w-full max-w-md rounded-[3.5rem] overflow-hidden shadow-2xl text-left">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center text-teal-900 font-black italic uppercase">
                <span className="flex items-center gap-2"><History size={20} /> Point History Log</span>
                <button onClick={() => setShowHistory(false)} className="size-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-gray-400"><X size={24} /></button>
              </div>
              <div className="p-8 max-h-[450px] overflow-y-auto space-y-4 custom-scrollbar">
                {checkins.map((item: any) => (
                  <motion.div key={item.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center justify-between p-5 bg-teal-50/40 rounded-[2rem] border border-teal-100/50">
                    <div className="flex items-center gap-4 text-left">
                      <div className="size-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-xl">🎬</div>
                      <div>
                        <p className="text-sm font-bold text-teal-900">{locationMap[item.location_id] || "Spot Verified"}</p>
                        <p className="text-[10px] text-teal-900/40 uppercase font-black tracking-widest">{new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-orange-600 font-black italic">+50 XP</p>
                  </motion.div>
                ))}
                {checkins.length === 0 && <p className="text-center py-10 opacity-30 italic font-bold">No history available.</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}