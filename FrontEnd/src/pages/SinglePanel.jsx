import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPanelById, getUserById, likePanel, commentPanel, updatePanel, deletePanel } from "../services/api";
import { FaHeart, FaRegComment, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth0 } from "@auth0/auth0-react";

export default function SinglePanel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [panel, setPanel] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const { user: currentUser } = useAuth0();

  useEffect(() => {
    const fetchPanelAndUser = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData && userData.id) {
          const panelData = await getPanelById(userData.id, id);
          setPanel(panelData.data);
          setEditedDescription(panelData.data.description);
          
          if (panelData.data.user && panelData.data.user._id) {
            const userDetails = await getUserById(panelData.data.user._id);
            setUser(userDetails.data);
          }
        }
      } catch (error) {
        console.error("Error fetching panel or user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPanelAndUser();
  }, [id]);

  const handleLike = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData && userData.id) {
        const response = await likePanel(userData.id, panel._id);
        if (response && response.panel) {
          setPanel(response.panel);
          console.log(response.message);
        } else {
          console.error("Unexpected response format:", response);
        }
      } else {
        console.error("User data not found in localStorage");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Qui potresti aggiungere un feedback visuale per l'utente
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData && userData.id) {
        await commentPanel(userData.id, panel._id, { text: comment });
        const updatedPanel = await getPanelById(userData.id, id);
        setPanel(updatedPanel.data);
        setComment('');
      } else {
        console.error("User data not found in localStorage");
      }
    } catch (error) {
      console.error("Error commenting on panel:", error);
      // Qui potresti aggiungere un feedback visuale per l'utente
    }
  };

  const handleEdit = async () => {
    try {
      await updatePanel(user._id, panel._id, { description: editedDescription });
      const updatedPanel = await getPanelById(user._id, id);
      setPanel(updatedPanel.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating panel:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePanel(user._id, panel._id);
      navigate('/profile'); // Redirect to profile after deletion
    } catch (error) {
      console.error("Error deleting panel:", error);
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!panel || !user) {
    return <div className="text-white">Panel or user not found</div>;
  }

  const isOwner = currentUser && panel.user._id === currentUser.sub;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto bg-gray-900 text-white p-4 border-b border-gray-800"
    >
      <div className="flex items-start mb-4">
        <img
          src={user.profileImage || "/placeholder-avatar.jpg"}
          alt={`${user.name}'s Avatar`}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h2 className="font-bold">{user.name}</h2>
          <p className="text-gray-400">@{user.nickname}</p>
        </div>
      </div>
      
      {isEditing ? (
        <div>
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded mb-2"
          />
          <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            Save
          </button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      ) : (
        <p className="mb-4">{panel.description}</p>
      )}
      
      <img
        src={panel.panelImage}
        alt={`Panel from ${panel.manga?.title}`}
        className="w-full rounded-lg mb-4"
      />
      
      <p className="text-gray-400 mb-4">
        From {panel.manga?.title}, Chapter {panel.chapterNumber}
      </p>

      <div className="flex justify-between text-gray-400">
      <motion.button 
      whileHover={{ scale: 1.1 }} 
      onClick={handleLike} 
      className="flex items-center"
    >
      <FaHeart className={`mr-2 ${panel.likes.includes(currentUser?.sub) ? 'text-red-500' : 'text-gray-400'}`} />
      <span>{panel.likes.length} Likes</span>
    </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} className="flex items-center">
          <FaRegComment className="mr-2" />
          <span>{panel.comments.length} Comments</span>
        </motion.button>
        {isOwner && (
          <>
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => setIsEditing(true)} className="flex items-center">
              <FaEdit className="mr-2" />
              <span>Edit</span>
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} onClick={handleDelete} className="flex items-center">
              <FaTrash className="mr-2" />
              <span>Delete</span>
            </motion.button>
          </>
        )}
      </div>

      <form onSubmit={handleComment} className="mt-4">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 bg-gray-800 rounded"
        />
        <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          Comment
        </button>
      </form>

      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2">Comments</h3>
        {panel.comments.map((comment, index) => (
          <div key={index} className="mb-2">
            <p className="font-bold">{comment.user.name}</p>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}