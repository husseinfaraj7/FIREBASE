'use client';

import { Card } from "@/components/ui/card"
import { BUSINESS_INFO } from "@/lib/constants"
import { MapPin } from "lucide-react"

export function LocationMap() {
    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(BUSINESS_INFO.address)}`;

    return (
        <section className="py-16 md:py-24">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Dove Siamo</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground flex items-center justify-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>{BUSINESS_INFO.address}</span>
                    </p>
                </div>
                <Card className="overflow-hidden rounded-3xl border border-border/60 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.4)]">
                     <div className="relative aspect-video">
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" aria-hidden="true" />
                        <iframe
                            src={embedUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Mappa della sede di MiniCar Digital"
                        ></iframe>
                    </div>
                </Card>
            </div>
        </section>
    )
}
