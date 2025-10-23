/**
 * @file axiosConfig.js
 */
import axios from 'axios'

// ⚠️ usa tu API Gateway (o `.env` si prefieres):
// const API_URL = import.meta.env.VITE_API_URL
const API_URL = 'https://fgdmbhrw5b.execute-api.us-east-2.amazonaws.com/dev'

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

export default axiosInstance
