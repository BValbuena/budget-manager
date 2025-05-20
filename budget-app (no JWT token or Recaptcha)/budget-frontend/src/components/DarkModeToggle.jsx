import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  return (
    <motion.button
      onClick={toggleDarkMode}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="fixed bottom-6 right-6 z-50 bg-black dark:bg-white text-white dark:text-black p-3 rounded-full shadow-lg transition-colors"
      title="Cambiar tema"
    >
      {darkMode ? "☀️" : "🌙"}
    </motion.button>
  );
}

export default DarkModeToggle;
