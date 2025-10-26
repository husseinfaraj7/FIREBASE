import { testimonials } from '@/lib/data';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star } from 'lucide-react';

export function Testimonials() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/40 to-background" aria-hidden="true" />
      <div className="container relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Dicono di Noi</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            La soddisfazione dei nostri clienti è la nostra migliore pubblicità.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => {
               const image = PlaceHolderImages.find(p => p.id === testimonial.image);
              return (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="h-full p-2">
                    <Card className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/90 shadow-lg backdrop-blur">
                      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-primary/10 via-transparent to-primary/30" />
                      <CardContent className="relative flex flex-1 flex-col items-center justify-center gap-4 text-center p-8">
                        {image && (
                          <Image
                            src={image.imageUrl}
                            alt={testimonial.name}
                            data-ai-hint={image.imageHint}
                            width={72}
                            height={72}
                            className="rounded-full border-4 border-white shadow-md"
                          />
                        )}
                        <p className="text-sm text-muted-foreground">"{testimonial.review}"</p>
                        <div className="flex justify-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`} />
                            ))}
                        </div>
                        <p className="text-base font-semibold text-foreground">{testimonial.name}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex" />
          <CarouselNext className="hidden lg:flex" />
        </Carousel>
      </div>
    </section>
  );
}
