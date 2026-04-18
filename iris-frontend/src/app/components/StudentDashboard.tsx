import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import DeadlineCard from './DeadlineCard';
import NotificationCard from './NotificationCard';

// 1. ADDED THE PROP DEFINITION HERE
interface StudentDashboardProps {
  searchQuery: string;
  onNotificationClick: (notification: any) => void; 
}

// 2. RECEIVING THE PROP HERE
export default function StudentDashboard({ searchQuery, onNotificationClick }: StudentDashboardProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Notifications and Deadlines
  useEffect(() => {
    // Fetch Notifications
    fetch('http://localhost:5000/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const formattedData = data.map((dbNotice: any) => ({
            id: dbNotice.id.toString(),
            sender: dbNotice.sender_name,
            senderRole: dbNotice.target_department || 'GEC Thrissur',
            category: dbNotice.category,
            title: dbNotice.title,
            preview: dbNotice.content.substring(0, 100) + '...',
            fullContent: dbNotice.content,
            timestamp: new Date(dbNotice.created_at).toLocaleDateString(),
            isRead: dbNotice.is_read || false,
            urgency: dbNotice.category === 'Urgent' ? 'urgent' : 'info' as const,
          }));
          setNotifications(formattedData);
        }
      })
      .catch((err) => console.error("Error fetching IRIS notifications:", err))
      .finally(() => setIsLoading(false));

    // Fetch Deadlines
    fetch('http://localhost:5000/api/deadlines')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const formattedDeadlines = data.map((d: any) => ({
            id: d.id.toString(),
            title: d.title,
            category: d.category,
            daysLeft: d.days_left,
            urgency: d.urgency,
            date: new Date(d.deadline_date).toLocaleDateString()
          }));
          setDeadlines(formattedDeadlines);
        }
      })
      .catch(err => console.error("Error fetching deadlines:", err));
  }, []);

  // Filter and Sort Notifications (Unread first)
  const filteredNotifications = notifications
    .filter(
      (notif) =>
        notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.sender.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.isRead === b.isRead) return 0;
      return a.isRead ? 1 : -1;
    });

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      {/* Deadline Tracker */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Deadlines</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {deadlines.length > 0 ? (
            deadlines.map((deadline) => (
              <DeadlineCard key={deadline.id} {...deadline} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming deadlines.</p>
          )}
        </div>
      </section>

      {/* Notifications Feed */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Notifications</h2>
          <p className="text-sm text-muted-foreground">
            {filteredNotifications.filter(n => !n.isRead).length} unread messages
          </p>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <p>Loading updates...</p>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                // 3. THIS IS WHERE WE USE THE PROP TO OPEN THE MODAL
                onClick={() => onNotificationClick(notification)} 
                className={`cursor-pointer transition-all ${notification.isRead ? 'opacity-60' : 'opacity-100'}`}
              >
                <NotificationCard {...notification} role="student" />
              </motion.div>
            ))
          ) : (
            <p className="text-center py-10 text-muted-foreground">No notifications found.</p>
          )}
        </div>
      </section>
    </div>
  );
}