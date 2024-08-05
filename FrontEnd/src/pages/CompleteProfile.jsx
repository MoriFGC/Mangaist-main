// CompleteProfile.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../services/api';

const CompleteProfile = () => {
   
    const [formData, setFormData] = useState({
        nickname: '',
        profilePublic: false,
        name: '',
        cognome: ''
    });
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData && userData.id) {
            setUserId(userData.id);
        } else {
            navigate('/'); // Redirect to home if user data is not available
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!userId) {
                throw new Error("User ID not available");
            }
            await updateUserProfile(userId, { ...formData, profileCompleted: true });
            navigate('/home');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
        >
            <motion.form 
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                initial={{ y: -50 }}
                animate={{ y: 0 }}
            >
                <h2 className="text-2xl mb-4 font-bold text-center">Complete Your Profile</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nickname">
                        Nickname
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="nickname"
                        type="text"
                        placeholder="Nickname"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cognome">
                        Surname
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="cognome"
                        type="text"
                        placeholder="Surname"
                        name="cognome"
                        value={formData.cognome}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="profilePublic"
                            checked={formData.profilePublic}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <span className="text-sm">Make profile public</span>
                    </label>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Complete Profile
                    </button>
                </div>
            </motion.form>
        </motion.div>
    );
};

export default CompleteProfile;