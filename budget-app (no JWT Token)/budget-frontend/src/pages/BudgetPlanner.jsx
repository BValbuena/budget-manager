import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { motion } from 'framer-motion';

import LanguageToggle from '../components/LanguageToggle';
import DarkModeToggle from '../components/DarkModeToggle';
import { translations } from '../translations';

function BudgetPlanner() {
  const [language, setLanguage] = useState('es');
  const t = translations[language];

  const [budget, setBudget] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [clientName, setClientName] = useState('');
  const [hideDarkModeButton, setHideDarkModeButton] = useState(false);
  const pdfRef = useRef();

  useEffect(() => {
    axios.get('http://localhost:4000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const progress = budget > 0 ? Math.min((totalCost / budget) * 100, 100) : 0;

  const toggleOption = (option) => {
    if (!budget || budget <= 0) {
      alert('Introduce un presupuesto válido antes de seleccionar opciones.');
      return;
    }

    const isSelected = selectedOptions.some(o => o.id === option.id);
    const updated = isSelected
      ? selectedOptions.filter(o => o.id !== option.id)
      : [...selectedOptions, option];

    setSelectedOptions(updated);
    setTotalCost(updated.reduce((sum, o) => sum + o.priceEuro, 0));
    setTotalHours(updated.reduce((sum, o) => sum + o.hours, 0));
  };

  const groupOptionsByCategory = (options) => {
    const grouped = { INICIAL: [], MENSUAL: [], OTROS: [] };
    options.forEach(opt => {
      const name = opt.name.toLowerCase();
      if (name.includes('setup') || name.includes('auditoría') || name.includes('inicial') || name.includes('estrategia')) {
        grouped.INICIAL.push(opt);
      } else if (name.includes('mensual') || name.includes('post') || name.includes('reunión') || name.includes('gestión')) {
        grouped.MENSUAL.push(opt);
      } else {
        grouped.OTROS.push(opt);
      }
    });
    return grouped;
  };

  const exportToPDF = () => {
    setHideDarkModeButton(true);
    setTimeout(() => {
      html2pdf().set({
        margin: 0,
        filename: `plan-${clientName || 'cliente'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' },
      }).from(pdfRef.current).save().then(() => setHideDarkModeButton(false));
    }, 300);
  };

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen p-4 sm:p-6 text-black dark:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <LanguageToggle language={language} setLanguage={setLanguage} />
          {!hideDarkModeButton && <DarkModeToggle />}
        </div>

        {/* Grid principal */}
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* IZQUIERDA: RESUMEN */}
          <div className="bg-neutral-100 dark:bg-gray-800 p-6 rounded-2xl shadow-inner border">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Aquí está el camino para que puedas alcanzar tus metas.
            </h2>

            <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              <p>{t.clientLabel}: <strong>{clientName}</strong></p>
              <p>{t.date}: {new Date().toLocaleDateString()}</p>
            </div>

            {Object.entries(groupOptionsByCategory(selectedOptions)).map(([section, items]) =>
              items.length > 0 && (
                <div key={section} className="bg-white dark:bg-gray-900 p-4 rounded-xl mb-4 shadow">
                  <h3 className="text-blue-700 font-bold text-xs uppercase mb-2 tracking-wider">{section}</h3>
                  <ul className="text-sm space-y-1">
                    {items.map((opt) => (
                      <li key={opt.id} className="flex justify-between text-gray-800 dark:text-white">
                        <span>→ {opt.name}</span>
                        <span>{opt.hours}h — €{opt.priceEuro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}

            {selectedOptions.length > 0 && (
              <div ref={pdfRef}>
                <div className="bg-blue-600 text-white text-center p-5 rounded-xl mt-6 shadow-lg">
                  <p className="text-xs">Horas al mes</p>
                  <p className="text-xl font-bold">{totalHours}h / mes</p>
                  <p className="text-xs mt-4">Total mensual</p>
                  <p className="text-2xl font-extrabold">€{totalCost} / mes</p>
                  <p className="text-[10px] italic mt-2 opacity-70">* IVA no incluido</p>
                </div>

                <motion.button
                  onClick={exportToPDF}
                  className="mt-6 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {t.savePlan}
                </motion.button>
              </div>
            )}
          </div>

          {/* DERECHA: Inputs + Categorías */}
          <div className="lg:col-span-2 space-y-6">
            {/* Inputs y barra en la parte superior derecha */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">{t.clientLabel}</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Introduzca su nombre"
                    className="w-full p-3 rounded border dark:bg-gray-800 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">{t.budgetLabel}</label>
                  <input
              ype="text"
  inputMode="numeric"
  pattern="[0-9]*"
  value={budget === 0 ? '' : budget}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, '');
    setBudget(Number(value));
  }}
  placeholder="Introduzca su presupuesto"
  className="w-full p-3 rounded border dark:bg-gray-800 dark:border-gray-600"
  maxLength={8}
/>

                </div>
              </div>

              {/* Barra de progreso */}
              <div className="mt-4">
                <div className="w-full bg-gray-300 dark:bg-gray-700 h-4 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${progress < 90 ? 'bg-blue-600' : progress < 100 ? 'bg-yellow-500' : 'bg-red-600'}`}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-center mt-2 text-sm text-gray-700 dark:text-gray-300">
                  €{totalCost} / €{budget || 0}
                </p>
              </div>
            </div>

            {/* Categorías y opciones */}
            {categories.map((cat) => (
              <div key={cat.id}>
                <h3 className="font-semibold text-blue-600 mb-2">
                  {language === 'es' ? cat.name_es || cat.name : cat.name_en || cat.name}
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {cat.options.map((opt) => {
                    const selected = selectedOptions.some((o) => o.id === opt.id);
                    return (
                      <motion.div
                        key={opt.id}
                        onClick={() => toggleOption(opt)}
                        className={`p-4 rounded-xl cursor-pointer text-sm transition border-2 ${
                          selected
                            ? 'bg-blue-600 text-white border-blue-700'
                            : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700'
                        }`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <div className="font-medium mb-1">{opt.name}</div>
                        <div>{opt.hours}h — €{opt.priceEuro}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetPlanner;
