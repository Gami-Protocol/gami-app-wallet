import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Target, Trophy, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface WalletData {
  balance: number;
  token: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  created_at: string;
}

interface QuestParticipation {
  quest_id: string;
  status: string;
  progress: number;
  quests: {
    title: string;
  };
}

export default function UserDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeQuests, setActiveQuests] = useState<QuestParticipation[]>([]);
  const [achievementCount, setAchievementCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    setProfile(profileData);

    // Fetch wallet
    const { data: walletData } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user.id)
      .eq("token", "GAMI")
      .single();
    setWallet(walletData);

    // Fetch recent transactions
    const { data: txData } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);
    setTransactions(txData || []);

    // Fetch active quests
    const { data: questData } = await supabase
      .from("quest_participants")
      .select("quest_id, status, progress, quests(title)")
      .eq("user_id", user.id)
      .eq("status", "active");
    setActiveQuests(questData || []);

    // Fetch achievement count
    const { count } = await supabase
      .from("achievements")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    setAchievementCount(count || 0);
  };

  const stats = [
    { 
      title: "Total Balance", 
      value: `${wallet?.balance || 0} GAMI`, 
      icon: Wallet, 
      trend: "+0%",
      trendUp: true 
    },
    { 
      title: "Active Quests", 
      value: activeQuests.length.toString(), 
      icon: Target, 
      trend: `${activeQuests.length} active`,
      trendUp: true 
    },
    { 
      title: "Achievements", 
      value: achievementCount.toString(), 
      icon: Trophy, 
      trend: `${achievementCount} earned`,
      trendUp: true 
    },
    { 
      title: "Rewards Earned", 
      value: `${wallet?.balance || 0} GAMI`, 
      icon: TrendingUp, 
      trend: "+0%",
      trendUp: true 
    },
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
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {stat.trendUp ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                {stat.trend}
              </p>
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
            {transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet</p>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <div className={`text-sm font-medium ${
                      tx.type === 'reward' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {tx.type === 'reward' ? '+' : '-'}{tx.amount} GAMI
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Quests</CardTitle>
            <CardDescription>Your ongoing quest progress</CardDescription>
          </CardHeader>
          <CardContent>
            {activeQuests.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active quests</p>
            ) : (
              <div className="space-y-4">
                {activeQuests.map((quest: any) => (
                  <div key={quest.quest_id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{quest.quests.title}</p>
                      <span className="text-xs text-muted-foreground">{quest.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all"
                        style={{ width: `${quest.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}