import { Paperclip, Check, Eye, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface NotificationCardProps {
  sender: string;
  senderRole: string;
  category: string;
  title: string;
  preview: string;
  hasAttachment?: boolean;
  timestamp: string;
  isRead: boolean;
  urgency: 'urgent' | 'pending' | 'info' | 'completed';
  onClick: () => void;
  role: 'student' | 'faculty';
  audience?: string;
  readRate?: number;
  totalRecipients?: number;
  readCount?: number;
}

const categoryColors: Record<string, string> = {
  Academic: 'bg-primary/10 text-primary border-primary/20',
  Scholarship: 'bg-pending/10 text-pending border-pending/20',
  Assignment: 'bg-info/10 text-info border-info/20',
  Internship: 'bg-completed/10 text-completed border-completed/20',
  Campus: 'bg-muted text-muted-foreground border-border',
  Department: 'bg-primary/10 text-primary border-primary/20',
  'Financial Aid': 'bg-pending/10 text-pending border-pending/20',
};

const urgencyBorderColors: Record<string, string> = {
  urgent: 'border-l-urgent',
  pending: 'border-l-pending',
  info: 'border-l-info',
  completed: 'border-l-completed',
};

export default function NotificationCard({
  sender,
  senderRole,
  category,
  title,
  preview,
  hasAttachment,
  timestamp,
  isRead,
  urgency,
  onClick,
  role,
  audience,
  readRate,
  totalRecipients,
  readCount,
}: NotificationCardProps) {
  return (
    <motion.div
      whileHover={{ x: 4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`bg-card border border-border rounded-xl p-5 cursor-pointer transition-all hover:shadow-md border-l-4 ${
        urgencyBorderColors[urgency]
      } ${!isRead && role === 'student' ? 'bg-accent/30' : ''}`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border-2 border-primary/20">
          <span className="text-primary text-sm font-semibold">
            {sender
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{sender}</h3>
                {!isRead && role === 'student' && (
                  <span className="size-2 bg-primary rounded-full flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{senderRole}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                  categoryColors[category] || categoryColors.Campus
                }`}
              >
                {category}
              </span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{timestamp}</span>
            </div>
          </div>

          {/* Title */}
          <h4 className="font-medium text-foreground mb-1 leading-snug">{title}</h4>

          {/* Preview */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{preview}</p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {hasAttachment && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Paperclip className="size-3.5" />
                  <span>Attachment</span>
                </div>
              )}
              {role === 'faculty' && audience && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="size-3.5" />
                  <span>{audience}</span>
                </div>
              )}
            </div>

            {role === 'student' && !isRead && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Mark as read logic
                }}
                className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-md text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <Check className="size-3.5" />
                Mark as Read
              </button>
            )}

            {role === 'faculty' && readRate !== undefined && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Eye className="size-3.5" />
                  <span>
                    {readCount}/{totalRecipients}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${readRate}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-full ${
                        readRate >= 80
                          ? 'bg-completed'
                          : readRate >= 60
                          ? 'bg-pending'
                          : 'bg-urgent'
                      } rounded-full`}
                    />
                  </div>
                  <span className="text-xs font-semibold text-foreground">{readRate}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
