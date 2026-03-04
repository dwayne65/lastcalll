import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Filter } from "lucide-react";
import { useState } from "react";

type DonationStatus = "success" | "pending" | "failed";

const donations = [
  { id: "TXN-001", donor: "Anonymous", email: "—", amount: 100, date: "Feb 15, 2026", status: "success" as DonationStatus, method: "Card" },
  { id: "TXN-002", donor: "Sarah Mitchell", email: "sarah@email.com", amount: 50, date: "Feb 15, 2026", status: "success" as DonationStatus, method: "Card" },
  { id: "TXN-003", donor: "James W.", email: "james@email.com", amount: 250, date: "Feb 14, 2026", status: "success" as DonationStatus, method: "PayPal" },
  { id: "TXN-004", donor: "Michael T.", email: "michael@email.com", amount: 75, date: "Feb 14, 2026", status: "pending" as DonationStatus, method: "Bank" },
  { id: "TXN-005", donor: "Anonymous", email: "—", amount: 25, date: "Feb 13, 2026", status: "failed" as DonationStatus, method: "Card" },
  { id: "TXN-006", donor: "Ruth Anderson", email: "ruth@email.com", amount: 500, date: "Feb 12, 2026", status: "success" as DonationStatus, method: "Card" },
  { id: "TXN-007", donor: "David Kim", email: "david@email.com", amount: 150, date: "Feb 11, 2026", status: "success" as DonationStatus, method: "PayPal" },
];

const statusStyles: Record<DonationStatus, string> = {
  success: "bg-green-500/10 text-green-700 border-green-200",
  pending: "bg-gold/10 text-gold-dark border-gold/30",
  failed: "bg-destructive/10 text-destructive border-destructive/30",
};

const DonationLedger = () => {
  const [search, setSearch] = useState("");

  const filtered = donations.filter(
    (d) => d.donor.toLowerCase().includes(search.toLowerCase()) || d.id.includes(search)
  );

  const totalSuccess = donations.filter((d) => d.status === "success").reduce((s, d) => s + d.amount, 0);

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
              <p className="text-2xl font-serif font-bold text-foreground mt-1">${totalSuccess.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">This Month</p>
              <p className="text-2xl font-serif font-bold text-foreground mt-1">${totalSuccess.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Transactions</p>
              <p className="text-2xl font-serif font-bold text-foreground mt-1">{donations.length}</p>
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
                    <th className="text-left p-4 font-medium">ID</th>
                    <th className="text-left p-4 font-medium">Donor</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Email</th>
                    <th className="text-right p-4 font-medium">Amount</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Date</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium hidden lg:table-cell">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => (
                    <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4 text-muted-foreground font-mono text-xs">{d.id}</td>
                      <td className="p-4 font-medium text-foreground">{d.donor}</td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">{d.email}</td>
                      <td className="p-4 text-right font-semibold text-foreground">${d.amount}</td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">{d.date}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[d.status]}`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground hidden lg:table-cell">{d.method}</td>
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

export default DonationLedger;
