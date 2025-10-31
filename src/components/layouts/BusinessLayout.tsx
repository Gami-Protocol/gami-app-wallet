import { ReactNode, useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  Target,
  PlusCircle,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Home,
  ArrowLeft,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import gamiLogo from '@/assets/gami-logo.png';

const menuItems = [
  { title: "Dashboard", url: "/business/dashboard", icon: LayoutDashboard },
  { title: "Quests", url: "/business/quests", icon: Target },
  { title: "Create Quest", url: "/business/quests/create", icon: PlusCircle },
  { title: "Analytics", url: "/business/analytics", icon: BarChart3 },
  { title: "Users", url: "/business/users", icon: Users },
  { title: "Settings", url: "/business/settings", icon: Settings },
];

function BusinessSidebar() {
  const { open } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b">
          <img src={gamiLogo} alt="Gami Protocol" className="h-8 w-auto" />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Business Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive ? "bg-muted text-primary font-medium" : ""
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mt-auto p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {open && <span>Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export function BusinessLayout({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/auth");
          return;
        }

        // Server-side verification using RPC
        const { data: hasBusinessAccess, error } = await supabase
          .rpc("verify_business_access");

        if (error) {
          console.error("[INTERNAL] Access verification error:", error);
          toast.error("Unable to verify access. Please try again.");
          navigate("/auth");
          return;
        }

        if (!hasBusinessAccess) {
          toast.error("Access denied.");
          navigate("/user/dashboard");
          return;
        }

        setIsAuthenticated(true);
        setHasAccess(true);
      } catch (error) {
        console.error("[INTERNAL] Access check error:", error);
        toast.error("An error occurred. Please try again.");
        navigate("/auth");
      }
    };

    checkAccess();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          navigate("/auth");
        } else {
          checkAccess();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (!isAuthenticated || !hasAccess) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <BusinessSidebar />
        <main className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur px-4">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Exit to Home
              </Button>
            </div>
          </header>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}