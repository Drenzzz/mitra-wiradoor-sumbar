'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, { message: "Password saat ini wajib diisi." }),
})

type PasswordFormValues = z.infer<typeof passwordFormSchema>

export function PasswordForm() {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { currentPassword: "" },
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
          throw new Error(errorData.error || "Gagal mengirim email verifikasi");
        }
        return res.json();
      }),
      {
        loading: "Mengirim email verifikasi...",
        success: (res) => {
          form.reset();
          return res.message;
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
          Masukkan password Anda saat ini untuk memulai proses penggantian password.
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
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Memverifikasi..." : "Kirim Link Verifikasi"}
                </Button>
            </CardFooter>
        </form>
       </Form>
    </Card>
  )
}
