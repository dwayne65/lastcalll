import { useState } from "react";
import { Search, Grid3X3, List, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SermonCard from "@/components/SermonCard";
import { motion, AnimatePresence } from "framer-motion";
import sermonThumb1 from "@/assets/sermon-thumb-1.jpg";
import sermonThumb2 from "@/assets/sermon-thumb-2.jpg";
import sermonThumb3 from "@/assets/sermon-thumb-3.jpg";

const allSermons = [
  { title: "The Seal of God and the Mark of the Beast", speaker: "Pastor James", date: "Feb 15, 2026", thumbnail: sermonThumb2, scripture: "Revelation 14:9-12", mediaTypes: ["video", "audio"] as ("video" | "audio")[], views: 1240 },
  { title: "Righteousness by Faith: The Heart of the Gospel", speaker: "Elder Sarah", date: "Feb 8, 2026", thumbnail: sermonThumb1, scripture: "Romans 3:21-26", mediaTypes: ["video", "audio", "text"] as ("video" | "audio" | "text")[], views: 890 },
  { title: "The Sabbath Rest: God's Gift for Weary Souls", speaker: "Pastor James", date: "Feb 1, 2026", thumbnail: sermonThumb3, scripture: "Hebrews 4:9-11", mediaTypes: ["audio", "text"] as ("audio" | "text")[], views: 2100 },
  { title: "Daniel's Final Vision: Hope in Tribulation", speaker: "Dr. Michael", date: "Jan 25, 2026", thumbnail: sermonThumb3, scripture: "Daniel 12:1-4", mediaTypes: ["video"] as ("video")[], views: 650 },
  { title: "The Sanctuary Message: Christ Our High Priest", speaker: "Elder Sarah", date: "Jan 18, 2026", thumbnail: sermonThumb1, scripture: "Hebrews 8:1-6", mediaTypes: ["video", "audio"] as ("video" | "audio")[], views: 1560 },
  { title: "Health Reform: Temples of the Holy Spirit", speaker: "Pastor James", date: "Jan 11, 2026", thumbnail: sermonThumb2, scripture: "1 Corinthians 6:19-20", mediaTypes: ["audio"] as ("audio")[], views: 430 },
];

const speakers = ["All Speakers", "Pastor James", "Elder Sarah", "Dr. Michael"];
const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "popular", label: "Most Popular" },
  { value: "az", label: "A – Z" },
];

const Sermons = () => {
  const [search, setSearch] = useState("");
  const [selectedSpeaker, setSelectedSpeaker] = useState("All Speakers");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = allSermons
    .filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.scripture.toLowerCase().includes(search.toLowerCase());
      const matchesSpeaker =
        selectedSpeaker === "All Speakers" || s.speaker === selectedSpeaker;
      return matchesSearch && matchesSpeaker;
    })
    .sort((a, b) => {
      if (sortBy === "popular") return (b.views ?? 0) - (a.views ?? 0);
      if (sortBy === "az") return a.title.localeCompare(b.title);
      if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const activeFilterCount = (selectedSpeaker !== "All Speakers" ? 1 : 0) + (search ? 1 : 0);

  const clearFilters = () => {
    setSearch("");
    setSelectedSpeaker("All Speakers");
    setSortBy("newest");
  };

  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-20 bg-background min-h-screen">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              Sermon <span className="text-gradient-gold">Library</span>
            </h1>
            <p className="mt-3 text-muted-foreground text-lg max-w-xl">
              Explore our complete collection of sermons, Bible studies, and prophetic teachings.
            </p>
          </motion.div>

          {/* Toolbar */}
          <div className="mt-10 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search sermons or scripture..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-card border-border focus-visible:ring-gold"
                  maxLength={200}
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`gap-2 border-border ${showFilters ? "bg-gold/10 text-gold border-gold/30" : "text-muted-foreground"}`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-gold text-primary text-xs flex items-center justify-center font-semibold">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px] bg-card border-border text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="hidden sm:flex gap-1 ml-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setViewMode("grid")}
                    className={`h-9 w-9 ${viewMode === "grid" ? "text-gold bg-gold/10" : "text-muted-foreground"}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setViewMode("list")}
                    className={`h-9 w-9 ${viewMode === "list" ? "text-gold bg-gold/10" : "text-muted-foreground"}`}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Expanded filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center gap-3">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Speaker:</span>
                    <div className="flex gap-2 flex-wrap">
                      {speakers.map((sp) => (
                        <Button
                          key={sp}
                          size="sm"
                          variant={selectedSpeaker === sp ? "default" : "outline"}
                          onClick={() => setSelectedSpeaker(sp)}
                          className={`h-8 text-xs ${
                            selectedSpeaker === sp
                              ? "bg-gradient-gold text-primary border-0"
                              : "border-border text-muted-foreground hover:border-gold/50 hover:text-foreground"
                          }`}
                        >
                          {sp}
                        </Button>
                      ))}
                    </div>
                    {activeFilterCount > 0 && (
                      <Button size="sm" variant="ghost" onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground ml-auto">
                        Clear all
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results count */}
          <div className="mt-4 mb-2 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filtered.length} sermon{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Results */}
          <div className={`grid gap-6 ${viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-3xl"}`}>
            {filtered.map((sermon, i) => (
              <SermonCard key={sermon.title} {...sermon} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No sermons found matching your search.</p>
              <Button variant="outline" onClick={clearFilters} className="mt-4 border-border text-muted-foreground">
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Sermons;
