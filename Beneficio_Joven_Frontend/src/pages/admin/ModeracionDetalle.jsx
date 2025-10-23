/**
 * @file ModeracionDetalle.jsx
 * @description Vista de detalle de una promoción individual con diseño moderno sin emojis.
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPromocionById,
  approvePromocion,
  rejectPromocion,
} from "../../api/services/admin-api-requests/moderacion";

export default function ModeracionDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promo, setPromo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPromo = async () => {
      const res = await getPromocionById(id);
      if (res.success) setPromo(res.data);
      else setError(res.message);
      setIsLoading(false);
    };
    fetchPromo();
  }, [id]);

  const handleApprove = async () => {
    if (!window.confirm("¿Aprobar esta promoción?")) return;
    const res = await approvePromocion(id);
    if (res.success) {
      alert("✅ Promoción aprobada correctamente");
      navigate("/admin/moderacion");
    } else alert("❌ " + res.message);
  };

  const handleReject = async () => {
    if (!window.confirm("¿Rechazar esta promoción?")) return;
    const res = await rejectPromocion(id);
    if (res.success) {
      alert("⚠️ Promoción rechazada correctamente");
      navigate("/admin/moderacion");
    } else alert("❌ " + res.message);
  };

  if (isLoading)
    return (
      <div className="text-center py-20 text-gray-600">
        Cargando promoción...
      </div>
    );

  if (error)
    return <div className="text-center py-20 text-red-600">{error}</div>;

  if (!promo)
    return (
      <div className="text-center py-20 text-gray-500">
        Promoción no encontrada.
      </div>
    );

  // 🗓 Formatear fechas legibles
  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mt-10 border border-gray-100">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-6 text-center text-white">
        <h1 className="text-3xl font-semibold">{promo.titulo}</h1>
        <p className="text-purple-100 mt-1 text-sm">
          {promo.descripcion || "Sin descripción"}
        </p>
      </div>

      {/* Contenido */}
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800">
          <div>
            <h3 className="text-sm text-gray-500 uppercase font-semibold">
              Establecimiento
            </h3>
            <p className="text-lg font-medium mt-1">
              {promo.nombreEstablecimiento}
            </p>
          </div>

          <div>
            <h3 className="text-sm text-gray-500 uppercase font-semibold">
              Tipo de descuento
            </h3>
            <p className="text-lg font-medium mt-1">{promo.discountType}</p>
          </div>

          <div>
            <h3 className="text-sm text-gray-500 uppercase font-semibold">
              Valor del descuento
            </h3>
            <p className="text-lg font-medium mt-1">{promo.discountValue}</p>
          </div>

          <div>
            <h3 className="text-sm text-gray-500 uppercase font-semibold">
              Vigencia
            </h3>
            <p className="text-lg font-medium mt-1">
              {formatDate(promo.validFrom)} – {formatDate(promo.validTo)}
            </p>
          </div>

          <div className="col-span-full">
            <h3 className="text-sm text-gray-500 uppercase font-semibold">
              Estado
            </h3>
            <span
              className={`inline-block mt-2 px-4 py-1.5 rounded-full text-sm font-semibold ${
                promo.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : promo.status === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {promo.status}
            </span>
          </div>
        </div>

        {/* Botones */}
        {promo.status === "PENDING" && (
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleApprove}
              className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Aprobar promoción
            </button>
            <button
              onClick={handleReject}
              className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Rechazar promoción
            </button>
          </div>
        )}

        <div className="text-center pt-6">
          <button
            onClick={() => navigate("/admin/moderacion")}
            className="text-purple-600 font-medium hover:underline"
          >
            ← Volver a la lista
          </button>
        </div>
      </div>
    </div>
  );
}
