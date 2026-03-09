import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FileText, DollarSign, Users, Settings, LogOut, ChevronLeft, ImageIcon, UserCircle, Mail, UsersRound, BookOpen, Hash,
} from "lucide-react";
import {
  SidebarProvider, Sidebar, SidebarContent, SidebarGroup,
  SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem,
  SidebarMenuButton, SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/lib/api-types";

const CONTENT_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "CONTRIBUTOR"];
const ADMIN_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN"];
const FINANCE_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "FINANCE"];

const navItems: { title: string; url: string; icon: typeof LayoutDashboard; roles?: Role[] }[] = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Content", url: "/admin/content", icon: FileText, roles: CONTENT_ROLES },
  { title: "Series Groups", url: "/admin/series", icon: BookOpen, roles: CONTENT_ROLES },
  { title: "Tags", url: "/admin/tags", icon: Hash, roles: CONTENT_ROLES },
  { title: "Media", url: "/admin/media", icon: ImageIcon, roles: CONTENT_ROLES },
  { title: "Donations", url: "/admin/donations", icon: DollarSign, roles: FINANCE_ROLES },
  { title: "Users & Roles", url: "/admin/users", icon: Users, roles: ADMIN_ROLES },
  { title: "Subscribers", url: "/admin/subscribers", icon: UsersRound, roles: ADMIN_ROLES },
  { title: "Inquiries", url: "/admin/inquiries", icon: Mail, roles: ADMIN_ROLES },
  { title: "Settings", url: "/admin/settings", icon: Settings, roles: ADMIN_ROLES },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate("/admin/login");
  };

  const filteredNav = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r border-sidebar-border">
          <div className="p-4 border-b border-sidebar-border">
            <Link to="/" className="text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground flex items-center gap-1">
              <ChevronLeft className="w-3 h-3" /> Back to site
            </Link>
            <h2 className="font-serif font-bold text-sidebar-foreground mt-2">
              LCM <span className="text-gold">Admin</span>
            </h2>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/40 text-xs uppercase tracking-widest">
                Management
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredNav.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end={item.url === "/admin"}
                          className="hover:bg-sidebar-accent/50"
                          activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="mt-auto p-4 border-t border-sidebar-border space-y-2">
            <button
              onClick={() => navigate("/admin/profile")}
              className="flex items-center gap-2 text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground w-full"
            >
              <UserCircle className="w-4 h-4" /> My Profile
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground w-full"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border bg-background flex items-center px-4 gap-3">
            <SidebarTrigger />
            <span className="text-sm text-muted-foreground font-medium">
              {filteredNav.find((n) => location.pathname === n.url || (n.url !== "/admin" && location.pathname.startsWith(n.url)))?.title || "Admin"}
            </span>
          </header>
          <main className="flex-1 p-6 bg-background overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
