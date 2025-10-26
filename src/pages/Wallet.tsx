import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Trophy, 
  Target, 
  Coins, 
  TrendingUp, 
  Gift, 
  LogOut,
  Wallet as WalletIcon,
  Zap
} from 'lucide-react';

export default function Wallet() {
  const { ready, authenticated, user, logout, provider } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State management
  const [totalXP, setTotalXP] = useState(12845);
  const [gamiBalance, setGamiBalance] = useState(2450);
  const [stakedGami, setStakedGami] = useState(1000);
  const [quests, setQuests] = useState([
    { id: 1, title: 'Complete 5 Daily Tasks', reward: 500, progress: 60, category: 'Daily', claimed: false },
    { id: 2, title: 'Stake 1000 $GAMI', reward: 1000, progress: 100, category: 'Staking', claimed: false },
    { id: 3, title: 'Invite 3 Friends', reward: 750, progress: 33, category: 'Social', claimed: false },
    { id: 4, title: 'Trade on Partner DEX', reward: 2000, progress: 0, category: 'DeFi', claimed: false },
  ]);

  useEffect(() => {
    // Only redirect if using Privy and not authenticated
    if (provider === 'privy' && ready && !authenticated) {
      navigate('/');
    }
  }, [provider, ready, authenticated, navigate]);

  // Show loading only for Privy auth, not demo mode
  if (provider === 'privy' && (!ready || !authenticated)) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary animate-pulse mx-auto mb-4" />
        <p className="text-muted-foreground">Loading wallet...</p>
      </div>
    </div>;
  }

  // Computed values
  const tier = totalXP >= 15000 ? 'Diamond' : totalXP >= 10000 ? 'Gold' : 'Silver';
  const nextTierXP = 15000;
  const multiplier = '2.5x';

  const rewards = [
    { id: 1, name: 'Premium NFT Avatar', cost: 5000, available: true },
    { id: 2, name: '10% Shopping Voucher', cost: 2000, available: true },
    { id: 3, name: 'Exclusive Discord Role', cost: 1500, available: true },
    { id: 4, name: 'Partner Token Airdrop', cost: 10000, available: false },
  ];

  // Action handlers
  const handleBuy = () => {
    setGamiBalance(prev => prev + 500);
    toast({
      title: "Purchase Successful!",
      description: "Added 500 $GAMI to your wallet",
    });
  };

  const handleSend = () => {
    if (gamiBalance < 100) {
      toast({
        title: "Insufficient Balance",
        description: "You need at least 100 $GAMI to send",
        variant: "destructive",
      });
      return;
    }
    setGamiBalance(prev => prev - 100);
    toast({
      title: "Sent Successfully!",
      description: "Transferred 100 $GAMI",
    });
  };

  const handleStake = () => {
    if (gamiBalance < 500) {
      toast({
        title: "Insufficient Balance",
        description: "You need at least 500 $GAMI to stake",
        variant: "destructive",
      });
      return;
    }
    setGamiBalance(prev => prev - 500);
    setStakedGami(prev => prev + 500);
    toast({
      title: "Staked Successfully!",
      description: "Staked 500 $GAMI - your multiplier increased!",
    });
  };

  const handleUnstake = () => {
    if (stakedGami < 500) {
      toast({
        title: "Insufficient Staked Amount",
        description: "You need at least 500 staked $GAMI to unstake",
        variant: "destructive",
      });
      return;
    }
    setStakedGami(prev => prev - 500);
    setGamiBalance(prev => prev + 500);
    toast({
      title: "Unstaked Successfully!",
      description: "Returned 500 $GAMI to your wallet",
    });
  };

  const handleClaim = (questId: number) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.progress < 100 || quest.claimed) return;

    setQuests(prev => prev.map(q => 
      q.id === questId ? { ...q, claimed: true } : q
    ));
    setTotalXP(prev => prev + quest.reward);
    toast({
      title: "Quest Completed!",
      description: `Earned ${quest.reward} XP`,
    });
  };

  const handleRedeem = (rewardId: number, cost: number, name: string) => {
    if (totalXP < cost) {
      toast({
        title: "Insufficient XP",
        description: `You need ${cost.toLocaleString()} XP to redeem this reward`,
        variant: "destructive",
      });
      return;
    }
    setTotalXP(prev => prev - cost);
    toast({
      title: "Reward Redeemed!",
      description: `Successfully claimed: ${name}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary" />
              <span className="font-bold text-xl">Gami Wallet</span>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="gap-2">
                <WalletIcon className="h-4 w-4" />
                {user?.wallet?.address ? `${user.wallet.address.slice(0,6)}...${user.wallet.address.slice(-4)}` : 'Guest'}
              </Badge>
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
        {/* XP Overview Card */}
        <Card className="bg-gradient-primary border-0 text-white">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm opacity-80 mb-1">Total XP</p>
                <h2 className="text-5xl font-bold font-display">{totalXP.toLocaleString()}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Trophy className="h-5 w-5" />
                  <span className="text-lg font-semibold">Tier: {tier} ⭐</span>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-0 text-lg px-4 py-2">
                <Zap className="h-4 w-4 mr-1" />
                {multiplier}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Diamond</span>
                <span>{nextTierXP - totalXP} XP needed</span>
              </div>
              <Progress value={(totalXP / nextTierXP) * 100} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Balance Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                $GAMI Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold mb-4">{gamiBalance.toLocaleString()}</p>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleBuy}>Buy</Button>
                <Button variant="outline" className="flex-1" onClick={handleSend}>Send</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
                Staked $GAMI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold mb-4">{stakedGami.toLocaleString()}</p>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleStake}>Stake More</Button>
                <Button variant="outline" className="flex-1" onClick={handleUnstake}>Unstake</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="quests" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="quests">Active Quests</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="quests" className="space-y-4">
            {quests.map((quest) => (
              <Card key={quest.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{quest.category}</Badge>
                        <h3 className="font-semibold">{quest.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        Reward: {quest.reward} XP
                      </p>
                    </div>
                    {quest.progress === 100 && !quest.claimed && (
                      <Button size="sm" onClick={() => handleClaim(quest.id)}>Claim</Button>
                    )}
                    {quest.claimed && (
                      <Badge variant="secondary">Claimed</Badge>
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
            ))}
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
                      disabled={!reward.available || totalXP < reward.cost}
                      variant={reward.available ? "default" : "outline"}
                      onClick={() => handleRedeem(reward.id, reward.cost, reward.name)}
                    >
                      {reward.available ? 'Redeem' : 'Locked'}
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
