import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-7 h-7 text-gold" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
            Stay Connected
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Receive weekly sermon updates, devotionals, and ministry news
            directly in your inbox.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-card border-border focus-visible:ring-gold"
            />
            <Button
              type="submit"
              className="bg-gradient-gold text-primary font-semibold gap-2 hover:opacity-90"
            >
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
