import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Achievement {
  id: string;
  title: string;
  description: string;
  badge_url: string | null;
  earned_at: string;
}

export default function UserAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", user.id)
      .order("earned_at", { ascending: false });

    setAchievements(data || []);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Achievement Gallery</h1>
        <p className="text-muted-foreground mt-2">
          View your earned badges and collection progress
        </p>
      </div>

      {achievements.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Your Achievements
            </CardTitle>
            <CardDescription>You haven't earned any achievements yet</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Complete quests to earn badges and unlock achievements
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-gradient-to-br from-primary/20 to-accent/10">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {achievements.length}
                </CardTitle>
                <CardDescription>Total Achievements</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="group hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      {achievement.badge_url ? (
                        <img src={achievement.badge_url} alt={achievement.title} className="h-8 w-8" />
                      ) : (
                        <Award className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <div>
                      <Star className="h-4 w-4 text-accent" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <h3 className="font-bold text-lg">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Earned {formatDistanceToNow(new Date(achievement.earned_at), { addSuffix: true })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}