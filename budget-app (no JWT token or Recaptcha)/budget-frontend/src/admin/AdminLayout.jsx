import {
  FaChartBar,
  FaBoxes,
  FaClipboardList,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Sidebar */}
      <div
        className={`hidden md:flex flex-col h-screen fixed z-40 top-0 left-0 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out
        ${sidebarOpen ? "w-64" : "w-20"}`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          {sidebarOpen && <h2 className="text-lg font-bold">Admin</h2>}
          <button
            className="text-xl ml-auto"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-2 px-2 mt-2 text-sm">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900"
          >
            <FaChartBar className="text-lg mx-auto md:mx-0" />
            {sidebarOpen && <span>Dashboard</span>}
          </button>

          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900"
          >
            <FaBoxes className="text-lg mx-auto md:mx-0" />
            {sidebarOpen && <span>Categorías</span>}
          </button>

          {/* NUEVA SECCIÓN: Planes */}
          <button
            onClick={() => navigate("/admin/plans")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900"
          >
            <FaClipboardList className="text-lg mx-auto md:mx-0" />
            {sidebarOpen && <span>Planes</span>}
          </button>

          <div className="flex-grow"></div>
          <button
            onClick={logout}
            className="flex items-center gap-3 p-3 text-red-600 hover:underline"
          >
            <FaSignOutAlt className="text-lg mx-auto md:mx-0" />
            {sidebarOpen && <span>Cerrar sesión</span>}
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 ml-0 md:ml-${
          sidebarOpen ? "[16rem]" : "[5rem]"
        } transition-all duration-300`}
        style={{ marginLeft: sidebarOpen ? "16rem" : "5rem" }}
      >
        {/* Mobile topbar */}
        <div className="md:hidden p-4">
          <button onClick={() => setMobileOpen(true)} className="text-2xl">
            <FaBars />
          </button>
        </div>
        <main className="p-4 max-w-7xl mx-auto">{children}</main>
      </div>

      {/* Sidebar móvil */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-50 md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.3 }}
            className="w-64 h-full bg-white dark:bg-gray-800 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-6">Admin</h2>
            <nav className="flex flex-col gap-4">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="flex items-center gap-3"
              >
                <FaChartBar /> Dashboard
              </button>
              <button
                onClick={() => navigate("/admin")}
                className="flex items-center gap-3"
              >
                <FaBoxes /> Categorías
              </button>
              <button
                onClick={() => navigate("/admin/plans")}
                className="flex items-center gap-3"
              >
                <FaClipboardList /> Planes
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-3 text-red-600 mt-8"
              >
                <FaSignOutAlt /> Cerrar sesión
              </button>
            </nav>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
