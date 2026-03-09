import { motion } from "framer-motion";
import { Users, Globe, PlayCircle, BookOpen } from "lucide-react";
import { usePublicStats, usePublicSettings } from "@/hooks/useApi";

const ImpactMetrics = () => {
  const { data: stats } = usePublicStats();
  const { data: settings } = usePublicSettings();

  const fmt = (n?: number) => (n != null ? n.toLocaleString() : "—");

  const metrics = [
    { icon: PlayCircle, value: stats?.publishedSermons != null ? `${fmt(stats.publishedSermons)}+` : "—", label: "Sermons Shared" },
    { icon: Users, value: stats?.activeSubscribers != null ? `${fmt(stats.activeSubscribers)}+` : "—", label: "Active Subscribers" },
    { icon: Globe, value: settings?.countries_reached || "85+", label: "Countries Reached" },
    { icon: BookOpen, value: stats?.totalSermonViews != null ? `${fmt(stats.totalSermonViews)}+` : "—", label: "Total Views" },
  ];

  return (
  <section className="py-20 bg-gradient-navy text-primary-foreground">
    <div className="container">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-3xl md:text-4xl font-serif font-bold mb-4"
      >
        Ministry <span className="text-gradient-gold">Impact</span>
      </motion.h2>
      <p className="text-center text-primary-foreground/60 mb-14 max-w-lg mx-auto">
        By God's grace, the message continues to reach hearts around the world.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {metrics.map(({ icon: Icon, value, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <Icon className="w-8 h-8 text-gold mx-auto mb-3" />
            <p className="text-3xl md:text-4xl font-serif font-bold text-gradient-gold">
              {value}
            </p>
            <p className="mt-1 text-sm text-primary-foreground/60 font-sans">
              {label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default ImpactMetrics;
