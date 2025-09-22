// app/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { MailCheck } from 'lucide-react'; // <-- Impor ikon baru

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // <-- State baru untuk UI

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal mengirim email.');
      
      // Ganti toast dengan mengubah state UI
      setIsSubmitted(true);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        className="w-full max-w-md mx-auto relative z-10" // Jangan lupa z-10
      >
        <Card className="w-full bg-zinc-900/80 border-zinc-700 text-white shadow-2xl">
          {/* Tampilan akan berubah berdasarkan state isSubmitted */}
          {isSubmitted ? (
            // Tampilan Sukses
            <div>
              <CardHeader className="text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
                  <MailCheck className="mx-auto h-16 w-16 text-green-500" />
                </motion.div>
                <CardTitle className="text-3xl font-bold pt-4">Silakan Cek Email Anda</CardTitle>
                <CardDescription className="text-zinc-400 pt-2">
                  Kami telah mengirimkan link untuk mereset password Anda ke <br />
                  <span className="font-bold text-zinc-200">{email}</span>
                </CardDescription>
              </CardHeader>
              <CardFooter>
                 <Button variant="link" asChild className="text-zinc-400 w-full">
                    <Link href="/login">Kembali ke Login</Link>
                  </Button>
              </CardFooter>
            </div>
          ) : (
            // Tampilan Form Awal
            <div>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold">Lupa Password</CardTitle>
                <CardDescription className="text-zinc-400 pt-2">
                Masukkan email Anda untuk menerima link reset password.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent>
                  <div className="space-y-2 pt-6">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-zinc-800/50 border-zinc-700 text-white focus:ring-offset-zinc-900" />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 pt-4">
                  <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200" disabled={isLoading}>
                    {isLoading ? "Mengirim..." : "Kirim Link Reset"}
                  </Button>
                  <Button variant="link" asChild className="text-zinc-400">
                    <Link href="/login">Kembali ke Login</Link>
                  </Button>
                </CardFooter>
              </form>
            </div>
          )}
        </Card>
      </motion.div>
    </AuroraBackground>
  );
}
