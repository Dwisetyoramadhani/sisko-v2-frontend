import { useState } from 'react'
import type React from 'react'
import axios from 'axios'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'

import { api, apiOrigin, errorMessage } from '../../services/api'
import type { Envelope, User } from '../../types/api'
import './LoginPage.css'

export function LoginPage({ onLogin }: { onLogin: (user: User) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setError('')

    try {
      const csrfUrl = apiOrigin ? `${apiOrigin}/sanctum/csrf-cookie` : '/sanctum/csrf-cookie'
      await axios.get(csrfUrl, { withCredentials: true })
      const response = await api.post<Envelope<User>>('/auth/login', { email, password })
      onLogin(response.data.data)
    } catch (submitError) {
      setError(errorMessage(submitError))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="login-page login-centered">
      <div className="login-orb login-orb-one" />
      <div className="login-orb login-orb-two" />

      <div className="login-shell">
        <form className="login-card" onSubmit={submit}>
          <div className="login-card-brand">
            <img className="login-brand-image" src="/logo-full.png" alt="SISKO — Sistem Kehadiran Online" />
          </div>

          <div className="login-welcome">SELAMAT DATANG KEMBALI</div>
          <h1>Masuk ke akun Anda</h1>
          <p className="login-description">Gunakan akun sekolah yang telah diberikan administrator.</p>

          {error && <div className="alert error login-error" role="alert">{error}</div>}

          <label className="login-field">
            <span>Email sekolah</span>
            <div className="login-input-wrap">
              <Mail size={17} aria-hidden="true" />
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nama@sekolah.sch.id"
              />
            </div>
          </label>

          <label className="login-field">
            <span>Kata sandi</span>
            <div className="login-input-wrap">
              <LockKeyhole size={17} aria-hidden="true" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Masukkan kata sandi"
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          <button className="login-submit" disabled={busy}>
            <span>{busy ? 'Memproses…' : 'Masuk'}</span>
            {!busy && <ArrowRight size={17} />}
          </button>

          <p className="login-help">Butuh bantuan akses? <span>Hubungi administrator sekolah</span></p>
        </form>

        <footer className="login-copyright">© 2026 SISKO · Sistem Informasi &amp; Administrasi Sekolah</footer>
      </div>
    </main>
  )
}
