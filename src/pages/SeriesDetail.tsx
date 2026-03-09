import { useParams, Link } from "react-router-dom";
import { ChevronLeft, PlayCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SermonCard from "@/components/SermonCard";
import { motion } from "framer-motion";
import { useSeriesBySlug } from "@/hooks/useApi";
import sermonThumb1 from "@/assets/sermon-thumb-1.jpg";

const SeriesDetail = () => {
  const { slug } = useParams();
  const { data: series, isLoading } = useSeriesBySlug(slug);

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

  if (!series) {
    return (
      <main>
        <Navbar />
        <div className="pt-24 pb-20 bg-background min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground text-lg">Series not found</p>
          <Link to="/sermons"><Button variant="outline">Back to Sermons</Button></Link>
        </div>
        <Footer />
      </main>
    );
  }

  const sermons = series.sermons || [];

  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-20 bg-background min-h-screen">
        <div className="container max-w-5xl">
          <Link to="/sermons" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gold transition-colors mb-6">
            <ChevronLeft className="w-4 h-4" /> Back to Sermons
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Series header */}
            <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
                <img src={series.coverUrl || sermonThumb1} alt={series.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-gold text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Series
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-gold" />
                  <span className="text-sm font-semibold text-gold uppercase tracking-widest">Study Series</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">{series.title}</h1>
                {series.description && (
                  <p className="mt-4 text-muted-foreground leading-relaxed">{series.description}</p>
                )}
                <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><PlayCircle className="w-4 h-4" /> {sermons.length} Parts</span>
                </div>
              </div>
            </div>

            {/* Sermons list */}
            {sermons.length > 0 ? (
              <div>
                <h2 className="text-xl font-serif font-semibold text-foreground mb-6">All Episodes</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sermons.map((s, i) => {
                    const mediaTypes: ("video" | "audio" | "text")[] = [];
                    if (s.videoUrl) mediaTypes.push("video");
                    if (s.audioUrl) mediaTypes.push("audio");
                    if (s.transcript) mediaTypes.push("text");
                    return (
                      <SermonCard
                        key={s.id}
                        title={s.title}
                        slug={s.slug}
                        speaker={s.speaker}
                        date={new Date(s.publishedAt || s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        thumbnail={s.thumbnailUrl || sermonThumb1}
                        scripture={s.scripture || ""}
                        mediaTypes={mediaTypes}
                        index={i}
                        views={s.viewCount}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-10">No sermons in this series yet.</p>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default SeriesDetail;
