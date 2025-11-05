'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Car, DollarSign, MessageSquare, Users, Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
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
  const isLoading = isUserLoading;

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace(`/login?from=${pathname}`);
      }
    }
  }, [user, isLoading, pathname, router]);

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

  if (!user) return null;

  return (
    <main className="bg-muted/10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10">
        <header className="flex flex-col gap-4 rounded-lg border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Panoramica
            </p>
            <div>
              <h1 id="dashboard-title" className="text-3xl font-semibold tracking-tight">
                Dashboard amministratore
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Controlla rapidamente numeri, attività e messaggi recenti del tuo showroom digitale.
              </p>
            </div>
          </div>
          <Button variant="outline" className="w-full gap-2 sm:w-auto">
            Aggiorna dati
          </Button>
        </header>

        <section
          aria-label="Statistiche principali"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <Card
              key={stat.title}
              role="region"
              aria-labelledby={`stat-${stat.title.replace(/\s+/g, '-')}`}
              className="border bg-card/95 shadow-sm"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle
                  id={`stat-${stat.title.replace(/\s+/g, '-')}`}
                  className="text-sm font-medium text-muted-foreground"
                >
                  {stat.title}
                </CardTitle>
                <span className="rounded-md bg-muted px-2 py-1">
                  <stat.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold tracking-tight">{stat.value}</div>
                <p
                  className={`mt-1 text-xs font-medium ${
                    stat.changeType === 'decrease' ? 'text-destructive' : 'text-emerald-600'
                  }`}
                >
                  {stat.change} rispetto a ieri
                </p>
                <p className="mt-3 text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section
          aria-label="Attività recenti"
          className="grid gap-6 md:grid-cols-2"
        >
          <Card role="region" aria-labelledby="recent-cars-title" className="border bg-card shadow-sm">
            <CardHeader className="pb-4">
              <h2 id="recent-cars-title" className="text-lg font-semibold">
                Auto aggiunte di recente
              </h2>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Tabella o lista delle auto recenti qui.
            </CardContent>
          </Card>

          <Card role="region" aria-labelledby="recent-messages-title" className="border bg-card shadow-sm">
            <CardHeader className="pb-4">
              <h2 id="recent-messages-title" className="text-lg font-semibold">
                Ultimi messaggi
              </h2>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Lista degli ultimi messaggi qui.
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
