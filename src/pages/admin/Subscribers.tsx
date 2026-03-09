import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Users, UserCheck, UserX } from "lucide-react";
import { useState } from "react";
import { useAdminSubscribers, useSubscriberStats } from "@/hooks/useApi";

const Subscribers = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminSubscribers({ page, limit: 25 });
  const { data: stats } = useSubscriberStats();

  const subscribers = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Subscribers</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage newsletter subscribers</p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="w-8 h-8 text-gold" />
              <div>
                <p className="text-2xl font-bold text-foreground">{stats?.total ?? "—"}</p>
                <p className="text-xs text-muted-foreground">Total Subscribers</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-foreground">{stats?.active ?? "—"}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <UserX className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{(stats?.total ?? 0) - (stats?.active ?? 0)}</p>
                <p className="text-xs text-muted-foreground">Unsubscribed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border">
            <p className="text-sm text-muted-foreground">Showing {subscribers.length} of {data?.total || 0} subscribers</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left p-4 font-medium">Email</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Name</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Subscribed</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium text-foreground">{sub.email}</td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">
                        {[sub.firstName, sub.lastName].filter(Boolean).join(" ") || "—"}
                      </td>
                      <td className="p-4">
                        {sub.isActive ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-200">Unsubscribed</Badge>
                        )}
                      </td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">
                        {new Date(sub.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                  {!isLoading && subscribers.length === 0 && (
                    <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No subscribers yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
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
    </AdminLayout>
  );
};

export default Subscribers;
