import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  format: 'currency' | 'percentage' | 'number';
  trend?: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'emerald';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  format,
  trend,
  icon: Icon,
  color
}) => {
  const formatValue = (val: number, fmt: string) => {
    switch (fmt) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString();
    }
  };

  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    emerald: 'text-emerald-600 bg-emerald-100'
  };

  const trendColorClasses = trend && trend > 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center ${trendColorClasses}`}>
            {trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="text-sm ml-1">{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-gray-900">
          {formatValue(value, format)}
        </div>
        <div className="text-sm text-gray-500">{title}</div>
      </div>
    </div>
  );
};

export default MetricCard;