import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, BookOpen, Mic, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

type SearchResult = {
  title: string;
  type: "sermon" | "article" | "resource";
  description: string;
  url: string;
};

const allContent: SearchResult[] = [
  { title: "The Seal of God and the Mark of the Beast", type: "sermon", description: "Revelation 14:9-12 — Pastor James", url: "/sermons/the-seal-of-god" },
  { title: "Righteousness by Faith: The Heart of the Gospel", type: "sermon", description: "Romans 3:21-26 — Elder Sarah", url: "/sermons/righteousness-by-faith" },
  { title: "The Sabbath Rest: God's Gift for Weary Souls", type: "sermon", description: "Hebrews 4:9-11 — Pastor James", url: "/sermons/the-sabbath-rest" },
  { title: "Daniel's Final Vision: Hope in Tribulation", type: "sermon", description: "Daniel 12:1-4 — Dr. Michael", url: "/sermons/daniels-final-vision" },
  { title: "The Sanctuary Message: Christ Our High Priest", type: "sermon", description: "Hebrews 8:1-6 — Elder Sarah", url: "/sermons/the-sanctuary-message" },
  { title: "Health Reform: Temples of the Holy Spirit", type: "sermon", description: "1 Corinthians 6:19-20 — Pastor James", url: "/sermons/health-reform" },
  { title: "Understanding the 2300-Day Prophecy", type: "article", description: "A deep dive into Daniel 8:14 and the investigative judgment", url: "/about" },
  { title: "Sabbath School Study Guide – Q1 2026", type: "resource", description: "Weekly study materials for personal and group Bible study", url: "/about" },
  { title: "The Great Controversy Reading Plan", type: "resource", description: "A 30-day reading plan through Ellen White's classic work", url: "/about" },
  { title: "Steps to Christ: A Journey of Faith", type: "article", description: "Exploring the path to a deeper relationship with Jesus", url: "/about" },
];

const typeIcons = {
  sermon: Mic,
  article: FileText,
  resource: BookOpen,
};

const typeLabels = { sermon: "Sermon", article: "Article", resource: "Resource" };
const typeColors = {
  sermon: "text-gold",
  article: "text-blue-500",
  resource: "text-green-500",
};

const GlobalSearch = ({ onClose }: { onClose: () => void }) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "sermon" | "article" | "resource">("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const results = allContent.filter((item) => {
    const matchesQuery = query.length >= 2 &&
      (item.title.toLowerCase().includes(query.toLowerCase()) ||
       item.description.toLowerCase().includes(query.toLowerCase()));
    const matchesFilter = filter === "all" || item.type === filter;
    return matchesQuery && matchesFilter;
  });

  const handleSelect = (url: string) => {
    navigate(url);
    onClose();
  };

  const filters = ["all", "sermon", "article", "resource"] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-primary/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <Input
            ref={inputRef}
            placeholder="Search sermons, articles, resources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 h-14 text-base bg-transparent"
            maxLength={200}
          />
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 px-5 py-3 border-b border-border">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-gold/10 text-gold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {f === "all" ? "All" : typeLabels[f] + "s"}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {query.length < 2 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Type at least 2 characters to search...
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            results.map((item) => {
              const Icon = typeIcons[item.type];
              return (
                <button
                  key={item.title}
                  onClick={() => handleSelect(item.url)}
                  className="w-full flex items-start gap-3 px-5 py-4 hover:bg-muted/50 transition-colors text-left border-b border-border last:border-0"
                >
                  <div className={`mt-0.5 ${typeColors[item.type]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    item.type === "sermon" ? "bg-gold/10 text-gold" :
                    item.type === "article" ? "bg-blue-500/10 text-blue-500" :
                    "bg-green-500/10 text-green-500"
                  }`}>
                    {typeLabels[item.type]}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {query.length >= 2 ? `${results.length} result${results.length !== 1 ? "s" : ""}` : ""}
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">ESC</kbd> to close
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GlobalSearch;
