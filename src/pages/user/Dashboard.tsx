import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Target, Trophy, TrendingUp } from "lucide-react";

export default function UserDashboard() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
    };
    fetchProfile();
  }, []);

  const stats = [
    { title: "Total Balance", value: "0 GAMI", icon: Wallet, trend: "+0%" },
    { title: "Active Quests", value: "0", icon: Target, trend: "0 new" },
    { title: "Achievements", value: "0", icon: Trophy, trend: "0 earned" },
    { title: "Rewards Earned", value: "$0", icon: TrendingUp, trend: "+0%" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}!</h1>
        <p className="text-muted-foreground mt-2">
          Here's an overview of your wallet and quest activity
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest wallet transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No activity yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connected Platforms</CardTitle>
            <CardDescription>Your linked gaming accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No platforms connected</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}