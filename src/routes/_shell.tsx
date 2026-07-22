import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";

export const Route = createFileRoute("/_shell")({
  component: ShellLayout,
});

function ShellLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <AppTopbar />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
          <footer className="border-t px-6 py-4 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Smart Idle Device Management System · AI for a Sustainable Future
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
