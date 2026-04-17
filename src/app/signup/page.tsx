"use client";
import { useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { ArrowLeft, UserPlus, User, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      alert("เกิดข้อผิดพลาด: " + authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ username: username })
        .eq("id", data.user.id);

      if (profileError) console.error(profileError.message);
      
      alert("สมัครสมาชิกสำเร็จ!");
      window.location.href = "/profile";
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDF9F0] flex items-center justify-center p-6 font-body">
      
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 border border-cream-100">
        
        <Link href="/" className="flex items-center gap-2 text-[#2D433D]/60 text-sm mb-8 hover:text-[#2D433D] transition-all">
          <ArrowLeft size={16} /> <span className="font-medium">Back to home</span>
        </Link>

        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#E98D4D] p-4 rounded-2xl text-white mb-6 shadow-sm">
            <UserPlus size={32} />
          </div>
          <h1 className="font-heading text-4xl font-bold text-[#0F2922]">Join Nostalgia</h1>
          <p className="text-[#2D433D]/50 text-sm text-center mt-3">เริ่มสะสมความทรงจำและแต้มเมืองรองไปกับเรา</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0F2922] ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#F2EDE4] focus:border-[#E98D4D] focus:ring-4 focus:ring-[#E98D4D]/5 outline-none bg-[#FDFBF7] transition-all text-[#0F2922]"
                placeholder="ชื่อเรียกของคุณ"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0F2922] ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#F2EDE4] focus:border-[#E98D4D] focus:ring-4 focus:ring-[#E98D4D]/5 outline-none bg-[#FDFBF7] transition-all text-[#0F2922]"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0F2922] ml-1">Create Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#F2EDE4] focus:border-[#E98D4D] focus:ring-4 focus:ring-[#E98D4D]/5 outline-none bg-[#FDFBF7] transition-all text-[#0F2922]"
                placeholder="At least 6 characters"
                required
              />
            </div>
          </div>
          
          <button 
            disabled={loading}
            className="w-full bg-[#0F2922] text-[#FDF9F0] py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-[#163a30] transition-all disabled:opacity-50 mt-4 active:scale-[0.98]"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#2D433D]/60 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="text-[#E98D4D] font-bold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}