import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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

  const mockData = {
    totalXP: 12845,
    tier: 'Gold',
    nextTierXP: 15000,
    gamiBalance: 2450,
    stakedGami: 1000,
    multiplier: '2.5x',
  };

  const quests = [
    { id: 1, title: 'Complete 5 Daily Tasks', reward: 500, progress: 60, category: 'Daily' },
    { id: 2, title: 'Stake 1000 $GAMI', reward: 1000, progress: 100, category: 'Staking' },
    { id: 3, title: 'Invite 3 Friends', reward: 750, progress: 33, category: 'Social' },
    { id: 4, title: 'Trade on Partner DEX', reward: 2000, progress: 0, category: 'DeFi' },
  ];

  const rewards = [
    { id: 1, name: 'Premium NFT Avatar', cost: 5000, available: true },
    { id: 2, name: '10% Shopping Voucher', cost: 2000, available: true },
    { id: 3, name: 'Exclusive Discord Role', cost: 1500, available: true },
    { id: 4, name: 'Partner Token Airdrop', cost: 10000, available: false },
  ];

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
              <Button variant="ghost" size="icon" onClick={() => logout?.()}>
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
                <h2 className="text-5xl font-bold font-display">{mockData.totalXP.toLocaleString()}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Trophy className="h-5 w-5" />
                  <span className="text-lg font-semibold">Tier: {mockData.tier} ⭐</span>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-0 text-lg px-4 py-2">
                <Zap className="h-4 w-4 mr-1" />
                {mockData.multiplier}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Diamond</span>
                <span>{mockData.nextTierXP - mockData.totalXP} XP needed</span>
              </div>
              <Progress value={(mockData.totalXP / mockData.nextTierXP) * 100} className="h-3" />
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
              <p className="text-4xl font-bold mb-4">{mockData.gamiBalance.toLocaleString()}</p>
              <div className="flex gap-2">
                <Button className="flex-1">Buy</Button>
                <Button variant="outline" className="flex-1">Send</Button>
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
              <p className="text-4xl font-bold mb-4">{mockData.stakedGami.toLocaleString()}</p>
              <div className="flex gap-2">
                <Button className="flex-1">Stake More</Button>
                <Button variant="outline" className="flex-1">Unstake</Button>
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
                    {quest.progress === 100 && (
                      <Button size="sm">Claim</Button>
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
                      disabled={!reward.available || mockData.totalXP < reward.cost}
                      variant={reward.available ? "default" : "outline"}
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
