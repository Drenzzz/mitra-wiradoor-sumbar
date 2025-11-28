"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const formSchema = z
  .object({
    password: z.string().min(8, { message: "Password baru minimal 8 karakter." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok.",
    path: ["confirmPassword"],
  });

export default function ChangePasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.promise(
      fetch("/api/user/settings/confirm-password-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: values.password }),
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Gagal mengubah password.");
        }
        return res.json();
      }),
      {
        loading: "Menyimpan password baru...",
        success: () => {
          setTimeout(() => router.push("/login"), 2000);
          return "Password berhasil diubah! Silakan login kembali.";
        },
        error: (err: Error) => err.message,
      }
    );
  };

  return (
    <AuroraBackground>
      <motion.div initial={{ opacity: 0.0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }} className="w-full max-w-md mx-auto relative z-10">
        <Card className="w-full bg-zinc-900/80 border-zinc-700 text-white shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Ubah Password</CardTitle>
            <CardDescription className="text-zinc-400 pt-2">Masukkan password baru Anda.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password Baru</Label>
                <Input id="password" type="password" {...register("password")} className="bg-zinc-800/50 border-zinc-700 text-white focus:ring-offset-zinc-900" />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                <Input id="confirmPassword" type="password" {...register("confirmPassword")} className="bg-zinc-800/50 border-zinc-700 text-white focus:ring-offset-zinc-900" />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-4">
              <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Password Baru"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </AuroraBackground>
  );
}
