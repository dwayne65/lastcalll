import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FileText, DollarSign, Users, Settings, LogOut, ChevronLeft, ImageIcon,
} from "lucide-react";
import {
  SidebarProvider, Sidebar, SidebarContent, SidebarGroup,
  SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem,
  SidebarMenuButton, SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Content", url: "/admin/content", icon: FileText },
  { title: "Media", url: "/admin/media", icon: ImageIcon },
  { title: "Donations", url: "/admin/donations", icon: DollarSign },
  { title: "Users & Roles", url: "/admin/users", icon: Users },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

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
                  {navItems.map((item) => (
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
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <button className="flex items-center gap-2 text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border bg-background flex items-center px-4 gap-3">
            <SidebarTrigger />
            <span className="text-sm text-muted-foreground font-medium">
              {navItems.find((n) => location.pathname === n.url || (n.url !== "/admin" && location.pathname.startsWith(n.url)))?.title || "Admin"}
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
