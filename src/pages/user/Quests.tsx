import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Coins, Calendar, Users } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  reward_amount: number;
  reward_token: string;
  current_participants: number;
  max_participants: number | null;
  end_date: string | null;
}

export default function UserQuests() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    const { data, error } = await supabase
      .from("quests")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load quests");
      return;
    }

    setQuests(data || []);
  };

  const handleJoinQuest = async (questId: string) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Check if already joined
    const { data: existing } = await supabase
      .from("quest_participants")
      .select("*")
      .eq("quest_id", questId)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      toast.error("You've already joined this quest");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("quest_participants")
      .insert({
        quest_id: questId,
        user_id: user.id,
        status: "active",
        progress: 0,
      });

    if (error) {
      toast.error("Failed to join quest");
    } else {
      toast.success("Successfully joined quest!");
      fetchQuests();
    }

    setLoading(false);
  };

  const filteredQuests = quests.filter((quest) =>
    quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quest.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500/10 text-green-500";
      case "medium": return "bg-yellow-500/10 text-yellow-500";
      case "hard": return "bg-red-500/10 text-red-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quest Discovery</h1>
        <p className="text-muted-foreground mt-2">
          Browse and participate in quests to earn rewards
        </p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search quests..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredQuests.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>No Quests Available</CardTitle>
              <CardDescription>Check back soon for new quests</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Quests will appear here once businesses create them
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredQuests.map((quest) => (
            <Card key={quest.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getDifficultyColor(quest.difficulty)}>
                    {quest.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm font-medium text-accent">
                    <Coins className="h-4 w-4" />
                    {quest.reward_amount} {quest.reward_token}
                  </div>
                </div>
                <CardTitle className="text-lg">{quest.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {quest.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {quest.current_participants}
                    {quest.max_participants && `/${quest.max_participants}`}
                  </div>
                  {quest.end_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDistanceToNow(new Date(quest.end_date), { addSuffix: true })}
                    </div>
                  )}
                </div>
                <Button 
                  onClick={() => handleJoinQuest(quest.id)}
                  disabled={loading}
                  className="w-full"
                >
                  Join Quest
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}