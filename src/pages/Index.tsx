import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LatestSermons from "@/components/LatestSermons";
import FeaturedSeries from "@/components/FeaturedSeries";
import ImpactMetrics from "@/components/ImpactMetrics";
import SocialFeed from "@/components/SocialFeed";
import NewsletterSignup from "@/components/NewsletterSignup";
import Footer from "@/components/Footer";

const Index = () => (
  <main>
    <Navbar />
    <HeroSection />
    <LatestSermons />
    <FeaturedSeries />
    <ImpactMetrics />
    <SocialFeed />
    <NewsletterSignup />
    <Footer />
  </main>
);

export default Index;
