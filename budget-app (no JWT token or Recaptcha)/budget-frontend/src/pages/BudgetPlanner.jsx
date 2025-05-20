import { useState, useEffect, useRef } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { motion, AnimatePresence } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import DarkModeToggle from "../components/DarkModeToggle";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { set } from "react-hook-form";

function BudgetPlanner() {
  const [budget, setBudget] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [firstMonthCost, setFirstMonthCost] = useState(0);
  const [recurringCost, setRecurringCost] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [hideDarkModeButton, setHideDarkModeButton] = useState(false);
  const [focused, setFocused] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [currentIndex, setCurrentIndex] = useState(null);
  const [pricePerHour, setPricePerHour] = useState(60);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const pdfRef = useRef();
  const captchaRef = useRef();

  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:4000/api/categories/with-active-options")
        .then((res) => {
          setCategories(res.data);
          const initial = {};
          res.data.forEach((cat) => (initial[cat.id] = true));
          setExpandedCategories(initial);
          if (res.data.length > 0) setCurrentIndex(res.data[0].id);
        });

      axios
        .get("http://localhost:4000/api/settings/hourly-rate")
        .then((res) => setPricePerHour(res.data.hourlyRate));
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const totalFirstMonthOnly = selectedOptions
      .filter((o) => o.firstMonthOnly)
      .reduce(
        (sum, o) => sum + (o.isFree ? 0 : Math.round(o.hours * pricePerHour)),
        0
      );

    const totalRecurring = selectedOptions
      .filter((o) => !o.firstMonthOnly)
      .reduce(
        (sum, o) => sum + (o.isFree ? 0 : Math.round(o.hours * pricePerHour)),
        0
      );

    const newTotalHours = selectedOptions.reduce((sum, o) => sum + o.hours, 0);

    setFirstMonthCost(totalFirstMonthOnly);
    setRecurringCost(totalRecurring);
    setTotalHours(newTotalHours);
  }, [pricePerHour, selectedOptions]);

  const toggleCategory = (id) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleOption = (option) => {
    if (!budget || budget <= 0) {
      return alert(
        "Introduce un presupuesto válido antes de seleccionar opciones."
      );
    }

    const isSelected = selectedOptions.some((o) => o.id === option.id);
    const updated = isSelected
      ? selectedOptions.filter((o) => o.id !== option.id)
      : [...selectedOptions, option];

    setSelectedOptions(updated);

    const totalFirstMonthOnly = updated
      .filter((o) => o.firstMonthOnly)
      .reduce(
        (sum, o) => sum + (o.isFree ? 0 : Math.round(o.hours * pricePerHour)),
        0
      );

    const totalRecurring = updated
      .filter((o) => !o.firstMonthOnly)
      .reduce(
        (sum, o) => sum + (o.isFree ? 0 : Math.round(o.hours * pricePerHour)),
        0
      );

    const totalHours = updated.reduce((sum, o) => sum + o.hours, 0);

    setFirstMonthCost(totalFirstMonthOnly);
    setRecurringCost(totalRecurring);
    setTotalHours(totalHours);
  };

  const verifyCaptcha = async () => {
    if (!captchaToken) {
      alert("Por favor, verifica el reCAPTCHA antes de continuar.");
      return false;
    }

    setIsVerifying(true);
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/recaptcha/verify-captcha",
        {
          token: captchaToken,
        }
      );
      setIsVerifying(false);
      if (!data.success) {
        alert("La verificación de reCAPTCHA ha fallado.");
        return false;
      }
      return true;
    } catch (err) {
      setIsVerifying(false);
      console.error(err);
      alert("Error al verificar el reCAPTCHA.");
      return false;
    }
  };

  const handleSaveAndDownload = async () => {
    setFormSubmitted(true);

    if (
      clientName.trim() === "" ||
      clientEmail.trim() === "" ||
      clientPhone.trim() === ""
    ) {
      if (clientName.trim() === "") toast.error("Introduce tu nombre");
      if (clientEmail.trim() === "") toast.error("Introduce tu email");
      if (clientPhone.trim() === "") toast.error("Introduce tu teléfono");
      return;
    }

    const isValid = await verifyCaptcha();
    if (!isValid) return;

    try {
      await axios.post("http://localhost:4000/api/plans", {
        clientName,
        clientEmail,
        clientPhone,
        budget,
        totalHours,
        firstMonthCost,
        recurringCost,
        selectedOptionIds: selectedOptions.map((o) => o.id),
      });
    } catch (err) {
      toast.error("Error al guardar el presupuesto");
      return;
    }

    setHideDarkModeButton(true);
    setTimeout(() => {
      html2pdf()
        .set({
          margin: 0,
          filename: `Presupuesto_${clientName || "cliente"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
        })
        .from(pdfRef.current)
        .save()
        .then(() => {
          setHideDarkModeButton(false);
          setCaptchaToken(null);
          setCanSubmit(false);
          if (captchaRef.current) {
            captchaRef.current.reset();
          }
        });
    }, 300);
  };

  const resetAll = () => {
    setSelectedOptions([]);
    setTotalHours(0);
    setFirstMonthCost(0);
    setRecurringCost(0);
    setBudget(0);
    setClientName("");
    setClientEmail("");
    setClientPhone("");
  };

  const progress =
    budget > 0 ? Math.min((recurringCost / budget) * 100, 100) : 0;
  const currentCategory = categories.find((cat) => cat.id === currentIndex);
  const groupedOptions = (initialOnly) =>
    selectedOptions.filter((o) => o.firstMonthOnly === initialOnly);

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen p-6 text-gray-900 dark:text-white relative">
      {!hideDarkModeButton && (
        <div className="fixed bottom-6 right-6 z-50">
          <DarkModeToggle />
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
        <div className="w-full order-2 lg:order-1">
          <div
            ref={pdfRef}
            className="bg-black/90 text-white p-6 rounded-2xl shadow-2xl h-full flex flex-col justify-between space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold mb-6 leading-snug">
                Presupuesto mensual de servicios adquiridos
              </h2>
              <div className="text-sm mb-6 space-y-1 text-white/80">
                <p>
                  <strong>Cliente:</strong> {clientName || ""}
                </p>
                <p>
                  <strong>Email:</strong> {clientEmail || ""}
                </p>
                <p>
                  <strong>Teléfono:</strong> {clientPhone || ""}
                </p>
                <p>
                  <strong>Fecha:</strong> {new Date().toLocaleDateString()}
                </p>
              </div>
              {selectedOptions.length > 0 ? (
                <>
                  {groupedOptions(true).length > 0 && (
                    <div className="mb-6">
                      <div className="bg-blue-600 px-3 py-2 rounded-md text-white text-xs font-bold uppercase mb-2 tracking-wide">
                        INICIAL
                      </div>
                      <ul className="space-y-2 text-sm">
                        {groupedOptions(true).map((opt) => (
                          <li
                            key={opt.id}
                            className="flex justify-between items-center border-b border-white/20 pb-1"
                          >
                            <span className="flex-1">🚀 {opt.name}</span>
                            <span className="text-xs">
                              ➜ {opt.hours}h /{" "}
                              {opt.isFree ? "Free" : `${pricePerHour}€`}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {groupedOptions(false).length > 0 && (
                    <div>
                      <div className="bg-blue-600 px-3 py-2 rounded-md text-white text-xs font-bold uppercase mb-2 tracking-wide">
                        MENSUAL
                      </div>
                      <ul className="space-y-2 text-sm">
                        {groupedOptions(false).map((opt) => (
                          <li
                            key={opt.id}
                            className="flex justify-between items-center border-b border-white/20 pb-1"
                          >
                            <span className="flex-1">🚀 {opt.name}</span>
                            <span className="text-xs">
                              ➜ {opt.hours}h /{" "}
                              {opt.isFree
                                ? "Free"
                                : `${Math.round(opt.hours * pricePerHour)}€`}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm italic text-gray-300">
                  Aún no se han seleccionado servicios.
                </p>
              )}
            </div>

            <div className="bg-blue-500 text-white text-center p-5 rounded-xl shadow-lg">
              <p className="text-sm font-light">Horas al mes</p>
              <p className="text-3xl font-bold">{totalHours}h</p>
              <div className="text-sm mt-2 font-medium space-y-1">
                <p>
                  Total mensual: <strong>{recurringCost}€</strong> / mes + IVA
                </p>
                <p>
                  Total 1er mes:{" "}
                  <strong>{firstMonthCost + recurringCost}€</strong> /mes + IVA
                </p>
              </div>
              <p className="text-[10px] mt-2 opacity-70 italic">
                *Combustible y peajes no incluido
              </p>
            </div>

            <div className="mt-10 border-t pt-4 text-center text-xs text-gray-400">
              <p>
                Apolo Agency ·
                <a
                  href="mailto:hola@universoapolo.com"
                  className="hover:underline"
                >
                  {" "}
                  hola@universoapolo.com
                </a>{" "}
              </p>
              <p className="flex justify-center items-center gap-1 mt-1">
                <a
                  href="https://instagram.com/apolo.propulsora"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  @apolo.propulsora
                </a>{" "}
                ·
                <a
                  href="https://www.universoapolo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline ml-1"
                >
                  universoapolo.com
                </a>
              </p>
              <p>
                <a href="tel:+34356099919" className="hover:underline">
                  {" "}
                  +34 956 099 919
                </a>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center mt-4">
            <ReCAPTCHA
              ref={captchaRef}
              sitekey=""
              onChange={(token) => {
                setCaptchaToken(token);
                setCanSubmit(true);
              }}
              className="mb-4"
            />

            <motion.button
              onClick={handleSaveAndDownload}
              disabled={!canSubmit || isVerifying}
              className={`w-full px-4 py-3 rounded-lg text-white ${
                !canSubmit || isVerifying
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }`}
              whileHover={{ scale: canSubmit ? 1.03 : 1 }}
              whileTap={{ scale: canSubmit ? 0.97 : 1 }}
            >
              {isVerifying
                ? "Verificando..."
                : "Mandar y descargar propuesta en PDF"}
            </motion.button>

            <button
              onClick={resetAll}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Restablecer selección
            </button>
          </div>
        </div>

        <div className="space-y-2 order-1 lg:order-2">
          <h1 className="text-4xl font-bold leading-tight mb-3">
            Presupuestador de servicios
          </h1>
          <div className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-4">
            Precio por hora: {pricePerHour}€
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Nombre del cliente"
                className={`w-full p-3 rounded border ${
                  formSubmitted && clientName === ""
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-800 dark:text-white`}
                required
              />
              {formSubmitted && clientName === "" && (
                <p className="text-sm text-red-600 mt-1">Introduce tu nombre</p>
              )}
            </div>

            <div>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="cliente@correo.com"
                className={`w-full p-3 rounded border ${
                  formSubmitted && clientEmail === ""
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-800 dark:text-white`}
                required
              />
              {formSubmitted && clientEmail === "" && (
                <p className="text-sm text-red-600 mt-1">Introduce tu email</p>
              )}
            </div>

            <div>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+34 600 000 000"
                className={`w-full p-3 rounded border ${
                  formSubmitted && clientPhone === ""
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-800 dark:text-white`}
                required
              />
              {formSubmitted && clientPhone === "" && (
                <p className="text-sm text-red-600 mt-1">
                  Introduce tu teléfono
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block mb-1 text-sm font-medium">
              Presupuesto mensual (€)
            </label>
            <input
              type="text"
              value={focused && budget === 0 ? "" : budget}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={(e) =>
                setBudget(Number(e.target.value.replace(/\D/g, "")))
              }
              className="w-full p-3 rounded border bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
              placeholder="Introduce tu presupuesto"
            />
            <div className="mt-4">
              <div className="w-full bg-gray-300 dark:bg-gray-700 h-4 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    progress < 90
                      ? "bg-blue-600"
                      : progress < 100
                      ? "bg-yellow-500"
                      : "bg-red-600"
                  }`}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <p className="text-center text-sm text-gray-800 dark:text-gray-300 mt-2">
                Coste mensual: <strong>{recurringCost}€</strong> / {budget || 0}
                €
              </p>

              {recurringCost > budget && (
                <p className="text-center text-sm font-bold text-gray-700 dark:text-gray-300 mt-1">
                  ⚠️ Has superado el presupuesto establecido.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCurrentIndex(cat.id)}
                className={`px-4 py-2 text-sm rounded ${
                  cat.id === currentIndex
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white"
                }`}
              >
                {cat.name_es || cat.name}
              </button>
            ))}
          </div>

          {currentCategory && (
            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-blue-600">
                  {currentCategory.name_es || currentCategory.name}
                </h3>
                <button
                  onClick={() => toggleCategory(currentCategory.id)}
                  className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition text-lg font-bold"
                >
                  {expandedCategories[currentCategory.id] ? "–" : "+"}
                </button>
              </div>
              <AnimatePresence>
                {expandedCategories[currentCategory.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid sm:grid-cols-2 md:grid-cols-3 gap-4"
                  >
                    {(currentCategory.options || []).length > 0 ? (
                      currentCategory.options.map((opt) => {
                        const selected = selectedOptions.some(
                          (o) => o.id === opt.id
                        );
                        return (
                          <motion.div
                            key={opt.id}
                            onClick={() => toggleOption(opt)}
                            className={`p-4 rounded-xl cursor-pointer border-2 text-sm transition duration-300 ease-in-out shadow-md ${
                              selected
                                ? "bg-blue-600 text-white border-blue-700"
                                : "bg-white text-gray-900 border-gray-300 hover:bg-blue-50 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                            }`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <div className="font-semibold mb-1">{opt.name}</div>
                            <div className="text-xs">
                              {opt.hours}h —{" "}
                              {opt.isFree
                                ? "Free"
                                : `${Math.round(opt.hours * pricePerHour)}€`}
                            </div>
                            {opt.isFree && (
                              <span
                                className={`text-xs font-semibold block mt-1 ${
                                  selected ? "text-green-200" : "text-green-500"
                                }`}
                              >
                                (Gratis)
                              </span>
                            )}
                            {opt.firstMonthOnly && (
                              <span
                                className={`text-xs font-semibold block ${
                                  selected
                                    ? "text-purple-200"
                                    : "text-purple-500"
                                }`}
                              >
                                (1er mes)
                              </span>
                            )}
                            {opt.onDemand && (
                              <span
                                className={`text-xs font-semibold block ${
                                  selected
                                    ? "text-indigo-200"
                                    : "text-indigo-500"
                                }`}
                              >
                                (A demanda)
                              </span>
                            )}
                          </motion.div>
                        );
                      })
                    ) : (
                      <p className="text-sm italic text-center text-gray-500 dark:text-gray-400">
                        Esta categoría aún no tiene opciones.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BudgetPlanner;
