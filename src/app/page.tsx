import AttractionsSection from '@/components/AttractionsSection';
import BannerCarousel from '@/components/BannerCarousel';
import NewsSection from '@/components/NewsSection';
import PilgrimageCards from '@/components/PilgrimageCards';
import TestimonialsSection from '@/components/TestimonialsSection';

export default function HomePage() {
  return (
    <>
      <BannerCarousel />
      <PilgrimageCards />
      <NewsSection />
      <AttractionsSection />
      <TestimonialsSection />
    </>
  );
}


