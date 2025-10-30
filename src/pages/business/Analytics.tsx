import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BusinessAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track participation metrics and user engagement
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Participation metrics, user engagement, and conversion funnels</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Analytics dashboard will show detailed insights once you have active quests
          </p>
        </CardContent>
      </Card>
    </div>
  );
}