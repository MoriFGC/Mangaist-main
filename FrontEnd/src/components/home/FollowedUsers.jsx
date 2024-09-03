import React from 'react';
import { Link } from 'react-router-dom';

const FollowedUsers = ({ users }) => {
  if (!users || users.length === 0) return null;

  return (
    <div className="bg-black rounded-lg p-4 mb-4">
      <h2 className="text-white text-lg font-bold mb-3">Utenti seguiti</h2>
      <div className="space-y-3">
        {users.map(user => (
          <Link key={user._id} to={`/profile/${user._id}`} className="flex items-center hover:bg-gray-800 p-2 rounded-lg transition duration-300">
            <img 
              src={user.profileImage || "/placeholder-avatar.jpg"} 
              alt={`${user.nickname}'s avatar`} 
              className="w-10 h-10 rounded-full mr-3"
            />
            <span className="text-white">{user.nickname}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FollowedUsers;