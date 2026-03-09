import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSeries } from "@/hooks/useApi";

const FeaturedSeries = () => {
  const { data: allSeries } = useSeries();
  const featured = allSeries?.[0];

  if (!featured) return null;

  const sermonCount = featured._count?.sermons ?? featured.sermonCount ?? 0;

  return (
    <section className="py-20 bg-card">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-10 items-center"
        >
          {featured.coverUrl ? (
            <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
              <img
                src={featured.coverUrl}
                alt={featured.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="bg-gold text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Current Series
                </span>
              </div>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-muted flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-muted-foreground/30" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="bg-gold text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Current Series
                </span>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-gold" />
              <span className="text-sm font-semibold text-gold uppercase tracking-widest">
                Featured Study
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
              {featured.title}
            </h2>
            {featured.description && (
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {featured.description}
              </p>
            )}
            {sermonCount > 0 && (
              <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
                <span>{sermonCount} Parts</span>
                <span>&bull;</span>
                <span>Video &amp; Audio</span>
              </div>
            )}
            <Link to={`/series/${featured.slug}`}>
              <Button className="mt-8 bg-gradient-gold text-primary font-semibold gap-2 hover:opacity-90">
                Start the Series
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedSeries;
