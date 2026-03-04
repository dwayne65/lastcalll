import { useParams, Link } from "react-router-dom";
import { Play, Download, FileText, Clock, Calendar, User, ChevronLeft, BookOpen, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SermonCard from "@/components/SermonCard";
import { motion } from "framer-motion";
import sermonThumb1 from "@/assets/sermon-thumb-1.jpg";
import sermonThumb2 from "@/assets/sermon-thumb-2.jpg";
import sermonThumb3 from "@/assets/sermon-thumb-3.jpg";

const sermonData: Record<string, {
  title: string; speaker: string; date: string; thumbnail: string;
  scripture: string; duration: string; description: string;
  transcript: string;
}> = {
  "the-seal-of-god": {
    title: "The Seal of God and the Mark of the Beast",
    speaker: "Pastor James",
    date: "February 15, 2026",
    thumbnail: sermonThumb2,
    scripture: "Revelation 14:9-12",
    duration: "52 min",
    description: "In this powerful sermon, Pastor James explores the prophetic significance of the seal of God and the mark of the beast as described in Revelation 14. Discover what these symbols mean for God's people in the last days and how to stand firm in the truth.",
    transcript: `Good evening, brothers and sisters. Tonight we turn to one of the most solemn passages in all of Scripture — Revelation chapter 14, verses 9 through 12.

The third angel follows them and says in a loud voice: "If anyone worships the beast and its image and receives its mark on their forehead or on their hand, they too will drink the wine of God's fury."

Now, what is this mark? And what is the seal of God that stands in contrast to it? These are not questions of idle curiosity — they are matters of eternal consequence.

The seal of God is His sign of authority, His mark of ownership upon His people. Throughout Scripture, God's law has been the standard of His government. And at the heart of that law lies the Sabbath commandment — the only commandment that contains the three elements of a seal: the name, the title, and the territory of the Lawgiver.

"For in six days the LORD made heaven and earth, the sea, and all that in them is, and rested the seventh day: wherefore the LORD blessed the sabbath day, and hallowed it." — Exodus 20:11

Friends, the issue before the world in these last days is worship. Who will you worship? The Creator who made heaven and earth? Or the power that has thought to change God's times and laws?

Let us choose this day whom we will serve. Let us receive the seal of the living God.`,
  },
  "righteousness-by-faith": {
    title: "Righteousness by Faith: The Heart of the Gospel",
    speaker: "Elder Sarah",
    date: "February 8, 2026",
    thumbnail: sermonThumb1,
    scripture: "Romans 3:21-26",
    duration: "45 min",
    description: "Elder Sarah presents a compelling study on righteousness by faith — the central pillar of the gospel message. Learn how justification and sanctification work together in God's plan of salvation.",
    transcript: "Full transcript coming soon...",
  },
  "the-sabbath-rest": {
    title: "The Sabbath Rest: God's Gift for Weary Souls",
    speaker: "Pastor James",
    date: "February 1, 2026",
    thumbnail: sermonThumb3,
    scripture: "Hebrews 4:9-11",
    duration: "48 min",
    description: "A beautiful exploration of the Sabbath as more than a day — it is a gift of rest, restoration, and relationship with our Creator. Pastor James connects the physical rest to the spiritual rest found in Christ.",
    transcript: "Full transcript coming soon...",
  },
};

const relatedSermons = [
  { title: "Righteousness by Faith: The Heart of the Gospel", speaker: "Elder Sarah", date: "Feb 8, 2026", thumbnail: sermonThumb1, scripture: "Romans 3:21-26", mediaTypes: ["video", "audio", "text"] as ("video" | "audio" | "text")[] },
  { title: "The Sabbath Rest: God's Gift for Weary Souls", speaker: "Pastor James", date: "Feb 1, 2026", thumbnail: sermonThumb3, scripture: "Hebrews 4:9-11", mediaTypes: ["audio", "text"] as ("audio" | "text")[] },
];

const SermonDetail = () => {
  const { slug } = useParams();
  const sermon = sermonData[slug || ""] || sermonData["the-seal-of-god"];

  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-20 bg-background min-h-screen">
        <div className="container max-w-5xl">
          <Link to="/sermons" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gold transition-colors mb-6">
            <ChevronLeft className="w-4 h-4" /> Back to Sermons
          </Link>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Video Player */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="aspect-video bg-primary rounded-xl overflow-hidden relative group cursor-pointer"
              >
                <img src={sermon.thumbnail} alt={sermon.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary/50 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-primary ml-1" />
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mt-6">
                  {sermon.title}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{sermon.speaker}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{sermon.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{sermon.duration}</span>
                  <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-gold" />{sermon.scripture}</span>
                </div>

                <p className="mt-6 text-muted-foreground leading-relaxed">{sermon.description}</p>

                {/* Action buttons */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button className="bg-gradient-gold text-primary font-semibold gap-2 hover:opacity-90">
                    <Download className="w-4 h-4" /> Download Audio
                  </Button>
                  <Button variant="outline" className="border-border text-muted-foreground hover:border-gold/50 hover:text-foreground gap-2">
                    <FileText className="w-4 h-4" /> Download PDF
                  </Button>
                  <Button variant="ghost" className="text-muted-foreground hover:text-gold gap-2">
                    <Share2 className="w-4 h-4" /> Share
                  </Button>
                </div>

                {/* Transcript */}
                <div className="mt-10">
                  <h2 className="text-xl font-serif font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gold" /> Transcript
                  </h2>
                  <div className="bg-card border border-border rounded-lg p-6 max-h-96 overflow-y-auto">
                    {sermon.transcript.split("\n\n").map((paragraph, i) => (
                      <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-4 last:mb-0 font-serif">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                  Related Sermons
                </h3>
                <div className="space-y-4">
                  {relatedSermons.map((s, i) => (
                    <Link key={s.title} to={`/sermons/${s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}`}>
                      <div className="flex gap-3 group cursor-pointer p-2 rounded-lg hover:bg-card transition-colors">
                        <img src={s.thumbnail} alt={s.title} className="w-20 h-14 rounded object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground group-hover:text-gold-dark transition-colors line-clamp-2 leading-snug">
                            {s.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{s.speaker}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default SermonDetail;
