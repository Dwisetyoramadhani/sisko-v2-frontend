import { useState } from 'react'
import type React from 'react'
import axios from 'axios'

import { api, errorMessage } from '../../services/api'
import type { Envelope, User } from '../../types/api'

export function LoginPage({ onLogin }: { onLogin: (user: User) => void }) {
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [busy,setBusy]=useState(false); const [error,setError]=useState('')
  const submit=async(e:React.FormEvent)=>{ e.preventDefault();setBusy(true);setError('');try{await axios.get(`${import.meta.env.VITE_API_ORIGIN || ''}/sanctum/csrf-cookie`,{withCredentials:true});const result=await api.post<Envelope<User>>('/auth/login',{email,password});onLogin(result.data.data)}catch(err){setError(errorMessage(err))}finally{setBusy(false)} }
  return <main className="login-page"><div className="login-decoration"><div className="login-brand"><div className="brand-mark">S</div><span>SISKO</span></div><div className="login-message"><span className="eyebrow">SISTEM KEHADIRAN ONLINE</span><h1>Operasional sekolah,<br/>lebih terorganisir.</h1><p>Satu ruang kerja untuk kehadiran, akademik, dan aktivitas sekolah.</p></div><div className="login-foot">© 2026 SISKO · Administrasi sekolah dalam satu sistem</div></div><div className="login-panel"><form className="login-form" onSubmit={submit}><div className="mobile-brand"><div className="brand-mark">S</div><strong>SISKO</strong></div><span className="eyebrow">SELAMAT DATANG KEMBALI</span><h2>Masuk ke akun Anda</h2><p className="muted">Gunakan akun sekolah yang telah diberikan administrator.</p>{error&&<div className="alert error">{error}</div>}<label>Email sekolah<input type="email" required autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} placeholder="nama@sekolah.sch.id"/></label><label>Kata sandi<input type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Masukkan kata sandi"/></label><button className="primary-button full" disabled={busy}>{busy?'Memproses…':'Masuk'}</button><small className="muted">Lupa kata sandi? Hubungi administrator sekolah.</small></form></div></main>
}
