
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from "lucide-react";

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
}

export const SupabaseConfigModal = ({ isOpen, onClose, tableName }: SupabaseConfigModalProps) => {
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [selectedTable, setSelectedTable] = useState(tableName);

  const tableOptions = [
    { value: "leads", label: "Leads" },
    { value: "email_logs", label: "Email Logs" },
    { value: "blogs", label: "Blogs" },
    { value: "news_posts", label: "News Posts" },
    { value: "trends", label: "Trends" },
    { value: "queue_items", label: "Queue Items" },
    { value: "social_metrics", label: "Social Metrics" },
    { value: "analytics_data", label: "Analytics Data" },
    { value: "workflows", label: "Workflows" },
    { value: "ai_logs", label: "AI Logs" },
    { value: "campaigns", label: "Campaigns" }
  ];

  const handleSave = () => {
    // Save configuration to localStorage or make API call
    localStorage.setItem('supabase_url', supabaseUrl);
    localStorage.setItem('supabase_key', supabaseKey);
    localStorage.setItem('selected_table', selectedTable);
    console.log('Supabase configuration saved:', { supabaseUrl, supabaseKey, selectedTable });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border-purple-200 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-purple-800">
            <Settings className="h-5 w-5" />
            <span>Configure Supabase Connection</span>
          </DialogTitle>
          <DialogDescription className="text-purple-600">
            Connect your Supabase database to sync data in real-time.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="supabase-url" className="text-purple-700 font-medium">Supabase URL</Label>
            <Input
              id="supabase-url"
              placeholder="https://your-project.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              className="border-purple-200 focus:border-purple-400 rounded-xl"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="supabase-key" className="text-purple-700 font-medium">Supabase Anon Key</Label>
            <Input
              id="supabase-key"
              type="password"
              placeholder="eyJh..."
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              className="border-purple-200 focus:border-purple-400 rounded-xl"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="table-select" className="text-purple-700 font-medium">Target Table</Label>
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger className="border-purple-200 focus:border-purple-400 rounded-xl">
                <SelectValue placeholder="Select a table" />
              </SelectTrigger>
              <SelectContent className="bg-white border-purple-200 rounded-xl">
                {tableOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-purple-50">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-purple-200 text-purple-600 hover:bg-purple-50 rounded-xl"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-xl shadow-lg shadow-purple-300/50"
          >
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
