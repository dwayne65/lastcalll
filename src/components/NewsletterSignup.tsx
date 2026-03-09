import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useSubscribe } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const subscribe = useSubscribe();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await subscribe.mutateAsync({ email });
      toast({ title: "Subscribed!", description: "You're now signed up for updates." });
      setEmail("");
    } catch {
      toast({ title: "Subscription failed", description: "Please try again.", variant: "destructive" });
    }
  };

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
            onSubmit={handleSubmit}
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
              disabled={subscribe.isPending}
              className="bg-gradient-gold text-primary font-semibold gap-2 hover:opacity-90"
            >
              {subscribe.isPending ? "Subscribing..." : "Subscribe"}
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
