import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Users, Coins, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  reward_amount: number;
  reward_token: string;
  current_participants: number;
  max_participants: number | null;
  status: string;
  created_at: string;
}

export default function BusinessQuests() {
  const navigate = useNavigate();
  const [quests, setQuests] = useState<Quest[]>([]);

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("quests")
      .select("*")
      .eq("business_id", user.id)
      .order("created_at", { ascending: false });

    setQuests(data || []);
  };

  const handleDeleteQuest = async (questId: string) => {
    const { error } = await supabase
      .from("quests")
      .delete()
      .eq("id", questId);

    if (error) {
      toast.error("Failed to delete quest");
    } else {
      toast.success("Quest deleted successfully");
      fetchQuests();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-500";
      case "draft": return "bg-yellow-500/10 text-yellow-500";
      case "completed": return "bg-blue-500/10 text-blue-500";
      case "expired": return "bg-red-500/10 text-red-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quest Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your quests
          </p>
        </div>
        <Button onClick={() => navigate("/business/quests/create")}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Quest
        </Button>
      </div>

      {quests.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Quests</CardTitle>
            <CardDescription>No quests created yet</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first quest to start engaging with users
            </p>
            <Button onClick={() => navigate("/business/quests/create")}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Your First Quest
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quests.map((quest) => (
            <Card key={quest.id}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getStatusColor(quest.status)}>
                    {quest.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDeleteQuest(quest.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-lg">{quest.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {quest.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {quest.current_participants} participants
                  </div>
                  <div className="flex items-center gap-1 font-medium text-accent">
                    <Coins className="h-4 w-4" />
                    {quest.reward_amount} {quest.reward_token}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Created {formatDistanceToNow(new Date(quest.created_at), { addSuffix: true })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}