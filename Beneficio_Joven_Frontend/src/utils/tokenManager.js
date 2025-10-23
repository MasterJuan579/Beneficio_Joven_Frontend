/**
 * @file tokenManager.js
 */
export const saveToken = (token) => localStorage.setItem('auth_token', token)
export const getToken  = () => localStorage.getItem('auth_token')
export const removeToken = () => localStorage.removeItem('auth_token')
export const hasToken = () => !!localStorage.getItem('auth_token')

export const saveUser = (user) => localStorage.setItem('user_data', JSON.stringify(user))
export const getUser  = () => {
  const s = localStorage.getItem('user_data')
  return s ? JSON.parse(s) : null
}
export const removeUser = () => localStorage.removeItem('user_data')

export const clearAuth = () => {
  removeToken()
  removeUser()
}
