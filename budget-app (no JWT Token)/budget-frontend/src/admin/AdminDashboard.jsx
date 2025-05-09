import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import AdminLayout from './AdminLayout';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/categories', {
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    }).then(res => {
      setCategories(res.data);
    });
  }, []);

  const categoryLabels = categories.map(cat => cat.name);
  const optionsPerCategory = categories.map(cat => cat.options?.length || 0);
  const hoursPerCategory = categories.map(cat =>
    cat.options?.reduce((acc, opt) => acc + opt.hours, 0) || 0
  );

  const activeCount = categories.flatMap(cat => cat.options || []).filter(opt => opt.active).length;
  const inactiveCount = categories.flatMap(cat => cat.options || []).filter(opt => !opt.active).length;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Estadísticas Generales</h1>

        <div className="bg-white dark:bg-gray-800 p-6 mb-10 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Opciones por categoría</h2>
          <Bar
            data={{
              labels: categoryLabels,
              datasets: [{
                label: 'Número de opciones',
                data: optionsPerCategory,
                backgroundColor: 'rgba(59,130,246,0.6)',
              }],
            }}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 mb-10 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Horas totales por categoría</h2>
          <Bar
            data={{
              labels: categoryLabels,
              datasets: [{
                label: 'Horas totales',
                data: hoursPerCategory,
                backgroundColor: 'rgba(34,197,94,0.6)',
              }],
            }}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Estado de las opciones</h2>
          <Pie
            data={{
              labels: ['Activas', 'Inactivas'],
              datasets: [{
                data: [activeCount, inactiveCount],
                backgroundColor: ['#22c55e', '#9ca3af'],
              }],
            }}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
