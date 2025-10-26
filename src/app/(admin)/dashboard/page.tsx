'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Car, DollarSign, MessageSquare, Users, Loader2 } from 'lucide-react';
import { useUser } from '@/firebase'; // assuming your custom hook
import { Button } from '@/components/ui/button';

const stats = [
  {
    title: 'Auto in Vendita',
    value: '12',
    icon: Car,
    change: '+2',
    changeType: 'increase',
    description: 'Numero totale di auto attualmente in vendita.',
  },
  {
    title: 'Valore Inventario',
    value: '€487.500',
    icon: DollarSign,
    change: '+€50k',
    changeType: 'increase',
    description: 'Valore complessivo dell’inventario auto.',
  },
  {
    title: 'Messaggi Nuovi',
    value: '3',
    icon: MessageSquare,
    change: '1 in più di ieri',
    changeType: 'increase',
    description: 'Messaggi ricevuti nelle ultime 24 ore.',
  },
  {
    title: 'Visitatori Unici (30gg)',
    value: '1.250',
    icon: Users,
    change: '-5%',
    changeType: 'decrease',
    description: 'Numero di visitatori unici negli ultimi 30 giorni.',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClaimsLoading, setIsClaimsLoading] = useState(true);

  // --- Fetch admin claim ---
  useEffect(() => {
    let mounted = true;
    const checkClaims = async () => {
      if (user) {
        try {
          const token = await user.getIdTokenResult(true);
          if (mounted) setIsAdmin(!!token.claims.admin);
        } catch (err) {
          console.error('Error fetching token claims:', err);
          if (mounted) setIsAdmin(false);
        }
      }
      if (mounted) setIsClaimsLoading(false);
    };
    checkClaims();
    return () => { mounted = false };
  }, [user]);

  const isLoading = isUserLoading || isClaimsLoading;

  // --- Redirect logic ---
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace(`/login?from=${pathname}`);
      } else if (user && !isAdmin) {
        router.replace('/');
      }
    }
  }, [user, isAdmin, isLoading, pathname, router]);

  // --- Show loading state ---
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Verifica delle credenziali amministratore...</p>
        </div>
      </div>
    );
  }

  // --- Block render if unauthorized ---
  if (!user || !isAdmin) return null;

  // --- Main content ---
  return (
    <main
      className="min-h-screen px-4 py-8"
      role="main"
      aria-labelledby="dashboard-title"
    >
      <header className="mb-6">
        <h1 id="dashboard-title" className="text-3xl font-bold">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Panoramica delle metriche e attività recenti.
        </p>
      </header>

      {/* Stats Section */}
      <section
        aria-label="Statistiche principali"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <Card
            key={stat.title}
            role="region"
            aria-labelledby={`stat-${stat.title.replace(/\s+/g, '-')}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                id={`stat-${stat.title.replace(/\s+/g, '-')}`}
                className="text-sm font-medium"
              >
                {stat.title}
              </CardTitle>
              <stat.icon
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs ${
                  stat.changeType === 'decrease'
                    ? 'text-destructive'
                    : 'text-muted-foreground'
                }`}
              >
                {stat.change} rispetto a ieri
              </p>
              <p className="sr-only">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Recent Activity Section */}
      <section
        aria-label="Attività recenti"
        className="mt-8 grid gap-8 md:grid-cols-2"
      >
        {/* Recent Cars Card */}
        <Card role="region" aria-labelledby="recent-cars-title">
          <CardHeader>
            <h2 id="recent-cars-title" className="text-lg font-semibold">
              Auto Aggiunte di Recente
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Tabella o lista delle auto recenti qui.
            </p>
          </CardContent>
        </Card>

        {/* Recent Messages Card */}
        <Card role="region" aria-labelledby="recent-messages-title">
          <CardHeader>
            <h2 id="recent-messages-title" className="text-lg font-semibold">
              Ultimi Messaggi
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Lista degli ultimi messaggi qui.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
