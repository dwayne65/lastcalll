import { useState } from "react";
import { Link } from "react-router-dom";
import { Play, Headphones, FileText, Calendar, User, Heart, Share2, Bookmark, MoreHorizontal, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SermonCardProps {
  title: string;
  slug: string;
  speaker: string;
  date: string;
  thumbnail: string;
  scripture: string;
  mediaTypes: ("video" | "audio" | "text")[];
  index?: number;
  views?: number;
}

const mediaIcons = {
  video: Play,
  audio: Headphones,
  text: FileText,
};

const SermonCard = ({
  title,
  slug,
  speaker,
  date,
  thumbnail,
  scripture,
  mediaTypes,
  index = 0,
  views = 0,
}: SermonCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const { toast } = useToast();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount((prev) => liked ? prev - 1 : prev + 1);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    toast({
      title: saved ? "Removed from saved" : "Saved to library",
      description: saved ? undefined : `"${title}" added to your library.`,
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard?.writeText(`${window.location.origin}/sermons/${slug}`);
    toast({ title: "Link copied!", description: "Share this sermon with others." });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl hover:shadow-gold/5 transition-all duration-300 hover:border-gold/20"
      onMouseLeave={() => setShowActions(false)}
    >
      <Link to={`/sermons/${slug}`}>
        <div className="relative aspect-video overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center shadow-lg">
              <Play className="w-6 h-6 text-primary ml-0.5" />
            </div>
          </div>
          {/* Media badges */}
          <div className="absolute top-3 right-3 flex gap-1.5">
            {mediaTypes.map((type) => {
              const Icon = mediaIcons[type];
              return (
                <span
                  key={type}
                  className="w-7 h-7 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center"
                  title={type}
                >
                  <Icon className="w-3.5 h-3.5 text-gold" />
                </span>
              );
            })}
          </div>
          {/* View count */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-primary/70 backdrop-blur-sm rounded-full px-2.5 py-1">
            <Eye className="w-3 h-3 text-primary-foreground/80" />
            <span className="text-xs text-primary-foreground/80 font-medium">{views.toLocaleString()}</span>
          </div>
        </div>
      </Link>

      <div className="p-5">
        <p className="text-xs font-sans font-medium text-gold uppercase tracking-wider mb-2">
          {scripture}
        </p>
        <Link to={`/sermons/${slug}`}>
          <h3 className="font-serif text-lg font-semibold text-card-foreground leading-snug group-hover:text-gold-dark transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {speaker}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {date}
          </span>
        </div>

        {/* Action bar */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLike}
              className={`h-8 px-2 gap-1.5 ${liked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
              <span className="text-xs font-medium">{likeCount}</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleShare}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSave}
              className={`h-8 px-2 ${saved ? "text-gold" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
            </Button>
          </div>
          <Link to={`/sermons/${slug}`}>
            <Button size="sm" variant="ghost" className="h-8 text-xs text-gold hover:text-gold-dark font-medium">
              Watch Now →
            </Button>
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default SermonCard;
