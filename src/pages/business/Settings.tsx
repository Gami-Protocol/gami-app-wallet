import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, Shield, ShieldOff } from "lucide-react";

export default function BusinessSettings() {
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tier, setTier] = useState("starter");
  const [maxUses, setMaxUses] = useState("1");
  const [expiresInDays, setExpiresInDays] = useState("365");

  useEffect(() => {
    loadCodes();
  }, []);

  const loadCodes = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("manage-access-codes", {
        body: { action: "list" },
      });

      if (error) throw error;
      setCodes(data.codes || []);
    } catch (error: any) {
      toast.error("Failed to load access codes");
    }
  };

  const generateCode = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-access-code", {
        body: {
          tier,
          max_uses: parseInt(maxUses),
          expires_in_days: parseInt(expiresInDays),
        },
      });

      if (error) throw error;
      toast.success("Access code generated!");
      loadCodes();
    } catch (error: any) {
      toast.error(error.message || "Failed to generate code");
    } finally {
      setLoading(false);
    }
  };

  const toggleCodeStatus = async (codeId: string, isActive: boolean) => {
    try {
      const { error } = await supabase.functions.invoke("manage-access-codes", {
        body: {
          action: isActive ? "deactivate" : "activate",
          code_id: codeId,
        },
      });

      if (error) throw error;
      toast.success(`Code ${isActive ? "deactivated" : "activated"}`);
      loadCodes();
    } catch (error: any) {
      toast.error("Failed to update code status");
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Access Code Management</h1>
        <p className="text-muted-foreground mt-2">
          Generate and manage business access codes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate New Access Code</CardTitle>
          <CardDescription>
            Create access codes for business users to register
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tier</Label>
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free Tier</SelectItem>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="growth">Growth</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Max Uses</Label>
              <Input
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label>Expires In (Days)</Label>
              <Input
                type="number"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
                min="1"
              />
            </div>
          </div>
          <Button onClick={generateCode} disabled={loading}>
            {loading ? "Generating..." : "Generate Code"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Access Codes</CardTitle>
          <CardDescription>
            Manage existing access codes and view usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {codes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No access codes yet</p>
            ) : (
              codes.map((code) => (
                <div
                  key={code.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono font-bold">{code.code}</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(code.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Tier: {code.tier}</span>
                      <span>Uses: {code.current_uses}/{code.max_uses}</span>
                      {code.expires_at && (
                        <span>
                          Expires: {new Date(code.expires_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant={code.is_active ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleCodeStatus(code.id, code.is_active)}
                  >
                    {code.is_active ? (
                      <>
                        <ShieldOff className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}