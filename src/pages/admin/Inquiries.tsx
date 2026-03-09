import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, MailOpen, Trash2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAdminInquiries, useMarkInquiryRead, useDeleteInquiry } from "@/hooks/useApi";
import type { Inquiry } from "@/lib/api-types";

const Inquiries = () => {
  const [page, setPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const { toast } = useToast();
  const { data, isLoading } = useAdminInquiries({ page, limit: 25 });
  const markRead = useMarkInquiryRead();
  const deleteInquiry = useDeleteInquiry();

  const inquiries = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handleOpen = async (inq: Inquiry) => {
    setSelectedInquiry(inq);
    if (!inq.isRead) {
      try {
        await markRead.mutateAsync(inq.id);
      } catch { /* silently continue */ }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInquiry.mutateAsync(id);
      toast({ title: "Inquiry deleted" });
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Inquiries</h1>
            <p className="text-sm text-muted-foreground mt-1">Messages from the contact form</p>
          </div>
        </div>

        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border">
            <p className="text-sm text-muted-foreground">
              {data?.total || 0} total inquiries
            </p>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-border">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className={`p-4 transition-colors cursor-pointer hover:bg-muted/50 ${!inq.isRead ? "bg-gold/5" : ""}`}
                onClick={() => handleOpen(inq)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {inq.isRead ? (
                        <MailOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                      )}
                      <span className="font-medium text-foreground truncate">{inq.name}</span>
                      <span className="text-xs text-muted-foreground">&lt;{inq.email}&gt;</span>
                      {!inq.isRead && (
                        <Badge variant="outline" className="bg-gold/10 text-gold-dark border-gold/30 text-xs">New</Badge>
                      )}
                    </div>
                    {inq.subject && (
                      <p className="text-sm font-medium text-foreground/80 mb-1">{inq.subject}</p>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {inq.message.slice(0, 150)}{inq.message.length > 150 ? "..." : ""}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(inq.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(inq.id)} title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {!isLoading && inquiries.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">No inquiries yet</div>
            )}
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded text-sm ${p === page ? "bg-gold text-primary font-semibold" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Full inquiry dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={(open) => { if (!open) setSelectedInquiry(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {selectedInquiry?.subject || "Inquiry"}
            </DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <div>
                  <span className="text-muted-foreground">From: </span>
                  <span className="font-medium">{selectedInquiry.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Email: </span>
                  <span className="font-medium">{selectedInquiry.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Date: </span>
                  <span>{new Date(selectedInquiry.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap max-h-[50vh] overflow-y-auto">
                {selectedInquiry.message}
              </div>

              <div className="flex justify-between items-center pt-2">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject || "Your inquiry")}`}
                  className="inline-flex items-center gap-2 text-sm text-gold hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Reply via email
                </a>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(selectedInquiry.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Inquiries;
