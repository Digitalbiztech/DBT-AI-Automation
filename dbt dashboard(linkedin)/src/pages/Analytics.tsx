import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Users, BarChart3, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Link } from 'react-router-dom';

const Analytics = ({ onClearChats }: { onClearChats?: () => void }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const dashboardStats = [
    {
      title: "Posts Today",
      value: "0",
      icon: Calendar,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      subtitle: "No posts today"
    },
    {
      title: "Scheduled Posts",
      value: "0",
      icon: TrendingUp,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      subtitle: "No scheduled posts"
    },
    {
      title: "Total Engagement",
      value: "0",
      icon: Users,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      subtitle: "No engagement yet"
    },
    {
      title: "Avg. Performance",
      value: "0%",
      icon: BarChart3,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      subtitle: "No data available"
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 font-inter">
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">Track your LinkedIn automation performance</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 ml-4"
          onClick={onClearChats || (() => { localStorage.removeItem('chats'); window.location.reload(); })}
          title="Clear all chats"
        >
          Refresh
        </Button>
      </div>
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <DashboardCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              subtitle={stat.subtitle}
              delay={index * 0.1}
            />
          ))}
        </div>
        {/* Additional Analytics Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Activity</h3>
            <div className="space-y-3">
              <div className="text-center py-8">
                <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Engagement Trends</h3>
            <div className="text-center py-8">
              <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No engagement data available</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;