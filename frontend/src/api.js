import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://hospitalmanagement-backend-0g6l.onrender.com/api'
const API = axios.create({ baseURL: API_BASE_URL })

API.setToken = (token) => {
  if (token) API.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete API.defaults.headers.common['Authorization']
}

export default API
