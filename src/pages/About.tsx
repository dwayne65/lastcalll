import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { BookOpen, Church, Heart, Users, Calendar, ChevronRight } from "lucide-react";
import leader1 from "@/assets/leader-1.jpg";
import leader2 from "@/assets/leader-2.jpg";
import leader3 from "@/assets/leader-3.jpg";

const leaders = [
  {
    name: "Pastor James Whitfield",
    role: "Senior Pastor & Founder",
    photo: leader1,
    bio: "With over 20 years of pastoral ministry, Pastor James founded Last Call Messages to bring present truth to a global audience through digital media.",
  },
  {
    name: "Elder Sarah Mitchell",
    role: "Director of Bible Studies",
    photo: leader2,
    bio: "A gifted teacher and scholar, Elder Sarah leads our Bible study program and oversees curriculum development for in-depth prophetic teaching.",
  },
  {
    name: "Dr. Michael Thornton",
    role: "Theological Advisor",
    photo: leader3,
    bio: "Dr. Thornton brings decades of academic expertise in Biblical prophecy and Adventist theology, ensuring our content remains Scripturally sound.",
  },
];

const beliefs = [
  { title: "The Holy Scriptures", summary: "The Bible is the inspired Word of God, the authoritative revealer of doctrines, and the trustworthy record of God's acts in history." },
  { title: "The Second Coming", summary: "The return of Jesus Christ is the blessed hope of the church. His coming will be literal, personal, visible, and worldwide." },
  { title: "The Sabbath", summary: "The seventh-day Sabbath is God's gift of rest, a sign of His creative and redemptive power, observed from Friday sunset to Saturday sunset." },
  { title: "The Three Angels' Messages", summary: "Revelation 14 contains God's final appeal to the world — a call to worship the Creator, come out of Babylon, and keep the commandments." },
  { title: "The Sanctuary", summary: "Christ's ministry in the heavenly sanctuary reveals the process of judgment and the assurance of salvation for all who trust in Him." },
  { title: "The State of the Dead", summary: "Death is an unconscious sleep. The hope of the Christian is the resurrection at Christ's return, not an immortal soul." },
];

const milestones = [
  { year: "2012", event: "Ministry founded with a small Bible study group of 15 members" },
  { year: "2015", event: "Launched online sermon platform, reaching 10,000 viewers in first year" },
  { year: "2018", event: "Expanded to include video production and live streaming capabilities" },
  { year: "2020", event: "Grew to 50,000+ monthly viewers across 60 countries during pandemic outreach" },
  { year: "2023", event: "Launched comprehensive Bible study curriculum and mobile app" },
  { year: "2026", event: "Now reaching 85+ countries with over 1,200 sermons in our library" },
];

const About = () => (
  <main>
    <Navbar />

    {/* Hero */}
    <section className="pt-28 pb-16 bg-gradient-navy text-primary-foreground">
      <div className="container text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Church className="w-10 h-10 text-gold mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold">
            About <span className="text-gradient-gold">Our Ministry</span>
          </h1>
          <p className="mt-4 text-primary-foreground/70 max-w-2xl mx-auto text-lg leading-relaxed">
            Last Call Messages is a Seventh-day Adventist ministry committed to proclaiming
            the everlasting gospel and the three angels' messages through modern media.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Mission */}
    <section className="py-20 bg-background">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            { icon: BookOpen, title: "Teach Truth", desc: "We present Bible prophecy with clarity and faithfulness to Scripture." },
            { icon: Heart, title: "Share Hope", desc: "Every message points to the love of God and the hope of Christ's return." },
            { icon: Users, title: "Reach All", desc: "We use digital media to reach every nation, kindred, tongue, and people." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Leadership */}
    <section className="py-20 bg-card">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground text-center mb-4">
            Our <span className="text-gradient-gold">Leadership</span>
          </h2>
          <p className="text-center text-muted-foreground mb-14 max-w-lg mx-auto">
            Dedicated servants called to share God's final message with the world.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {leaders.map((leader, i) => (
            <motion.div
              key={leader.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background rounded-xl overflow-hidden border border-border group"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={leader.photo}
                  alt={leader.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-lg font-semibold text-foreground">{leader.name}</h3>
                <p className="text-sm text-gold font-medium mt-1">{leader.role}</p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{leader.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Beliefs */}
    <section className="py-20 bg-background">
      <div className="container max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground text-center mb-4">
            What We <span className="text-gradient-gold">Believe</span>
          </h2>
          <p className="text-center text-muted-foreground mb-14 max-w-lg mx-auto">
            Our teachings are grounded in the full counsel of Scripture.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-6">
          {beliefs.map((belief, i) => (
            <motion.div
              key={belief.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-lg bg-card border border-border hover:border-gold/30 transition-colors"
            >
              <h3 className="font-serif text-base font-semibold text-foreground flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-gold flex-shrink-0" />
                {belief.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed pl-6">{belief.summary}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="py-20 bg-gradient-navy text-primary-foreground">
      <div className="container max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-serif font-bold text-center mb-14"
        >
          Ministry <span className="text-gradient-gold">Timeline</span>
        </motion.h2>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gold/20" />
          {milestones.map((m, i) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative mb-10 pl-12 md:pl-0 md:w-1/2 ${
                i % 2 === 0 ? "md:pr-12 md:text-right" : "md:ml-auto md:pl-12"
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full bg-gold left-[10px] md:left-auto ${
                  i % 2 === 0 ? "md:right-[-6px]" : "md:left-[-6px]"
                }`}
              />
              <Calendar className="w-4 h-4 text-gold mb-1 inline-block" />
              <span className="text-gold font-bold font-serif text-lg ml-1">{m.year}</span>
              <p className="text-primary-foreground/70 text-sm mt-1 leading-relaxed">{m.event}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </main>
);

export default About;
