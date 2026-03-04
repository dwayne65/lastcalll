import { Youtube, Instagram, Facebook } from "lucide-react";
import { motion } from "framer-motion";

const posts = [
  {
    platform: "YouTube",
    icon: Youtube,
    content: "NEW: The Three Angels' Messages Explained — Watch the full sermon now!",
    time: "2 hours ago",
  },
  {
    platform: "Instagram",
    icon: Instagram,
    content: "\"For God so loved the world...\" — Sabbath blessings to all 🙏",
    time: "5 hours ago",
  },
  {
    platform: "Facebook",
    icon: Facebook,
    content: "Join us this Sabbath for a special prayer service. All are welcome!",
    time: "1 day ago",
  },
];

const SocialFeed = () => (
  <section className="py-20 bg-card">
    <div className="container">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-serif font-bold text-foreground text-center mb-12"
      >
        Follow <span className="text-gradient-gold">Along</span>
      </motion.h2>
      <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {posts.map(({ platform, icon: Icon, content, time }, i) => (
          <motion.a
            key={platform}
            href="#"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-lg bg-background border border-border hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all group"
          >
            <Icon className="w-6 h-6 text-gold mb-4" />
            <p className="text-sm text-foreground leading-relaxed">{content}</p>
            <p className="mt-3 text-xs text-muted-foreground">{time}</p>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default SocialFeed;
