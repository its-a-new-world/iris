import { Clock, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface DeadlineCardProps {
  title: string;
  category: string;
  daysLeft: number;
  urgency: 'urgent' | 'pending' | 'info' | 'completed';
  date: string;
}

const urgencyStyles = {
  urgent: {
    gradient: 'from-urgent/10 to-urgent/5',
    border: 'border-urgent/30',
    badge: 'bg-urgent text-urgent-foreground',
    text: 'text-urgent',
  },
  pending: {
    gradient: 'from-pending/10 to-pending/5',
    border: 'border-pending/30',
    badge: 'bg-pending text-pending-foreground',
    text: 'text-pending',
  },
  info: {
    gradient: 'from-info/10 to-info/5',
    border: 'border-info/30',
    badge: 'bg-info text-primary-foreground',
    text: 'text-info',
  },
  completed: {
    gradient: 'from-completed/10 to-completed/5',
    border: 'border-completed/30',
    badge: 'bg-completed text-completed-foreground',
    text: 'text-completed',
  },
};

export default function DeadlineCard({ title, category, daysLeft, urgency, date }: DeadlineCardProps) {
  const styles = urgencyStyles[urgency];

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`min-w-[280px] p-5 rounded-xl border-2 bg-gradient-to-br ${styles.gradient} ${styles.border} backdrop-blur-sm hover:shadow-lg transition-all cursor-pointer`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${styles.badge}`}>
          {category}
        </span>
        <div className={`flex items-center gap-1 ${styles.text}`}>
          <Clock className="size-4" />
          <span className="text-sm font-semibold">{daysLeft}d</span>
        </div>
      </div>

      <h3 className="font-semibold text-foreground mb-3 leading-snug">{title}</h3>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Calendar className="size-3.5" />
        <span>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>

      {/* Urgency indicator */}
      <div className="mt-4 h-1.5 bg-muted/30 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: urgency === 'urgent' ? '90%' : urgency === 'pending' ? '60%' : '30%' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`h-full ${styles.badge} rounded-full`}
        />
      </div>
    </motion.div>
  );
}
