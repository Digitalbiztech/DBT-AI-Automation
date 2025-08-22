import { motion } from 'framer-motion';
import { Moon, Sun, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
  onSettingsClick: () => void;
}

export const Header = ({ isDarkMode, onThemeToggle, onSettingsClick }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8 bg-card/80 backdrop-blur-md rounded-2xl shadow-glass px-8 py-6">
      <div>
  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2 font-sans">LinkedIn Post Approval</h1>
  <p className="text-text/70 font-light">Create, schedule, and review your LinkedIn content</p>
      </div>
      <div className="flex gap-2 items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onThemeToggle}
          className="rounded-full bg-background/60 hover:bg-primary/20 transition-all"
        >
          {isDarkMode ? <Sun className="h-5 w-5 text-primary" /> : <Moon className="h-5 w-5 text-primary" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick}
          className="rounded-full bg-background/60 hover:bg-primary/20 transition-all"
        >
          <Settings className="h-5 w-5 text-primary" />
        </Button>
      </div>
    </div>
  );
};