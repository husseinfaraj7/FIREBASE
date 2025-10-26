import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { Hero } from "@/components/home/hero";
import { Stats } from "@/components/home/stats";
import { FeaturedCars } from "@/components/home/featured-cars";
import { Services } from "@/components/home/services";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { Testimonials } from "@/components/home/testimonials";
import { ContactCta } from "@/components/home/contact-cta";
import { LocationMap } from "@/components/home/location-map";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Stats />
        <FeaturedCars />
        <Services />
        <WhyChooseUs />
        <Testimonials />
        <LocationMap />
        <ContactCta />
      </main>
      <Footer />
    </div>
  );
}
