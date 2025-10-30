import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export default function UserAchievements() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Achievement Gallery</h1>
        <p className="text-muted-foreground mt-2">
          View your earned badges and collection progress
        </p>
      </div>

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
    </div>
  );
}