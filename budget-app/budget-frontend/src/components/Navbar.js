import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleDarkMode = () => {
        document.documentElement.classList.toggle('dark');
    };

    return (
        <nav className="bg-blue-600 text-white p-4 flex justify-between dark:bg-gray-800">
            <div>
                <Link to="/" className="font-bold text-xl">Budget App</Link>
            </div>
            <div className="flex space-x-2 items-center">
                {token ? (
                    <>
                        <Link to="/profile" className="px-2">Profile</Link>
                        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="px-2">Login</Link>
                        <Link to="/register" className="px-2">Register</Link>
                    </>
                )}
                <button
                    onClick={toggleDarkMode}
                    className="border px-2 py-1 rounded"
                >
                    Dark Mode
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
