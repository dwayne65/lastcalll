import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2,
  Quote, Image, Link2, Undo, Redo, Save, Eye, Send, ArrowLeft,
  Code, AlignLeft, AlignCenter, AlignRight, Strikethrough,
  Type, Minus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MediaPickerDialog from "@/components/admin/MediaPickerDialog";
import MarkdownPreview from "@/components/admin/MarkdownPreview";
import { useAutosave } from "@/hooks/useAutosave";
import type { MediaItem } from "@/data/mediaData";

type ContentType = "sermon" | "blog" | "resource";
type PublishStatus = "draft" | "published" | "scheduled";

const toolbarGroups = [
  [
    { icon: Undo, label: "Undo", action: "undo" },
    { icon: Redo, label: "Redo", action: "redo" },
  ],
  [
    { icon: Heading1, label: "Heading 1", action: "h1" },
    { icon: Heading2, label: "Heading 2", action: "h2" },
    { icon: Type, label: "Paragraph", action: "p" },
  ],
  [
    { icon: Bold, label: "Bold", action: "bold" },
    { icon: Italic, label: "Italic", action: "italic" },
    { icon: Underline, label: "Underline", action: "underline" },
    { icon: Strikethrough, label: "Strikethrough", action: "strike" },
  ],
  [
    { icon: AlignLeft, label: "Align left", action: "left" },
    { icon: AlignCenter, label: "Center", action: "center" },
    { icon: AlignRight, label: "Align right", action: "right" },
  ],
  [
    { icon: List, label: "Bullet list", action: "ul" },
    { icon: ListOrdered, label: "Numbered list", action: "ol" },
    { icon: Quote, label: "Blockquote", action: "quote" },
    { icon: Code, label: "Code block", action: "code" },
    { icon: Minus, label: "Divider", action: "hr" },
  ],
  [
    { icon: Image, label: "Insert image", action: "image" },
    { icon: Link2, label: "Insert link", action: "link" },
  ],
];

