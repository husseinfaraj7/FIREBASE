'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Car,
  LayoutDashboard,
  MessageSquare,
  LogOut,
  User,
  Loader2,
} from 'lucide-react';
import { signOut } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useAuth, useUser } from '@/firebase';

// Define admin navigation items
const adminNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/cars', label: 'Gestione Auto', icon: Car },
  { href: '/dashboard/messages', label: 'Messaggi', icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isClaimsLoading, setIsClaimsLoading] = useState(true);

  // --- Step 1: Fetch custom claims (admin) ---
  useEffect(() => {
    let isMounted = true;

    const checkClaims = async () => {
      if (user) {
        try {
          // ✅ Force refresh to ensure latest claims
          const idTokenResult = await user.getIdTokenResult(true);
          if (isMounted) {
            setIsAdmin(!!idTokenResult.claims.admin);
            console.log('Admin claim:', idTokenResult.claims.admin);
          }
        } catch (err) {
          console.error('Error checking admin claims:', err);
          if (isMounted) setIsAdmin(false);
        } finally {
          if (isMounted) setIsClaimsLoading(false);
        }
      } else {
        if (isMounted) setIsClaimsLoading(false);
      }
    };

    checkClaims();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // --- Step 2: Redirect logic (once loading finishes) ---
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace(`/login?from=${pathname}`);
    } else if (!isClaimsLoading && user && !isAdmin) {
      router.replace('/');
    }
  }, [user, isUserLoading, isAdmin, isClaimsLoading, pathname, router]);

  // --- Step 3: Sign out handler ---
  const handleSignOut = async () => {
    if (auth) await signOut(auth);
  };

  // --- Step 4: Loading state ---
  const isLoading = isUserLoading || isClaimsLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Caricamento area amministratore...</p>
        </div>
      </div>
    );
  }

  // --- Step 5: Guard ---
  if (!user || !isAdmin) return null;

  // --- Step 6: Layout rendering ---
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 font-headline text-lg font-bold text-sidebar-foreground"
              >
                <Car className="h-6 w-6 text-primary" />
                <span>MiniCar Admin</span>
              </Link>
              <SidebarTrigger className="hidden md:flex" aria-label="Apri/Chiudi menu" />
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      pathname === item.href ||
                      (item.href !== '/dashboard' && pathname.startsWith(item.href))
                    }
                  >
                    <Link href={item.href} aria-label={item.label}>
                      <item.icon aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut} aria-label="Esci">
                  <LogOut aria-hidden="true" />
                  <span>Esci</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <header
            className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6 md:px-8"
            role="banner"
          >
            <SidebarTrigger className="md:hidden" aria-label="Apri menu" />
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Profilo amministratore"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Foto profilo amministratore"
                    className="rounded-full h-6 w-6"
                  />
                ) : (
                  <User className="h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </div>
          </header>

          <main
            className="flex-1 overflow-y-auto bg-muted/20 p-4 sm:p-6 md:p-8"
            role="main"
            aria-label="Contenuto principale"
          >
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
