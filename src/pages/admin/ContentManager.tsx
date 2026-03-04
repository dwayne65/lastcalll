import { useNavigate } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type ContentStatus = "published" | "draft" | "scheduled" | "pending";

const contentItems = [
  { id: 1, title: "The Seal of God and the Mark of the Beast", type: "Sermon", speaker: "Pastor James", status: "published" as ContentStatus, date: "Feb 15, 2026", views: 1240 },
  { id: 2, title: "Righteousness by Faith: The Heart of the Gospel", type: "Sermon", speaker: "Elder Sarah", status: "published" as ContentStatus, date: "Feb 8, 2026", views: 890 },
  { id: 3, title: "Understanding the 2300-Day Prophecy", type: "Sermon", speaker: "Dr. Michael", status: "draft" as ContentStatus, date: "—", views: 0 },
  { id: 4, title: "The Health Message: Temples of the Holy Spirit", type: "Blog", speaker: "Pastor James", status: "scheduled" as ContentStatus, date: "Mar 1, 2026", views: 0 },
  { id: 5, title: "Sabbath School Study Guide - Q1 2026", type: "Resource", speaker: "Elder Sarah", status: "pending" as ContentStatus, date: "—", views: 0 },
  { id: 6, title: "The Sabbath Rest: God's Gift for Weary Souls", type: "Sermon", speaker: "Pastor James", status: "published" as ContentStatus, date: "Feb 1, 2026", views: 2100 },
];

const statusColors: Record<ContentStatus, string> = {
  published: "bg-green-500/10 text-green-700 border-green-200",
  draft: "bg-muted text-muted-foreground border-border",
  scheduled: "bg-blue-500/10 text-blue-700 border-blue-200",
  pending: "bg-gold/10 text-gold-dark border-gold/30",
};

const ContentManager = () => {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(contentItems);
  const navigate = useNavigate();
  const { toast } = useToast();

  const filtered = items.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast({ title: "Content deleted", description: "The item has been removed." });
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Content Manager</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage sermons, blogs, and resources</p>
          </div>
          <Button className="bg-gradient-gold text-primary font-semibold gap-2 hover:opacity-90" onClick={() => navigate("/admin/content/new")}>
            <Plus className="w-4 h-4" /> New Content
          </Button>
        </div>

        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
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
                    <th className="text-left p-4 font-medium hidden md:table-cell">Type</th>
                    <th className="text-left p-4 font-medium hidden lg:table-cell">Author</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Date</th>
                    <th className="text-left p-4 font-medium hidden lg:table-cell">Views</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium text-foreground max-w-xs truncate">{item.title}</td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">{item.type}</td>
                      <td className="p-4 text-muted-foreground hidden lg:table-cell">{item.speaker}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[item.status]}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">{item.date}</td>
                      <td className="p-4 text-muted-foreground hidden lg:table-cell">{item.views.toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => navigate(`/sermons/${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}`)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => navigate(`/admin/content/${item.id}?type=sermon`)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
