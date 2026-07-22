import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, MonitorSmartphone, Building2, LineChart, Sparkles,
  FileText, Leaf, Settings, LogOut,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Computers", url: "/computers", icon: MonitorSmartphone },
  { title: "Labs", url: "/labs", icon: Building2 },
  { title: "Analytics", url: "/analytics", icon: LineChart },
  { title: "AI Prediction", url: "/ai-prediction", icon: Sparkles },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "ESG Impact", url: "/esg", icon: Leaf },
  { title: "Settings", url: "/settings", icon: Settings },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const logout = () => {
    try { localStorage.removeItem("sidms_user"); } catch {}
    navigate({ to: "/" });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-brand">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <div className="text-sm font-semibold text-sidebar-foreground">SIDMS</div>
              <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">Energy Intelligence</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url || (item.url !== "/dashboard" && pathname.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} tooltip="Logout">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
