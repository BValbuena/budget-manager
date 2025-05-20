import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import html2pdf from "html2pdf.js";

function BudgetInput({
  budget,
  setBudget,
  totalCost,
  totalHours,
  clientName,
  setClientName,
}) {
  const [focused, setFocused] = useState(false);
  const percentage = budget > 0 ? Math.min((totalCost / budget) * 100, 100) : 0;

  const handleChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setBudget(0);
    } else {
      setBudget(value);
    }
  };

  const generatePDF = () => {
    const element = document.getElementById("pdf-preview");
    const opt = {
      margin: 0.5,
      filename: `Presupuesto_${clientName || "cliente"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="mb-12 px-4 md:px-0">
      <label className="block mb-2 text-lg font-semibold text-gray-700 dark:text-white">
        Nombre del cliente
      </label>
      <input
        type="text"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        className="w-full mb-6 text-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Introduce tu nombre"
      />

      <label className="block mb-2 text-lg font-semibold text-gray-700 dark:text-white">
        Presupuesto mensual (€)
      </label>

      <div className="relative w-full">
        <input
          type="number"
          inputMode="numeric"
          value={focused && budget === 0 ? "" : budget}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={handleChange}
          className="w-full text-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500
            appearance-none [appearance:textfield]
            [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          placeholder="Introduce tu presupuesto"
          min="1"
        />

        <div className="mt-3 w-full bg-gray-300 dark:bg-gray-700 h-4 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${
              percentage < 90
                ? "bg-blue-600"
                : percentage < 100
                ? "bg-yellow-500"
                : "bg-red-600"
            }`}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="text-sm mt-2 text-center text-gray-600 dark:text-gray-300">
          <AnimatePresence mode="wait">
            <motion.div
              key={totalCost}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              €{totalCost} / €{budget || 0} mensuales
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-8 text-right">
        <button
          onClick={generatePDF}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
        >
          Descargar resumen PDF
        </button>
      </div>

      {/* Preview visual del presupuesto */}
      <div
        id="pdf-preview"
        className="mt-10 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg max-w-3xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Resumen del presupuesto
        </h2>
        <p className="text-lg mb-2">
          <strong>Cliente:</strong> {clientName || "Sin nombre"}
        </p>
        <p className="text-lg mb-2">
          <strong>Presupuesto mensual:</strong> €{budget || 0}
        </p>
        <p className="text-lg mb-2">
          <strong>Coste estimado:</strong> €{totalCost}
        </p>
        <p className="text-lg mb-2">
          <strong>Horas estimadas:</strong> {totalHours} horas
        </p>
        <p className="text-sm text-gray-600 mt-4">
          * Este presupuesto es solo una estimación visual del coste mensual en
          base a las opciones seleccionadas.
        </p>
      </div>
    </div>
  );
}

export default BudgetInput;
