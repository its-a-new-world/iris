import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
}

export default function MetricCard({ label, value, change, trend, icon: Icon }: MetricCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="size-5 text-primary" />
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
            trend === 'up'
              ? 'bg-completed/10 text-completed'
              : 'bg-info/10 text-info'
          }`}
        >
          <TrendIcon className="size-3" />
          <span>{change}</span>
        </div>
      </div>

      <div>
        <p className="text-2xl font-semibold text-foreground mb-1">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  );
}
