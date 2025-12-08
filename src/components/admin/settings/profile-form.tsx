"use client";

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const profileFormSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { data: session, status, update } = useSession();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    values: {
      name: session?.user?.name ?? "",
    },
    disabled: status === "loading",
  });

  const onSubmit = async (data: ProfileFormValues) => {
    toast.promise(
      fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name }),
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Gagal memperbarui profil");
        }
        return res.json();
      }),
      {
        loading: "Menyimpan perubahan...",
        success: async () => {
          await update();
          return "Profil berhasil diperbarui!";
        },
        error: (err: Error) => err.message,
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil Pengguna</CardTitle>
        <CardDescription>Perbarui informasi profil Anda di sini. Email tidak dapat diubah.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label>Nama</Label>
                  <FormControl>
                    <Input placeholder="Nama Lengkap Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={session?.user?.email || ""} disabled className="cursor-not-allowed" />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
              {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
