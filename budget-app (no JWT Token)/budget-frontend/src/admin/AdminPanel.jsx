import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './AdminLayout';

function AdminPanel() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingOption, setEditingOption] = useState(null);

  const [optionForm, setOptionForm] = useState({
    name: '', priceEuro: '', hours: '', categoryId: '', active: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin/login');
    else fetchCategories(token);
  }, []);

  const fetchCategories = (token = localStorage.getItem('adminToken')) => {
    axios.get('http://localhost:4000/api/categories', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setCategories(res.data))
      .catch(err => {
        console.error('Error al obtener categorías:', err.response?.data || err.message);
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      });
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) {
      alert('Nombre de categoría requerido');
      return;
    }
    axios.post('http://localhost:4000/api/categories', { name: newCategoryName }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    }).then(() => {
      setNewCategoryName('');
      fetchCategories();
    }).catch(err => {
      console.error('Error al añadir categoría:', err.response?.data || err.message);
      alert('Error al añadir categoría');
    });
  };

  const deleteCategory = (id) => {
    axios.delete(`http://localhost:4000/api/categories/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    }).then(() => fetchCategories())
      .catch(err => console.error('Error al eliminar categoría:', err.response?.data || err.message));
  };

  const handleOptionSubmit = () => {
    if (!optionForm.name || isNaN(optionForm.priceEuro) || isNaN(optionForm.hours) || !optionForm.categoryId) {
      alert('Por favor completa todos los campos numéricos y selecciona una categoría');
      return;
    }

    const method = editingOption ? 'put' : 'post';
    const url = editingOption
      ? `http://localhost:4000/api/options/${editingOption.id}`
      : `http://localhost:4000/api/options`;

    axios[method](url, optionForm, {
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    }).then(() => {
      setOptionForm({ name: '', priceEuro: '', hours: '', categoryId: '', active: true });
      setEditingOption(null);
      fetchCategories();
    }).catch(err => {
      console.error('Error al guardar opción:', err.response?.data || err.message);
      alert('Error al guardar opción');
    });
  };

  const deleteOption = (id) => {
    axios.delete(`http://localhost:4000/api/options/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    }).then(() => fetchCategories())
      .catch(err => console.error('Error al eliminar opción:', err.response?.data || err.message));
  };

  const startEditOption = (option) => {
    setEditingOption(option);
    setOptionForm({
      name: option.name,
      priceEuro: option.priceEuro,
      hours: option.hours,
      categoryId: option.categoryId,
      active: option.active,
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Gestión de Categorías</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-10">
          <h2 className="text-xl font-semibold mb-4">Añadir nueva categoría</h2>
          <div className="flex flex-wrap gap-4">
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1 min-w-[200px] p-2 border rounded-lg dark:bg-gray-700"
              placeholder="Nombre de la categoría"
            />
            <button
              onClick={addCategory}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Añadir
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-10">
          <h2 className="text-xl font-semibold mb-4">{editingOption ? 'Editar opción' : 'Añadir opción'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              placeholder="Nombre"
              value={optionForm.name}
              onChange={(e) => setOptionForm({ ...optionForm, name: e.target.value })}
              className="p-2 border rounded-lg dark:bg-gray-700"
            />
            <input
              placeholder="Precio €"
              type="number"
              value={optionForm.priceEuro}
              onChange={(e) => setOptionForm({ ...optionForm, priceEuro: parseFloat(e.target.value) })}
              className="p-2 border rounded-lg dark:bg-gray-700"
            />
            <input
              placeholder="Horas"
              type="number"
              value={optionForm.hours}
              onChange={(e) => setOptionForm({ ...optionForm, hours: parseFloat(e.target.value) })}
              className="p-2 border rounded-lg dark:bg-gray-700"
            />
            <select
              value={optionForm.categoryId}
              onChange={(e) => setOptionForm({ ...optionForm, categoryId: parseInt(e.target.value) })}
              className="p-2 border rounded-lg dark:bg-gray-700"
            >
              <option value="">-- Categoría --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center mt-4 gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={optionForm.active}
                onChange={() => setOptionForm({ ...optionForm, active: !optionForm.active })}
              />
              Activo
            </label>
            <button
              onClick={handleOptionSubmit}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              {editingOption ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Categorías</h2>
        <div className="space-y-6">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{cat.name}</h3>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Eliminar categoría
                </button>
              </div>
              {cat.options && cat.options.length > 0 ? (
                <ul className="space-y-2">
                  {cat.options.map(opt => (
                    <li key={opt.id} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{opt.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          €{opt.priceEuro} / {opt.hours}h
                        </span>
                        <span className={`ml-2 text-xs px-2 py-1 rounded-full font-semibold ${
                          opt.active ? 'bg-green-100 text-green-700' : 'bg-gray-300 text-gray-700'
                        }`}>
                          {opt.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <div className="flex gap-2 text-sm">
                        <button
                          onClick={() => startEditOption(opt)}
                          className="text-blue-600 hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteOption(opt.id)}
                          className="text-red-600 hover:underline"
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Sin opciones aún.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminPanel;
