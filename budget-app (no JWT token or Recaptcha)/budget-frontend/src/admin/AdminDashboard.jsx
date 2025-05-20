import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import AdminLayout from "./AdminLayout";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [popularOptions, setPopularOptions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }

    axios
      .get("http://localhost:4000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategories(res.data))
      .catch((err) => {
        console.error(
          "Error al cargar categorías:",
          err.response?.data || err.message
        );
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
      });

    axios
      .get("http://localhost:4000/api/stats/monthly", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMonthlyStats(res.data))
      .catch((err) => console.error("Error al cargar stats mensuales:", err));

    axios
      .get("http://localhost:4000/api/stats/popular-options", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPopularOptions(res.data))
      .catch((err) =>
        console.error("Error al cargar opciones populares:", err)
      );
  }, []);

  const categoryLabels = categories.map((cat) => cat.name);
  const optionsPerCategory = categories.map((cat) => cat.options?.length || 0);
  const hoursPerCategory = categories.map(
    (cat) => cat.options?.reduce((acc, opt) => acc + opt.hours, 0) || 0
  );

  const activeCount = categories
    .flatMap((cat) => cat.options || [])
    .filter((opt) => opt.active).length;

  const inactiveCount = categories
    .flatMap((cat) => cat.options || [])
    .filter((opt) => !opt.active).length;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Estadísticas Generales</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">
              Opciones por categoría
            </h2>
            <Bar
              data={{
                labels: categoryLabels,
                datasets: [
                  {
                    label: "Número de opciones",
                    data: optionsPerCategory,
                    backgroundColor: "rgba(59,130,246,0.6)",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">
              Horas totales por categoría
            </h2>
            <Bar
              data={{
                labels: categoryLabels,
                datasets: [
                  {
                    label: "Horas totales",
                    data: hoursPerCategory,
                    backgroundColor: "rgba(34,197,94,0.6)",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">
              Estado de las opciones
            </h2>
            <Pie
              data={{
                labels: ["Activas", "Inactivas"],
                datasets: [
                  {
                    data: [activeCount, inactiveCount],
                    backgroundColor: ["#22c55e", "#9ca3af"],
                  },
                ],
              }}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">📈 Evolución mensual</h2>
            <Line
              data={{
                labels: monthlyStats.map((m) => m.month),
                datasets: [
                  {
                    label: "Planes creados",
                    data: monthlyStats.map((m) => m.total),
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59,130,246,0.2)",
                    tension: 0.4,
                    fill: true,
                  },
                ],
              }}
              options={{ responsive: true }}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow col-span-1 md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">
              🔥 Opciones más populares
            </h2>
            <Bar
              data={{
                labels: popularOptions.map((opt) => opt.name),
                datasets: [
                  {
                    label: "Veces seleccionada",
                    data: popularOptions.map((opt) => opt.count),
                    backgroundColor: "rgba(244,63,94,0.6)",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
