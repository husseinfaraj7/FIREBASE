
import type { Car, Testimonial, Service, Stat, TeamMember, WhyChooseUsItem } from "@/types";
import { Gauge, Users, Wrench, ShieldCheck, Star, Rocket, Handshake, Heart } from "lucide-react";

export const stats: Stat[] = [
  { value: "13+", label: "Anni di esperienza" },
  { value: "500+", label: "Auto consegnate" },
  { value: "98%", label: "Clienti soddisfatti" },
];

export const services: Service[] = [
  { 
    title: "Ispezione Completa",
    description: "Ogni auto subisce un'ispezione approfondita di oltre 100 punti da parte di meccanici certificati.",
    icon: Wrench
  },
  { 
    title: "Garanzia Inclusa",
    description: "Tutte le nostre auto sono coperte da una garanzia per darti la massima tranquillità.",
    icon: ShieldCheck
  },
  { 
    title: "Finanziamenti Flessibili",
    description: "Offriamo soluzioni di finanziamento competitive e personalizzate con approvazione rapida.",
    icon: Gauge
  },
  { 
    title: "Assistenza Post-Vendita",
    description: "Forniamo supporto continuo, consigli di manutenzione e servizi di permuta.",
    icon: Users
  },
];

export const testimonials: Testimonial[] = [
    {
        name: "Marco",
        rating: 5,
        review: "Esperienza fantastica! Ho trovato l'auto perfetta per me e il team è stato molto professionale. Consiglio vivamente MiniCar!",
        image: "testimonial-1"
    },
    {
        name: "Laura Bianchi",
        rating: 5,
        review: "Servizio eccellente dall'inizio alla fine. L'auto era esattamente come descritta e il processo di acquisto è stato semplice e veloce.",
        image: "testimonial-2"
    },
    {
        name: "Giuseppe Verdi",
        rating: 5,
        review: "Dopo aver visitato diversi concessionari, ho scelto MiniCar per la loro trasparenza e professionalità. Non potrei essere più soddisfatto!",
        image: "testimonial-3"
    },
    {
        name: "Sofia Romano",
        rating: 5,
        review: "Ottimo rapporto qualità-prezzo. Il team mi ha aiutato a trovare l'auto perfetta nel mio budget. Altamente raccomandato!",
        image: "testimonial-4"
    },
    {
        name: "Andrea Colombo",
        rating: 5,
        review: "Personale competente e disponibile. Hanno risposto a tutte le mie domande e mi hanno fatto sentire a mio agio durante tutto il processo.",
        image: "testimonial-5"
    }
];

export const whyChooseUs: WhyChooseUsItem[] = [
  {
    title: "Qualità Garantita",
    description: "Solo le migliori auto usate di qualità, con un rigoroso processo di selezione e controlli completi sulla storia del veicolo.",
    icon: Star
  },
  {
    title: "Prezzi Trasparenti",
    description: "Nessun costo nascosto, prezzi competitivi e documentazione chiara e completa per ogni veicolo.",
    icon: Handshake
  },
  {
    title: "Esperienza nel Settore",
    description: "Oltre 10 anni di esperienza, conoscenza approfondita del mercato e la fiducia di centinaia di clienti soddisfatti.",
    icon: Rocket
  },
  {
    title: "Assistenza Personalizzata",
    description: "Servizio clienti dedicato, consigli personalizzati e supporto completo durante tutto il processo di acquisto.",
    icon: Heart
  }
];

export const team: TeamMember[] = [
  { name: "Mario Rossi", role: "Fondatore & CEO", image: "team-member-3" },
  { name: "Elena Costa", role: "Responsabile Vendite", image: "team-member-2" },
  { name: "Luca Ferrari", role: "Specialista Prodotto", image: "team-member-1" },
]

