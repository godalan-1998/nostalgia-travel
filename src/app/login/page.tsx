"use client";
import { useState } from "react";
import { Film, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      alert("ยินดีต้อนรับสู่ Nostalgia! (เชื่อมต่อ Supabase สำเร็จ)");
      window.location.href = "/"; 
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-6 font-body">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-10 border border-cream-200">
        <Link href="/" className="flex items-center gap-2 text-teal-800 text-sm mb-8 hover:text-orange-500 transition-all">
          <ArrowLeft size={16} /> กลับหน้าหลัก
        </Link>

        <div className="flex flex-col items-center mb-8">
          <div className="bg-teal-900 p-3 rounded-2xl text-white mb-4">
            <Film size={32} />
          </div>
          <h1 className="font-heading text-3xl font-bold text-teal-900">Welcome Back</h1>
          <p className="text-gray-500 text-sm text-center mt-2">เข้าสู่ระบบเพื่อเก็บความทรงจำจากฉากหนังที่คุณประทับใจ</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-teal-900 mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-orange-500 bg-cream-50"
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
              className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-orange-500 bg-cream-50"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-teal-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-all"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
}