"use client";

import { useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { Navbar } from "@/components/Navbar";
import { MapPin, Navigation, CheckCircle2, Trophy, Camera, Image as ImageIcon } from "lucide-react";

export default function CheckinPage() {
  const [loading, setLoading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const supabase = createClient();


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // สร้าง URL จำลองเพื่อโชว์รูปตัวอย่าง
    }
  };

  const handleCheckIn = async () => {
    if (!selectedFile) {
      alert("กรุณาถ่ายรูปหรือเลือกรูปภาพเพื่อยืนยันการเช็คอินก่อนครับ 📸");
      return;
    }

    setLoading(true);

    try {
  
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        alert("กรุณาล็อกอินก่อนทำการเช็คอินครับ");
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('checkin-images')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

  
      const { data: { publicUrl } } = supabase
        .storage
        .from('checkin-images')
        .getPublicUrl(fileName);

     
      const { error: dbError } = await supabase.from("check_ins").insert([
        { 
          user_id: userId, 
          location_id: 6, 
          user_image_url: publicUrl 
        }
      ]);

      if (dbError) throw dbError;

     
      const { data: profile } = await supabase
        .from("profiles")
        .select("points")
        .eq("id", userId)
        .single();

      const newPoints = (profile?.points || 0) + 150;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ points: newPoints })
        .eq("id", userId);

      if (updateError) throw updateError;


      setCheckedIn(true);
      alert("เช็คอินสำเร็จ! คุณได้รับ +150 แต้มสะสม 🏆");

    } catch (error: any) {
      console.error("Error:", error.message);
      alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDF9F0]">
      <Navbar />
      
      <div className="max-w-md mx-auto p-6 pt-12">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-[#F2EDE4] text-center">
          <div className="size-20 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-600 mx-auto mb-6">
            <MapPin size={40} />
          </div>
          
          <h1 className="font-heading text-2xl font-bold text-[#0F2922]">Check-in Location</h1>
          <p className="text-[#2D433D]/60 mt-2 mb-8 text-sm">ยืนยันการมาเยือน "ดอยเสมอดาว" เพื่อรับแต้ม</p>

          {checkedIn ? (
            <div className="bg-green-50 p-6 rounded-2xl border border-green-100 animate-in zoom-in duration-300">
              <CheckCircle2 size={48} className="text-green-500 mx-auto mb-3" />
              <p className="font-bold text-green-700 text-lg">เช็คอินสำเร็จเรียบร้อย!</p>
              <div className="mt-4 flex items-center justify-center gap-2 bg-white py-3 px-4 rounded-xl shadow-sm text-[#0F2922] font-bold">
                <Trophy size={18} className="text-orange-500" /> +150 Points Added
              </div>
              <button 
                onClick={() => window.location.href = '/profile'}
                className="mt-6 text-sm font-bold text-teal-900 underline"
              >
                ดูคะแนนสะสมใน Profile ของฉัน
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-left text-xs font-black text-teal-900/40 uppercase tracking-widest">
                  Proof of Visit (Required)
                </label>
                <div className="relative group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="hidden" 
                    id="camera-upload"
                  />
                  <label 
                    htmlFor="camera-upload" 
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 rounded-[2rem] cursor-pointer bg-gray-50 hover:bg-cream-100 transition-all overflow-hidden"
                  >
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Camera className="text-gray-400 mb-2 size-8" />
                        <span className="text-xs font-bold text-gray-500">กดเพื่อถ่ายรูปหรือเลือกไฟล์</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <button
                onClick={handleCheckIn}
                disabled={loading}
                className="w-full bg-[#0F2922] text-white py-5 rounded-2xl font-bold text-lg shadow-lg hover:bg-[#163a30] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:bg-gray-400"
              >
                {loading ? (
                  <>บันทึกข้อมูล...</>
                ) : (
                  <>
                    <Navigation size={20} />
                    Confirm Check-in
                  </>
                )}
              </button>
            </div>
          )}

          <p className="mt-8 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Verified by Nostalgia GPS Service
          </p>
        </div>
      </div>
    </main>
  );
}