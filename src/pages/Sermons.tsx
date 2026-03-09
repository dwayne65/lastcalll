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
import { usePublishedSermons, useSpeakers } from "@/hooks/useApi";
import sermonThumb1 from "@/assets/sermon-thumb-1.jpg";

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

  const { data: speakerList } = useSpeakers();
  const speakers = ["All Speakers", ...(speakerList || [])];

  const { data, isLoading } = usePublishedSermons({
    search: search || undefined,
    speaker: selectedSpeaker !== "All Speakers" ? selectedSpeaker : undefined,
    sort: sortBy,
    limit: 50,
  });

  const sermons = data?.data || [];

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
              {isLoading ? "Loading..." : `${sermons.length} sermon${sermons.length !== 1 ? "s" : ""} found`}
            </p>
          </div>

          {/* Results */}
          <div className={`grid gap-6 ${viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-3xl"}`}>
            {sermons.map((sermon, i) => (
              <SermonCard
                key={sermon.id}
                title={sermon.title}
                slug={sermon.slug}
                speaker={sermon.speaker}
                date={sermon.publishedAt ? new Date(sermon.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                thumbnail={sermon.thumbnailUrl || sermonThumb1}
                scripture={sermon.scripture || ""}
                mediaTypes={[
                  ...(sermon.videoUrl ? ["video" as const] : []),
                  ...(sermon.audioUrl ? ["audio" as const] : []),
                  ...(sermon.transcript ? ["text" as const] : []),
                ]}
                index={i}
                views={sermon.viewCount}
              />
            ))}
          </div>

          {!isLoading && sermons.length === 0 && (
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
