"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import { Navbar } from "@/components/Navbar";
import { MapPin, Navigation, CheckCircle2, Trophy, Camera, Loader2, Clock } from "lucide-react";

export default function CheckinPage() {
  const [loading, setLoading] = useState(false);
  const [initialChecking, setInitialChecking] = useState(true); // ใช้เช็คสถานะตอนโหลดหน้า
  const [cooldown, setCooldown] = useState({ active: false, msg: "" });
  const [checkedIn, setCheckedIn] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [gainedPoints, setGainedPoints] = useState(0); 
  
  const supabase = createClient();
  const currentLocationId = 6; // ดอยเสมอดาว

  // 🟢 1. ดึงข้อมูลมาเช็คทันทีที่เปิดหน้าเว็บ (ป้องกันการกดซ้ำหลัง Refresh)
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
          
          setCooldown({ 
            active: true, 
            msg: `รออีก ${days} วัน ${hours} ชม.` 
          });
        }
      }
      setInitialChecking(false);
    }
    checkExistingStatus();
  }, [supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (cooldown.active) return; // ล็อคการเลือกรูป
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleCheckIn = async () => {
    if (cooldown.active || !selectedFile) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Please login");

      // 🟢 2. อัปโหลดรูปภาพ
      const fileName = `${session.user.id}-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('checkin-images')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('checkin-images')
        .getPublicUrl(fileName);

      // 🟢 3. บันทึกข้อมูลลง Database
      const { error: dbError } = await supabase.from("check_ins").insert([
        { user_id: session.user.id, location_id: currentLocationId, user_image_url: publicUrl }
      ]);

      if (dbError) throw dbError;

      // 🟢 4. คำนวณแต้มโชว์ (500 -> 100 -> 50)
      const { count } = await supabase.from("check_ins").select("*", { count: 'exact', head: true })
        .eq("user_id", session.user.id).eq("location_id", currentLocationId);

      setGainedPoints((count || 0) === 1 ? 500 : (count || 0) === 2 ? 100 : 50);
      setCheckedIn(true);
      setCooldown({ active: true, msg: "เช็คอินแล้ววันนี้" });

    } catch (error: any) {
      alert(error.message.includes("COOLDOWN") ? "⏳ ติดคูลดาวน์ 7 วันครับ" : error.message);
    } finally {
      setLoading(false);
    }
  };

  // ถ้ายังโหลดสถานะไม่เสร็จ ให้ขึ้น Loading ก่อน เพื่อป้องกันปุ่ม "แวบ" มาให้กด
  if (initialChecking) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF9F0]">
      <Loader2 className="animate-spin text-[#0F2922]" size={32} />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FDF9F0]">
      <Navbar />
      <div className="max-w-md mx-auto p-6 pt-12">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-[#F2EDE4] text-center">
          <div className={`size-20 rounded-3xl flex items-center justify-center mx-auto mb-6 ${cooldown.active ? 'bg-gray-100 text-gray-400' : 'bg-orange-100 text-orange-600'}`}>
            <MapPin size={40} />
          </div>
          
          <h1 className="text-2xl font-bold text-[#0F2922]">Check-in Location</h1>
          <p className="text-gray-500 mt-2 mb-8 text-sm italic">"ดอยเสมอดาว"</p>

          {checkedIn ? (
            <div className="bg-green-50 p-6 rounded-2xl border border-green-100 animate-in zoom-in duration-300">
              <CheckCircle2 size={48} className="text-green-500 mx-auto mb-3" />
              <p className="font-bold text-green-700">เช็คอินสำเร็จ!</p>
              <div className="mt-4 flex items-center justify-center gap-2 bg-white py-3 px-4 rounded-xl shadow-sm font-bold">
                <Trophy size={18} className="text-orange-500" /> +{gainedPoints} Points
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* --- โซนอัปโหลดรูป (จะ Locked ถ้าติด Cooldown) --- */}
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="cam-input" disabled={cooldown.active} />
              <label 
                htmlFor={cooldown.active ? "" : "cam-input"} 
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-[2rem] transition-all overflow-hidden ${cooldown.active ? 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-50' : 'bg-gray-50 border-gray-200 cursor-pointer hover:bg-orange-50'}`}
              >
                {previewUrl ? (
                  <img src={previewUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    {cooldown.active ? <Clock size={32} /> : <Camera size={32} />}
                    <span className="text-xs font-bold mt-2 uppercase">{cooldown.active ? "Locked" : "Snap Photo"}</span>
                  </div>
                )}
              </label>

              {/* --- ปุ่มกดยืนยัน (จะ Locked ถ้าติด Cooldown) --- */}
              <button
                onClick={handleCheckIn}
                disabled={loading || cooldown.active || !selectedFile}
                className={`w-full py-5 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all ${cooldown.active ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#0F2922] text-white hover:bg-[#163a30]'}`}
              >
                {loading ? <Loader2 className="animate-spin" /> : cooldown.active ? cooldown.msg : <><Navigation size={20} /> Confirm Check-in</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}