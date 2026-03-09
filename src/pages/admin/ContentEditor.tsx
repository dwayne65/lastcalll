import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
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
import { useCreateSermon, useUpdateSermon, useSpeakers, useCreatePost, useUpdatePost, useCreateResource, useUpdateResource, useUploadMedia, useSeries, useTags } from "@/hooks/useApi";
import { api } from "@/lib/api-client";
import type { Sermon, Post, Resource } from "@/lib/api-types";
import type { MediaItem } from "@/data/mediaData";
import { Paperclip, Upload, X } from "lucide-react";

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
  const { id } = useParams();
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

  const [videoUrl, setVideoUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [attachments, setAttachments] = useState<{ name: string; url: string }[]>([]);

  // Common fields
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [seriesId, setSeriesId] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");

  // Resource-specific
  const [resourceType, setResourceType] = useState("document");
  const [fileUrl, setFileUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  const createSermon = useCreateSermon();
  const updateSermon = useUpdateSermon();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const createResource = useCreateResource();
  const updateResource = useUpdateResource();
  const { data: speakerList } = useSpeakers();
  const { data: allSeries } = useSeries();
  const { data: allTags } = useTags();
  const uploadMedia = useUploadMedia();

  const autosaveData = { title, contentType, status, speaker, scripture, date, body, seoTitle, seoDesc };
  const { lastSaved, loadSaved, clearSaved } = useAutosave(autosaveData, 30000);

  // Load existing content when editing
  useEffect(() => {
    if (!id) return;
    if (contentType === "blog") {
      api.get<Post>(`/posts/${id}`).then((p) => {
        setTitle(p.title);
        setBody(p.body || "");
        setStatus(p.status === "PUBLISHED" ? "published" : "draft");
        setDate(p.publishedAt ? new Date(p.publishedAt).toISOString().split("T")[0] : "");
        setSelectedTagIds(p.tags?.map((t) => t.id) || []);
        setFeaturedImage(p.featuredImage || "");
        setSeriesId(p.seriesId || "");
      }).catch(() => {});
    } else if (contentType === "resource") {
      api.get<Resource>(`/resources/${id}`).then((r) => {
        setTitle(r.title);
        setBody(r.description || "");
        setStatus(r.status === "PUBLISHED" ? "published" : "draft");
        setDate(r.publishedAt ? new Date(r.publishedAt).toISOString().split("T")[0] : "");
        setResourceType(r.type || "document");
        setFileUrl(r.fileUrl || "");
        setCoverUrl(r.coverUrl || "");
        setSelectedTagIds(r.tags?.map((t) => t.id) || []);
        setSeriesId(r.seriesId || "");
      }).catch(() => {});
    } else {
      api.get<Sermon>(`/sermons/${id}`).then((s) => {
        setTitle(s.title);
        setSpeaker(s.speaker || "");
        setScripture(s.scripture || "");
        setBody(s.transcript || s.description || "");
        setStatus(s.status === "PUBLISHED" ? "published" : "draft");
        setDate(s.publishedAt ? new Date(s.publishedAt).toISOString().split("T")[0] : "");
        setSeoTitle(s.seoTitle || "");
        setSeoDesc(s.seoDescription || "");
        setVideoUrl(s.videoUrl || "");
        setAudioUrl(s.audioUrl || "");
        setPdfUrl(s.pdfUrl || "");
        setSeriesId(s.seriesId || "");
        setSelectedTagIds(s.tags?.map((t) => t.id) || []);
      }).catch(() => {});
    }
  }, [id, contentType]);

  // Offer to restore draft on mount (only for new content)
  useEffect(() => {
    if (hasRestoredDraft || id) return;
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

  const handleFileAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      try {
        const asset = await uploadMedia.mutateAsync(file);
        setAttachments((prev) => [...prev, { name: file.name, url: asset.url }]);
        toast({ title: `"${file.name}" attached` });
      } catch {
        toast({ title: `Failed to upload "${file.name}"`, variant: "destructive" });
      }
    }
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (pub: PublishStatus) => {
    if (!title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    const targetStatus = pub === "published" ? "PUBLISHED" : "DRAFT";
    try {
      if (contentType === "blog") {
        const blogPayload = {
          title,
          body,
          status: targetStatus,
          excerpt: body.slice(0, 200),
          featuredImage: featuredImage || undefined,
          seriesId: seriesId && seriesId !== "none" ? seriesId : undefined,
          tagIds: selectedTagIds.length ? selectedTagIds : undefined,
        };
        if (id) {
          await updatePost.mutateAsync({ id, ...blogPayload } as any);
        } else {
          await createPost.mutateAsync(blogPayload as any);
        }
      } else if (contentType === "resource") {
        const resourcePayload = {
          title,
          description: body,
          type: resourceType,
          fileUrl: fileUrl || attachments[0]?.url || "",
          coverUrl: coverUrl || undefined,
          status: targetStatus,
          seriesId: seriesId && seriesId !== "none" ? seriesId : undefined,
          tagIds: selectedTagIds.length ? selectedTagIds : undefined,
        };
        if (id) {
          await updateResource.mutateAsync({ id, ...resourcePayload } as any);
        } else {
          await createResource.mutateAsync(resourcePayload as any);
        }
      } else {
        // Sermon
        const attachmentText = attachments.length
          ? "\n\n---\n**Attachments:**\n" + attachments.map((a) => `- [${a.name}](${a.url})`).join("\n")
          : "";
        const sermonPayload: Record<string, unknown> = {
          title,
          speaker: speaker || "Unknown",
          scripture,
          description: body,
          transcript: body + attachmentText,
          status: targetStatus,
          scheduledAt: date || undefined,
          videoUrl: videoUrl || undefined,
          audioUrl: audioUrl || undefined,
          pdfUrl: pdfUrl || attachments.find((a) => a.name.endsWith(".pdf"))?.url || undefined,
          seoTitle: seoTitle || undefined,
          seoDescription: seoDesc || undefined,
          seriesId: seriesId && seriesId !== "none" ? seriesId : undefined,
          tagIds: selectedTagIds.length ? selectedTagIds : undefined,
        };
        if (id) {
          await updateSermon.mutateAsync({ id, ...sermonPayload } as any);
        } else {
          await createSermon.mutateAsync(sermonPayload as any);
        }
      }
      clearSaved();
      setStatus(pub);
      toast({
        title: pub === "published" ? "Content published!" : "Draft saved",
        description: pub === "published" ? `"${title}" is now live.` : "Your changes have been saved.",
      });
      navigate("/admin/content");
    } catch {
      toast({ title: "Save failed", description: "Please try again.", variant: "destructive" });
    }
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

            {/* Series — available for ALL content types */}
            <Card className="bg-card border-border">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-serif font-semibold text-foreground text-sm">Series</h3>
                <p className="text-xs text-muted-foreground">Optionally group this content into a series</p>
                <Select value={seriesId} onValueChange={setSeriesId}>
                  <SelectTrigger className="bg-background border-border"><SelectValue placeholder="Standalone (no series)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Standalone (no series)</SelectItem>
                    {allSeries?.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Sermon-specific fields */}
            {contentType === "sermon" && (
              <Card className="bg-card border-border">
                <CardContent className="p-5 space-y-4">
                  <h3 className="font-serif font-semibold text-foreground text-sm">Sermon Details</h3>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Speaker</Label>
                    <Input
                      placeholder="e.g. Pastor James"
                      value={speaker}
                      onChange={(e) => setSpeaker(e.target.value)}
                      className="bg-background border-border focus-visible:ring-gold"
                      list="speaker-list"
                      maxLength={200}
                    />
                    <datalist id="speaker-list">
                      {(speakerList || []).map((sp) => (
                        <option key={sp} value={sp} />
                      ))}
                    </datalist>
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
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Video</Label>
                    {videoUrl ? (
                      <div className="flex items-center gap-2 text-sm bg-background rounded p-2 border border-border">
                        <span className="truncate flex-1 text-xs">{videoUrl.split("/").pop()}</span>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setVideoUrl("")}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-gold hover:text-gold-dark">
                          <Upload className="w-4 h-4" />
                          <span>{uploadMedia.isPending ? "Uploading..." : "Upload Video"}</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="video/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const asset = await uploadMedia.mutateAsync(file);
                                setVideoUrl(asset.url);
                                toast({ title: "Video uploaded" });
                              } catch { toast({ title: "Upload failed", variant: "destructive" }); }
                              e.target.value = "";
                            }}
                            disabled={uploadMedia.isPending}
                          />
                        </label>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="border-t border-border flex-1" />
                          <span>or paste URL</span>
                          <span className="border-t border-border flex-1" />
                        </div>
                        <Input
                          placeholder="https://youtube.com/..."
                          onChange={(e) => setVideoUrl(e.target.value)}
                          className="bg-background border-border focus-visible:ring-gold text-sm h-8"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Audio</Label>
                    {audioUrl ? (
                      <div className="flex items-center gap-2 text-sm bg-background rounded p-2 border border-border">
                        <span className="truncate flex-1 text-xs">{audioUrl.split("/").pop()}</span>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setAudioUrl("")}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-gold hover:text-gold-dark">
                        <Upload className="w-4 h-4" />
                        <span>{uploadMedia.isPending ? "Uploading..." : "Upload Audio"}</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="audio/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const asset = await uploadMedia.mutateAsync(file);
                              setAudioUrl(asset.url);
                              toast({ title: "Audio uploaded" });
                            } catch { toast({ title: "Upload failed", variant: "destructive" }); }
                            e.target.value = "";
                          }}
                          disabled={uploadMedia.isPending}
                        />
                      </label>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Post-specific: Featured Image */}
            {contentType === "blog" && (
              <Card className="bg-card border-border">
                <CardContent className="p-5 space-y-4">
                  <h3 className="font-serif font-semibold text-foreground text-sm">Featured Image</h3>
                  {featuredImage ? (
                    <div className="space-y-2">
                      <img src={featuredImage} alt="Featured" className="w-full h-32 object-cover rounded border border-border" />
                      <Button size="sm" variant="ghost" className="text-xs text-destructive" onClick={() => setFeaturedImage("")}>
                        <X className="w-3 h-3 mr-1" /> Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gold hover:text-gold-dark">
                      <Upload className="w-4 h-4" />
                      <span>{uploadMedia.isPending ? "Uploading..." : "Upload Image"}</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const asset = await uploadMedia.mutateAsync(file);
                            setFeaturedImage(asset.url);
                            toast({ title: "Image uploaded" });
                          } catch { toast({ title: "Upload failed", variant: "destructive" }); }
                          e.target.value = "";
                        }}
                        disabled={uploadMedia.isPending}
                      />
                    </label>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Resource-specific fields */}
            {contentType === "resource" && (
              <Card className="bg-card border-border">
                <CardContent className="p-5 space-y-4">
                  <h3 className="font-serif font-semibold text-foreground text-sm">Resource Details</h3>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Resource Type</Label>
                    <Select value={resourceType} onValueChange={setResourceType}>
                      <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="study-guide">Study Guide</SelectItem>
                        <SelectItem value="presentation">Presentation</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Resource File</Label>
                    {fileUrl ? (
                      <div className="flex items-center gap-2 text-sm bg-background rounded p-2 border border-border">
                        <Paperclip className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span className="truncate flex-1 text-xs">{fileUrl.split("/").pop()}</span>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setFileUrl("")}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-gold hover:text-gold-dark">
                          <Upload className="w-4 h-4" />
                          <span>{uploadMedia.isPending ? "Uploading..." : `Upload ${resourceType === "audio" ? "Audio" : resourceType === "video" ? "Video" : "File"}`}</span>
                          <input
                            type="file"
                            className="hidden"
                            accept={resourceType === "audio" ? "audio/*" : resourceType === "video" ? "video/*" : undefined}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const asset = await uploadMedia.mutateAsync(file);
                                setFileUrl(asset.url);
                                toast({ title: "File uploaded" });
                              } catch { toast({ title: "Upload failed", variant: "destructive" }); }
                              e.target.value = "";
                            }}
                            disabled={uploadMedia.isPending}
                          />
                        </label>
                        {resourceType === "video" && (
                          <>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="border-t border-border flex-1" />
                              <span>or paste URL</span>
                              <span className="border-t border-border flex-1" />
                            </div>
                            <Input
                              placeholder="https://youtube.com/..."
                              onChange={(e) => setFileUrl(e.target.value)}
                              className="bg-background border-border focus-visible:ring-gold text-sm h-8"
                            />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Cover Image</Label>
                    {coverUrl ? (
                      <div className="space-y-2">
                        <img src={coverUrl} alt="Cover" className="w-full h-24 object-cover rounded border border-border" />
                        <Button size="sm" variant="ghost" className="text-xs text-destructive" onClick={() => setCoverUrl("")}>
                          <X className="w-3 h-3 mr-1" /> Remove
                        </Button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-gold hover:text-gold-dark">
                        <Upload className="w-4 h-4" />
                        <span>{uploadMedia.isPending ? "Uploading..." : "Upload Cover"}</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const asset = await uploadMedia.mutateAsync(file);
                              setCoverUrl(asset.url);
                              toast({ title: "Cover uploaded" });
                            } catch { toast({ title: "Upload failed", variant: "destructive" }); }
                            e.target.value = "";
                          }}
                          disabled={uploadMedia.isPending}
                        />
                      </label>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags (for all content types) */}
            <Card className="bg-card border-border">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-serif font-semibold text-foreground text-sm">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags?.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() =>
                        setSelectedTagIds((prev) =>
                          prev.includes(t.id) ? prev.filter((x) => x !== t.id) : [...prev, t.id]
                        )
                      }
                      className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                        selectedTagIds.includes(t.id)
                          ? "bg-gold/10 text-gold border-gold/30 font-medium"
                          : "bg-background text-muted-foreground border-border hover:border-gold/30"
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                  {(!allTags || allTags.length === 0) && (
                    <p className="text-xs text-muted-foreground">No tags available. Create tags in the admin panel.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* File Attachments */}
            <Card className="bg-card border-border">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-serif font-semibold text-foreground text-sm">Attachments</h3>
                <p className="text-xs text-muted-foreground">Attach supplementary files to this content</p>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gold hover:text-gold-dark">
                  <Paperclip className="w-4 h-4" />
                  <span>{uploadMedia.isPending ? "Uploading..." : "Attach Files"}</span>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileAttach}
                    disabled={uploadMedia.isPending}
                  />
                </label>
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((a, i) => (
                      <div key={i} className="flex items-center justify-between text-sm bg-background rounded p-2 border border-border">
                        <span className="truncate flex-1">{a.name}</span>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeAttachment(i)}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

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
