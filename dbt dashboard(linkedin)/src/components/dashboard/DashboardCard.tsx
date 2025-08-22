import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  subtitle?: string;
  delay?: number;
}

export const DashboardCard = ({ title, value, icon: Icon, color, subtitle, delay = 0 }: DashboardCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="p-6 rounded-2xl bg-card/80 backdrop-blur-md shadow-glass hover:shadow-2xl transition-all duration-300 border-0 cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-text/70 text-sm font-semibold font-sans">{title}</p>
            <p className="text-3xl font-bold text-text font-sans">{value}</p>
            {subtitle && (
              <p className="text-xs text-text/50 font-light font-sans">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-2xl ${color} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};