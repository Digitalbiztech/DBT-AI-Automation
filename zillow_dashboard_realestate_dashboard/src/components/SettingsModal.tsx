import { useState, useEffect } from "react";
import { Settings, CheckCircle, XCircle, Loader2, Save, Trash2, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MISTRAL_API_KEY_STORAGE = "mistral_api_key";
const MODEL_SELECTION_STORAGE = "mistral_model";
const DEFAULT_API_KEY = "rXJrHVux1cmQhHU2B0NIaJ8QeqiDhueM";

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("large");
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const storedKey = localStorage.getItem(MISTRAL_API_KEY_STORAGE);
    const storedModel = localStorage.getItem(MODEL_SELECTION_STORAGE);
    
    if (storedKey && storedKey !== "undefined" && storedKey !== "null" && storedKey.length > 0) {
      setApiKey(storedKey);
    } else {
      setApiKey(DEFAULT_API_KEY);
    }
    
    setSelectedModel(storedModel || "large");
    setConnectionStatus("success");
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem(MISTRAL_API_KEY_STORAGE, apiKey.trim());
      localStorage.setItem(MODEL_SELECTION_STORAGE, selectedModel);
      setConnectionStatus("success");
      toast.success("Settings saved successfully");
    }
  };

  const handleClear = () => {
    localStorage.removeItem(MISTRAL_API_KEY_STORAGE);
    setApiKey("");
    setConnectionStatus("idle");
    toast.info("API key cleared");
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key first");
      return;
    }

    setIsTesting(true);
    setConnectionStatus("idle");

    try {
      const response = await fetch("https://api.mistral.ai/v1/models", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
        },
      });

      if (response.ok) {
        setConnectionStatus("success");
        localStorage.setItem(MISTRAL_API_KEY_STORAGE, apiKey.trim());
        localStorage.setItem(MODEL_SELECTION_STORAGE, selectedModel);
        toast.success("Connection successful!");
      } else {
        setConnectionStatus("error");
        toast.error("Invalid API key");
      }
    } catch {
      setConnectionStatus("error");
      toast.error("Connection failed");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            AI Settings
          </DialogTitle>
          <DialogDescription>
            Configure your AI model and API connection for real estate analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Model Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Model
            </Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="large">
                  <div className="flex flex-col">
                    <span className="font-medium">Mistral Large</span>
                    <span className="text-xs text-muted-foreground">Best for complex analysis & insights</span>
                  </div>
                </SelectItem>
                <SelectItem value="small">
                  <div className="flex flex-col">
                    <span className="font-medium">Mistral Small</span>
                    <span className="text-xs text-muted-foreground">Faster, simpler queries</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Large model provides smarter analysis but uses more credits.
            </p>
          </div>

          {/* API Key */}
          <div className="space-y-3">
            <Label htmlFor="api-key" className="text-sm font-medium">
              Mistral API Key
            </Label>
            <div className="flex gap-2">
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setConnectionStatus("idle");
                }}
                placeholder="Enter your Mistral API key"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestConnection}
                disabled={isTesting || !apiKey.trim()}
              >
                {isTesting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : connectionStatus === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : connectionStatus === "error" ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : (
                  "Test"
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your API key from{" "}
              <a
                href="https://console.mistral.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Mistral Console
              </a>
            </p>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2 text-sm">
            <div
              className={`h-2 w-2 rounded-full ${
                connectionStatus === "success"
                  ? "bg-green-500"
                  : connectionStatus === "error"
                  ? "bg-red-500"
                  : "bg-gray-300"
              }`}
            />
            <span className="text-muted-foreground">
              {connectionStatus === "success"
                ? `Connected (${selectedModel === "large" ? "Large" : "Small"} model)`
                : connectionStatus === "error"
                ? "Connection failed"
                : "Not connected"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClear} disabled={!apiKey}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button onClick={handleSave} disabled={!apiKey.trim()}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function getApiKey(): string {
  const storedKey = localStorage.getItem(MISTRAL_API_KEY_STORAGE);
  if (storedKey && storedKey !== "undefined" && storedKey !== "null" && storedKey.length > 0) {
    return storedKey;
  }
  return DEFAULT_API_KEY;
}

export function getUseLargeModel(): boolean {
  const model = localStorage.getItem(MODEL_SELECTION_STORAGE);
  return model !== "small";
}

export function hasApiKey(): boolean {
  return true;
}