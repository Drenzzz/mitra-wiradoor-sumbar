// File: components/admin/sidebar.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  Home, Package, Folder, LineChart, Mail, Settings, Package2, LogOut, Moon, Sun, User,
} from 'lucide-react';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SidebarProps {
  isCollapsed: boolean;
}

export function Sidebar({ isCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const { data: session } = useSession();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/products', label: 'Produk', icon: Package },
    { href: '/admin/categories', label: 'Kategori', icon: Folder },
    { href: '/admin/articles', label: 'Artikel', icon: LineChart },
    { href: '/admin/inquiries', label: 'Pesan Masuk', icon: Mail },
  ];

  const NavLink = ({ href, icon: Icon, label }: any) => {
    const isActive = pathname.startsWith(href) && (href !== '/admin' || pathname === '/admin');
    if (isCollapsed) {
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={href}
                className={cn(
                  'flex h-10 w-10 w-full items-center justify-center rounded-lg transition-colors hover:text-foreground',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return (
      <Link
        href={href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
          isActive
            ? 'bg-sidebar-primary text-sidebar-primary-foreground font-semibold '
            : 'text-muted-foreground'
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    );
  };

  return (
    <div
      className={cn(
        'flex h-full max-h-screen flex-col gap-2 bg-background border-r transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div
        className={cn(
          'flex h-14 items-center border-b px-4',
          isCollapsed && 'justify-center px-0'
        )}
      >
        <Link
          href="/admin"
          className='flex items-center gap-2 font-semibold'
        >
          <Package2 className="h-6 w-6" />
          {!isCollapsed && <span className="">Wiradoor Admin</span>}
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav
          className={cn(
            'grid items-start gap-1',
            isCollapsed ? 'px-2' : 'px-4'
          )}
        >
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
      </div>

      {/* Bagian Bawah: Profil Pengguna dengan Jarak Tambahan */}
      <div className="mt-auto border-t p-2">
         {/* Menambahkan mb-2 untuk memberi jarak ekstra di bawah */}
        <div className="mb-2">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                variant="ghost"
                className={cn(
                    'w-full justify-start gap-2 h-auto py-2',
                    isCollapsed && 'justify-center'
                )}
                >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
                    <User className="h-4 w-4" />
                </div>
                {!isCollapsed && (
                    <div className="text-left grow-0 min-w-0">
                    <p className="text-sm font-medium leading-none truncate">
                        {session?.user?.name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                        {session?.user?.email}
                    </p>
                    </div>
                )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="mb-2 w-56">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light Mode</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark Mode</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/admin/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Pengaturan</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
