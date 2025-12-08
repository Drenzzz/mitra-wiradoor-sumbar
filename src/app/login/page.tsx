"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginImage from "@/assets/foto_mitra_usaha.jpg";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Email atau password salah. Silakan coba lagi.");
    } else {
      router.push("/admin");
    }
  };

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4 w-full h-full"
      >
        <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl grid md:grid-cols-2 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-60">
          <div className="relative hidden md:block">
            <Image src={LoginImage} alt="Elegant interior with a modern door" layout="fill" objectFit="cover" className="opacity-90" />
            <div className="absolute inset-0 bg-black/60 flex items-end p-8">
              <div className="text-white"> 
                <p className="text-xl italic">&quot;temp quotes wak.&quot;</p>
                <p className="mt-4 font-semibold">- Manajemen WiraDoor</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-8 bg-zinc-900/80">
            <Card className="w-full max-w-md bg-transparent border-0 text-white shadow-none">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold">Selamat Datang Kembali</CardTitle>
                <CardDescription className="text-zinc-400 pt-2">Masuk ke Panel Admin Wiradoor Sumbar</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-zinc-800/50 border-zinc-700 text-white focus:ring-offset-zinc-900" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-zinc-800/50 border-zinc-700 text-white focus:ring-offset-zinc-900" />
                    <Button variant="link" asChild className="p-0 h-auto text-xs text-zinc-400">
                      <Link href="/forgot-password">Lupa Password?</Link>
                    </Button>
                  </div>
                  {error && <p className="text-sm text-red-500 text-center pt-2">{error}</p>}
                </CardContent>
                <CardFooter className="flex flex-col gap-4 pt-4">
                  <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200" disabled={isLoading}>
                    {isLoading ? "Memverifikasi..." : "Login"}
                  </Button>
                  <Button variant="link" asChild className="text-zinc-400">
                    <Link href="/">Kembali ke Halaman Utama</Link>
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
