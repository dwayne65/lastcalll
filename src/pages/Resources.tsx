import { Download, FileText, BookOpen, Video, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { usePublishedResources } from "@/hooks/useApi";

const typeIcons: Record<string, any> = {
  DOCUMENT: FileText,
  VIDEO: Video,
  AUDIO: Music,
  BOOK: BookOpen,
};

const Resources = () => {
  const { data, isLoading } = usePublishedResources();
  const resources = data?.data || [];

  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-20 bg-background min-h-screen">
        <div className="container max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              Study <span className="text-gradient-gold">Resources</span>
            </h1>
            <p className="mt-3 text-muted-foreground text-lg max-w-xl">
              Free study guides, documents, and materials to deepen your understanding of God's Word.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {resources.map((resource, i) => {
              const TypeIcon = typeIcons[resource.type] || FileText;
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all"
                >
                  {resource.coverUrl && (
                    <img src={resource.coverUrl} alt={resource.title} className="w-full h-40 object-cover" />
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <TypeIcon className="w-4 h-4 text-gold" />
                      <span className="text-xs font-semibold text-gold uppercase tracking-wider">{resource.type}</span>
                    </div>
                    <h3 className="text-lg font-serif font-semibold text-foreground line-clamp-2">{resource.title}</h3>
                    {resource.description && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{resource.downloadCount} downloads</span>
                      <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="bg-gradient-gold text-primary font-semibold gap-1.5 hover:opacity-90">
                          <Download className="w-3.5 h-3.5" /> Download
                        </Button>
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {!isLoading && resources.length === 0 && (
            <div className="mt-16 text-center text-muted-foreground">
              <p className="text-lg">No resources available yet</p>
              <p className="text-sm mt-1">Check back soon for new materials!</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Resources;
