'use client';

import { useState } from 'react';
import axios from 'axios';

interface FormData {
  role: string;
  goals: string;
  challenges: string;
  target_country: string;
  content_tone: string;
}

interface PostGeneratorProps {
  userId: string;
  onPostPublished?: () => void;
  currentPreferences: FormData;
}

export default function PostGenerator({ userId, onPostPublished, currentPreferences }: PostGeneratorProps) {
  const [generatedPost, setGeneratedPost] = useState('');
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Validation function to check if preferences are valid
  const isPreferencesValid = (): boolean => {
    return (
      currentPreferences.role.trim().length >= 2 &&
      currentPreferences.role.trim().length <= 100 &&
      currentPreferences.goals.trim().length >= 10 &&
      currentPreferences.goals.trim().length <= 500 &&
      currentPreferences.challenges.trim().length >= 10 &&
      currentPreferences.challenges.trim().length <= 500 &&
      currentPreferences.target_country.trim().length >= 2 &&
      currentPreferences.target_country.trim().length <= 100 &&
      ['Professional', 'Casual', 'Inspirational', 'Funny'].includes(currentPreferences.content_tone)
    );
  };

  const getValidationMessage = (): string => {
    if (currentPreferences.role.trim().length < 2) return 'Role must be at least 2 characters';
    if (currentPreferences.goals.trim().length < 10) return 'Career goals must be at least 10 characters';
    if (currentPreferences.challenges.trim().length < 10) return 'Challenges must be at least 10 characters';
    if (currentPreferences.target_country.trim().length < 2) return 'Target country must be at least 2 characters';
    return '';
  };

  const isButtonDisabled = generating || !isPreferencesValid();

  const handleGeneratePost = async () => {
    setGenerating(true);
    setGeneratedPost('');
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/generate/${userId}`,
        { preferences: currentPreferences },
        { withCredentials: true }
      );
      setGeneratedPost(response.data.content);
    } catch (error: any) {
      console.error('Generate post error:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        window.location.href = '/';
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to generate post. Check backend console.';
        alert(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
      }
    }
    setGenerating(false);
  };

  const handlePublish = async () => {
    if (!generatedPost) return;
    setPublishing(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/publish/${userId}`, {
        content: generatedPost
      }, {
        withCredentials: true
      });
      alert('Post Published Successfully! 🚀');
      if (onPostPublished) onPostPublished();
      setGeneratedPost('');
    } catch (error: any) {
      console.error('Publish error:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        window.location.href = '/';
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to publish. Check if "Share on LinkedIn" is enabled in Developer Portal.';
        alert(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
      }
    }
    setPublishing(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Content Generator (AI)</h2>
      
      <p className="text-sm text-gray-600 mb-4">
        Based on your preferences, AI will generate a LinkedIn post for you.
      </p>

      {!isPreferencesValid() && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm font-medium">⚠️ {getValidationMessage()}</p>
          <p className="text-yellow-700 text-xs mt-1">Please fill in all required fields correctly before generating.</p>
        </div>
      )}

      <button 
        onClick={handleGeneratePost}
        disabled={isButtonDisabled}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition"
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
            <button 
              onClick={handlePublish}
              disabled={publishing}
              className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 shadow disabled:bg-gray-400"
            >
              {publishing ? 'Publishing...' : 'Publish to LinkedIn 🚀'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
