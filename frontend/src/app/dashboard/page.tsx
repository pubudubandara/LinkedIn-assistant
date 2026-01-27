'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Interfaces
interface UserProfile {
  id: number;
  email: string;
  linkedinAccount: {
    first_name: string;
    last_name: string;
    headline: string;
    profile_image: string;
  };
  preference?: {
    role: string;
    goals: string;
    challenges: string;
    target_country: string;
    content_tone: string;
  };
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    role: '',
    goals: '',
    challenges: '',
    target_country: 'USA',
    content_tone: 'Professional',
  });

  // AI Post Generation State
  const [generatedPost, setGeneratedPost] = useState('');
  const [generating, setGenerating] = useState(false);

  // Fetch User Data
  const fetchUser = () => {
    if (userId) {
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`)
        .then((response) => {
          setUser(response.data);
          // Load existing preferences if available
          if (response.data.preference) {
             setFormData({
               role: response.data.preference.role,
               goals: response.data.preference.goals,
               challenges: response.data.preference.challenges,
               target_country: response.data.preference.target_country,
               content_tone: response.data.preference.content_tone,
             });
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  // Handle Save Preferences
  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}/preferences`, formData);
      alert('Preferences Saved Successfully!');
      fetchUser();
    } catch (error) {
      alert('Failed to save preferences');
    }
  };

  // Handle Generate Post (Gemini AI)
  const handleGeneratePost = async () => {
    setGenerating(true);
    setGeneratedPost(''); // Clear previous post
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/generate/${userId}`);
      setGeneratedPost(response.data.content);
    } catch (error) {
      console.error(error);
      alert('Failed to generate post. Check backend console.');
    }
    setGenerating(false);
  };

  if (loading) return <div className="p-10 text-center">Loading User Data...</div>;
  if (!user) return <div className="p-10 text-center text-red-500">User not found. Please check the URL ID.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: User Profile */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border h-fit">
          <div className="flex flex-col items-center">
            {user.linkedinAccount.profile_image ? (
              <img src={user.linkedinAccount.profile_image} alt="Profile" className="w-28 h-28 rounded-full mb-4 border-4 border-blue-100" />
            ) : (
              <div className="w-28 h-28 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-gray-500">No Img</div>
            )}
            <h2 className="text-xl font-bold text-center text-gray-800">{user.linkedinAccount.first_name} {user.linkedinAccount.last_name}</h2>
            <p className="text-gray-500 text-sm text-center mb-4">{user.email}</p>
            <div className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
              LinkedIn Connected
            </div>
          </div>
        </div>

        {/* Middle Column: Preferences Form */}
        <div className="md:col-span-2 space-y-8">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">1. AI Personalization Setup</h2>
            <form onSubmit={handleSavePreferences} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role / Title</label>
                  <input type="text" className="mt-1 w-full border rounded p-2" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} required />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700">Target Country</label>
                   <input type="text" className="mt-1 w-full border rounded p-2" value={formData.target_country} onChange={(e) => setFormData({...formData, target_country: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Career Goals</label>
                <textarea className="mt-1 w-full border rounded p-2" rows={2} value={formData.goals} onChange={(e) => setFormData({...formData, goals: e.target.value})} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Key Challenges</label>
                <textarea className="mt-1 w-full border rounded p-2" rows={2} value={formData.challenges} onChange={(e) => setFormData({...formData, challenges: e.target.value})} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Content Tone</label>
                <select className="mt-1 w-full border rounded p-2" value={formData.content_tone} onChange={(e) => setFormData({...formData, content_tone: e.target.value})}>
                  <option value="Professional">Professional</option>
                  <option value="Casual">Casual</option>
                  <option value="Inspirational">Inspirational</option>
                  <option value="Funny">Funny</option>
                </select>
              </div>

              <button type="submit" className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-black text-sm">
                Save / Update Preferences
              </button>
            </form>
          </div>

          {/* Bottom Section: AI Generator */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">2. Content Generator ( AI)</h2>
            
            <p className="text-sm text-gray-600 mb-4">
              Based on your preferences above, AI will generate a LinkedIn post for you.
            </p>

            <button 
              onClick={handleGeneratePost}
              disabled={generating}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-blue-300 font-semibold transition"
            >
              {generating ? '✨ AI is writing your post...' : '✨ Generate New Post'}
            </button>

            {generatedPost && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <label className="block text-sm font-bold text-blue-800 mb-2">Generated Draft:</label>
                <textarea 
                  className="w-full h-48 p-4 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                  value={generatedPost}
                  onChange={(e) => setGeneratedPost(e.target.value)}
                ></textarea>
                
                <div className="mt-4 flex justify-end">
                  <button className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 shadow">
                    Publish to LinkedIn 🚀 (Coming Soon)
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}