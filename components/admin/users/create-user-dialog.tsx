'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { userCreateSchema, UserCreateFormInput } from '@/lib/validations/user.schema';
import { Role } from '@prisma/client';

interface CreateUserDialogProps {
  onSuccess: () => void;
}

export function CreateUserDialog({ onSuccess }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<UserCreateFormInput>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: Role.STAF,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: UserCreateFormInput) => {
    const payload: UserCreateFormInput = {
      ...values,
      role: values.role ?? Role.STAF,
    };

    toast.promise(
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then(async (res) => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Gagal menambahkan pengguna');
        }
        return res.json();
      }),
      {
        loading: 'Menambahkan pengguna...',
        success: () => {
          form.reset();
          setOpen(false);
          onSuccess();
          return 'Pengguna berhasil ditambahkan!';
        },
        error: (err: Error) => err.message,
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Staf
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Pengguna Staf Baru</DialogTitle>
          <DialogDescription>
            Isi detail untuk akun staf baru. Akun ini akan memiliki akses terbatas.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Nama Lengkap</FormLabel><FormControl><Input placeholder="cth: Staf Baru" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="cth: staf@example.com" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="Minimal 8 karakter" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="role" render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value={Role.STAF}>STAF</SelectItem>
                    <SelectItem value={Role.ADMIN}>ADMIN</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Pengguna"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
