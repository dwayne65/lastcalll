import { useNavigate } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAdminSermons, useDeleteSermon, useAdminPosts, useDeletePost, useAdminResources, useDeleteResource } from "@/hooks/useApi";

const statusColors: Record<string, string> = {
  PUBLISHED: "bg-green-500/10 text-green-700 border-green-200",
  DRAFT: "bg-muted text-muted-foreground border-border",
  SCHEDULED: "bg-blue-500/10 text-blue-700 border-blue-200",
  PENDING: "bg-gold/10 text-gold-dark border-gold/30",
  ARCHIVED: "bg-muted text-muted-foreground border-border",
};

type ContentTab = "sermons" | "posts" | "resources";

const ContentManager = () => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<ContentTab>("sermons");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: sermonData, isLoading: loadingSermons } = useAdminSermons({ search: search || undefined, limit: 50 });
  const { data: postData, isLoading: loadingPosts } = useAdminPosts({ search: search || undefined, limit: 50 });
  const { data: resourceData, isLoading: loadingResources } = useAdminResources({ search: search || undefined, limit: 50 });
  const deleteSermon = useDeleteSermon();
  const deletePost = useDeletePost();
  const deleteResource = useDeleteResource();

  const sermons = sermonData?.data || [];
  const posts = postData?.data || [];
  const resources = resourceData?.data || [];

  const handleDelete = async (id: string, type: ContentTab) => {
    try {
      if (type === "sermons") await deleteSermon.mutateAsync(id);
      else if (type === "posts") await deletePost.mutateAsync(id);
      else await deleteResource.mutateAsync(id);
      toast({ title: "Content deleted", description: "The item has been removed." });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  const isLoading = tab === "sermons" ? loadingSermons : tab === "posts" ? loadingPosts : loadingResources;

  const items = tab === "sermons"
    ? sermons.map((s) => ({ id: s.id, title: s.title, slug: s.slug, subtitle: s.speaker, status: s.status, date: s.publishedAt || s.createdAt, views: s.viewCount }))
    : tab === "posts"
    ? posts.map((p) => ({ id: p.id, title: p.title, slug: p.slug, subtitle: p.author ? `${p.author.firstName} ${p.author.lastName}` : "", status: p.status, date: p.publishedAt || p.createdAt, views: p.viewCount }))
    : resources.map((r) => ({ id: r.id, title: r.title, slug: r.slug, subtitle: r.type, status: r.status, date: r.publishedAt || r.createdAt, views: r.downloadCount }));

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Content Manager</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage sermons, blogs, and resources</p>
          </div>
          <Button className="bg-gradient-gold text-primary font-semibold gap-2 hover:opacity-90" onClick={() => navigate(`/admin/content/new?type=${tab === "sermons" ? "sermon" : tab === "posts" ? "post" : "resource"}`)}>
            <Plus className="w-4 h-4" /> New {tab === "sermons" ? "Sermon" : tab === "posts" ? "Post" : "Resource"}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-muted p-1 rounded-lg w-fit">
          {([["sermons", "Sermons"], ["posts", "Posts"], ["resources", "Resources"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${tab}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-background border-border focus-visible:ring-gold"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left p-4 font-medium">Title</th>
                    <th className="text-left p-4 font-medium hidden lg:table-cell">{tab === "sermons" ? "Speaker" : tab === "posts" ? "Author" : "Type"}</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Date</th>
                    <th className="text-left p-4 font-medium hidden lg:table-cell">{tab === "resources" ? "Downloads" : "Views"}</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium text-foreground max-w-xs truncate">{item.title}</td>
                      <td className="p-4 text-muted-foreground hidden lg:table-cell">{item.subtitle}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[item.status] || statusColors.DRAFT}`}>
                          {item.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">
                        {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="p-4 text-muted-foreground hidden lg:table-cell">{(item.views || 0).toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => navigate(`/${tab === "sermons" ? "sermons" : tab === "posts" ? "blog" : "resources"}/${item.slug}`)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => navigate(`/admin/content/${item.id}?type=${tab === "sermons" ? "sermon" : tab === "posts" ? "post" : "resource"}`)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(item.id, tab)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!isLoading && items.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No {tab} found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ContentManager;
