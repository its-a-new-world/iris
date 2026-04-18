import { X, Paperclip, Calendar, Users, Eye, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';

interface NotificationModalProps {
  notification: any;
  onClose: () => void;
  role: 'student' | 'faculty';
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

export default function NotificationModal({ notification, onClose, role }: NotificationModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-border flex items-start justify-between sticky top-0 bg-card/95 backdrop-blur-sm z-10">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                  <span className="text-primary font-semibold">
                    {notification.sender
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{notification.sender}</h3>
                  <p className="text-xs text-muted-foreground">{notification.senderRole}</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="size-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors flex-shrink-0"
            >
              <X className="size-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5 overflow-y-auto max-h-[calc(85vh-200px)]">
            {/* Title and metadata */}
            <div className="mb-6">
              <div className="flex items-start gap-3 mb-3">
                <span
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
                    categoryColors[notification.category] || categoryColors.Campus
                  }`}
                >
                  {notification.category}
                </span>
                {role === 'faculty' && notification.audience && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-md text-xs text-muted-foreground">
                    <Users className="size-3.5" />
                    <span>{notification.audience}</span>
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-semibold text-foreground mb-3">{notification.title}</h2>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  <span>{notification.timestamp}</span>
                </div>
                {role === 'faculty' && notification.readRate !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <Eye className="size-3.5" />
                    <span>
                      {notification.readCount} of {notification.totalRecipients} read (
                      {notification.readRate}%)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Full content */}
            <div className="prose prose-sm max-w-none mb-6">
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {notification.fullContent}
              </p>
            </div>

            {/* Attachment */}
            {notification.hasAttachment && (
              <div className="border border-border rounded-lg p-4 bg-secondary/50 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Paperclip className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {notification.category === 'Academic'
                          ? 'Exam_Schedule_Spring_2026.pdf'
                          : 'Project_Guidelines.pdf'}
                      </p>
                      <p className="text-xs text-muted-foreground">PDF Document • 245 KB</p>
                    </div>
                  </div>
                  <button className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors text-xs font-medium flex items-center gap-2">
                    <Download className="size-3.5" />
                    Download
                  </button>
                </div>
              </div>
            )}

            {/* Analytics for faculty */}
            {role === 'faculty' && notification.readRate !== undefined && (
              <div className="border border-border rounded-lg p-4 bg-accent/50">
                <h4 className="text-sm font-semibold text-foreground mb-3">Engagement Analytics</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-muted-foreground">Read Rate</span>
                      <span className="text-xs font-semibold text-foreground">
                        {notification.readRate}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${notification.readRate}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className={`h-full ${
                          notification.readRate >= 80
                            ? 'bg-completed'
                            : notification.readRate >= 60
                            ? 'bg-pending'
                            : 'bg-urgent'
                        } rounded-full`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total Recipients</p>
                      <p className="text-lg font-semibold text-foreground">
                        {notification.totalRecipients}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Read Count</p>
                      <p className="text-lg font-semibold text-foreground">
                        {notification.readCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {role === 'student' && (
            <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-between">
              <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Archive
              </button>
              {!notification.isRead && (
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium">
                  Mark as Read
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
