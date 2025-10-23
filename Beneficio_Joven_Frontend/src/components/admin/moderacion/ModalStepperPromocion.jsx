import React, { useState } from "react";
import Stepper, { Step } from "./Stepper";

export default function ModalStepperPromocion({ promo, onClose }) {
  const [justificacion, setJustificacion] = useState("");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      {/* 🔹 Contenedor principal sin fondo blanco detrás */}
      <div className="relative rounded-2xl w-full max-w-2xl">
        <Stepper
          initialStep={1}
          onFinalStepCompleted={() => console.log("✅ Todos los pasos completados")}
          backButtonText="Atrás"
          nextButtonText="Siguiente"
          stepCircleContainerClassName="bg-transparent"
          stepContainerClassName="bg-transparent"
          contentClassName="bg-[#f3f0ff] rounded-2xl p-8 shadow-xl"
          footerClassName="bg-transparent"
        >
          {/* 🟣 Step 1 - Introducción con botón salir */}
          <Step>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-purple-700">
                Detalles de la Promoción
              </h2>
              <p className="text-gray-700">
                Aquí puedes revisar los datos básicos de la promoción antes de aprobarla.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-5 py-2 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-800 transition"
              >
                Salir
              </button>
            </div>
          </Step>

          {/* 🟣 Step 2 - Información real del cupón */}
          <Step>
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              Información del Cupón
            </h2>
            <div className="bg-white/80 rounded-xl p-5 shadow-inner space-y-3 text-gray-800">
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

          {/* 🟣 Step 3 - Justificación */}
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

          {/* 🟣 Step 4 - Confirmación */}
          <Step>
            <h2 className="text-2xl font-semibold text-purple-700 mb-2">
              Confirmar acción
            </h2>
            <p className="text-gray-700 mb-6">
              Revisa toda la información antes de aprobar o rechazar esta promoción.
            </p>
            <div className="flex gap-4">
              <button className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
                Aprobar
              </button>
              <button className="flex-1 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 transition">
                Rechazar
              </button>
            </div>
          </Step>
        </Stepper>
      </div>
    </div>
  );
}
