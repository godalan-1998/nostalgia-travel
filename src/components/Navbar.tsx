"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Ticket, Film, MapPin, Users, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client"; // เช็ค path ให้ตรงนะครับ

const navItems = [
  { href: "#movies", label: "Movies", icon: Film },
  { href: "#secondary-cities", label: "Secondary Cities", icon: MapPin },
  { href: "#community", label: "Community", icon: Users },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null); // เก็บข้อมูล User ที่ล็อกอิน
  const router = useRouter();
  const supabase = createClient();


  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh(); 
  };

  return (
    <header className="sticky top-0 z-50 border-b border-cream-200/70 bg-cream-50/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="group inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition hover:bg-cream-100">
          <span className="grid size-8 place-items-center rounded-full bg-teal-900 text-cream-50 shadow-premium">
            <Ticket className="size-4" aria-hidden />
          </span>
          <span className="font-heading text-xl font-semibold tracking-tight text-teal-900">Nostalgia</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(({ href, label }) => (
            <a key={href} href={href} className="rounded-full px-4 py-2 text-sm font-medium text-teal-900/80 transition hover:bg-cream-100 hover:text-teal-900">
              {label}
            </a>
          ))}
          
          <div className="ml-4 flex items-center gap-2">
            {user ? (
            
              <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center gap-2 rounded-full bg-teal-900 px-5 py-2 text-sm font-bold text-white shadow-premium transition hover:bg-teal-800">
                  <User size={16} /> My Profile
                </Link>
              </div>
            ) : (

              <>
                <Link href="/login" className="px-4 py-2 text-sm font-bold text-teal-900 hover:text-orange-600 transition-all">Login</Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2 text-sm font-bold text-white shadow-premium transition hover:bg-orange-600">Sign Up</Link>
              </>
            )}
          </div>
        </nav>

     
        <button className="inline-flex items-center justify-center rounded-full border border-cream-200 bg-cream-50 px-3 py-2 text-teal-900 shadow-sm transition hover:bg-cream-100 md:hidden" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

    
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-cream-200/70 bg-cream-50/95 backdrop-blur md:hidden">
            <div className="mx-auto max-w-6xl px-4 py-3">
              <div className="grid gap-2">
                {navItems.map(({ href, label, icon: Icon }) => (
                  <a key={href} href={href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-teal-900 transition hover:bg-cream-100" onClick={() => setOpen(false)}>
                    <span className="grid size-9 place-items-center rounded-xl bg-cream-100 text-orange-600"><Icon className="size-4" /></span>
                    {label}
                  </a>
                ))}
                
                <hr className="my-2 border-cream-200" />  
                {user ? (
                  <button onClick={() => { setOpen(false); handleLogout(); }} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 py-3 text-sm font-bold text-red-500 transition hover:bg-red-100">
                    <LogOut size={16} /> Logout
                  </button>
                ) : (
                  <>
                    <button className="rounded-2xl border border-teal-900/10 py-3 text-sm font-bold text-teal-900" onClick={() => { setOpen(false); router.push("/login"); }}>Login</button>
                    <button className="rounded-2xl bg-orange-500 py-3 text-sm font-bold text-white shadow-premium" onClick={() => { setOpen(false); router.push("/signup"); }}>Sign Up</button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}