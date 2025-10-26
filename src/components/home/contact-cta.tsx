import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants';

export function ContactCta() {
  return (
    <section className="bg-secondary">
      <div className="container text-center py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold">Hai Domande? Contattaci!</h2>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Il nostro team è a tua completa disposizione per rispondere a ogni tua domanda e guidarti nella scelta della tua prossima auto.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/contact">
                <Mail className="mr-2 h-4 w-4" />
                Invia un messaggio
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-foreground">
            <a href={`tel:${BUSINESS_INFO.phone}`}>
                <Phone className="mr-2 h-4 w-4" />
                Chiamaci ora
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
