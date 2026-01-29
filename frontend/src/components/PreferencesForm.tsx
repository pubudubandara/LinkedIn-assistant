'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface FormData {
  role: string;
  goals: string;
  challenges: string;
  target_country: string;
  content_tone: string;
}

interface PreferencesFormProps {
  userId: string;
  currentPreferences: FormData;
  setCurrentPreferences: (prefs: FormData) => void;
}

export default function PreferencesForm({ userId, currentPreferences, setCurrentPreferences }: PreferencesFormProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (userId) {
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`, {
        withCredentials: true
      })
        .then((response) => {
          if (response.data.preference) {
            setCurrentPreferences({
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

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Role validation
    if (!currentPreferences.role.trim()) {
      newErrors.role = 'Role is required';
    } else if (currentPreferences.role.trim().length < 2) {
      newErrors.role = 'Role must be at least 2 characters';
    } else if (currentPreferences.role.length > 100) {
      newErrors.role = 'Role must not exceed 100 characters';
    }

    // Goals validation
    if (!currentPreferences.goals.trim()) {
      newErrors.goals = 'Career goals are required';
    } else if (currentPreferences.goals.trim().length < 10) {
      newErrors.goals = 'Goals must be at least 10 characters';
    } else if (currentPreferences.goals.length > 500) {
      newErrors.goals = 'Goals must not exceed 500 characters';
    }

    // Challenges validation
    if (!currentPreferences.challenges.trim()) {
      newErrors.challenges = 'Challenges are required';
    } else if (currentPreferences.challenges.trim().length < 10) {
      newErrors.challenges = 'Challenges must be at least 10 characters';
    } else if (currentPreferences.challenges.length > 500) {
      newErrors.challenges = 'Challenges must not exceed 500 characters';
    }

    // Target country validation
    if (!currentPreferences.target_country.trim()) {
      newErrors.target_country = 'Target country is required';
    } else if (currentPreferences.target_country.trim().length < 2) {
      newErrors.target_country = 'Target country must be at least 2 characters';
    } else if (currentPreferences.target_country.length > 100) {
      newErrors.target_country = 'Target country must not exceed 100 characters';
    }

    // Content tone validation
    const validTones = ['Professional', 'Casual', 'Inspirational', 'Funny'];
    if (!validTones.includes(currentPreferences.content_tone)) {
      newErrors.content_tone = 'Invalid content tone';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}/preferences`, currentPreferences, {
        withCredentials: true
      });
      alert('Preferences Saved Successfully!');
      setErrors({});
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to save preferences';
      alert(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
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
              className={`mt-1 w-full border rounded p-2 text-sm ${errors.role ? 'border-red-500' : ''}`}
              value={currentPreferences.role} 
              onChange={(e) => setCurrentPreferences({...currentPreferences, role: e.target.value})} 
              maxLength={100}
            />
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Country</label>
            <input 
              type="text" 
              className={`mt-1 w-full border rounded p-2 text-sm ${errors.target_country ? 'border-red-500' : ''}`}
              value={currentPreferences.target_country} 
              onChange={(e) => setCurrentPreferences({...currentPreferences, target_country: e.target.value})} 
              maxLength={100}
            />
            {errors.target_country && <p className="text-red-500 text-xs mt-1">{errors.target_country}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Career Goals</label>
          <textarea 
            className={`mt-1 w-full border rounded p-2 text-sm ${errors.goals ? 'border-red-500' : ''}`}
            rows={2} 
            value={currentPreferences.goals} 
            onChange={(e) => setCurrentPreferences({...currentPreferences, goals: e.target.value})} 
            maxLength={500}
          />
          {errors.goals && <p className="text-red-500 text-xs mt-1">{errors.goals}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Key Challenges</label>
          <textarea 
            className={`mt-1 w-full border rounded p-2 text-sm ${errors.challenges ? 'border-red-500' : ''}`}
            rows={2} 
            value={currentPreferences.challenges} 
            onChange={(e) => setCurrentPreferences({...currentPreferences, challenges: e.target.value})} 
            maxLength={500}
          />
          {errors.challenges && <p className="text-red-500 text-xs mt-1">{errors.challenges}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Content Tone</label>
          <select 
            className={`mt-1 w-full border rounded p-2 text-sm ${errors.content_tone ? 'border-red-500' : ''}`}
            value={currentPreferences.content_tone} 
            onChange={(e) => setCurrentPreferences({...currentPreferences, content_tone: e.target.value})}
          >
            <option value="Professional">Professional</option>
            <option value="Casual">Casual</option>
            <option value="Inspirational">Inspirational</option>
            <option value="Funny">Funny</option>
          </select>
          {errors.content_tone && <p className="text-red-500 text-xs mt-1">{errors.content_tone}</p>}
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
