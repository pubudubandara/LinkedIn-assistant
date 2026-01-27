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

  // Fetch User Data
  const fetchUser = () => {
    if (userId) {
      axios.get(`http://localhost:3000/users/${userId}`)
        .then((response) => {
          setUser(response.data);
          // If there are existing preferences, populate the form
          if (response.data.preference) {
             setFormData(response.data.preference);
          }
          setLoading(false);
        })
        .catch((error) => console.error(error));
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3000/users/${userId}/preferences`, formData);
      alert('Preferences Saved Successfully!');
      fetchUser(); // Refresh data
    } catch (error) {
      alert('Failed to save preferences');
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (!user) return <div className="p-10">User not found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: User Profile */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow h-fit">
          <div className="flex flex-col items-center">
            {user.linkedinAccount.profile_image ? (
              <img src={user.linkedinAccount.profile_image} alt="Profile" className="w-24 h-24 rounded-full mb-4 border-4 border-blue-500" />
            ) : (
              <div className="w-24 h-24 bg-gray-300 rounded-full mb-4"></div>
            )}
            <h2 className="text-xl font-bold text-center">{user.linkedinAccount.first_name} {user.linkedinAccount.last_name}</h2>
            <p className="text-gray-500 text-sm text-center">{user.email}</p>
          </div>
        </div>

        {/* Right Column: AI Preferences Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">AI Personalization Setup</h2>
          <p className="text-gray-600 mb-6">Tell us about yourself so AI can write better posts for you.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Role / Job Title</label>
              <input 
                type="text" 
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g. Software Engineer"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Career Goals</label>
              <textarea 
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                rows={2}
                placeholder="e.g. Become a Tech Lead, Share knowledge"
                value={formData.goals}
                onChange={(e) => setFormData({...formData, goals: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Key Challenges</label>
              <textarea 
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                rows={2}
                placeholder="e.g. Keeping up with AI, Time management"
                value={formData.challenges}
                onChange={(e) => setFormData({...formData, challenges: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Target Country</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  value={formData.target_country}
                  onChange={(e) => setFormData({...formData, target_country: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content Tone</label>
                <select 
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  value={formData.content_tone}
                  onChange={(e) => setFormData({...formData, content_tone: e.target.value})}
                >
                  <option value="Professional">Professional</option>
                  <option value="Casual">Casual</option>
                  <option value="Inspirational">Inspirational</option>
                  <option value="Funny">Funny</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
              Save Preferences
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}