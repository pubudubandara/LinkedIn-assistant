'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Post {
  id: number;
  content: string;
  status: string;
  created_at: string;
  linkedin_post_id?: string;
}

interface PostHistoryProps {
  userId: string;
  refreshTrigger?: number;
}

export default function PostHistory({ userId, refreshTrigger }: PostHistoryProps) {
  const [postHistory, setPostHistory] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = () => {
    if (userId) {
      setLoading(true);
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/history/${userId}`, {
        withCredentials: true
      })
        .then((res) => {
          setPostHistory(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [userId, refreshTrigger]);

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (postHistory.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        No posts yet. Generate and publish one!
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Content Preview</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">LinkedIn ID</th>
          </tr>
        </thead>
        <tbody>
          {postHistory.map((post) => (
            <tr key={post.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4">
                {new Date(post.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-xs">
                {post.content.substring(0, 50)}...
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                  ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {post.status.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4">
                {post.linkedin_post_id || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
