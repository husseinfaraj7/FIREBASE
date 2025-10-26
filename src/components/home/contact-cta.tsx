import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants';

export function ContactCta() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/80" aria-hidden="true" />
      <div className="container relative py-16 md:py-24 text-center text-primary-foreground">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Hai Domande? Contattaci!</h2>
          <p className="text-base md:text-lg text-primary-foreground/80">
            Il nostro team è a tua completa disposizione per rispondere a ogni tua domanda e guidarti nella scelta della tua prossima auto.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white text-foreground hover:bg-white/90 shadow-lg"
            >
              <Link href="/contact">
                <Mail className="mr-2 h-4 w-4" />
                Invia un messaggio
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/70 text-white hover:bg-white/10"
            >
              <a href={`tel:${BUSINESS_INFO.phone}`}>
                <Phone className="mr-2 h-4 w-4" />
                Chiamaci ora
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
