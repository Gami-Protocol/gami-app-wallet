import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BusinessQuests() {
  const navigate = useNavigate();

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

      <Card>
        <CardHeader>
          <CardTitle>Your Quests</CardTitle>
          <CardDescription>No quests created yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Create your first quest to start engaging with users
          </p>
        </CardContent>
      </Card>
    </div>
  );
}