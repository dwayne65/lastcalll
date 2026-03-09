import { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useSeries,
  useCreateSeries,
  useUpdateSeries,
  useDeleteSeries,
} from "@/hooks/useApi";
import type { Series } from "@/lib/api-types";

const SeriesManager = () => {
  const { toast } = useToast();
  const { data: allSeries, isLoading } = useSeries();
  const createSeries = useCreateSeries();
  const updateSeries = useUpdateSeries();
  const deleteSeries = useDeleteSeries();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Series | null>(null);
  const [form, setForm] = useState({ title: "", description: "", coverUrl: "" });

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", description: "", coverUrl: "" });
    setDialogOpen(true);
  };

  const openEdit = (s: Series) => {
    setEditing(s);
    setForm({ title: s.title, description: s.description || "", coverUrl: s.coverUrl || "" });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    try {
      if (editing) {
        await updateSeries.mutateAsync({ id: editing.id, ...form });
        toast({ title: "Series updated" });
      } else {
        await createSeries.mutateAsync(form);
        toast({ title: "Series created" });
      }
      setDialogOpen(false);
    } catch {
      toast({ title: "Failed to save series", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSeries.mutateAsync(id);
      toast({ title: "Series deleted" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Series</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage sermon series and study groups</p>
          </div>
          <Button onClick={openNew} className="bg-gradient-gold text-primary font-semibold gap-2">
            <Plus className="w-4 h-4" /> New Series
          </Button>
        </div>

        <div className="grid gap-4">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {allSeries?.map((s) => (
            <Card key={s.id} className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                {s.coverUrl ? (
                  <img src={s.coverUrl} alt={s.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{s.title}</h3>
                  {s.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{s.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {(s as any)._count?.sermons ?? s.sermonCount ?? 0} sermons &middot; {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(s)} title="Edit">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(s.id)} title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {!isLoading && (!allSeries || allSeries.length === 0) && (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No series yet. Create one to group your sermons.</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">{editing ? "Edit Series" : "New Series"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Title *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Revelation Unsealed"
                className="mt-1"
                maxLength={200}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of this series..."
                className="mt-1"
                rows={3}
                maxLength={1000}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Cover Image URL</label>
              <Input
                value={form.coverUrl}
                onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
                placeholder="https://..."
                className="mt-1"
                maxLength={500}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                disabled={createSeries.isPending || updateSeries.isPending}
                className="bg-gradient-gold text-primary font-semibold"
              >
                {editing ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default SeriesManager;
