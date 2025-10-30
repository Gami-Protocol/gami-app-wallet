import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function UserQuests() {
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
          <Input placeholder="Search quests..." className="pl-10" />
        </div>
        <Button>Filter</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
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
      </div>
    </div>
  );
}