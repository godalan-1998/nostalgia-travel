"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import { Navbar } from "@/components/Navbar";
import { MapPin, Navigation, CheckCircle2, Trophy, Camera, Loader2, Clock, RotateCcw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckinPage() {
  const [loading, setLoading] = useState(false);
  const [initialChecking, setInitialChecking] = useState(true);
  const [cooldown, setCooldown] = useState({ active: false, msg: "" });
  const [checkedIn, setCheckedIn] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [gainedPoints, setGainedPoints] = useState(0);

  const supabase = createClient();
  const currentLocationId = 6; // ดอยเสมอดาว

  useEffect(() => {
    async function checkExistingStatus() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setInitialChecking(false);
        return;
      }

      const { data: history } = await supabase
        .from("check_ins")
        .select("created_at")
        .eq("user_id", session.user.id)
        .eq("location_id", currentLocationId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (history && history.length > 0) {
        const lastDate = new Date(history[0].created_at);
        const nextDate = new Date(lastDate.getTime() + (7 * 24 * 60 * 60 * 1000));
        const now = new Date();

        if (now < nextDate) {
          const diff = nextDate.getTime() - now.getTime();
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          setCooldown({ active: true, msg: `Available in ${days}d ${hours}h` });
        }
      }
      setInitialChecking(false);
    }
    checkExistingStatus();
  }, [supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (cooldown.active) return;
    const file = e.target.files?.[0];
    if (file) {
      // ตรวจสอบขนาดไฟล์ (ไม่ควรเกิน 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size is too large. Please select an image under 5MB.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleCheckIn = async () => {
    if (cooldown.active || !selectedFile) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Please login to continue");

      // 1. อัปโหลดรูปภาพเข้าโฟลเดอร์ checkins/
      const fileName = `checkins/${session.user.id}-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('checkin-images')
        .upload(fileName, selectedFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('checkin-images')
        .getPublicUrl(fileName);

      // 2. บันทึกข้อมูลลง Table
      const { error: dbError } = await supabase.from("check_ins").insert([
        { user_id: session.user.id, location_id: currentLocationId, user_image_url: publicUrl }
      ]);

      if (dbError) throw dbError;

      // 3. คำนวณแต้ม
      const { count } = await supabase.from("check_ins").select("*", { count: 'exact', head: true })
        .eq("user_id", session.user.id).eq("location_id", currentLocationId);

      const points = (count || 0) === 1 ? 500 : (count || 0) === 2 ? 100 : 50;
      setGainedPoints(points);
      setCheckedIn(true);
      setCooldown({ active: true, msg: "Checked in today" });

    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialChecking) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF9F0]">
      <Loader2 className="animate-spin text-[#0F2922]" size={32} />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FDF9F0] pb-20">
      <Navbar />
      <div className="max-w-md mx-auto p-6 pt-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-10 shadow-2xl border border-[#F2EDE4] text-center relative overflow-hidden"
        >
          {/* Decorative background circle */}
          <div className="absolute -top-10 -right-10 size-40 bg-orange-50 rounded-full blur-3xl opacity-50" />

          <div className={`size-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner ${cooldown.active ? 'bg-gray-100 text-gray-400' : 'bg-orange-100 text-orange-600'}`}>
            <MapPin size={48} />
          </div>
          
          <h1 className="text-3xl font-black text-[#0F2922] tracking-tighter italic uppercase">Verify Spot</h1>
          <p className="text-orange-600 font-bold mt-2 mb-10 text-sm tracking-widest uppercase">"ดอยเสมอดาว"</p>

          <AnimatePresence mode="wait">
            {checkedIn ? (
              <motion.div 
                key="success"
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                className="bg-green-50 p-8 rounded-[2rem] border border-green-100"
              >
                <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
                <p className="font-black text-green-700 uppercase tracking-tighter text-xl italic">Check-in Success!</p>
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 flex items-center justify-center gap-3 bg-white py-4 px-6 rounded-2xl shadow-xl font-black text-teal-900 border-2 border-orange-100"
                >
                  <Trophy size={24} className="text-orange-500" /> +{gainedPoints} XP
                </motion.div>
              </motion.div>
            ) : (
              <motion.div key="form" className="space-y-8">
                <div className="relative group">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="cam-input" disabled={cooldown.active} />
                  
                  {previewUrl && (
                    <button 
                      onClick={resetSelection}
                      className="absolute -top-3 -right-3 size-10 bg-white shadow-xl rounded-full flex items-center justify-center text-red-500 z-10 hover:scale-110 transition-transform"
                    >
                      <X size={20} />
                    </button>
                  )}

                  <label 
                    htmlFor={cooldown.active ? "" : "cam-input"} 
                    className={`flex flex-col items-center justify-center w-full h-64 border-4 border-dashed rounded-[2.5rem] transition-all overflow-hidden ${cooldown.active ? 'bg-gray-50 border-gray-100 cursor-not-allowed' : 'bg-gray-50 border-gray-200 cursor-pointer hover:border-orange-300 hover:bg-orange-50'}`}
                  >
                    {previewUrl ? (
                      <img src={previewUrl} className="w-full h-full object-cover rounded-[2rem]" alt="Preview" />
                    ) : (
                      <div className="flex flex-col items-center text-gray-300">
                        {cooldown.active ? <Clock size={48} className="opacity-20" /> : <Camera size={48} className="group-hover:scale-110 transition-transform" />}
                        <span className="text-[10px] font-black mt-4 uppercase tracking-[0.3em]">{cooldown.active ? "LOCKED" : "Upload Evidence"}</span>
                      </div>
                    )}
                  </label>
                </div>

                <button
                  onClick={handleCheckIn}
                  disabled={loading || cooldown.active || !selectedFile}
                  className={`w-full py-6 rounded-2xl font-black text-lg shadow-2xl flex items-center justify-center gap-3 tracking-tighter uppercase transition-all active:scale-95 ${cooldown.active ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#0F2922] text-white hover:bg-orange-600 shadow-teal-900/20'}`}
                >
                  {loading ? <Loader2 className="animate-spin" /> : cooldown.active ? cooldown.msg : <><Navigation size={22} /> Log Memory</>}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Support Text */}
        <p className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.5em] text-teal-900/20">
          Nostalgia_Archive_Ref: {currentLocationId} // Verified_Only
        </p>
      </div>
    </main>
  );
}