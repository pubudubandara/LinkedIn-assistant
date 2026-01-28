'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface UserProfile {
  id: number;
  email: string;
  linkedinAccount: {
    first_name: string;
    last_name: string;
    headline: string;
    profile_image: string;
  };
}

interface ProfileCardProps {
  userId: string;
}

export default function ProfileCard({ userId }: ProfileCardProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`)
        .then((response) => {
          setUser(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center p-6">
        <div className="w-28 h-28 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>
    );
  }

  if (!user) return <div className="text-center text-red-500">Failed to load profile</div>;

  return (
    <div className="flex flex-col items-center">
      {user.linkedinAccount.profile_image ? (
        <img 
          src={user.linkedinAccount.profile_image} 
          alt="Profile" 
          className="w-28 h-28 rounded-full mb-4 border-4 border-blue-100" 
        />
      ) : (
        <div className="w-28 h-28 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-gray-500">
          No Img
        </div>
      )}
      <h2 className="text-xl font-bold text-center text-gray-800">
        {user.linkedinAccount.first_name} {user.linkedinAccount.last_name}
      </h2>
      <p className="text-gray-500 text-sm text-center mb-4">{user.email}</p>
      <div className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
        LinkedIn Connected
      </div>
    </div>
  );
}
