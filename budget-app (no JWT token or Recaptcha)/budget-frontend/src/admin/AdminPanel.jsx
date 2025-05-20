import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaChevronDown, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa";
import AdminLayout from "./AdminLayout";

function AdminPanel() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingOption, setEditingOption] = useState(null);
  const [pricePerHour, setPricePerHour] = useState(60);

  const [optionForm, setOptionForm] = useState({
    name: "",
    priceEuro: 0,
    hours: "",
    categoryId: "",
    active: true,
    isFree: false,
    firstMonthOnly: false,
    onDemand: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");
    else {
      fetchCategories(token);
      axios
        .get("http://localhost:4000/api/settings/hourly-rate", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setPricePerHour(res.data.hourlyRate));
    }
  }, []);

  const fetchCategories = (token = localStorage.getItem("adminToken")) => {
    axios
      .get("http://localhost:4000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategories(res.data))
      .catch((err) => {
        console.error(
          "Error al obtener categorías:",
          err.response?.data || err.message
        );
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      });
  };

  const updateHourlyRate = () => {
    axios
      .put(
        "http://localhost:4000/api/settings/hourly-rate",
        { hourlyRate: pricePerHour },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      .then(() => alert("Precio por hora actualizado."));
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return alert("Nombre de categoría requerido");

    axios
      .post(
        "http://localhost:4000/api/categories",
        { name: newCategoryName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      .then(() => {
        setNewCategoryName("");
        fetchCategories();
      })
      .catch((err) => {
        console.error(
          "Error al añadir categoría:",
          err.response?.data || err.message
        );
        alert("Error al añadir categoría");
      });
  };

  const deleteCategory = (id) => {
    axios
      .delete(`http://localhost:4000/api/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then(() => fetchCategories());
  };

  const handleOptionSubmit = () => {
    const { name, priceEuro, hours, categoryId } = optionForm;
    if (!name || isNaN(priceEuro) || isNaN(hours) || !categoryId) {
      return alert("Por favor completa todos los campos correctamente");
    }

    const method = editingOption ? "put" : "post";
    const url = editingOption
      ? `http://localhost:4000/api/options/${editingOption.id}`
      : "http://localhost:4000/api/options";

    axios[method](url, optionForm, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    })
      .then(() => {
        setOptionForm({
          name: "",
          priceEuro: 0,
          hours: "",
          categoryId: "",
          active: true,
          isFree: false,
          firstMonthOnly: false,
        });
        setEditingOption(null);
        fetchCategories();
      })
      .catch((err) => {
        console.error(
          "Error al guardar opción:",
          err.response?.data || err.message
        );
        alert("Error al guardar opción");
      });
  };

  const deleteOption = (id) => {
    axios
      .delete(`http://localhost:4000/api/options/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then(() => fetchCategories());
  };

  const startEditOption = (opt) => {
    setEditingOption(opt);
    setOptionForm({
      name: opt.name,
      priceEuro: pricePerHour,
      hours: opt.hours,
      categoryId: opt.categoryId,
      active: opt.active,
      isFree: opt.isFree || false,
      firstMonthOnly: opt.firstMonthOnly || false,
      onDemand: opt.onDemand || false,
    });
  };

  const handleHoursChange = (e) => {
    const hours = parseFloat(e.target.value);
    if (!isNaN(hours)) {
      setOptionForm({
        ...optionForm,
        hours,
        priceEuro: optionForm.isFree ? 0 : Math.round(hours * pricePerHour),
      });
    } else {
      setOptionForm({ ...optionForm, hours: "", priceEuro: 0 });
    }
  };

  const handleIsFreeChange = () => {
    const newIsFree = !optionForm.isFree;
    setOptionForm({
      ...optionForm,
      isFree: newIsFree,
      priceEuro: newIsFree ? 0 : Math.round(optionForm.hours * pricePerHour),
    });
  };

  const toggleCategory = (id) => {
    setExpandedCategory((prev) => (prev === id ? null : id));
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-10">
        <h1 className="text-3xl font-bold">Gestión de Categorías</h1>

        {/* Añadir Categoría */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Añadir nueva categoría</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addCategory();
            }}
            className="flex flex-col md:flex-row items-start md:items-center gap-4"
          >
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full p-3 border rounded-lg dark:bg-gray-700"
              placeholder="Nombre de la categoría"
            />
            <button
              type="submit"
              className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Añadir
            </button>
          </form>
        </div>

        {/* Precio por hora */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Precio por hora base</h2>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              value={pricePerHour}
              onChange={(e) => setPricePerHour(parseFloat(e.target.value))}
              className="p-3 border rounded-lg dark:bg-gray-700 w-32"
            />
            <button
              onClick={updateHourlyRate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </div>

        {/* Añadir opción */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingOption ? "Editar opción" : "Añadir opción"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleOptionSubmit();
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setEditingOption(null);
                setOptionForm({
                  name: "",
                  priceEuro: 0,
                  hours: "",
                  categoryId: "",
                  active: true,
                  isFree: false,
                  firstMonthOnly: false,
                  onDemand: false,
                });
              }
            }}
            className="space-y-4"
          >
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Nombre</label>
                <input
                  placeholder="Nombre"
                  value={optionForm.name}
                  onChange={(e) =>
                    setOptionForm({ ...optionForm, name: e.target.value })
                  }
                  className="p-3 border rounded-lg dark:bg-gray-700 w-full"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Precio (€)</label>
                <input
                  placeholder="Precio €"
                  type="number"
                  value={optionForm.priceEuro}
                  readOnly
                  className="p-3 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed w-full"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Horas</label>
                <input
                  placeholder="Horas"
                  type="number"
                  value={optionForm.hours}
                  onChange={handleHoursChange}
                  className="p-3 border rounded-lg dark:bg-gray-700 w-full"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Categoría</label>
                <select
                  value={optionForm.categoryId}
                  onChange={(e) =>
                    setOptionForm({
                      ...optionForm,
                      categoryId: parseInt(e.target.value),
                    })
                  }
                  className="p-3 border rounded-lg dark:bg-gray-700 w-full"
                >
                  <option value="">-- Categoría --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={optionForm.active}
                  onChange={() =>
                    setOptionForm({ ...optionForm, active: !optionForm.active })
                  }
                />
                Activo
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={optionForm.onDemand}
                  onChange={() =>
                    setOptionForm({
                      ...optionForm,
                      onDemand: !optionForm.onDemand,
                    })
                  }
                />
                A demanda
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={optionForm.isFree}
                  onChange={handleIsFreeChange}
                />
                Gratis
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={optionForm.firstMonthOnly}
                  onChange={() =>
                    setOptionForm({
                      ...optionForm,
                      firstMonthOnly: !optionForm.firstMonthOnly,
                    })
                  }
                />
                Solo primer mes
              </label>
            </div>

            <div className="flex flex-wrap gap-4 mt-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                {editingOption ? "Actualizar" : "Crear"}
              </button>
              {editingOption && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingOption(null);
                    setOptionForm({
                      name: "",
                      priceEuro: 0,
                      hours: "",
                      categoryId: "",
                      active: true,
                      isFree: false,
                      firstMonthOnly: false,
                    });
                  }}
                  className="text-sm text-gray-500 underline hover:text-gray-800"
                >
                  Cancelar edición (Esc)
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Listado de categorías visuales */}
        <h2 className="text-2xl font-bold mb-4">Categorías</h2>
        <div className="space-y-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="border rounded-lg bg-white dark:bg-gray-800 shadow-md"
            >
              <div
                className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => toggleCategory(cat.id)}
              >
                <div className="flex items-center gap-2">
                  {expandedCategory === cat.id ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronRight />
                  )}
                  <h3 className="text-lg font-semibold">{cat.name}</h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCategory(cat.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
              {expandedCategory === cat.id && (
                <div className="px-6 py-4 border-t animate-fade-in">
                  {cat.options && cat.options.length > 0 ? (
                    <ul className="space-y-2">
                      {cat.options.map((opt) => (
                        <li
                          key={opt.id}
                          className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{opt.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              €
                              {opt.isFree
                                ? "0"
                                : Math.round(opt.hours * pricePerHour)}{" "}
                              / {opt.hours}h
                              {opt.isFree && (
                                <span className="ml-2 text-green-600 font-semibold">
                                  (Gratis)
                                </span>
                              )}
                              {opt.firstMonthOnly && (
                                <span className="ml-2 text-yellow-600 font-semibold">
                                  (1er mes)
                                </span>
                              )}
                              {opt.onDemand && (
                                <span className="ml-2 text-indigo-600 font-semibold">
                                  (A demanda)
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => startEditOption(opt)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => deleteOption(opt.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">Sin opciones aún.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminPanel;
