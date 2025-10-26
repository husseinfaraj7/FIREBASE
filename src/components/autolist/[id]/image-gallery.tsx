
'use client'

import * as React from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

type ImageGalleryProps = {
  images: string[]
  carName: string
}

export function ImageGallery({ images, carName }: ImageGalleryProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [_, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])
  
  const handleThumbClick = (index: number) => {
    api?.scrollTo(index);
  }

  const imageSources = images.length > 0 ? images.filter(img => img && (img.startsWith('http') || img.startsWith('data:'))) : [];
  if (imageSources.length === 0) {
    imageSources.push("https://picsum.photos/seed/placeholder/600/400");
  }


  return (
    <div className="space-y-4">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {imageSources.map((image, index) => (
            <CarouselItem key={index}>
              <Card className="overflow-hidden">
                <CardContent className="p-0 aspect-[4/3] relative">
                  <Image
                    src={image}
                    alt={`${carName} - foto ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
      </Carousel>
      {imageSources.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {imageSources.map((image, index) => (
              <div key={index} className={cn(
                  "aspect-square relative rounded-md overflow-hidden cursor-pointer ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  current === index + 1 ? 'ring-2 ring-primary' : ''
              )}
              onClick={() => handleThumbClick(index)}
              >
                  <Image
                      src={image}
                      alt={`Thumbnail ${carName} ${index + 1}`}
                      fill
                      className="object-cover"
                  />
              </div>
          ))}
        </div>
      )}
    </div>
  )
}

    
