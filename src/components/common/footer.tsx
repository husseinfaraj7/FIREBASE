
import Link from 'next/link';
import { Car, MapPin, Phone, Mail } from 'lucide-react';
import { BUSINESS_INFO, BUSINESS_HOURS } from '@/lib/constants';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/autolist', label: 'Le Nostre Auto' },
  { href: '/about', label: 'Chi Siamo' },
  { href: '/contact', label: 'Contattaci' },
  { href: '/dashboard', label: 'Area Admin' },
];

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-headline text-xl font-bold">
              <Car className="h-7 w-7 text-primary" />
              <span>MiniCar Digital</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Qualità e passione per auto usate garantite. La tua prossima auto ti aspetta.
            </p>
            <div className="text-sm text-muted-foreground">
                <p>P.IVA: {BUSINESS_INFO.partitaIVA}</p>
                <p>C.F: {BUSINESS_INFO.codiceFiscale}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Link Utili</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Contatti</h3>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>{BUSINESS_INFO.address}</span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href={`tel:${BUSINESS_INFO.phone}`} className="hover:text-primary transition-colors">{BUSINESS_INFO.phone}</a>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-primary transition-colors">{BUSINESS_INFO.email}</a>
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Orari</h3>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              {BUSINESS_HOURS.map(item => (
                <div key={item.day} className="flex justify-between">
                  <span>{item.day}</span>
                  <span>{item.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Studio Faraj. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}
