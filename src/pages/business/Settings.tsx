import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BusinessSettings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Business Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your business account
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Business account configuration and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Settings panel will be available in future updates
          </p>
        </CardContent>
      </Card>
    </div>
  );
}