import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PageWrapper } from "@/components/admin/page-wrapper";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function UserManagementPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== 'ADMIN') {
    redirect('/admin');
  }

  return (
    <PageWrapper>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
          <p className="text-muted-foreground">
            Kelola akun staf yang memiliki akses ke panel admin ini.
          </p>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
        </CardHeader>
      </Card>
    </PageWrapper>
  );
}
