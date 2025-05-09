import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

function BudgetInput({ budget, setBudget, totalCost, t }) {
  const [focused, setFocused] = useState(false);
  const percentage = budget > 0 ? Math.min((totalCost / budget) * 100, 100) : 0;

  const handleChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setBudget(0); // o puedes setBudget(1) si quieres un mínimo forzado
    } else {
      setBudget(value);
    }
  };

  return (
    <div className="mb-8">
      <label className="block mb-2 text-lg font-semibold text-gray-700 dark:text-white">
        {t.budgetLabel}
      </label>

      <div className="relative w-full">
        <input
          type="number"
          inputMode="numeric"
          value={focused && budget === 0 ? '' : budget}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={handleChange}
          className="w-full text-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500
            appearance-none [appearance:textfield] 
            [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          placeholder={t.budgetPlaceholder || 'Introduce tu presupuesto'}
          min="1"
        />

        {/* Barra de progreso */}
        <div className="mt-3 w-full bg-gray-300 dark:bg-gray-700 h-4 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${
              percentage < 90 ? 'bg-blue-600' : percentage < 100 ? 'bg-yellow-500' : 'bg-red-600'
            }`}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Texto de progreso */}
        <div className="text-sm mt-2 text-center text-gray-600 dark:text-gray-300">
          <AnimatePresence mode="wait">
            <motion.div
              key={totalCost}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              €{totalCost} / €{budget || 0}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default BudgetInput;
