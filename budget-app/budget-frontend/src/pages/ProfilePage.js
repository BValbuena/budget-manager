import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const updateProfile = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/auth/profile`,
                { name, email },
                { headers: { Authorization: localStorage.getItem('token') } }
            );
            setMessage('Profile updated successfully!');
        } catch {
            setMessage('Failed to update profile.');
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto bg-white rounded shadow dark:bg-gray-700 dark:text-white">
            <h1 className="text-2xl mb-4">Update Profile</h1>
            {message && <div className="mb-2">{message}</div>}
            <form onSubmit={updateProfile}>
                <input
                    type="text"
                    placeholder="New Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                />
                <input
                    type="email"
                    placeholder="New Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Update
                </button>
            </form>
        </div>
    );
}

export default ProfilePage;
