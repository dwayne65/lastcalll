import { useNavigate } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, FileText, Users, TrendingUp, Plus } from "lucide-react";

const stats = [
  { label: "Total Donations", value: "$12,450", change: "+12%", icon: DollarSign },
  { label: "Published Sermons", value: "48", change: "+3", icon: FileText },
  { label: "Active Users", value: "1,247", change: "+8%", icon: Users },
  { label: "Views This Month", value: "52.3K", change: "+24%", icon: TrendingUp },
];

const recentActivity = [
  { action: "Sermon published", detail: "The Seal of God and the Mark of the Beast", time: "2 hours ago", type: "publish" },
  { action: "Donation received", detail: "$100.00 from Anonymous", time: "4 hours ago", type: "donation" },
  { action: "Content edited", detail: "Righteousness by Faith draft updated", time: "6 hours ago", type: "edit" },
  { action: "New subscriber", detail: "john.doe@email.com joined newsletter", time: "8 hours ago", type: "user" },
  { action: "Donation received", detail: "$50.00 from Sarah M.", time: "12 hours ago", type: "donation" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
  <AdminLayout>
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back, Pastor James</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-gradient-gold text-primary font-semibold gap-2 hover:opacity-90" onClick={() => navigate("/admin/content/new?type=sermon")}>
            <Plus className="w-4 h-4" /> New Sermon
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, change, icon: Icon }) => (
          <Card key={label} className="bg-card border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
                  <p className="text-2xl font-serif font-bold text-foreground mt-1">{value}</p>
                  <p className="text-xs text-gold font-medium mt-1">{change} this month</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  item.type === "donation" ? "bg-gold" :
                  item.type === "publish" ? "bg-green-500" :
                  item.type === "edit" ? "bg-blue-500" : "bg-muted-foreground"
                }`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
  );
};

export default AdminDashboard;
