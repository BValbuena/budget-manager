import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import html2pdf from "html2pdf.js";

function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHours, setTotalHours] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    fetchPlans(currentPage);
  }, [currentPage]);

  const fetchPlans = (page) => {
    axios
      .get(`http://localhost:4000/api/plans?page=${page}&limit=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((res) => {
        setPlans(res.data.plans);
        setFilteredPlans(res.data.plans);
        setTotalPages(res.data.totalPages);
        setTotalHours(res.data.totalHours);
        setTotalCost(res.data.totalCost);
      })
      .catch((err) => console.error("Error fetching plans:", err));
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredPlans(
      plans.filter(
        (plan) =>
          plan.clientName.toLowerCase().includes(term) ||
          plan.clientEmail.toLowerCase().includes(term)
      )
    );
  };

  const handleDownload = (plan) => {
    const content = `
      <div style="padding:24px; font-family:Arial">
        <h2 style="text-align:center">Propuesta de servicios</h2>
        <p><strong>Cliente:</strong> ${plan.clientName}</p>
        <p><strong>Email:</strong> ${plan.clientEmail}</p>
        <p><strong>Teléfono:</strong> ${plan.clientPhone}</p>
        <p><strong>Fecha:</strong> ${new Date(
          plan.createdAt
        ).toLocaleDateString()}</p>
        <hr/>
        <ul>
          ${plan.planOptions
            .map((po) => {
              const o = po.option;
              const price = o.isFree
                ? 0
                : (o.hours * plan.pricePerHour).toFixed(2);
              return `<li>
                ${o.name}
                ${o.isFree ? ' <span style="color:green;">(Gratis)</span>' : ""}
                ${
                  !o.isFree && o.firstMonthOnly
                    ? ' <span style="color:orange;">(1er mes)</span>'
                    : ""
                }
                — ${o.hours}h · €${price}
              </li>`;
            })
            .join("")}
        </ul>
        <hr/>
        <p><strong>Total Horas:</strong> ${plan.totalHours}</p>
        <p><strong>Total Coste:</strong> €${plan.totalCost}</p>
        <p><strong>Presupuesto estimado:</strong> €${plan.budget}</p>
      </div>
    `;

    const temp = document.createElement("div");
    temp.innerHTML = content;
    document.body.appendChild(temp);

    html2pdf()
      .from(temp)
      .set({
        filename: `Presupuesto_${plan.clientName || "cliente"}.pdf`,
        margin: 0,
        jsPDF: { format: "a4", orientation: "portrait" },
        html2canvas: { scale: 2 },
      })
      .save()
      .then(() => document.body.removeChild(temp));
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar este presupuesto?")) {
      await axios.delete(`http://localhost:4000/api/plans/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      fetchPlans(currentPage);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Presupuestos guardados</h1>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-sm">Total de páginas</p>
            <p className="text-2xl font-bold">{totalPages}</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-sm">Horas acumuladas</p>
            <p className="text-2xl font-bold">{totalHours}h</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-sm">Coste total acumulado</p>
            <p className="text-2xl font-bold">€{totalCost}</p>
          </div>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Buscar por nombre o email"
          className="w-full md:w-1/2 mb-6 px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />

        {filteredPlans.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No se encontraron presupuestos.
          </p>
        ) : (
          <div className="space-y-6">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-blue-600">
                      {plan.clientName}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      📧 {plan.clientEmail} · 📞 {plan.clientPhone}
                    </p>
                    <p className="text-sm">
                      📅 {new Date(plan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(plan)}
                      className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800"
                    >
                      Descargar PDF
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm">Presupuesto</p>
                    <p className="font-bold text-lg">€{plan.budget}</p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm">Coste total</p>
                    <p className="font-bold text-lg text-blue-600">
                      €{plan.totalCost}
                    </p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm">Horas totales</p>
                    <p className="font-bold text-lg">{plan.totalHours}h</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm uppercase mb-2">
                    Opciones seleccionadas:
                  </h3>
                  <ul className="space-y-1 text-sm">
                    {plan.planOptions.map((po) => {
                      const opt = po.option;
                      return (
                        <li
                          key={opt.id}
                          className="flex justify-between items-center border-b pb-1"
                        >
                          <span>
                            {opt.name}
                            {opt.isFree && (
                              <span className="ml-2 text-green-500 text-xs font-semibold">
                                (Gratis)
                              </span>
                            )}
                            {!opt.isFree && opt.firstMonthOnly && (
                              <span className="ml-2 text-yellow-600 text-xs font-semibold">
                                (1er mes)
                              </span>
                            )}
                          </span>
                          <span>
                            {opt.hours}h · €
                            {opt.isFree
                              ? "0"
                              : (opt.hours * plan.pricePerHour).toFixed(2)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}

            <div className="flex justify-center mt-8 gap-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                ← Anterior
              </button>
              <span className="text-sm font-medium self-center">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminPlans;
