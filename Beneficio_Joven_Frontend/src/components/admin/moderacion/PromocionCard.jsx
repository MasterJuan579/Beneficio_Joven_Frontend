import { Eye } from "lucide-react"; // 👁 Ícono elegante para ver detalles

export default function PromocionCard({ promo, onViewDetails }) {
  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative"
    >
      {/* Estado badge */}
      <span
        className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full ${
          promo.status === "APPROVED"
            ? "bg-green-100 text-green-700"
            : promo.status === "REJECTED"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {promo.status === "APPROVED"
          ? "Aprobada"
          : promo.status === "REJECTED"
          ? "Rechazada"
          : "Pendiente"}
      </span>

      {/* Ícono de ver detalles */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails?.(promo); // 👈 Llama a la función que abre el modal
        }}
        className="absolute top-3 right-3 text-purple-600 hover:text-purple-800 transition"
        title="Ver detalles"
      >
        <Eye size={20} />
      </button>

      {/* Imagen de la promoción */}
      <div className="w-full h-48 bg-white flex items-center justify-center border-b">
        <img
          src={
            promo.logoURL?.includes("res.cloudinary.com")
              ? promo.logoURL.replace(
                  "/upload/",
                  "/upload/w_500,h_300,c_pad,b_white,q_auto,f_auto/"
                )
              : promo.logoURL || "https://placehold.co/400x300?text=Logo"
          }
          alt={promo.nombreEstablecimiento}
          className="max-h-44 object-contain"
        />
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {promo.titulo}
        </h3>
        <p className="text-gray-500 text-sm mb-3">
          {promo.nombreEstablecimiento}
        </p>

        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-semibold">Descuento:</span>{" "}
            {promo.discountType || "Otro tipo"}
          </p>
          <p>
            <span className="font-semibold">Vigencia:</span>{" "}
            {promo.validFrom && promo.validTo
              ? `${promo.validFrom} – ${promo.validTo}`
              : "Sin fecha – Sin fecha"}
          </p>
        </div>
      </div>
    </div>
  );
}
