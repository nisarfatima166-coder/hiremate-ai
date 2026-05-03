import { getToken } from './authToken'

const API_BASE = import.meta.env.VITE_API_URL ?? ''

async function parseJsonResponse(res) {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return { raw: text }
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await parseJsonResponse(res)
  if (!res.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data ? String(data.message) : `Request failed (${res.status})`
    const err = new Error(message)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export async function getHealth() {
  return request('/api/health')
}

export async function signup({ name, email, password }) {
  return request('/api/auth/signup', { method: 'POST', body: { name, email, password } })
}

export async function login({ email, password }) {
  return request('/api/auth/login', { method: 'POST', body: { email, password } })
}

export async function getMe() {
  return request('/api/users/me')
}
