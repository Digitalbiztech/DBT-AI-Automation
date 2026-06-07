import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface SettingsModalProps {
  webhookMap: Record<string, string>;
  onWebhookMapChange: (map: Record<string, string>) => void;
}

export function SettingsModal({ webhookMap, onWebhookMapChange }: SettingsModalProps) {
  const [tempMap, setTempMap] = useState<Record<string, string>>(() => ({
    sap: webhookMap?.sap || import.meta.env.VITE_N8N_WEBHOOK_SAP || '',
    legal: webhookMap?.legal || import.meta.env.VITE_N8N_WEBHOOK_LEGAL || '',
    nosta: webhookMap?.nosta || import.meta.env.VITE_N8N_WEBHOOK_NOSTA || 'https://n8n.digitalbiz.tech/webhook/488406a9-e2ec-406b-9616-bd648f801d7a',
    cost: webhookMap?.cost || import.meta.env.VITE_N8N_WEBHOOK_COST || '',
  }));
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onWebhookMapChange(tempMap);
    setIsOpen(false);
    toast.success("Settings saved successfully");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          s variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Application Settings</DialogTitle>
          <DialogDescription>
            Configure your application settings and integrations.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="webhook-sap" className="text-right text-card-foreground">
              SAP Agent Webhook
            </Label>
            <Input
              id="webhook-sap"
              value={tempMap.sap}
              onChange={(e) => setTempMap(prev => ({ ...prev, sap: e.target.value }))}
              placeholder="https://n8n.example.com/webhook/sap"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="webhook-legal" className="text-right text-card-foreground">
              Legal Agent Webhook
            </Label>
            <Input
              id="webhook-legal"
              value={tempMap.legal}
              onChange={(e) => setTempMap(prev => ({ ...prev, legal: e.target.value }))}
              placeholder="https://n8n.example.com/webhook/legal"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="webhook-nosta" className="text-right text-card-foreground">
              DBT AI Agent Webhook
            </Label>
            <Input
              id="webhook-nosta"
              value={tempMap.nosta}
              onChange={(e) => setTempMap(prev => ({ ...prev, nosta: e.target.value }))}
              placeholder="https://n8n.example.com/webhook/dbt-ai-info"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="webhook-cost" className="text-right text-card-foreground">
              Cost Agent Webhook
            </Label>
            <Input
              id="webhook-cost"
              value={tempMap.cost}
              onChange={(e) => setTempMap(prev => ({ ...prev, cost: e.target.value }))}
              placeholder="https://n8n.example.com/webhook/cost-calculator"
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
