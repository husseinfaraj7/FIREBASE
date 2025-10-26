import { testimonials } from '@/lib/data';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star } from 'lucide-react';

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
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
                  <div className="p-1 h-full">
                    <Card className="h-full flex flex-col">
                      <CardContent className="flex flex-col items-center text-center justify-center flex-grow p-6">
                        {image && (
                          <Image
                            src={image.imageUrl}
                            alt={testimonial.name}
                            data-ai-hint={image.imageHint}
                            width={80}
                            height={80}
                            className="rounded-full mb-4"
                          />
                        )}
                        <p className="text-muted-foreground mb-4 flex-grow">"{testimonial.review}"</p>
                        <div className="flex justify-center mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-accent fill-accent' : 'text-muted-foreground/30'}`} />
                            ))}
                        </div>
                        <p className="font-semibold">{testimonial.name}</p>
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
