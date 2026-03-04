import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import sermonThumb1 from "@/assets/sermon-thumb-1.jpg";

const FeaturedSeries = () => (
  <section className="py-20 bg-card">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-10 items-center"
      >
        <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
          <img
            src={sermonThumb1}
            alt="The Book of Revelation study series"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className="bg-gold text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Current Series
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-gold" />
            <span className="text-sm font-semibold text-gold uppercase tracking-widest">
              Featured Study
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
            Unsealing the Book of Revelation
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Journey through the prophetic visions of Revelation with our
            comprehensive 12-part series. Discover the hope and warnings
            contained in God's final message to the world — presented with
            clarity and deep Biblical scholarship.
          </p>
          <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
            <span>12 Parts</span>
            <span>•</span>
            <span>Video & Audio</span>
            <span>•</span>
            <span>Study Guides</span>
          </div>
          <Button className="mt-8 bg-gradient-gold text-primary font-semibold gap-2 hover:opacity-90">
            Start the Series
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default FeaturedSeries;
