"use client";

import { useState } from "react";
import { UserPlus, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client"; 

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. สมัครสมาชิกใน Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username, // เก็บชื่อผู้ใช้ลงใน Metadata
          },
        },
      });

      if (error) {
        alert("สมัครสมาชิกไม่สำเร็จ: " + error.message);
      } else {
        alert("สมัครสมาชิกสำเร็จ! กำลังพาท่านไปหน้าเข้าสู่ระบบ");
        
        // 2. ส่งไปหน้า Login ตามที่คุณต้องการ
        router.push("/login"); 
      }
    } catch (err: any) {
      alert("เกิดข้อผิดพลาด: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF9F0] flex items-center justify-center p-6 font-body">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-10 border border-cream-200">
        
        <Link href="/" className="flex items-center gap-2 text-teal-800 text-sm mb-8 hover:text-orange-500 transition-all font-bold">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="flex flex-col items-center mb-8">
          <div className="bg-orange-500 p-3 rounded-2xl text-white mb-4 shadow-lg">
            <UserPlus size={32} />
          </div>
          <h1 className="font-heading text-4xl font-bold text-teal-900">Join Nostalgia</h1>
          <p className="text-gray-500 text-sm text-center mt-2 font-medium">เริ่มสะสมความทรงจำและแต้มเมืองรองไปกับเรา</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-teal-900 mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-orange-500 bg-cream-50"
              placeholder="ชื่อเรียกของคุณ"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-teal-900 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-orange-500 bg-cream-50"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-teal-900 mb-2">Create Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-orange-500 bg-cream-50"
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-teal-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 font-medium">
            Already have an account? <Link href="/login" className="text-orange-600 font-bold hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}