const ContentEditor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const editType = (searchParams.get("type") as ContentType) || "sermon";

  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState<ContentType>(editType);
  const [status, setStatus] = useState<PublishStatus>("draft");
  const [speaker, setSpeaker] = useState("");
  const [scripture, setScripture] = useState("");
  const [date, setDate] = useState("");
  const [body, setBody] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

  const autosaveData = { title, contentType, status, speaker, scripture, date, body, seoTitle, seoDesc };
  const { lastSaved, loadSaved, clearSaved } = useAutosave(autosaveData, 30000);

  // Offer to restore draft on mount
  useEffect(() => {
    if (hasRestoredDraft) return;
    const saved = loadSaved();
    if (saved && (saved.title || saved.body)) {
      const restore = window.confirm("A saved draft was found. Would you like to restore it?");
      if (restore) {
        if (saved.title) setTitle(saved.title as string);
        if (saved.contentType) setContentType(saved.contentType as ContentType);
        if (saved.speaker) setSpeaker(saved.speaker as string);
        if (saved.scripture) setScripture(saved.scripture as string);
        if (saved.date) setDate(saved.date as string);
        if (saved.body) setBody(saved.body as string);
        if (saved.seoTitle) setSeoTitle(saved.seoTitle as string);
        if (saved.seoDesc) setSeoDesc(saved.seoDesc as string);
        toast({ title: "Draft restored", description: "Your previous work has been loaded." });
      } else {
        clearSaved();
      }
    }
    setHasRestoredDraft(true);
  }, []);

  const toggleFormat = (action: string) => {
    if (action === "image" || action === "link") {
      setMediaPickerOpen(true);
      return;
    }
    setActiveFormats((prev) =>
      prev.includes(action) ? prev.filter((a) => a !== action) : [...prev, action]
    );
  };

  const handleMediaInsert = (item: MediaItem) => {
    const tag = item.type === "image"
      ? `![${item.name}](${item.thumbnail || item.url})`
      : `[${item.name}](${item.url})`;
    setBody((prev) => prev ? `${prev}\n${tag}` : tag);
    toast({ title: "Media inserted", description: `"${item.name}" added to content.` });
  };

  const handleSave = (pub: PublishStatus) => {
    if (!title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    setStatus(pub);
    toast({
      title: pub === "published" ? "Content published!" : "Draft saved",
      description: pub === "published" ? `"${title}" is now live.` : "Your changes have been saved.",
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/content")}
              className="text-muted-foreground gap-1 hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Content
            </Button>
            {lastSaved && (
              <span className="text-xs text-muted-foreground">
                Autosaved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-border gap-2" onClick={() => handleSave("draft")}>
              <Save className="w-4 h-4" /> Save Draft
            </Button>
            <Button variant="outline" className="border-border gap-2" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="w-4 h-4" /> {showPreview ? "Edit" : "Preview"}
            </Button>
            <Button className="bg-gradient-gold text-primary font-semibold gap-2 hover:opacity-90" onClick={() => handleSave("published")}>
              <Send className="w-4 h-4" /> Publish
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main editor */}
          <div className="lg:col-span-2 space-y-4">
            <Input
              placeholder="Enter title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-serif font-bold h-14 bg-card border-border focus-visible:ring-gold"
              maxLength={200}
            />

            {/* Rich text toolbar / Preview */}
            <Card className="bg-card border-border">
              {showPreview ? (
                <CardContent className="p-0">
                  <MarkdownPreview content={body} title={title} />
                </CardContent>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-0 p-2 border-b border-border">
                    {toolbarGroups.map((group, gi) => (
                      <div key={gi} className="flex items-center">
                        {gi > 0 && <div className="w-px h-6 bg-border mx-1" />}
                        {group.map(({ icon: Icon, label, action }) => (
                          <Button
                            key={action}
                            type="button"
                            size="icon"
                            variant="ghost"
                            title={label}
                            onClick={() => toggleFormat(action)}
                            className={`h-8 w-8 ${
                              activeFormats.includes(action)
                                ? "bg-gold/10 text-gold"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </Button>
                        ))}
                      </div>
                    ))}
                  </div>
                  <CardContent className="p-0">
                    <Textarea
                      placeholder="Start writing your content here...

Use the toolbar above to format your text. You can add headings, bold, italic, lists, quotes, images, and more.

For sermons, consider structuring with:
• Opening Scripture
• Main Points (use headings)
• Supporting Scriptures
• Application
• Closing Appeal"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="min-h-[500px] border-0 rounded-none focus-visible:ring-0 resize-none text-sm leading-relaxed p-6 font-serif"
                    />
                  </CardContent>
                </>
              )}
            </Card>
          </div>

          {/* Sidebar settings */}
          <div className="space-y-4">
            {/* Status & Type */}
            <Card className="bg-card border-border">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-serif font-semibold text-foreground text-sm">Settings</h3>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Content Type</Label>
                  <Select value={contentType} onValueChange={(v) => setContentType(v as ContentType)}>
                    <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sermon">Sermon</SelectItem>
                      <SelectItem value="blog">Blog Post</SelectItem>
                      <SelectItem value="resource">Resource</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      status === "published" ? "bg-green-500" :
                      status === "scheduled" ? "bg-blue-500" : "bg-muted-foreground"
                    }`} />
                    <span className="text-sm text-foreground capitalize">{status}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Publish Date</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-background border-border focus-visible:ring-gold"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sermon-specific fields */}
            {contentType === "sermon" && (
              <Card className="bg-card border-border">
                <CardContent className="p-5 space-y-4">
                  <h3 className="font-serif font-semibold text-foreground text-sm">Sermon Details</h3>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Speaker</Label>
                    <Select value={speaker} onValueChange={setSpeaker}>
                      <SelectTrigger className="bg-background border-border"><SelectValue placeholder="Select speaker" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pastor James">Pastor James</SelectItem>
                        <SelectItem value="Elder Sarah">Elder Sarah</SelectItem>
                        <SelectItem value="Dr. Michael">Dr. Michael</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Scripture Reference</Label>
                    <Input
                      placeholder="e.g. Romans 3:21-26"
                      value={scripture}
                      onChange={(e) => setScripture(e.target.value)}
                      className="bg-background border-border focus-visible:ring-gold"
                      maxLength={100}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* SEO */}
            <Card className="bg-card border-border">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-serif font-semibold text-foreground text-sm">SEO Metadata</h3>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">SEO Title</Label>
                  <Input
                    placeholder="Custom page title"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="bg-background border-border focus-visible:ring-gold"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">{seoTitle.length}/60</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Meta Description</Label>
                  <Textarea
                    placeholder="Brief description for search engines"
                    value={seoDesc}
                    onChange={(e) => setSeoDesc(e.target.value)}
                    className="bg-background border-border focus-visible:ring-gold min-h-[80px]"
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground">{seoDesc.length}/160</p>
                </div>
                {/* Live SEO Preview */}
                <div className="bg-background rounded-lg p-4 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Search preview</p>
                  <p className="text-sm text-blue-600 font-medium truncate">
                    {seoTitle || title || "Page Title"}
                  </p>
                  <p className="text-xs text-green-700 truncate">lastcallmessages.org/sermons/...</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {seoDesc || "Add a meta description to see a preview here..."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <MediaPickerDialog
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={handleMediaInsert}
      />
    </AdminLayout>
  );
};

export default ContentEditor;
