import { useState } from 'react';
import axios from 'axios';

function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const resetPassword = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset`, { email, newPassword });
            setMessage('Password reset successfully!');
        } catch {
            setMessage('Failed to reset password.');
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto bg-white rounded shadow dark:bg-gray-700 dark:text-white">
            <h1 className="text-2xl mb-4">Reset Password</h1>
            {message && <div className="mb-2">{message}</div>}
            <form onSubmit={resetPassword}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                />
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
}

export default ResetPasswordPage;
