import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Webhook, Shield, RefreshCw, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export const SettingsPanel = () => {
  const [autoRenew, setAutoRenew] = useState(true);
  const [tokenStatus, setTokenStatus] = useState<'active' | 'expiring' | 'expired'>('active');
  const [daysUntilExpiry, setDaysUntilExpiry] = useState(45);
  const { toast } = useToast();

  const WEBHOOK_URL = 'https://n8n.digitalbiz.tech/webhook/7dd3232a-1926-4cef-84a3-7287b72c561a';

  const refreshToken = () => {
    toast({
      title: "Token refresh initiated",
      description: "LinkedIn token is being refreshed...",
    });
    setTimeout(() => {
      setTokenStatus('active');
      setDaysUntilExpiry(60);
      toast({
        title: "Token refreshed",
        description: "LinkedIn token has been successfully renewed.",
      });
    }, 2000);
  };

  const getTokenStatusBadge = () => {
    switch (tokenStatus) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'expiring':
        return <Badge variant="secondary"><AlertTriangle className="h-3 w-3 mr-1" />Expiring Soon</Badge>;
      case 'expired':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Expired</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="space-y-8 w-full"
    >
      <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <Webhook className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900 tracking-tight font-inter">n8n Webhook Integration</h2>
        </div>
        <div className="space-y-6">
          <div>
            <Label htmlFor="webhook" className="text-gray-700 font-medium">Webhook URL</Label>
            <div className="mt-2 bg-gray-100 text-gray-900 border border-gray-300 rounded-xl px-4 py-2 select-all font-mono text-sm">
              {WEBHOOK_URL}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Status:</span>
            <Badge variant="default" className="text-xs px-3 py-1 rounded-full">
              Connected
            </Badge>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900 tracking-tight font-inter">LinkedIn Token Manager</h2>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Token Status:</span>
            {getTokenStatusBadge()}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Expires in:</span>
            <span className="text-sm font-medium text-gray-900">{daysUntilExpiry} days</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-sm text-gray-700">Auto-Renewal</span>
              <p className="text-xs text-gray-500">Automatically refresh tokens before expiry</p>
            </div>
            <Switch checked={autoRenew} onCheckedChange={setAutoRenew} />
          </div>
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Last Refresh:</span>
              <span>2 days ago</span>
            </div>
            <div className="flex justify-between">
              <span>Next Check:</span>
              <span>In 22 hours</span>
            </div>
          </div>
          <Button onClick={refreshToken} variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl shadow-md focus:ring-2 focus:ring-blue-500 transition-all duration-200">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Token Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
};