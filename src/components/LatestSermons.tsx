import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SermonCard from "@/components/SermonCard";
import { motion } from "framer-motion";
import { usePublishedSermons } from "@/hooks/useApi";
import sermonThumb1 from "@/assets/sermon-thumb-1.jpg";

const LatestSermons = () => {
  const { data } = usePublishedSermons({ limit: 3 });
  const sermons = data?.data || [];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="flex items-end justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Latest <span className="text-gradient-gold">Sermons</span>
            </h2>
            <p className="mt-2 text-muted-foreground">
              Fresh teaching from God's Word for these last days.
            </p>
          </motion.div>
          <Link to="/sermons" className="hidden md:block">
            <Button variant="ghost" className="text-gold hover:text-gold-dark gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermons.map((s, i) => {
            const mediaTypes: ("video" | "audio" | "text")[] = [];
            if (s.videoUrl) mediaTypes.push("video");
            if (s.audioUrl) mediaTypes.push("audio");
            if (s.transcript) mediaTypes.push("text");
            return (
              <SermonCard
                key={s.id}
                title={s.title}
                slug={s.slug}
                speaker={s.speaker}
                date={new Date(s.publishedAt || s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                thumbnail={s.thumbnailUrl || sermonThumb1}
                scripture={s.scripture || ""}
                mediaTypes={mediaTypes}
                index={i}
                views={s.viewCount}
              />
            );
          })}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link to="/sermons">
            <Button variant="ghost" className="text-gold hover:text-gold-dark gap-2">
              View All Sermons <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestSermons;
