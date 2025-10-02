'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Folder, LineChart, Mail } from "lucide-react";

type Stats = {
  products: number;
  categories: number;
  articles: number;
  inquiries: number;
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/stats');
        if (!response.ok) throw new Error('Gagal memuat data');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statItems = [
    {
      title: "Produk Aktif",
      count: stats?.products,
      icon: <Package className="h-4 w-4 text-muted-foreground" />,
      link: "/admin/products"
    },
    {
      title: "Kategori",
      count: stats?.categories,
      icon: <Folder className="h-4 w-4 text-muted-foreground" />,
      link: "/admin/categories"
    },
    {
      title: "Artikel Terbit",
      count: stats?.articles,
      icon: <LineChart className="h-4 w-4 text-muted-foreground" />,
      link: "/admin/articles"
    },
    {
      title: "Pesan Baru",
      count: stats?.inquiries,
      icon: <Mail className="h-4 w-4 text-muted-foreground" />,
      link: "/admin/inquiries"
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali, {session?.user?.name || 'Admin'}! Berikut ringkasan aktivitas website Anda.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          statItems.map((item) => (
            <Link href={item.link} key={item.title}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                  {item.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.count ?? 0}</div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

    </div>
  );
}
