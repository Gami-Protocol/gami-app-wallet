import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, TrendingUp, Award } from "lucide-react";

export default function BusinessAnalytics() {
  const [stats, setStats] = useState({
    totalQuests: 0,
    activeQuests: 0,
    totalParticipants: 0,
    completedQuests: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch quest counts
    const { count: totalQuests } = await supabase
      .from("quests")
      .select("*", { count: "exact", head: true })
      .eq("business_id", user.id);

    const { count: activeQuests } = await supabase
      .from("quests")
      .select("*", { count: "exact", head: true })
      .eq("business_id", user.id)
      .eq("status", "active");

    // Fetch participant counts
    const { data: quests } = await supabase
      .from("quests")
      .select("id")
      .eq("business_id", user.id);

    const questIds = quests?.map((q) => q.id) || [];

    const { count: totalParticipants } = await supabase
      .from("quest_participants")
      .select("*", { count: "exact", head: true })
      .in("quest_id", questIds);

    const { count: completedQuests } = await supabase
      .from("quest_participants")
      .select("*", { count: "exact", head: true })
      .in("quest_id", questIds)
      .eq("status", "completed");

    setStats({
      totalQuests: totalQuests || 0,
      activeQuests: activeQuests || 0,
      totalParticipants: totalParticipants || 0,
      completedQuests: completedQuests || 0,
    });
  };

  const analyticsCards = [
    { 
      title: "Total Quests", 
      value: stats.totalQuests, 
      icon: Target, 
      description: "All quests created" 
    },
    { 
      title: "Active Quests", 
      value: stats.activeQuests, 
      icon: TrendingUp, 
      description: "Currently running" 
    },
    { 
      title: "Total Participants", 
      value: stats.totalParticipants, 
      icon: Users, 
      description: "Across all quests" 
    },
    { 
      title: "Completions", 
      value: stats.completedQuests, 
      icon: Award, 
      description: "Quests completed" 
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track participation metrics and user engagement
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analyticsCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Rate</CardTitle>
            <CardDescription>Average completion rate across all quests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.totalParticipants > 0 
                ? Math.round((stats.completedQuests / stats.totalParticipants) * 100)
                : 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg Participants per Quest</CardTitle>
            <CardDescription>Average number of users per quest</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.totalQuests > 0
                ? Math.round(stats.totalParticipants / stats.totalQuests)
                : 0}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}