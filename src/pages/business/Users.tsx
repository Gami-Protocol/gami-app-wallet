import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BusinessUsers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage user activity
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>User segmentation, activity monitoring, and access controls</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            User management features will be available in future updates
          </p>
        </CardContent>
      </Card>
    </div>
  );
}