import axios, { AxiosError } from 'axios'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
export const apiOrigin = (import.meta.env.VITE_API_ORIGIN || apiBaseUrl).replace(/\/+$/, '')
export const api = axios.create({ baseURL: `${apiBaseUrl}/api/v1`, withCredentials: true, withXSRFToken: true, headers: { Accept: 'application/json' } })

export function errorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const e = error as AxiosError<{ message?: string; errors?: Record<string,string[]> }>
    if (e.response?.status === 401) return 'Sesi berakhir. Silakan masuk kembali.'
    if (e.response?.status === 403) return 'Akun Anda tidak memiliki akses ke data ini.'
    if (e.response?.status === 404) return 'Data atau endpoint tidak ditemukan.'
    if (e.response?.status === 409) return e.response.data?.message || 'Perubahan bertentangan dengan data yang ada.'
    if (e.response?.status === 422) return Object.values(e.response.data?.errors || {}).flat().join(' ')
    if (e.response?.status === 429) return 'Terlalu banyak permintaan. Coba kembali sebentar lagi.'
    if (e.response?.status && e.response.status >= 500) return 'Server sedang mengalami gangguan. Silakan coba kembali beberapa saat lagi.'
    return e.response?.data?.message || 'Terjadi gangguan saat memuat data.'
  }
  return 'Terjadi gangguan saat memuat data.'
}
