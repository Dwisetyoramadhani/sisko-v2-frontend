import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { AppShell } from '../layouts/AppShell'
import { LoginPage } from '../../features/auth/LoginPage'
import { api } from '../../services/api'
import type { Envelope, User } from '../../types/api'
import { QueryProvider } from '../providers/QueryProvider'

function AppRoutes() {
  const { data, isLoading } = useQuery({ queryKey: ['me'], queryFn: async () => (await api.get<Envelope<User>>('/auth/me')).data.data, retry: false })
  const [loginUser, setLoginUser] = useState<User | null | undefined>(undefined)
  // `null` is an explicit signed-out state; do not fall back to cached `/auth/me` data.
  const user = loginUser === undefined ? data ?? null : loginUser
  if (loginUser === undefined && isLoading) return <div className="splash"><img src="/logo-full.png" alt="SISKO" /><span className="splash-spinner" aria-hidden="true" /><p>Memuat aplikasi…</p></div>
  return <Routes><Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage onLogin={setLoginUser} />} /><Route path="*" element={user ? <AppShell user={user} onLogout={() => setLoginUser(null)} /> : <Navigate to="/login" replace />} /></Routes>
}

function AppRouterContent() { return <BrowserRouter><AppRoutes /></BrowserRouter> }

export function AppRouter() { return <QueryProvider><AppRouterContent /></QueryProvider> }
