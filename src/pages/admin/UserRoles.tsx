import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Shield, User, Edit, Trash2 } from "lucide-react";

type Role = "admin" | "editor" | "viewer";

const users = [
  { id: 1, name: "Pastor James Whitfield", email: "james@lastcallmessages.org", role: "admin" as Role, lastActive: "2 hours ago", avatar: "JW" },
  { id: 2, name: "Elder Sarah Mitchell", email: "sarah@lastcallmessages.org", role: "editor" as Role, lastActive: "6 hours ago", avatar: "SM" },
  { id: 3, name: "Dr. Michael Thornton", email: "michael@lastcallmessages.org", role: "editor" as Role, lastActive: "1 day ago", avatar: "MT" },
  { id: 4, name: "Ruth Anderson", email: "ruth@lastcallmessages.org", role: "viewer" as Role, lastActive: "3 days ago", avatar: "RA" },
  { id: 5, name: "David Kim", email: "david@lastcallmessages.org", role: "viewer" as Role, lastActive: "1 week ago", avatar: "DK" },
];

const roleStyles: Record<Role, string> = {
  admin: "bg-destructive/10 text-destructive border-destructive/30",
  editor: "bg-gold/10 text-gold-dark border-gold/30",
  viewer: "bg-muted text-muted-foreground border-border",
};

const permissions: Record<Role, string[]> = {
  admin: ["Manage users", "Manage content", "View donations", "Edit settings", "Publish content"],
  editor: ["Manage content", "View donations", "Publish content"],
  viewer: ["View content", "View donations"],
};

const UserRoles = () => (
  <AdminLayout>
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Users & Roles</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage team access and permissions</p>
        </div>
        <Button className="bg-gradient-gold text-primary font-semibold gap-2 hover:opacity-90">
          <Plus className="w-4 h-4" /> Invite User
        </Button>
      </div>

      {/* Permission Matrix */}
      <Card className="bg-card border-border mb-8">
        <CardHeader>
          <CardTitle className="font-serif text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold" /> Permission Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-6">
            {(["admin", "editor", "viewer"] as Role[]).map((role) => (
              <div key={role} className="p-4 rounded-lg bg-background border border-border">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider ${roleStyles[role]}`}>
                  {role}
                </span>
                <ul className="mt-3 space-y-1.5">
                  {permissions[role].map((perm) => (
                    <li key={perm} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold" /> {perm}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Team Members</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Email</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Last Active</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gold/10 text-gold font-semibold text-xs flex items-center justify-center">
                          {user.avatar}
                        </div>
                        <span className="font-medium text-foreground">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">{user.email}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleStyles[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">{user.lastActive}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive">
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

export default UserRoles;
