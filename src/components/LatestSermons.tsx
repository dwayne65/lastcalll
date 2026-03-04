import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SermonCard from "@/components/SermonCard";
import { motion } from "framer-motion";
import sermonThumb1 from "@/assets/sermon-thumb-1.jpg";
import sermonThumb2 from "@/assets/sermon-thumb-2.jpg";
import sermonThumb3 from "@/assets/sermon-thumb-3.jpg";

const sermons = [
  {
    title: "The Seal of God and the Mark of the Beast",
    speaker: "Pastor James",
    date: "Feb 15, 2026",
    thumbnail: sermonThumb2,
    scripture: "Revelation 14:9-12",
    mediaTypes: ["video", "audio"] as ("video" | "audio")[],
  },
  {
    title: "Righteousness by Faith: The Heart of the Gospel",
    speaker: "Elder Sarah",
    date: "Feb 8, 2026",
    thumbnail: sermonThumb1,
    scripture: "Romans 3:21-26",
    mediaTypes: ["video", "audio", "text"] as ("video" | "audio" | "text")[],
  },
  {
    title: "The Sabbath Rest: God's Gift for Weary Souls",
    speaker: "Pastor James",
    date: "Feb 1, 2026",
    thumbnail: sermonThumb3,
    scripture: "Hebrews 4:9-11",
    mediaTypes: ["audio", "text"] as ("audio" | "text")[],
  },
];

const LatestSermons = () => (
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
        {sermons.map((sermon, i) => (
          <SermonCard key={sermon.title} {...sermon} index={i} />
        ))}
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

export default LatestSermons;
