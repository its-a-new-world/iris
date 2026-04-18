import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, User, Phone, BookOpen, GraduationCap, ShieldAlert } from 'lucide-react';

export default function AuthPage({ onLogin }: { onLogin: (userData: any) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'error' or 'success'

  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', department: 'Computer Science', semester: 'S4'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    if (isLogin) {
      // --- LOGIN LOGIC ---
      try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        const data = await res.json();

        if (res.ok && data.user.status === 'approved') {
          onLogin(data.user); // Redirects to Dashboard
        } else if (res.ok && data.user.status === 'pending') {
          setMessage({ text: 'Your account is waiting for Admin verification.', type: 'error' });
        } else {
          setMessage({ text: data.error || 'Invalid credentials', type: 'error' });
        }
      } catch (err) { setMessage({ text: 'Server connection failed.', type: 'error' }); }
      
    } else {
      // --- SIGN UP LOGIC ---
      try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, role })
        });
        
        if (res.ok) {
          setMessage({ text: 'Registration successful! Please wait for Admin approval.', type: 'success' });
          setTimeout(() => setIsLogin(true), 3000); // Switch to login after 3 secs
        } else {
          setMessage({ text: 'Email already exists or registration failed.', type: 'error' });
        }
      } catch (err) { setMessage({ text: 'Server connection failed.', type: 'error' }); }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <motion.div 
        layout
        className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-border"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">IRIS Portal</h1>
          <p className="text-muted-foreground">{isLogin ? 'Welcome back to GEC Thrissur' : 'Create your IRIS account'}</p>
        </div>

        {message.text && (
          <div className={`p-3 rounded-xl mb-6 text-sm text-center font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* SIGN UP ONLY FIELDS */}
          <AnimatePresence>
            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                
                {/* Role Selector */}
                <div className="flex gap-2 p-1 bg-secondary/20 rounded-xl mb-4">
                  <button type="button" onClick={() => setRole('student')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${role === 'student' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>Student</button>
                  <button type="button" onClick={() => setRole('faculty')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${role === 'faculty' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>Faculty</button>
                </div>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input required={!isLogin} type="text" placeholder="Full Name" className="w-full pl-10 p-3 rounded-xl border bg-secondary/20 outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input required={!isLogin} type="tel" placeholder="Phone Number" className="w-full pl-10 p-3 rounded-xl border bg-secondary/20 outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>

                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select className="w-full pl-10 p-3 rounded-xl border bg-secondary/20 outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, department: e.target.value})}>
                      <option>Computer Science</option>
                      <option>Mechanical</option>
                      <option>Electronics</option>
                      <option>Electrical</option>
                    </select>
                  </div>
                  
                  {role === 'student' && (
                    <div className="relative w-1/3">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select className="w-full pl-10 p-3 rounded-xl border bg-secondary/20 outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, semester: e.target.value})}>
                        <option>S2</option><option>S4</option><option>S6</option><option>S8</option>
                      </select>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ALWAYS VISIBLE FIELDS (Email & Password) */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input required type="email" placeholder="Email Address" className="w-full pl-10 p-3 rounded-xl border bg-secondary/20 outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input required type="password" placeholder="Password" className="w-full pl-10 p-3 rounded-xl border bg-secondary/20 outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all mt-4">
            {isLoading ? 'Processing...' : (isLogin ? 'Secure Login' : 'Submit Registration')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isLogin ? "Don't have an account? " : "Already registered? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-bold hover:underline">
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}