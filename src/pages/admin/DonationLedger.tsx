import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Filter } from "lucide-react";
import { useState } from "react";
import { useDonations, useDonationStats } from "@/hooks/useApi";

const statusStyles: Record<string, string> = {
  SUCCESS: "bg-green-500/10 text-green-700 border-green-200",
  PENDING: "bg-gold/10 text-gold-dark border-gold/30",
  FAILED: "bg-destructive/10 text-destructive border-destructive/30",
  INITIATED: "bg-blue-500/10 text-blue-700 border-blue-200",
  CANCELLED: "bg-muted text-muted-foreground border-border",
};

const DonationLedger = () => {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useDonations({ search: search || undefined, limit: 50 });
  const { data: stats } = useDonationStats();

  const donations = data?.data || [];

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Donation Ledger</h1>
            <p className="text-sm text-muted-foreground mt-1">Track and manage all donations</p>
          </div>
          <Button variant="outline" className="border-border text-muted-foreground hover:border-gold/50 gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Received</p>
              <p className="text-2xl font-serif font-bold text-foreground mt-1">
                ${stats?.totalAmount?.toLocaleString() ?? "—"}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">This Month</p>
              <p className="text-2xl font-serif font-bold text-foreground mt-1">
                ${stats?.monthlyAmount?.toLocaleString() ?? "—"}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Transactions</p>
              <p className="text-2xl font-serif font-bold text-foreground mt-1">
                {stats?.totalCount ?? data?.total ?? "—"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by donor or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background border-border focus-visible:ring-gold"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left p-4 font-medium">Donor</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Email</th>
                    <th className="text-right p-4 font-medium">Amount</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Date</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium hidden lg:table-cell">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium text-foreground">{d.donorName || "Anonymous"}</td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">{d.donorEmail || "—"}</td>
                      <td className="p-4 text-right font-semibold text-foreground">${d.amount}</td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">
                        {new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[d.status] || statusStyles.PENDING}`}>
                          {d.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground hidden lg:table-cell">{d.paymentMethod || "—"}</td>
                    </tr>
                  ))}
                  {!isLoading && donations.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No donations found</td></tr>
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

export default DonationLedger;
