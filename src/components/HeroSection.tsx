import { Link } from "react-router-dom";
import { Play, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { usePublicSettings } from "@/hooks/useApi";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const { data: settings } = usePublicSettings();

  const tagline = settings?.tagline || "Teaching present truth for these last days through powerful sermons, Bible studies, and prophetic insights.";
  const siteName = settings?.site_name || "Last Call Messages";

  return (
  <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
    <img
      src={heroBg}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
      loading="eager"
    />
    <div className="absolute inset-0 bg-hero-overlay" />

    <div className="relative z-10 container text-center px-4">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-gold font-sans font-medium tracking-[0.2em] uppercase text-sm mb-6"
      >
        Seventh-day Adventist Ministry
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-cream leading-tight max-w-4xl mx-auto"
      >
        Proclaiming the{" "}
        <span className="text-gradient-gold">Everlasting Gospel</span>{" "}
        to Every Nation
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-6 text-cream/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-sans"
      >
        {tagline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link to="/sermons">
          <Button size="lg" className="bg-gradient-gold text-primary font-semibold text-base px-8 gap-2 hover:opacity-90 transition-opacity">
            <Play className="w-5 h-5" />
            Watch Sermons
          </Button>
        </Link>
        <Link to="/donate">
          <Button
            size="lg"
            variant="outline"
            className="border-gold/50 text-gold hover:bg-gold/10 font-semibold text-base px-8 gap-2"
          >
            <Heart className="w-5 h-5" />
            Support This Ministry
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
  );
};

export default HeroSection;
