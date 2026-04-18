import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, CheckCircle2, Clock, Send, FileUp, Paperclip } from 'lucide-react';
import MetricCard from './MetricCard';
import NotificationCard from './NotificationCard';


const mockMetrics = [
  { id: '1', label: 'Messages Sent', value: '124', change: '+12%', trend: 'up' as const, icon: Users },
  { id: '2', label: 'Overall Read Rate', value: '87.3%', change: '+5.2%', trend: 'up' as const, icon: CheckCircle2 },
  { id: '3', label: 'Pending Acknowledgements', value: '23', change: '-8', trend: 'down' as const, icon: Clock },
  { id: '4', label: 'Most Engaged Dept', value: 'CS', change: '92% rate', trend: 'up' as const, icon: TrendingUp },
];

const mockSentNotifications = [
  {
    id: '1',
    sender: 'You',
    senderRole: 'HOD - Computer Science',
    category: 'Academic',
    title: 'Important: Midterm Exam Schedule Released',
    preview: 'The midterm examination schedule for Spring 2026 has been finalized...',
    fullContent: 'The midterm examination schedule for Spring 2026 has been finalized. All students are required to review the dates carefully and report any conflicts to the academic office within 48 hours.',
    hasAttachment: true,
    timestamp: '2 hours ago',
    isRead: false,
    urgency: 'urgent' as const,
    audience: 'All CS Students (342)',
    readRate: 73,
    totalRecipients: 342,
    readCount: 250,
  }
];

interface PendingUser {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  semester?: string; // The '?' means it's optional (faculty won't have a semester)
}


export default function FacultyDashboard({ searchQuery, onNotificationClick }: any) {
  const [isSending, setIsSending] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  // This tells the dashboard to go get the data the moment the page loads
    useEffect(() => {
      fetch('http://localhost:5000/api/admin/pending')
        .then((res) => res.json())
        .then((data) => {
          console.log("Successfully fetched pending users:", data);
          setPendingUsers(data);
        })
        .catch((err) => console.error("Failed to fetch from backend:", err));
    }, []);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Academic',
    emails: '', 
    senderName: 'Prof. ' 
  });

const handleVerify = async (id: number, status: 'approved' | 'rejected') => {
  // We ensure the ID is treated as part of the URL string
  const res = await fetch(`http://localhost:5000/api/admin/verify/${String(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });

  if (res.ok) {
    setPendingUsers((prev) => prev.filter((u) => u.id !== id));
  }
};

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // Using FormData to handle file upload
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('category', formData.category);
    data.append('senderName', formData.senderName);
    data.append('studentEmails', formData.emails); // We will split this in the backend
    
    if (file) {
      data.append('attachment', file);
    }

    try {
      const response = await fetch('http://localhost:5000/api/faculty/broadcast', {
        method: 'POST',
        // Note: Do NOT set Content-Type header when sending FormData; 
        // the browser will set it automatically with the boundary string.
        body: data,
      });

      if (response.ok) {
        alert("🚀 Broadcast with attachment sent to students!");
        setFormData({ title: '', content: '', category: 'Academic', emails: '', senderName: 'Prof. ' });
        setFile(null);
      }
    } catch (err) {
      console.error("Broadcast failed:", err);
      alert("Error sending broadcast.");
    } finally {
      setIsSending(false);
    }
  };

  const filteredNotifications = mockSentNotifications.filter(
    (notif) =>
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 1. COMPOSE SECTION */}
      <section className="mb-10 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-border">
        <div className="flex items-center gap-2 mb-6">
          <Send className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Compose New Broadcast</h2>
        </div>
        
        <form onSubmit={handleBroadcast} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <input 
              className="w-full p-2.5 rounded-xl border bg-secondary/20 focus:ring-2 focus:ring-primary outline-none" 
              placeholder="Your Name (e.g. Prof. Satish)" 
              value={formData.senderName}
              onChange={e => setFormData({...formData, senderName: e.target.value})}
              required
            />
            <input 
              className="w-full p-2.5 rounded-xl border bg-secondary/20 focus:ring-2 focus:ring-primary outline-none" 
              placeholder="Notice Title" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
            />
            <input 
              className="w-full p-2.5 rounded-xl border bg-secondary/20 focus:ring-2 focus:ring-primary outline-none" 
              placeholder="Target Emails (comma separated)" 
              value={formData.emails}
              onChange={e => setFormData({...formData, emails: e.target.value})}
              required
            />
            
            {/* FILE UPLOAD FIELD */}
            <div className="relative group">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-secondary/10 border-secondary hover:bg-secondary/20 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {file ? (
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <Paperclip className="w-4 h-4" />
                      {file.name}
                    </div>
                  ) : (
                    <>
                      <FileUp className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                />
              </label>
            </div>
          </div>
          
          <div className="space-y-4 flex flex-col">
            <select 
              className="w-full p-2.5 rounded-xl border bg-secondary/20 outline-none"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option>Academic</option>
              <option>Urgent</option>
              <option>Assignment</option>
              <option>Department</option>
            </select>
            <textarea 
              className="w-full p-2.5 rounded-xl border bg-secondary/20 flex-grow min-h-[150px] outline-none" 
              placeholder="Type the full message here..."
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              required
            />
            <button 
              type="submit"
              disabled={isSending}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSending ? 'Sending...' : (
                <><Send className="w-5 h-5" /> Dispatch Alert</>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* 2. ANALYTICS */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Analytics Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockMetrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MetricCard {...metric} />
            </motion.div>
          ))}
        </div>
      </section>
      {/* 3. VERIFICATION CENTER */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <Users className="w-6 h-6 text-orange-500" /> Pending Approvals
        </h2>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border overflow-hidden">
            {pendingUsers.length > 0 ? (
      <table className="w-full text-left border-collapse">
        <thead className="bg-secondary/20">
          <tr className="text-sm font-bold">
            <th className="p-4">Name</th>
            <th className="p-4">Role</th>
            <th className="p-4">Dept/Sem</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {pendingUsers.map((u: PendingUser) => (
            <tr key={u.id} className="text-sm hover:bg-secondary/5">
              <td className="p-4">
                <p className="font-bold">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </td>
              <td className="p-4 capitalize">{u.role}</td>
              <td className="p-4">{u.department} {u.semester && `(${u.semester})`}</td>
              <td className="p-4 text-right space-x-2">
                <button onClick={() => handleVerify(u.id, 'approved')} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg font-bold hover:bg-green-200">Approve</button>
                <button onClick={() => handleVerify(u.id, 'rejected')} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg font-bold hover:bg-red-200">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p className="p-10 text-center text-muted-foreground italic">No pending verifications. All clear!</p>
    )}
  </div>
</section>

      {/* 4. SENT HISTORY */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Sent History</h2>
        <div className="space-y-3">
          {filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NotificationCard
                {...notification}
                onClick={() => onNotificationClick(notification)}
                role="faculty"
              />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}