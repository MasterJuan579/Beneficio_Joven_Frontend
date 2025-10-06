// src/api/config/axiosConfig.js
import axios from 'axios';

// URL de tu backend desplegado en AWS
const API_URL = 'https://fgdmbhrw5b.execute-api.us-east-2.amazonaws.com/dev';


// Crear instancia de axios con configuración base
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;