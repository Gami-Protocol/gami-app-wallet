import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function CreateQuest() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">Create New Quest</h1>
        <p className="text-muted-foreground mt-2">
          Design an engaging quest for your users
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quest Creation Studio</CardTitle>
          <CardDescription>Coming soon - No-code builder with template library</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Quest Title</Label>
            <Input id="title" placeholder="Enter quest title" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe your quest" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reward">Reward Amount</Label>
            <Input id="reward" type="number" placeholder="0" disabled />
          </div>
          <Button disabled>Create Quest (Coming Soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
}