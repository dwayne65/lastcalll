import { useParams, Link } from "react-router-dom";
import { Play, Download, FileText, Clock, Calendar, User, ChevronLeft, BookOpen, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SermonCard from "@/components/SermonCard";
import { motion } from "framer-motion";
import { useSermonBySlug, usePublishedSermons } from "@/hooks/useApi";
import sermonThumb1 from "@/assets/sermon-thumb-1.jpg";

const SermonDetail = () => {
  const { slug } = useParams();
  const { data: sermon, isLoading } = useSermonBySlug(slug);
  const { data: relatedData } = usePublishedSermons({ limit: 3 });
  const relatedSermons = (relatedData?.data || []).filter((s) => s.slug !== slug).slice(0, 2);

  if (isLoading) {
    return (
      <main>
        <Navbar />
        <div className="pt-24 pb-20 bg-background min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!sermon) {
    return (
      <main>
        <Navbar />
        <div className="pt-24 pb-20 bg-background min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground text-lg">Sermon not found</p>
          <Link to="/sermons"><Button variant="outline">Back to Sermons</Button></Link>
        </div>
        <Footer />
      </main>
    );
  }

  const thumbnail = sermon.thumbnailUrl || sermonThumb1;
  const dateStr = sermon.publishedAt
    ? new Date(sermon.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

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
                className="aspect-video bg-primary rounded-xl overflow-hidden relative group"
              >
                {sermon.videoUrl ? (
                  sermon.videoUrl.includes("youtube.com") || sermon.videoUrl.includes("youtu.be") ? (
                    <iframe
                      src={sermon.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                      title={sermon.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={sermon.videoUrl}
                      poster={thumbnail}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )
                ) : sermon.audioUrl ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    <img src={thumbnail} alt={sermon.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <Play className="w-12 h-12 text-gold" />
                      <audio src={sermon.audioUrl} controls className="w-72" />
                    </div>
                  </div>
                ) : (
                  <>
                    <img src={thumbnail} alt={sermon.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-primary/50 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-gold/30 flex items-center justify-center">
                        <Play className="w-8 h-8 text-gold ml-1" />
                      </div>
                    </div>
                  </>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mt-6">
                  {sermon.title}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{sermon.speaker}</span>
                  {dateStr && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{dateStr}</span>}
                  {sermon.duration && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{sermon.duration}</span>}
                  {sermon.scripture && <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-gold" />{sermon.scripture}</span>}
                </div>

                {sermon.description && (
                  <p className="mt-6 text-muted-foreground leading-relaxed">{sermon.description}</p>
                )}

                {/* Action buttons */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {sermon.audioUrl && (
                    <a href={sermon.audioUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-gradient-gold text-primary font-semibold gap-2 hover:opacity-90">
                        <Download className="w-4 h-4" /> Download Audio
                      </Button>
                    </a>
                  )}
                  <Button variant="ghost" className="text-muted-foreground hover:text-gold gap-2">
                    <Share2 className="w-4 h-4" /> Share
                  </Button>
                </div>

                {/* Transcript */}
                {sermon.transcript && (
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
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                  Related Sermons
                </h3>
                <div className="space-y-4">
                  {relatedSermons.map((s) => (
                    <Link key={s.id} to={`/sermons/${s.slug}`}>
                      <div className="flex gap-3 group cursor-pointer p-2 rounded-lg hover:bg-card transition-colors">
                        <img src={s.thumbnailUrl || sermonThumb1} alt={s.title} className="w-20 h-14 rounded object-cover flex-shrink-0" />
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
