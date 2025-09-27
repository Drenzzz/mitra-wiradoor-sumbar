import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "@/components/admin/settings/profile-form"
import { PasswordForm } from "@/components/admin/settings/password-form"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-medium">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">
          Kelola informasi akun dan preferensi keamanan Anda.
        </p>
      </div>
      <Separator />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="password" className="mt-6">
          <PasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
