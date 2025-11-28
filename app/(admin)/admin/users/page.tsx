"use client";

import { useState } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

import { PageWrapper } from "@/components/admin/page-wrapper";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useUserManagement } from "@/hooks/use-user-management";
import { UserTable } from "@/components/admin/users/user-table";
import { CreateUserDialog } from "@/components/admin/users/create-user-dialog";
import { EditUserDialog } from "@/components/admin/users/edit-user-dialog";
import { ConfirmationDialog } from "@/components/admin/shared/confirmation-dialog";
import { ClientUser } from "@/types";

export default function UserManagementPage() {
  const { data: session } = useSession();

  const { users, totalCount, isLoading, searchTerm, setSearchTerm, currentPage, setCurrentPage, rowsPerPage, fetchUsers } = useUserManagement();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ClientUser | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  if (session && session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const handleEditClick = (user: ClientUser) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (user: ClientUser) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    setIsActionLoading(true);
    toast.promise(fetch(`/api/users/${selectedUser.id}`, { method: "DELETE" }), {
      loading: `Menghapus ${selectedUser.name}...`,
      success: () => {
        fetchUsers();
        setIsDeleteOpen(false);
        setSelectedUser(null);
        return "Pengguna berhasil dihapus!";
      },
      error: (err: any) => {
        return err.json().then((json: any) => json.error || "Gagal menghapus pengguna.");
      },
      finally: () => setIsActionLoading(false),
    });
  };

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <PageWrapper>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
          <p className="text-muted-foreground">Kelola akun staf yang memiliki akses ke panel admin ini.</p>
        </div>
        <CreateUserDialog onSuccess={fetchUsers} />
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Daftar Pengguna Staf</CardTitle>
          <CardDescription>Total {totalCount} pengguna staf ditemukan.</CardDescription>
          <div className="pt-4">
            <Input placeholder="Cari berdasarkan nama atau email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-1/2" />
          </div>
        </CardHeader>
        <CardContent>
          <UserTable users={users} isLoading={isLoading} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
        </CardContent>
        {totalPages > 1 && (
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
            </div>
            <div className="flex items-center space-x-2 ml-auto">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage <= 1 || isLoading}>
                Sebelumnya
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage >= totalPages || isLoading}>
                Selanjutnya
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      <EditUserDialog isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} user={selectedUser} onSuccess={fetchUsers} />

      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title={`Hapus Pengguna "${selectedUser?.name}"?`}
        description="Aksi ini tidak dapat dibatalkan. Akun ini akan dihapus secara permanen."
        variant="destructive"
        isLoading={isActionLoading}
      />
    </PageWrapper>
  );
}
