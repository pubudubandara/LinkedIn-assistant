'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProfileCard from '@/components/ProfileCard';
import PreferencesForm from '@/components/PreferencesForm';
import PostGenerator from '@/components/PostGenerator';
import PostHistory from '@/components/PostHistory';

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Route Protection Logic
  useEffect(() => {
    const id = searchParams.get('id');
    
    if (!id) {
      router.push('/');
    } else {
      setUserId(id);
    }
  }, [searchParams, router]);

  const handlePostPublished = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (!userId) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-600">Loading Dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
           <div>
             <h1 className="text-3xl font-bold text-gray-800">LinkedIn AI Dashboard</h1>
             <p className="text-gray-500 mt-1">Create and manage AI-powered LinkedIn posts</p>
           </div>
           <button 
             onClick={() => router.push('/')} 
             className="mt-4 md:mt-0 bg-red-50 text-red-600 hover:bg-red-100 px-5 py-2 rounded-lg font-semibold transition-colors border border-red-200"
           >
             Logout
           </button>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Column: Profile & Settings */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
               <ProfileCard userId={userId} />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
               <PreferencesForm userId={userId} />
            </div>
          </div>

          {/* Right Column: Generator & History */}
          <div className="lg:col-span-3 space-y-6">
             <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500 border border-gray-200">
                <PostGenerator userId={userId} onPostPublished={handlePostPublished} />
             </div>
             
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Post History</h3>
                <PostHistory userId={userId} refreshTrigger={refreshTrigger} />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}