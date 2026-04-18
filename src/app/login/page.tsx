"use client";

import { useState } from "react";
import { Film, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. ยืนยันตัวตนกับ Supabase จริงๆ
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("เข้าสู่ระบบไม่สำเร็จ: " + error.message);
      } else {
        // 2. สั่งรีเฟรชระบบเพื่อให้ Navbar และส่วนอื่นๆ รู้ว่ามี User มาแล้ว
        router.refresh(); 
        // 3. ส่งกลับหน้าหลัก
        router.push("/");
      }
    } catch (err: any) {
      alert("เกิดข้อผิดพลาด: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF9F0] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-10 border border-cream-200">
        <Link href="/" className="flex items-center gap-2 text-teal-800 text-sm mb-8 hover:text-orange-500 transition-all">
          <ArrowLeft size={16} /> กลับหน้าหลัก
        </Link>

        <div className="flex flex-col items-center mb-8">
          <div className="bg-teal-900 p-3 rounded-2xl text-white mb-4">
            <Film size={32} />
          </div>
          <h1 className="font-heading text-3xl font-bold text-teal-900">Welcome Back</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-teal-900 mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:border-orange-500 bg-cream-50 outline-none"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-teal-900 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:border-orange-500 bg-cream-50 outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-teal-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-all disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  );
}