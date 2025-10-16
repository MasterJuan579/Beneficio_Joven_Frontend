/**
 * @file axiosConfig.js
 * @description Configuración base de Axios para el proyecto Beneficio Joven Frontend.
 * Crea una instancia preconfigurada para realizar solicitudes HTTP al backend en AWS.
 *
 * @module api/config/axiosConfig
 * @version 1.0.0
 */

import axios from 'axios';

/**
 * URL base del backend desplegado en AWS (API Gateway).
 * @constant
 * @type {string}
 */
const API_URL = 'https://fgdmbhrw5b.execute-api.us-east-2.amazonaws.com/dev';

/**
 * Instancia personalizada de Axios con configuración base.
 *
 * @constant
 * @type {import('axios').AxiosInstance}
 *
 * @property {string} baseURL - Dirección base del backend.
 * @property {number} timeout - Tiempo máximo de espera (ms) antes de cancelar la solicitud.
 * @property {Object} headers - Encabezados HTTP predeterminados para cada solicitud.
 * @property {string} headers['Content-Type'] - Define el tipo de contenido como JSON.
 *
 * @example
 * import axiosInstance from '@/api/config/axiosConfig';
 * axiosInstance.get('/comercios')
 *   .then(response => console.log(response.data))
 *   .catch(error => console.error(error));
 */
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Exportación por defecto para usar la instancia configurada en todo el proyecto.
export default axiosInstance;
