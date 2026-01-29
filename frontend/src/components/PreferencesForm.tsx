'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface PreferencesFormProps {
  userId: string;
}

interface FormData {
  role: string;
  goals: string;
  challenges: string;
  target_country: string;
  content_tone: string;
}

export default function PreferencesForm({ userId }: PreferencesFormProps) {
  const [formData, setFormData] = useState<FormData>({
    role: '',
    goals: '',
    challenges: '',
    target_country: 'USA',
    content_tone: 'Professional',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userId) {
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`, {
        withCredentials: true
      })
        .then((response) => {
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
  }, [userId]);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}/preferences`, formData, {
        withCredentials: true
      });
      alert('Preferences Saved Successfully!');
    } catch (error) {
      alert('Failed to save preferences');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">AI Personalization</h2>
      <form onSubmit={handleSavePreferences} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Role / Title</label>
            <input 
              type="text" 
              className="mt-1 w-full border rounded p-2 text-sm" 
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value})} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Country</label>
            <input 
              type="text" 
              className="mt-1 w-full border rounded p-2 text-sm" 
              value={formData.target_country} 
              onChange={(e) => setFormData({...formData, target_country: e.target.value})} 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Career Goals</label>
          <textarea 
            className="mt-1 w-full border rounded p-2 text-sm" 
            rows={2} 
            value={formData.goals} 
            onChange={(e) => setFormData({...formData, goals: e.target.value})} 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Key Challenges</label>
          <textarea 
            className="mt-1 w-full border rounded p-2 text-sm" 
            rows={2} 
            value={formData.challenges} 
            onChange={(e) => setFormData({...formData, challenges: e.target.value})} 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Content Tone</label>
          <select 
            className="mt-1 w-full border rounded p-2 text-sm" 
            value={formData.content_tone} 
            onChange={(e) => setFormData({...formData, content_tone: e.target.value})}
          >
            <option value="Professional">Professional</option>
            <option value="Casual">Casual</option>
            <option value="Inspirational">Inspirational</option>
            <option value="Funny">Funny</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-black text-sm disabled:bg-gray-400"
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </form>
    </div>
  );
}
