import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Image, FileVideo, FileAudio, FileText, Check } from "lucide-react";
import { mockMedia, type MediaItem } from "@/data/mediaData";

type FilterType = "all" | "image" | "video" | "audio" | "document";

const typeIcons: Record<string, typeof Image> = {
  image: Image,
  video: FileVideo,
  audio: FileAudio,
  document: FileText,
};

const typeColors: Record<string, string> = {
  image: "bg-blue-500/10 text-blue-400",
  video: "bg-purple-500/10 text-purple-400",
  audio: "bg-emerald-500/10 text-emerald-400",
  document: "bg-amber-500/10 text-amber-400",
};

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (item: MediaItem) => void;
}

const MediaPickerDialog = ({ open, onOpenChange, onSelect }: MediaPickerDialogProps) => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = mockMedia
    .filter((m) => filterType === "all" || m.type === filterType)
    .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  const selectedItem = filtered.find((m) => m.id === selectedId);

  const handleInsert = () => {
    if (selectedItem) {
      onSelect(selectedItem);
      setSelectedId(null);
      setSearch("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-serif">Insert from Media Library</DialogTitle>
        </DialogHeader>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card border-border focus-visible:ring-gold"
            />
          </div>
          <Select value={filterType} onValueChange={(v) => setFilterType(v as FilterType)}>
            <SelectTrigger className="w-32 bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 py-2">
            {filtered.map((item) => {
              const Icon = typeIcons[item.type];
              const isSelected = selectedId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  onDoubleClick={() => { setSelectedId(item.id); handleInsert(); }}
                  className={`relative rounded-lg border overflow-hidden text-left transition-all ${
                    isSelected
                      ? "ring-2 ring-gold border-gold"
                      : "border-border hover:border-muted-foreground/50"
                  }`}
                >
                  <div className="aspect-square bg-muted/30 overflow-hidden">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon className="w-8 h-8 text-muted-foreground/40" />
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 bg-gold/20 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                    )}
                    <Badge className={`absolute top-1.5 right-1.5 text-[10px] px-1.5 py-0 ${typeColors[item.type]}`}>
                      {item.type}
                    </Badge>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground">{item.size}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No media found matching your search.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {selectedItem ? `Selected: ${selectedItem.name}` : "Select a file to insert"}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button
              disabled={!selectedItem}
              onClick={handleInsert}
              className="bg-gradient-gold text-primary font-semibold hover:opacity-90"
            >
              Insert
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaPickerDialog;
