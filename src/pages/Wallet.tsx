import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Trophy, 
  Target, 
  Gift, 
  LogOut,
  Wallet as WalletIcon,
  Zap,
  Shield,
  Sparkles,
  Copy,
  RefreshCw
} from 'lucide-react';
import { 
  calculateLevel, 
  calculateXpForNextLevel, 
  calculateLevelBonus,
  questClaimSchema,
  airdropUpdateSchema,
  LEVEL_CONFIG
} from '@/lib/wallet-validation';

interface Quest {
  id: string;
  title: string;
  reward: number;
  progress: number;
  category: string;
  claimed: boolean;
}

interface WalletData {
  xp: number;
  level: number;
  wallet_address: string | null;
}

interface AirdropAllocation {
  base_allocation: number;
  quest_bonus: number;
  level_bonus: number;
  total_allocation: number;
}

export default function Wallet() {
  const { ready, authenticated, user, logout, login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State management
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [airdropData, setAirdropData] = useState<AirdropAllocation | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [generatingWallet, setGeneratingWallet] = useState(false);

  // Fetch wallet data
  useEffect(() => {
    if (authenticated && user) {
      fetchWalletData();
      fetchQuests();
    } else if (ready && !authenticated) {
      setLoading(false);
    }
  }, [authenticated, user, ready]);

  const fetchWalletData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const [walletRes, airdropRes] = await Promise.all([
        supabase.from('wallets').select('xp, level, wallet_address').eq('user_id', authUser.id).single(),
        supabase.from('airdrop_allocations').select('*').eq('user_id', authUser.id).maybeSingle()
      ]);

      if (walletRes.data) {
        setWalletData(walletRes.data);
      }
      
      if (airdropRes.data) {
        setAirdropData(airdropRes.data);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
      toast({
        title: "Error",
        description: "Failed to load wallet data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuests = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data, error } = await supabase
        .from('quest_participants')
        .select(`
          id,
          progress,
          status,
          quest_id,
          quests (
            title,
            description,
            reward_amount,
            difficulty
          )
        `)
        .eq('user_id', authUser.id)
        .eq('status', 'active');

      if (error) throw error;

      const formattedQuests: Quest[] = (data || []).map((qp: any) => ({
        id: qp.id,
        title: qp.quests?.title || 'Unknown Quest',
        reward: Number(qp.quests?.reward_amount || 0),
        progress: qp.progress,
        category: qp.quests?.difficulty || 'medium',
        claimed: qp.status === 'completed'
      }));

      setQuests(formattedQuests);
    } catch (error) {
      console.error('Error fetching quests:', error);
    }
  };

  // Generate wallet address
  const generateWallet = async () => {
    if (!authenticated || !user) return;
    
    setGeneratingWallet(true);
    try {
      // Generate a random Ethereum-style address
      const randomAddress = '0x' + Array.from({ length: 40 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('wallets')
        .update({ wallet_address: randomAddress })
        .eq('user_id', authUser.id);

      if (error) throw error;

      setWalletData(prev => prev ? { ...prev, wallet_address: randomAddress } : null);
      
      toast({
        title: "Wallet Generated! 🎉",
        description: "Your unique wallet address has been created",
      });
    } catch (error) {
      console.error('Error generating wallet:', error);
      toast({
        title: "Error",
        description: "Failed to generate wallet address",
        variant: "destructive",
      });
    } finally {
      setGeneratingWallet(false);
    }
  };

  // Copy wallet address
  const copyAddress = () => {
    if (walletData?.wallet_address) {
      navigator.clipboard.writeText(walletData.wallet_address);
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  // Show login prompt if not authenticated
  if (!loading && !authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <WalletIcon className="h-6 w-6" />
              Connect Your Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Sign in with Privy to access your gamified wallet and start earning XP!
            </p>
            <Button onClick={login} className="w-full" size="lg">
              <Shield className="mr-2 h-5 w-5" />
              Sign in with Privy
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              New users automatically get a wallet and 100 base airdrop allocation
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading wallet...</p>
        </div>
      </div>
    );
  }

  const currentXP = walletData?.xp || 0;
  const currentLevel = walletData?.level || 1;
  const xpForNextLevel = calculateXpForNextLevel(currentLevel);
  const xpProgress = xpForNextLevel > 0 ? ((currentXP % 1000) / 1000) * 100 : 100;
  const levelBonus = calculateLevelBonus(currentLevel);

  const rewards = [
    { id: 1, name: 'Early Access Badge', cost: 5000, available: true },
    { id: 2, name: 'Premium Discord Role', cost: 2000, available: true },
    { id: 3, name: 'Exclusive NFT', cost: 10000, available: true },
    { id: 4, name: 'Beta Tester Badge', cost: 1500, available: true },
  ];

  const handleClaim = async (questId: string) => {
    try {
      const quest = quests.find(q => q.id === questId);
      if (!quest || quest.progress < 100 || quest.claimed) return;

      // Validate input
      const validation = questClaimSchema.safeParse({
        questId,
        reward: quest.reward
      });

      if (!validation.success) {
        toast({
          title: "Invalid Request",
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        return;
      }

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      // Update quest status and wallet XP
      const newXP = currentXP + quest.reward;
      const newLevel = calculateLevel(newXP);
      const newLevelBonus = calculateLevelBonus(newLevel);
      
      const [questUpdate, walletUpdate, airdropUpdate] = await Promise.all([
        supabase.from('quest_participants').update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        }).eq('id', questId),
        supabase.from('wallets').update({ 
          xp: newXP,
          level: newLevel
        }).eq('user_id', authUser.id),
        supabase.from('airdrop_allocations').update({
          quest_bonus: (airdropData?.quest_bonus || 0) + quest.reward / 10,
          level_bonus: newLevelBonus
        }).eq('user_id', authUser.id)
      ]);

      if (questUpdate.error || walletUpdate.error || airdropUpdate.error) {
        throw new Error('Failed to update data');
      }

      // Refresh data
      await Promise.all([fetchWalletData(), fetchQuests()]);

      toast({
        title: "Quest Completed! 🎉",
        description: `Earned ${quest.reward} XP${newLevel > currentLevel ? ` and leveled up to ${newLevel}!` : ''}`,
      });
    } catch (error) {
      console.error('Error claiming quest:', error);
      toast({
        title: "Error",
        description: "Failed to claim quest reward",
        variant: "destructive",
      });
    }
  };

  const handleRedeem = async (rewardId: number, cost: number, name: string) => {
    try {
      if (currentXP < cost) {
        toast({
          title: "Insufficient XP",
          description: `You need ${cost.toLocaleString()} XP to redeem this reward`,
          variant: "destructive",
        });
        return;
      }

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const newXP = currentXP - cost;
      const newLevel = calculateLevel(newXP);

      const { error } = await supabase
        .from('wallets')
        .update({ xp: newXP, level: newLevel })
        .eq('user_id', authUser.id);

      if (error) throw error;

      await fetchWalletData();

      toast({
        title: "Reward Redeemed! 🎁",
        description: `Successfully claimed: ${name}`,
      });
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast({
        title: "Error",
        description: "Failed to redeem reward",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary" />
              <span className="font-typewriter font-bold text-xl">Gami Wallet</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => {
                logout?.();
                navigate('/');
              }}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 space-y-8">
        {/* Wallet Address Card */}
        {!walletData?.wallet_address ? (
          <Card className="border-primary/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <WalletIcon className="h-12 w-12 mx-auto text-primary" />
                <div>
                  <h3 className="font-bold text-xl mb-2">Generate Your Wallet</h3>
                  <p className="text-muted-foreground">
                    Create a unique wallet address to start your journey
                  </p>
                </div>
                <Button 
                  onClick={generateWallet} 
                  disabled={generatingWallet}
                  size="lg"
                  className="gap-2"
                >
                  {generatingWallet ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Wallet
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Your Wallet Address</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono bg-muted px-3 py-2 rounded-lg">
                      {walletData.wallet_address}
                    </code>
                    <Button variant="ghost" size="icon" onClick={copyAddress}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Level & XP Card */}
        <Card className="bg-gradient-primary border-0 text-white">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm opacity-80 mb-1">Total XP</p>
                <h2 className="text-5xl font-bold font-display">{currentXP.toLocaleString()}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Trophy className="h-5 w-5" />
                  <span className="text-lg font-semibold">Level {currentLevel}</span>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-0 text-lg px-4 py-2">
                <Zap className="h-4 w-4 mr-1" />
                +{levelBonus} Airdrop
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Level {currentLevel + 1}</span>
                <span>{currentXP % 1000} / 1000 XP</span>
              </div>
              <Progress value={xpProgress} className="h-3 bg-white/20" />
            </div>
          </CardContent>
        </Card>

        {/* Airdrop Allocation Card */}
        {airdropData && (
          <Card className="border-secondary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-secondary" />
                $GAMI Airdrop Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Base</p>
                  <p className="text-2xl font-bold">{airdropData.base_allocation}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quest Bonus</p>
                  <p className="text-2xl font-bold text-primary">+{airdropData.quest_bonus.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Level Bonus</p>
                  <p className="text-2xl font-bold text-secondary">+{airdropData.level_bonus}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-primary">
                    {airdropData.total_allocation.toFixed(1)}
                  </p>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  💡 Complete quests and level up to increase your airdrop allocation. Each quest adds bonus points, and every level grants +{LEVEL_CONFIG.airdropBonusPerLevel} allocation!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs Section */}
        <Tabs defaultValue="quests" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="quests">Active Quests</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="quests" className="space-y-4">
            {quests.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No active quests. Join quests from the Quests page to start earning!
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/user/quests')}
                  >
                    Browse Quests
                  </Button>
                </CardContent>
              </Card>
            ) : (
              quests.map((quest) => (
                <Card key={quest.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="capitalize">{quest.category}</Badge>
                          <h3 className="font-semibold">{quest.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          Reward: {quest.reward} XP + {(quest.reward / 10).toFixed(1)} Airdrop Bonus
                        </p>
                      </div>
                      {quest.progress >= 100 && !quest.claimed && (
                        <Button size="sm" onClick={() => handleClaim(quest.id)}>
                          Claim Reward
                        </Button>
                      )}
                      {quest.claimed && (
                        <Badge variant="secondary">✓ Claimed</Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{quest.progress}%</span>
                      </div>
                      <Progress value={quest.progress} />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            {rewards.map((reward) => (
              <Card key={reward.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <Gift className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{reward.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {reward.cost.toLocaleString()} XP
                        </p>
                      </div>
                    </div>
                    <Button 
                      disabled={!reward.available || currentXP < reward.cost}
                      variant={reward.available ? "default" : "outline"}
                      onClick={() => handleRedeem(reward.id, reward.cost, reward.name)}
                    >
                      {currentXP < reward.cost ? `Need ${reward.cost - currentXP} XP` : reward.available ? 'Redeem' : 'Locked'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
