import { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
} from "@/hooks/useApi";
import type { Tag } from "@/lib/api-types";

const TagsManager = () => {
  const { toast } = useToast();
  const { data: tags, isLoading } = useTags();
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [name, setName] = useState("");

  const openNew = () => {
    setEditing(null);
    setName("");
    setDialogOpen(true);
  };

  const openEdit = (t: Tag) => {
    setEditing(t);
    setName(t.name);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    try {
      if (editing) {
        await updateTag.mutateAsync({ id: editing.id, name });
        toast({ title: "Tag updated" });
      } else {
        await createTag.mutateAsync({ name });
        toast({ title: "Tag created" });
      }
      setDialogOpen(false);
    } catch {
      toast({ title: "Failed to save tag", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTag.mutateAsync(id);
      toast({ title: "Tag deleted" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Tags</h1>
            <p className="text-sm text-muted-foreground mt-1">Labels for quick content discovery</p>
          </div>
          <Button onClick={openNew} className="bg-gradient-gold text-primary font-semibold gap-2">
            <Plus className="w-4 h-4" /> New Tag
          </Button>
        </div>

        {isLoading && <p className="text-muted-foreground">Loading...</p>}

        <div className="flex flex-wrap gap-3">
          {tags?.map((t) => (
            <Card key={t.id} className="bg-card border-border">
              <CardContent className="p-3 flex items-center gap-3">
                <Hash className="w-4 h-4 text-gold flex-shrink-0" />
                <span className="font-medium text-foreground">{t.name}</span>
                <div className="flex gap-0.5 flex-shrink-0">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(t)} title="Edit">
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(t.id)} title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!isLoading && (!tags || tags.length === 0) && (
          <div className="text-center py-12 text-muted-foreground">
            <Hash className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No tags yet. Create tags to label and discover content easily.</p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif">{editing ? "Edit Tag" : "New Tag"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Prophecy"
                className="mt-1"
                maxLength={50}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                disabled={createTag.isPending || updateTag.isPending}
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

export default TagsManager;
