
import React, { useState, useEffect } from 'react';

const UserStats: React.FC = () => {
  const [onlineUsers, setOnlineUsers] = useState(111);
  const [registeredUsers, setRegisteredUsers] = useState(15941);
  const [sessionTime, setSessionTime] = useState(new Date(0));

  useEffect(() => {
    const onlineInterval = setInterval(() => {
      setOnlineUsers(prev => {
        const fluctuation = Math.floor(Math.random() * 7) - 3; // between -3 and +3
        return Math.max(50, prev + fluctuation); // Keep it above a baseline
      });
    }, 3000); // Update every 3 seconds

    const registeredInterval = setInterval(() => {
      setRegisteredUsers(prev => prev + (Math.random() > 0.7 ? 1 : 0)); // Occasionally increment
    }, 7000); // Update every 7 seconds
    
    // Simple session timer
    const startTime = Date.now();
    const sessionInterval = setInterval(() => {
        const elapsed = new Date(Date.now() - startTime);
        setSessionTime(elapsed);
    }, 1000);

    return () => {
      clearInterval(onlineInterval);
      clearInterval(registeredInterval);
      clearInterval(sessionInterval);
    };
  }, []);

  const formatSessionTime = (date: Date) => {
    const h = String(date.getUTCHours()).padStart(2, '0');
    const m = String(date.getUTCMinutes()).padStart(2, '0');
    const s = String(date.getUTCSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  return (
    <div className="bg-slate-900/50 border-b border-slate-700/50 text-white text-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-10">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="flex items-center">
            <span className="relative flex h-3 w-3 ltr:mr-2 rtl:ml-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span>کاربران آنلاین: <span className="font-bold text-green-400">{onlineUsers.toLocaleString('fa-IR')}</span></span>
          </div>
          <div className="hidden sm:flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ltr:mr-2 rtl:ml-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span>کاربران ثبت‌شده: <span className="font-bold text-indigo-400">{registeredUsers.toLocaleString('fa-IR')}</span></span>
          </div>
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ltr:mr-2 rtl:ml-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>مدت جلسه: <span className="font-roboto-mono font-bold text-gray-300">{formatSessionTime(sessionTime)}</span></span>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
