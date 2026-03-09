import { useState, useRef, useCallback } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload, Search, Grid3X3, List, Image, FileVideo, FileAudio,
  FileText, Trash2, Download, Copy, Eye, MoreVertical,
  FolderPlus, Filter, SortAsc, X, Check, CloudUpload,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

import { useMedia, useUploadMedia, useDeleteMedia } from "@/hooks/useApi";
import type { MediaAsset } from "@/lib/api-types";

type MediaType = "all" | "image" | "video" | "audio" | "document";
type ViewMode = "grid" | "list";

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

const formatSize = (bytes: number) => {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
};

const MediaLibrary = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<MediaType>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaAsset | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date");

  const typeParam = filterType === "all" ? undefined : filterType;
  const { data, isLoading } = useMedia({ limit: 100, type: typeParam });
  const uploadMedia = useUploadMedia();
  const deleteMedia = useDeleteMedia();

  const allItems = data?.data || [];

  const filtered = allItems
    .filter((m) => m.originalName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.originalName.localeCompare(b.originalName);
      if (sortBy === "date") return b.createdAt.localeCompare(a.createdAt);
      if (sortBy === "size") return b.size - a.size;
      return 0;
    });

  const stats = {
    total: allItems.length,
    images: allItems.filter((m) => m.type === "IMAGE").length,
    videos: allItems.filter((m) => m.type === "VIDEO").length,
    audio: allItems.filter((m) => m.type === "AUDIO").length,
    documents: allItems.filter((m) => m.type === "DOCUMENT").length,
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      uploadMedia.mutate(file, {
        onSuccess: () => toast({ title: `"${file.name}" uploaded` }),
        onError: () => toast({ title: `Failed to upload "${file.name}"`, variant: "destructive" }),
      });
    });
  }, [uploadMedia, toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      uploadMedia.mutate(file, {
        onSuccess: () => toast({ title: `"${file.name}" uploaded` }),
        onError: () => toast({ title: `Failed to upload "${file.name}"`, variant: "destructive" }),
      });
    });
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((m) => m.id)));
    }
  };

  const deleteSelected = () => {
    const count = selected.size;
    selected.forEach((id) => deleteMedia.mutate(id));
    toast({ title: `${count} item(s) deleted` });
    setSelected(new Set());
  };

  const copyUrl = (item: MediaAsset) => {
    navigator.clipboard.writeText(item.url);
    toast({ title: "URL copied to clipboard" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Media Library</h1>
            <p className="text-sm text-muted-foreground">{stats.total} files · {stats.images} images · {stats.videos} videos</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-border gap-2">
              <FolderPlus className="w-4 h-4" /> New Folder
            </Button>
            <Button
              className="bg-gradient-gold text-primary font-semibold gap-2 hover:opacity-90"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4" /> Upload Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            />
          </div>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            isDragging
              ? "border-gold bg-gold/5 scale-[1.01]"
              : "border-border hover:border-muted-foreground/50"
          }`}
        >
          <CloudUpload className={`w-10 h-10 mx-auto mb-3 transition-colors ${isDragging ? "text-gold" : "text-muted-foreground"}`} />
          <p className="text-sm font-medium text-foreground">
            {isDragging ? "Drop files here to upload" : "Drag & drop files here"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            or{" "}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-gold hover:underline font-medium"
            >
              browse from your computer
            </button>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Supports images, video, audio, and documents up to 50 MB
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-60 bg-card border-border focus-visible:ring-gold"
              />
            </div>
            <Select value={filterType} onValueChange={(v) => setFilterType(v as MediaType)}>
              <SelectTrigger className="w-36 bg-card border-border">
                <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
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
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as "name" | "date" | "size")}>
              <SelectTrigger className="w-32 bg-card border-border">
                <SortAsc className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Newest</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="size">Size</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            {selected.size > 0 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                <Badge variant="secondary" className="font-normal">{selected.size} selected</Badge>
                <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())} className="text-muted-foreground h-8">
                  <X className="w-3.5 h-3.5" />
                </Button>
                <Button variant="destructive" size="sm" onClick={deleteSelected} className="h-8 gap-1.5">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </Button>
              </motion.div>
            )}
            <Button variant="ghost" size="sm" onClick={selectAll} className="text-muted-foreground h-8 text-xs">
              {selected.size === filtered.length ? "Deselect All" : "Select All"}
            </Button>
            <div className="flex border border-border rounded-md overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-none ${viewMode === "grid" ? "bg-accent text-foreground" : "text-muted-foreground"}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-none ${viewMode === "list" ? "bg-accent text-foreground" : "text-muted-foreground"}`}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            <AnimatePresence>
              {filtered.map((item) => {
                const Icon = typeIcons[item.type.toLowerCase()] || Image;
                const isSelected = selected.has(item.id);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card
                      className={`group cursor-pointer transition-all border-border hover:border-gold/40 overflow-hidden ${
                        isSelected ? "ring-2 ring-gold border-gold" : ""
                      }`}
                      onClick={() => toggleSelect(item.id)}
                      onDoubleClick={() => setPreviewItem(item)}
                    >
                      {/* Thumbnail */}
                      <div className="aspect-square relative bg-muted/30 overflow-hidden">
                        {item.thumbnailUrl ? (
                          <img src={item.thumbnailUrl} alt={item.originalName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Icon className="w-10 h-10 text-muted-foreground/40" />
                          </div>
                        )}
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 bg-black/50 text-white hover:bg-black/70"
                              onClick={(e) => { e.stopPropagation(); setPreviewItem(item); }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 bg-black/50 text-white hover:bg-black/70"
                              onClick={(e) => { e.stopPropagation(); copyUrl(item); }}
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                        {/* Selection check */}
                        <div className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          isSelected ? "bg-gold border-gold" : "border-white/60 group-hover:border-white bg-black/20"
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-primary" />}
                        </div>
                        {/* Type badge */}
                        <Badge className={`absolute top-2 right-2 text-[10px] px-1.5 py-0 ${typeColors[item.type.toLowerCase()] || ""}`}>
                          {item.type.toLowerCase()}
                        </Badge>
                      </div>
                      <CardContent className="p-2.5">
                        <p className="text-xs font-medium text-foreground truncate">{item.originalName}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {formatSize(item.size)} {item.width && item.height && `· ${item.width}×${item.height}`}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* List View */
          <Card className="border-border overflow-hidden">
            <div className="divide-y divide-border">
              {filtered.map((item) => {
                const Icon = typeIcons[item.type.toLowerCase()] || Image;
                const isSelected = selected.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 p-3 hover:bg-muted/30 cursor-pointer transition-colors ${
                      isSelected ? "bg-gold/5" : ""
                    }`}
                    onClick={() => toggleSelect(item.id)}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "bg-gold border-gold" : "border-border"
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-primary" />}
                    </div>
                    {item.thumbnailUrl ? (
                      <img src={item.thumbnailUrl} alt={item.originalName} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-muted/30 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.originalName}</p>
                      <p className="text-xs text-muted-foreground">{formatSize(item.size)} {item.width && item.height && `· ${item.width}×${item.height}`}</p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] ${typeColors[item.type.toLowerCase()] || ""}`}>
                      {item.type.toLowerCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setPreviewItem(item)}>
                          <Eye className="w-4 h-4 mr-2" /> Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyUrl(item)}>
                          <Copy className="w-4 h-4 mr-2" /> Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" /> Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            deleteMedia.mutate(item.id, {
                              onSuccess: () => toast({ title: `"${item.originalName}" deleted` }),
                            });
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Image className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">No files found</p>
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif">{previewItem?.originalName}</DialogTitle>
          </DialogHeader>
          {previewItem && (
            <div className="space-y-4">
              {previewItem.thumbnailUrl ? (
                <img src={previewItem.thumbnailUrl} alt={previewItem.originalName} className="w-full rounded-lg max-h-96 object-contain bg-muted/20" />
              ) : (
                <div className="w-full h-48 rounded-lg bg-muted/20 flex items-center justify-center">
                  {(() => { const Icon = typeIcons[previewItem.type.toLowerCase()] || Image; return <Icon className="w-16 h-16 text-muted-foreground/30" />; })()}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Type:</span> <span className="text-foreground capitalize ml-1">{previewItem.type.toLowerCase()}</span></div>
                <div><span className="text-muted-foreground">Size:</span> <span className="text-foreground ml-1">{formatSize(previewItem.size)}</span></div>
                {previewItem.width && previewItem.height && (
                  <div><span className="text-muted-foreground">Dimensions:</span> <span className="text-foreground ml-1">{previewItem.width}×{previewItem.height}</span></div>
                )}
                <div><span className="text-muted-foreground">Uploaded:</span> <span className="text-foreground ml-1">{new Date(previewItem.createdAt).toLocaleDateString()}</span></div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2 flex-1" onClick={() => copyUrl(previewItem)}>
                  <Copy className="w-4 h-4" /> Copy URL
                </Button>
                <Button variant="outline" className="gap-2 flex-1">
                  <Download className="w-4 h-4" /> Download
                </Button>
                <Button
                  variant="destructive"
                  className="gap-2"
                  onClick={() => {
                    deleteMedia.mutate(previewItem.id, {
                      onSuccess: () => {
                        setPreviewItem(null);
                        toast({ title: "File deleted" });
                      },
                    });
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default MediaLibrary;
