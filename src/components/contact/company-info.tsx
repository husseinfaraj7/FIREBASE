import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BUSINESS_INFO, BUSINESS_HOURS } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function CompanyInfo() {
  const contactMethods = [
    { icon: Phone, label: "Telefono", value: BUSINESS_INFO.phone, href: `tel:${BUSINESS_INFO.phone}` },
    { icon: Mail, label: "Email", value: BUSINESS_INFO.email, href: `mailto:${BUSINESS_INFO.email}` },
    { icon: MapPin, label: "Indirizzo", value: BUSINESS_INFO.address },
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Informazioni di Contatto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contactMethods.map(method => (
              <div key={method.label} className="flex items-start gap-4">
                <method.icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">{method.label}</h4>
                  {method.href ? (
                    <a href={method.href} className="text-muted-foreground hover:text-primary transition-colors">{method.value}</a>
                  ) : (
                    <p className="text-muted-foreground">{method.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>Orari di Apertura</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              {BUSINESS_HOURS.map(item => (
                <div key={item.day} className="flex justify-between">
                  <span>{item.day}</span>
                  <span className="font-medium text-foreground">{item.hours}</span>
                </div>
              ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