export const cars: Car[] = [
  {
    id: "1",
    make: "Fiat",
    model: "500",
    year: 2021,
    price: 15000,
    mileage: 25000,
    fuelType: "Benzina",
    transmission: "Manuale",
    description: "Iconica city car, perfetta per la guida in città. Consumi ridotti e stile inconfondibile.",
    category: "Utilitaria",
    images: ["car-fiat-500", "car-fiat-500", "car-fiat-500"],
    featured: true,
    available: true,
  },
  {
    id: "2",
    make: "BMW",
    model: "X3",
    year: 2020,
    price: 45000,
    mileage: 40000,
    fuelType: "Diesel",
    transmission: "Automatica",
    description: "SUV di lusso con prestazioni eccellenti e comfort di alto livello. Ideale per lunghi viaggi e famiglie.",
    category: "SUV",
    images: ["car-bmw-x3", "car-bmw-x3", "car-bmw-x3"],
    featured: true,
    available: true,
  },
  {
    id: "3",
    make: "Audi",
    model: "A4",
    year: 2019,
    price: 32000,
    mileage: 60000,
    fuelType: "Diesel",
    transmission: "Automatica",
    description: "Berlina elegante e sportiva, con interni di alta qualità e tecnologia all'avanguardia.",
    category: "Berlina",
    images: ["car-audi-a4", "car-audi-a4", "car-audi-a4"],
    featured: true,
    available: true,
  },
  {
    id: "4",
    make: "Volkswagen",
    model: "Golf",
    year: 2022,
    price: 28000,
    mileage: 15000,
    fuelType: "Benzina",
    transmission: "Manuale",
    description: "La berlina compatta per eccellenza, versatile e affidabile. Ultimo modello con tutti gli optional.",
    category: "Berlina",
    images: ["car-vw-golf", "car-vw-golf", "car-vw-golf"],
    featured: true,
    available: false,
  },
  {
    id: "5",
    make: "Tesla",
    model: "Model 3",
    year: 2022,
    price: 42000,
    mileage: 30000,
    fuelType: "Elettrica",
    transmission: "Automatica",
    description: "Performance elettrizzanti e tecnologia futuristica. Autonomia elevata e accesso a Supercharger.",
    category: "Berlina",
    images: ["car-tesla-model3", "car-tesla-model3", "car-tesla-model3"],
    available: true,
  },
    {
    id: "6",
    make: "Porsche",
    model: "911",
    year: 2018,
    price: 95000,
    mileage: 22000,
    fuelType: "Benzina",
    transmission: "Automatica",
    description: "Icona sportiva senza tempo. Prestazioni mozzafiato e un design che non passa mai di moda. Per veri appassionati.",
    category: "Sportiva",
    images: ["car-porsche-911", "car-porsche-911", "car-porsche-911"],
    available: true,
  },
  {
    id: "7",
    make: "Mercedes-Benz",
    model: "S-Class",
    year: 2021,
    price: 85000,
    mileage: 18000,
    fuelType: "Ibrida",
    transmission: "Automatica",
    description: "L'apice del lusso e del comfort. Tecnologia di bordo di ultima generazione e materiali pregiati.",
    category: "Lusso",
    images: ["car-mercedes-s-class", "car-mercedes-s-class", "car-mercedes-s-class"],
    available: true,
  },
  {
    id: "8",
    make: "Jeep",
    model: "Wrangler",
    year: 2019,
    price: 38000,
    mileage: 55000,
    fuelType: "Diesel",
    transmission: "Automatica",
    description: "Inarrestabile fuoristrada, pronto a qualsiasi avventura. Capacità off-road leggendarie.",
    category: "SUV",
    images: ["car-jeep-wrangler", "car-jeep-wrangler", "car-jeep-wrangler"],
    available: true,
  },
  {
    id: "9",
    make: "Mazda",
    model: "MX-5",
    year: 2020,
    price: 26000,
    mileage: 20000,
    fuelType: "Benzina",
    transmission: "Manuale",
    description: "La cabrio più amata al mondo. Piacere di guida puro e agilità eccezionale.",
    category: "Cabrio",
    images: ["car-mazda-mx5", "car-mazda-mx5", "car-mazda-mx5"],
    available: true,
  },
  {
    id: "10",
    make: "Toyota",
    model: "C-HR",
    year: 2021,
    price: 27500,
    mileage: 32000,
    fuelType: "Ibrida",
    transmission: "Automatica",
    description: "Crossover dal design audace e tecnologia ibrida efficiente. Perfetto per la città e le gite fuori porta.",
    category: "Crossover",
    images: ["car-toyota-chr", "car-toyota-chr", "car-toyota-chr"],
    available: true,
  },
  {
    id: "11",
    make: "Volvo",
    model: "V60",
    year: 2019,
    price: 34000,
    mileage: 70000,
    fuelType: "Diesel",
    transmission: "Automatica",
    description: "Station wagon che unisce eleganza, sicurezza e grande capacità di carico. Comfort scandinavo ai massimi livelli.",
    category: "Station Wagon",
    images: ["car-volvo-v60", "car-volvo-v60", "car-volvo-v60"],
    available: true,
  },
  {
    id: "12",
    make: "Ford",
    model: "Ranger",
    year: 2020,
    price: 35000,
    mileage: 45000,
    fuelType: "Diesel",
    transmission: "Automatica",
    description: "Pick-up robusto e versatile, ideale per lavoro e tempo libero. Grande capacità di traino e cassone spazioso.",
    category: "Pick-up",
    images: ["car-ford-ranger", "car-ford-ranger", "car-ford-ranger"],
    available: true,
  }
];
