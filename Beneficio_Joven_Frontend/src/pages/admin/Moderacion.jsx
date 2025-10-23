import { useEffect, useState } from 'react';
import PromocionCard from '../../components/admin/moderacion/PromocionCard';
import ModalStepperPromocion from "../../components/admin/moderacion/ModalStepperPromocion";

import {
  getPromocionesModeracion,
  approvePromocion,
  rejectPromocion,
} from '../../api/services/admin-api-requests/moderacion';

export default function Moderacion() {
  const [activeTab, setActiveTab] = useState('PENDING');
  const [promos, setPromos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 🟣 Nuevo: estado para abrir/cerrar modal y promoción seleccionada
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔁 Obtener promociones
  const fetchPromos = async () => {
    setIsLoading(true);
    setError('');
    const res = await getPromocionesModeracion(activeTab);
    if (res.success) {
      setPromos(res.data || []);
    } else {
      setError(res.message);
      setPromos([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPromos();
  }, [activeTab]);

  // ✅ Aprobar promoción
  const handleApprove = async (id) => {
    if (!window.confirm('¿Aprobar esta promoción?')) return;
    const res = await approvePromocion(id);
    if (res.success) {
      alert('✅ Promoción aprobada correctamente.');
      fetchPromos();
    } else {
      alert('❌ ' + res.message);
    }
  };

  // ❌ Rechazar promoción
  const handleReject = async (id) => {
    if (!window.confirm('¿Rechazar esta promoción?')) return;
    const res = await rejectPromocion(id);
    if (res.success) {
      alert('⚠️ Promoción rechazada correctamente.');
      fetchPromos();
    } else {
      alert('❌ ' + res.message);
    }
  };

  // 🟣 Función para abrir modal con datos
  const handleOpenModal = (promo) => {
    setSelectedPromo(promo);
    setIsModalOpen(true);
  };

  // 🟣 Cerrar modal
  const handleCloseModal = () => {
    setSelectedPromo(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Moderación de Promociones</h1>
          <p className="text-gray-600 mt-2 sm:mt-0">
            Revisa, aprueba o rechaza promociones creadas por los comercios.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          {['PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg font-medium transition ${
                activeTab === tab
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tab === 'PENDING'
                ? 'Pendientes'
                : tab === 'APPROVED'
                ? 'Aprobadas'
                : 'Rechazadas'}
            </button>
          ))}
        </div>

        {/* Contenido principal */}
        {isLoading ? (
          <div className="text-center text-gray-600 py-16">Cargando promociones...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-16">{error}</div>
        ) : promos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500">
            No hay promociones en esta categoría.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {promos.map((promo) => (
              <PromocionCard
                key={promo.idPromocion}
                promo={promo}
                onApprove={() => handleApprove(promo.idPromocion)}
                onReject={() => handleReject(promo.idPromocion)}
                onViewDetails={() => handleOpenModal(promo)} // 🟣 Nuevo botón de detalles
              />
            ))}
          </div>
        )}
      </div>

      {/* 🟣 Modal con Stepper */}
      {isModalOpen && (
        <ModalStepperPromocion promo={selectedPromo} onClose={handleCloseModal} />
      )}
    </div>
  );
}
