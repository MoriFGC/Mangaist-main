import React from 'react';
import { Link } from 'react-router-dom';

const CommentList = ({ panel }) => {
    console.log("Panel in CommentList:", panel);

    if (!panel) {
      return <p className="text-gray-500">Caricamento commenti...</p>;
    }
  
    const comments = Array.isArray(panel.comments) ? panel.comments : [];
  
    if (comments.length === 0) {
      return <p className="text-gray-500">Nessun commento disponibile.</p>;
    }

  return (
    <div className="space-y-4 mt-5">
      {comments.map((comment, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 ">
          <img
            src={comment.user?.profileImage || "/placeholder-avatar.jpg"}
            alt={`${comment.user?.name || 'User'}'s avatar`}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <Link
              to={`/profile/${comment.user?._id}`}
              className="font-semibold text-white hover:underline "
            >
              {comment.user?.nickname || 'Utente anonimo'}
            </Link>
            <p className="text-white/60">{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;