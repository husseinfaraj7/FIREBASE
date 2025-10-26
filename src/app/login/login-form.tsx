'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Loader2, Car } from 'lucide-react';

import { useAuth, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const loginSchema = z.object({
  email: z.string().email("Inserisci un'email valida."),
  password: z.string().min(6, 'La password deve contenere almeno 6 caratteri.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') || '/dashboard';

  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { isSubmitting } = form.formState;

  // Automatically redirect if already logged in
  useEffect(() => {
    const checkUserRole = async () => {
      if (isUserLoading) return;
      if (!user) return;

      const token = await user.getIdTokenResult();
      const isAdmin = token.claims.admin === true;

      if (isAdmin) {
        router.replace('/dashboard');
      } else {
        router.replace('/');
      }
    };

    checkUserRole();
  }, [user, isUserLoading, router]);

  const handleLogin = async (data: LoginFormValues) => {
    if (!auth) return;
    setAuthError(null);

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      const currentUser = auth.currentUser;
      const token = await currentUser?.getIdTokenResult(true);

      if (token?.claims.admin) {
        toast({
          title: 'Accesso effettuato',
          description: "Bentornato nell'area di amministrazione.",
        });
        router.push(redirectTo);
      } else {
        toast({
          title: 'Accesso negato',
          description: 'Non hai i permessi per accedere all’area amministratore.',
          variant: 'destructive',
        });
        await auth.signOut(); // Sign out non-admin user
        router.push('/');
      }
    } catch (err: any) {
      const code = err.code;
      const message =
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential'
          ? "Credenziali non valide. Controlla email e password."
          : "Si è verificato un errore durante l'accesso. Riprova.";
      setAuthError(message);
    }
  };

  if (isUserLoading || user) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-secondary"
        role="status"
        aria-live="polite"
        aria-label="Caricamento in corso"
      >
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary py-12 px-4">
      <Card className="w-full max-w-md" role="form" aria-labelledby="login-title">
        <CardHeader className="text-center">
          <div
            className="flex items-center justify-center gap-2 mb-4"
            aria-hidden="true"
          >
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold font-headline">MiniCar Digital</span>
          </div>
          <CardTitle id="login-title">Accesso Area Riservata</CardTitle>
          <CardDescription>
            Inserisci le tue credenziali da amministratore.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} noValidate>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          aria-describedby="email-error"
                          placeholder="admin@minicar.it"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage id="email-error" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          autoComplete="current-password"
                          aria-describedby="password-error"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage id="password-error" />
                    </FormItem>
                  )}
                />
                {authError && (
                  <p
                    className="text-sm font-medium text-destructive"
                    role="alert"
                    aria-live="assertive"
                  >
                    {authError}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !auth}
                  aria-label="Accedi all'area riservata"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? 'Accesso in corso...' : 'Accedi'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
