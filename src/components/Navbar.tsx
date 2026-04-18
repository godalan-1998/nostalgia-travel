"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Ticket, Map as MapIcon, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client"; 

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getInitialUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getInitialUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (_event === 'SIGNED_IN') router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
    router.push("/");
    router.refresh(); 
  };

  return (
    <header className="sticky top-0 z-50 border-b border-cream-200/70 bg-cream-50/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        
        {/* Logo - ใช้ Font Heading เดิม */}
        <Link href="/" className="group inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition hover:bg-cream-100">
          <span className="grid size-8 place-items-center rounded-full bg-teal-900 text-cream-50 shadow-premium">
            <Ticket className="size-4" />
          </span>
          <span className="font-heading text-xl font-semibold text-teal-900">Nostalgia</span>
        </Link>

        {/* Desktop Nav - ใช้ Font เดิม (text-sm font-medium) */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/#movies" className="text-sm font-medium text-teal-900/60 hover:text-teal-900 transition-colors">
            Movies
          </Link>
          
          {/* 🟢 เพิ่มเมนู Map ตรงนี้ */}
          <Link href="/map" className="flex items-center gap-1.5 text-sm font-medium text-teal-900/60 hover:text-orange-500 transition-colors">
            <MapIcon size={16} /> Map
          </Link>

          <Link href="/#secondary-cities" className="text-sm font-medium text-teal-900/60 hover:text-teal-900 transition-colors">
            Cities
          </Link>

          <div className="h-6 w-px bg-cream-200 mx-2" />

          {/* สลับปุ่มตามสถานะ User (ดีไซน์เดิม) */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link 
                href="/profile" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-teal-900 px-5 py-2 text-sm font-bold text-white shadow-premium transition hover:bg-teal-800"
              >
                <User size={16} /> My Profile
              </Link>
              <button 
                onClick={handleLogout} 
                className="p-2 text-teal-900/40 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-3 py-2 text-sm font-bold text-teal-900 hover:text-orange-600 transition-colors">
                Login
              </Link>
              <Link 
                href="/signup" 
                className="rounded-full bg-orange-500 px-5 py-2 text-sm font-bold text-white shadow-premium hover:bg-orange-600 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-teal-900 hover:bg-cream-100 rounded-full transition-colors" 
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu (คง Font และสไตล์เดิม) */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }} 
            className="md:hidden bg-white border-t p-6 shadow-xl"
          >
            <div className="flex flex-col gap-4">
              <Link href="/#movies" onClick={() => setOpen(false)} className="font-medium text-teal-900">Movies</Link>
              <Link href="/map" onClick={() => setOpen(false)} className="font-medium text-orange-500">Map</Link>
              <Link href="/#secondary-cities" onClick={() => setOpen(false)} className="font-medium text-teal-900">Cities</Link>
              <hr className="border-cream-100" />
              {user ? (
                <div className="flex flex-col gap-3">
                  <Link href="/profile" target="_blank" onClick={() => setOpen(false)} className="bg-teal-900 text-white p-4 rounded-2xl text-center font-bold shadow-lg">
                    My Profile
                  </Link>
                  <button onClick={handleLogout} className="text-red-500 font-bold p-2">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/login" onClick={() => setOpen(false)} className="text-teal-900 p-4 rounded-2xl text-center font-bold border border-cream-200">
                    Login
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="bg-orange-500 text-white p-4 rounded-2xl text-center font-bold shadow-lg">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}