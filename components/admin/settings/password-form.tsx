'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, { message: "Password saat ini wajib diisi." }),
    newPassword: z.string().min(8, { message: "Password baru minimal 8 karakter." }),
})

type PasswordFormValues = z.infer<typeof passwordFormSchema>

export function PasswordForm() {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  })

  const onSubmit = async (data: PasswordFormValues) => {
    toast.promise(
      fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Gagal memperbarui password");
        }
        return res.json();
      }),
      {
        loading: "Memperbarui password...",
        success: () => {
          form.reset();
          return "Password berhasil diperbarui!";
        },
        error: (err: Error) => err.message,
      }
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ganti Password</CardTitle>
        <CardDescription>
          Pastikan Anda menggunakan password yang kuat untuk menjaga keamanan akun.
        </CardDescription>
      </CardHeader>
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                        <FormItem>
                            <Label>Password Saat Ini</Label>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <Label>Password Baru</Label>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Menyimpan..." : "Ganti Password"}
                </Button>
            </CardFooter>
        </form>
       </Form>
    </Card>
  )
}
