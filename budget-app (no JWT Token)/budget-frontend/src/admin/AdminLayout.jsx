import { FaChartBar, FaBoxes, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Sidebar */}
      <div
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 p-6 shadow-md transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <h2 className="text-xl font-bold mb-4">Admin Apolo</h2>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-3 mb-4 hover:text-blue-600"
        >
          <FaChartBar /> Dashboard
        </button>
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-3 mb-4 hover:text-blue-600"
        >
          <FaBoxes /> Categorías
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-3 mt-8 text-red-600 hover:underline"
        >
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-4 md:ml-64 w-full">
        {/* Botón hamburguesa móvil */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-800 dark:text-white text-2xl"
          >
            <FaBars />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
