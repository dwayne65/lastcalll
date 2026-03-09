import { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Shield, Edit, Trash2 } from "lucide-react";
import { useAdminUsers, useDeleteUser, useInviteUser, useUpdateUser } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import type { User, Role } from "@/lib/api-types";

const roleStyles: Record<string, string> = {
  SUPER_ADMIN: "bg-destructive/10 text-destructive border-destructive/30",
  ADMIN: "bg-destructive/10 text-destructive border-destructive/30",
  EDITOR: "bg-gold/10 text-gold-dark border-gold/30",
  CONTRIBUTOR: "bg-blue-500/10 text-blue-700 border-blue-200",
  FINANCE: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  VIEWER: "bg-muted text-muted-foreground border-border",
};

const permissions: Record<string, string[]> = {
  ADMIN: ["Manage users", "Manage content", "View donations", "Edit settings", "Publish content"],
  EDITOR: ["Manage content", "View donations", "Publish content"],
  VIEWER: ["View content", "View donations"],
};

const UserRoles = () => {
  const { toast } = useToast();
  const { data, isLoading } = useAdminUsers({ limit: 50 });
  const deleteUser = useDeleteUser();
  const inviteUser = useInviteUser();
  const updateUser = useUpdateUser();

  const users = data?.data || [];

  // Add user dialog state
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteFirstName, setInviteFirstName] = useState("");
  const [inviteLastName, setInviteLastName] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("VIEWER");
  const [invitePassword, setInvitePassword] = useState("");

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<Role>("VIEWER");
  const [editActive, setEditActive] = useState(true);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  const formatLastActive = (dateStr?: string) => {
    if (!dateStr) return "Never";
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"?`)) return;
    deleteUser.mutate(id, {
      onSuccess: () => toast({ title: "User deleted" }),
      onError: () => toast({ title: "Failed to delete user", variant: "destructive" }),
    });
  };

  const handleInvite = () => {
    if (!inviteEmail.trim() || !inviteFirstName.trim() || !inviteLastName.trim()) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    inviteUser.mutate(
      { email: inviteEmail, firstName: inviteFirstName, lastName: inviteLastName, role: inviteRole, password: invitePassword || undefined },
      {
        onSuccess: () => {
          toast({ title: "User created", description: `${inviteFirstName} ${inviteLastName} has been added.` });
          setInviteOpen(false);
          setInviteEmail("");
          setInviteFirstName("");
          setInviteLastName("");
          setInviteRole("VIEWER");
          setInvitePassword("");
        },
        onError: (err) => toast({ title: "Failed to invite user", description: String((err as Error).message), variant: "destructive" }),
      },
    );
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setEditRole(user.role);
    setEditActive(user.isActive);
    setEditFirstName(user.firstName);
    setEditLastName(user.lastName);
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!editUser) return;
    updateUser.mutate(
      { id: editUser.id, role: editRole, isActive: editActive, firstName: editFirstName, lastName: editLastName },
      {
        onSuccess: () => {
          toast({ title: "User updated" });
          setEditOpen(false);
          setEditUser(null);
        },
        onError: () => toast({ title: "Failed to update user", variant: "destructive" }),
      },
    );
  };

  const allRoles: Role[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "CONTRIBUTOR", "FINANCE", "VIEWER"];

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Users & Roles</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage team access and permissions</p>
          </div>
          <Button className="bg-gradient-gold text-primary font-semibold gap-2 hover:opacity-90" onClick={() => setInviteOpen(true)}>
            <Plus className="w-4 h-4" /> Add User
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
              {(["ADMIN", "EDITOR", "VIEWER"] as const).map((role) => (
                <div key={role} className="p-4 rounded-lg bg-background border border-border">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider ${roleStyles[role]}`}>
                    {role.toLowerCase()}
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
                            {getInitials(user.firstName, user.lastName)}
                          </div>
                          <span className="font-medium text-foreground">{user.firstName} {user.lastName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">{user.email}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleStyles[user.role] || roleStyles.VIEWER}`}>
                          {user.role.toLowerCase()}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">{formatLastActive(user.lastLoginAt)}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEdit(user)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(user.id, `${user.firstName} ${user.lastName}`)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!isLoading && users.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invite User Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input value={inviteFirstName} onChange={(e) => setInviteFirstName(e.target.value)} placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input value={inviteLastName} onChange={(e) => setInviteLastName(e.target.value)} placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="user@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={invitePassword} onChange={(e) => setInvitePassword(e.target.value)} placeholder="Leave blank for auto-generated" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allRoles.map((r) => (
                    <SelectItem key={r} value={r}>{r.replace("_", " ").toLowerCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">If no password is provided, a temporary one will be generated. The user should change it on first login.</p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
              <Button className="bg-gradient-gold text-primary font-semibold" onClick={handleInvite} disabled={inviteUser.isPending}>
                {inviteUser.isPending ? "Creating..." : "Add User"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Edit User</DialogTitle>
          </DialogHeader>
          {editUser && (
            <div className="space-y-4 mt-2">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={editLastName} onChange={(e) => setEditLastName(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={editUser.email} disabled className="opacity-60" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={editRole} onValueChange={(v) => setEditRole(v as Role)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allRoles.map((r) => (
                      <SelectItem key={r} value={r}>{r.replace("_", " ").toLowerCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <Label>Active</Label>
                <input type="checkbox" checked={editActive} onChange={(e) => setEditActive(e.target.checked)} className="rounded" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button className="bg-gradient-gold text-primary font-semibold" onClick={handleEditSave} disabled={updateUser.isPending}>
                  {updateUser.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UserRoles;
