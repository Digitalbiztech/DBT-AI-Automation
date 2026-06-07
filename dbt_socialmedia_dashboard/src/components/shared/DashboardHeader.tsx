
import React from "react";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  description: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export const DashboardHeader = ({ 
  title, 
  subtitle, 
  description, 
  primaryColor = "from-purple-900 via-violet-800 to-blue-900",
  secondaryColor = "text-purple-700/80"
}: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-3">
        <h1 className="text-5xl font-black tracking-tight">
          <span className={`bg-gradient-to-r ${primaryColor} bg-clip-text text-transparent`}>
            {title}
          </span>
          <span className="text-slate-600 font-light"> {subtitle}</span>
        </h1>
        <p className={`text-lg ${secondaryColor} font-medium`}>{description}</p>
      </div>
    </div>
  );
};
