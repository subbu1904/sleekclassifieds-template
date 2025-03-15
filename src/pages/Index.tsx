
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { FeaturedListings } from "@/components/FeaturedListings";
import { Footer } from "@/components/Footer";
import { PwaInstall } from "@/components/PwaInstall";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="pt-16 flex-grow">
        <Hero />
        <Categories />
        <FeaturedListings />
        <PwaInstall />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
