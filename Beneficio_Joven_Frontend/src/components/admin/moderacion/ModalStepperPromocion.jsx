import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Stepper, { Step } from "./Stepper";
import {
  approvePromocion,
  rejectPromocion,
} from "../../../api/services/admin-api-requests/moderacion";

export default function ModalStepperPromocion({ promo, onClose }) {
  const [justificacion, setJustificacion] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  useEffect(() => {
    const handleClose = () => {
      setIsVisible(false);
      setTimeout(() => onClose(), 600);
    };
    window.addEventListener("closeStepper", handleClose);
    return () => window.removeEventListener("closeStepper", handleClose);
  }, [onClose]);

  // 🔹 Manejadores de acción
  const handleAprobar = async () => {
    setIsLoading(true);
    const { success, message } = await approvePromocion(promo.idPromocion);
    setFeedbackMsg(message);
    setIsLoading(false);

    if (success) {
      // Ejecuta animación del Stepper
      window.dispatchEvent(new CustomEvent("triggerStepperComplete"));
    }
  };

  const handleRechazar = async () => {
    if (!justificacion.trim()) {
      alert("Por favor agrega una justificación antes de rechazar la promoción.");
      return;
    }

    setIsLoading(true);
    const { success, message } = await rejectPromocion(
      promo.idPromocion,
      justificacion
    );
    setFeedbackMsg(message);
    setIsLoading(false);

    if (success) {
      window.dispatchEvent(new CustomEvent("triggerStepperComplete"));
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative rounded-2xl w-full max-w-2xl"
          >
            <Stepper
              initialStep={1}
              backButtonText="Atrás"
              nextButtonText="Siguiente"
              stepCircleContainerClassName="bg-[#b8b8daff]"
              contentClassName="bg-[#f3f0ff] rounded-2xl p-10 shadow-xl mt-10 mx-6 mb-10"
              onStepChange={() => setFeedbackMsg("")}
            >
              {/* 🔹 Step 1 */}
              <Step>
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-purple-700 mb-3">
                    Detalles de la Promoción
                  </h2>
                  <p className="text-gray-700">
                    Aquí puedes revisar los datos básicos de la promoción antes de aprobarla.
                  </p>
                </div>
              </Step>

              {/* 🔹 Step 2 */}
              <Step>
                <h2 className="text-2xl font-semibold text-purple-700 mb-4">
                  Información del Cupón
                </h2>
                <div className="bg-white/80 rounded-xl p-6 shadow-inner space-y-3 text-gray-800">
                  <p><strong>Título:</strong> {promo?.titulo || "Sin título"}</p>
                  <p><strong>Establecimiento:</strong> {promo?.nombreEstablecimiento}</p>
                  <p><strong>Tipo de descuento:</strong> {promo?.discountType || "Otro"}</p>
                  <p><strong>Valor:</strong> {promo?.discountValue || "—"}</p>
                  <p>
                    <strong>Vigencia:</strong>{" "}
                    {promo?.validFrom && promo?.validTo
                      ? `${promo.validFrom} – ${promo.validTo}`
                      : "Sin fecha definida"}
                  </p>
                  <p><strong>Estado actual:</strong> {promo?.status}</p>
                </div>
              </Step>

              {/* 🔹 Step 3 */}
              <Step>
                <h2 className="text-2xl font-semibold text-purple-700 mb-4">
                  Observaciones o Justificación
                </h2>
                <textarea
                  value={justificacion}
                  onChange={(e) => setJustificacion(e.target.value)}
                  placeholder="Escribe una justificación (solo si la rechazas)"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white/80"
                  rows={4}
                />
              </Step>

              {/* 🔹 Step 4 - Confirmación */}
              <Step>
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-semibold text-purple-700">
                    Confirmar acción
                  </h2>
                  <p className="text-gray-700">
                    Revisa toda la información antes de aprobar o rechazar esta promoción.
                  </p>

                  <div className="flex gap-4 justify-center mt-6 pb-4">
                    <button
                      onClick={handleAprobar}
                      disabled={isLoading}
                      className={`flex-1 max-w-[150px] py-3 rounded-lg font-semibold transition ${
                        isLoading
                          ? "bg-purple-400 cursor-not-allowed"
                          : "bg-purple-600 hover:bg-purple-700 text-white"
                      }`}
                    >
                      {isLoading ? "Procesando..." : "Aprobar"}
                    </button>

                    <button
                      onClick={handleRechazar}
                      disabled={isLoading}
                      className={`flex-1 max-w-[150px] py-3 rounded-lg font-semibold transition ${
                        isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gray-700 hover:bg-gray-800 text-white"
                      }`}
                    >
                      {isLoading ? "Procesando..." : "Rechazar"}
                    </button>
                  </div>

                  {feedbackMsg && (
                    <p className="text-sm text-gray-600 font-medium mt-2">
                      {feedbackMsg}
                    </p>
                  )}
                </div>
              </Step>
            </Stepper>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
