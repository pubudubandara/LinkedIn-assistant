'use client';

import { useState } from 'react';
import axios from 'axios';

interface PostGeneratorProps {
  userId: string;
  onPostPublished?: () => void;
}

export default function PostGenerator({ userId, onPostPublished }: PostGeneratorProps) {
  const [generatedPost, setGeneratedPost] = useState('');
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handleGeneratePost = async () => {
    setGenerating(true);
    setGeneratedPost('');
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/generate/${userId}`);
      setGeneratedPost(response.data.content);
    } catch (error) {
      console.error(error);
      alert('Failed to generate post. Check backend console.');
    }
    setGenerating(false);
  };

  const handlePublish = async () => {
    if (!generatedPost) return;
    setPublishing(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/publish/${userId}`, {
        content: generatedPost
      });
      alert('Post Published Successfully! 🚀');
      if (onPostPublished) onPostPublished();
      setGeneratedPost('');
    } catch (error) {
      console.error(error);
      alert('Failed to publish. Check if "Share on LinkedIn" is enabled in Developer Portal.');
    }
    setPublishing(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Content Generator (AI)</h2>
      
      <p className="text-sm text-gray-600 mb-4">
        Based on your preferences, AI will generate a LinkedIn post for you.
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
