import { ReactNode, useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  Wallet,
  Target,
  Trophy,
  User,
  LogOut,
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
  { title: "Dashboard", url: "/user/dashboard", icon: LayoutDashboard },
  { title: "Wallet", url: "/user/wallet", icon: Wallet },
  { title: "Quests", url: "/user/quests", icon: Target },
  { title: "Achievements", url: "/user/achievements", icon: Trophy },
  { title: "Profile", url: "/user/profile", icon: User },
];

function UserSidebar() {
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
          <SidebarGroupLabel>User Portal</SidebarGroupLabel>
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

export function UserLayout({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setIsAuthenticated(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!isAuthenticated) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <UserSidebar />
        <main className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 flex h-14 items-center border-b bg-background/95 backdrop-blur px-4">
            <SidebarTrigger />
          </header>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}