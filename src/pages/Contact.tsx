import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Youtube, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const socialLinks = [
  { icon: Youtube, label: "YouTube", url: "https://youtube.com" },
  { icon: Instagram, label: "Instagram", url: "https://instagram.com" },
  { icon: Facebook, label: "Facebook", url: "https://facebook.com" },
];

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-20 bg-background min-h-screen">
        <div className="container max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              Get in <span className="text-gradient-gold">Touch</span>
            </h1>
            <p className="mt-3 text-muted-foreground text-lg max-w-xl">
              We'd love to hear from you. Reach out with questions, prayer requests, or just to say hello.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-12 mt-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3"
            >
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="bg-background border-border focus-visible:ring-gold"
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="bg-background border-border focus-visible:ring-gold"
                      maxLength={200}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What is this about?"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="bg-background border-border focus-visible:ring-gold"
                    maxLength={200}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Your message, prayer request, or question..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="bg-background border-border focus-visible:ring-gold min-h-[150px]"
                    maxLength={2000}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={sending}
                  className="bg-gradient-gold text-primary font-semibold gap-2 hover:opacity-90 w-full sm:w-auto"
                >
                  <Send className="w-4 h-4" />
                  {sending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </motion.div>

            {/* Info sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              <div className="bg-card border border-border rounded-xl p-8">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-6">Ministry Address</h3>
                <div className="space-y-5">
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Last Call Messages</p>
                      <p className="text-sm text-muted-foreground">123 Advent Way, Suite 200<br />Berrien Springs, MI 49103</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground">(269) 555-0147</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground">contact@lastcallmessages.org</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground">Office Hours</p>
                      <p className="text-sm text-muted-foreground">Mon–Thu: 9am – 5pm<br />Fri: 9am – 3pm<br />Sabbath & Sun: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-8">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Follow Us</h3>
                <p className="text-sm text-muted-foreground mb-4">Stay connected on social media for the latest sermons and updates.</p>
                <div className="flex gap-3">
                  {socialLinks.map(({ icon: Icon, label, url }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-11 h-11 rounded-full bg-muted flex items-center justify-center hover:bg-gold/20 hover:text-gold transition-colors text-muted-foreground"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Contact;
