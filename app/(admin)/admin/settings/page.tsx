// app/(admin)/admin/settings/page.tsx
'use client'

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const [name, setName] = useState(session?.user?.name || "")

  // Kita akan menambahkan logika untuk submit form di commit selanjutnya
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted with name:", name)
    // Logika untuk update akan ditambahkan di sini
  }
  
  // Tampilkan loading state jika sesi masih dimuat
  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-medium">Pengaturan Akun</h1>
        <p className="text-sm text-muted-foreground">
          Kelola informasi akun Anda di sini.
        </p>
      </div>
      <Separator />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Profil Pengguna</CardTitle>
            <CardDescription>
              Perbarui nama dan email Anda. Email tidak dapat diubah.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={session?.user?.email || ""} 
                disabled 
              />
            </div>
          </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Simpan Perubahan</Button>
            </CardFooter>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Ganti Password</CardTitle>
          <CardDescription>
            Pastikan Anda menggunakan password yang kuat.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Password Saat Ini</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Password Baru</Label>
            <Input id="new-password" type="password" />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit">Ganti Password</Button>
        </CardFooter>
      </Card>
    </div>
  )
}