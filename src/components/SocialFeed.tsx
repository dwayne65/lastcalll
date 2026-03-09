import { Youtube, Instagram, Facebook, Twitter, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useSocialLinks } from "@/hooks/useApi";

const platformIcons: Record<string, any> = {
  youtube: Youtube,
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
};

const platformMessages: Record<string, string> = {
  youtube: "Watch our latest sermons and Bible studies on YouTube!",
  instagram: "Follow us for daily inspiration and Sabbath blessings 🙏",
  facebook: "Join our community and stay updated on events and programs!",
  twitter: "Follow us for updates, quotes, and ministry news!",
};

const SocialFeed = () => {
  const { data: socialLinks } = useSocialLinks();
  const links = (socialLinks || []).slice(0, 3);

  if (links.length === 0) return null;

  return (
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
        {links.map((link, i) => {
          const Icon = platformIcons[link.platform?.toLowerCase()] || Globe;
          const message = platformMessages[link.platform?.toLowerCase()] || `Follow us on ${link.platform}!`;
          return (
            <motion.a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-lg bg-background border border-border hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all group"
            >
              <Icon className="w-6 h-6 text-gold mb-4" />
              <p className="text-sm text-foreground leading-relaxed">{message}</p>
              <p className="mt-3 text-xs text-muted-foreground capitalize">{link.platform}</p>
            </motion.a>
          );
        })}
      </div>
    </div>
  </section>
  );
};

export default SocialFeed;
