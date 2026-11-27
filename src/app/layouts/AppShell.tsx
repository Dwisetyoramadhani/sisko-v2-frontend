import { useState, type ReactNode } from 'react'
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import {
  Activity,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  FileBarChart2,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Search,
  ShieldAlert,
  Users,
  X,
} from 'lucide-react'

import { DashboardPage } from '../../features/dashboard/DashboardPage'
import { MasterDataResource } from '../../features/master-data/MasterDataResource'
import { StudentsPage } from '../../features/students/StudentsPage'
import { TeachersPage } from '../../features/teachers/TeachersPage'
import { ClassesPage } from '../../features/classes/ClassesPage'
import { SchedulesPage } from '../../features/schedules/SchedulesPage'
import { PermissionsPage } from '../../features/permissions/PermissionsPage'
import { TeachingSessionsPage } from '../../features/teaching/TeachingSessionsPage'
import { TeachingJournalsPage } from '../../features/teaching/TeachingJournalsPage'
import { AssignmentsPage } from '../../features/assignments/AssignmentsPage'
import { ViolationsPage } from '../../features/violations/ViolationsPage'
import { ReportsPage } from '../../features/reports/ReportsPage'
import { NotificationsPage } from '../../features/notifications/NotificationsPage'
import { ProfilePage } from '../../features/auth/ProfilePage'
import { api } from '../../services/api'
import type { User } from '../../types/api'
import { RoleGuard } from '../../components/shared/RoleGuard'

const menu = [
  {
    title: 'Ringkasan',
    links: [{ label: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['admin', 'wali_kelas', 'guru', 'petugas_piket', 'sekretaris_kelas'] }],
  },
  {
    title: 'Akademik',
    links: [
      { label: 'Siswa', path: '/master-data/students', icon: GraduationCap, roles: ['admin', 'petugas_piket', 'wali_kelas', 'sekretaris_kelas', 'guru'] },
      { label: 'Guru', path: '/master-data/teachers', icon: Users, roles: ['admin', 'guru'] },
      { label: 'Kelas', path: '/master-data/classes', icon: BookOpen, roles: ['admin', 'petugas_piket', 'wali_kelas', 'sekretaris_kelas', 'guru'] },
      { label: 'Mata pelajaran', path: '/master-data/subjects', icon: BookOpen, roles: ['admin'] },
      { label: 'Tahun ajaran', path: '/master-data/academic-years', icon: CalendarDays, roles: ['admin'] },
      { label: 'Hari libur', path: '/master-data/holidays', icon: CalendarDays, roles: ['admin'] },
      { label: 'Jadwal', path: '/schedules', icon: CalendarDays, roles: ['admin', 'guru', 'wali_kelas', 'sekretaris_kelas'] },
    ],
  },
  {
    title: 'Operasional',
    links: [
      { label: 'Pengajuan izin', path: '/permissions', icon: ClipboardCheck, roles: ['admin', 'petugas_piket', 'wali_kelas', 'sekretaris_kelas'] },
      { label: 'Sesi mengajar', path: '/teaching-sessions', icon: BookOpen, roles: ['admin', 'guru', 'wali_kelas'] },
      { label: 'Jurnal mengajar', path: '/teaching-journals', icon: BookOpen, roles: ['admin', 'guru', 'wali_kelas'] },
      { label: 'Tugas pengganti', path: '/assignments', icon: Activity, roles: ['admin', 'guru', 'wali_kelas', 'sekretaris_kelas'] },
      { label: 'Pelanggaran', path: '/violations', icon: ShieldAlert, roles: ['admin', 'petugas_piket', 'wali_kelas'] },
    ],
  },
  {
    title: 'Laporan',
    links: [
      { label: 'Laporan kehadiran', path: '/reports', icon: FileBarChart2, roles: ['admin', 'wali_kelas', 'guru', 'sekretaris_kelas'] },
      { label: 'Notifikasi', path: '/notifications', icon: Bell, roles: ['admin', 'wali_kelas', 'guru', 'petugas_piket', 'sekretaris_kelas'] },
    ],
  },
]

const mobileOrder: Record<string, string[]> = {
  guru: ['/', '/schedules', '/teaching-sessions', '/teaching-journals'],
  wali_kelas: ['/', '/teaching-sessions', '/permissions', '/violations'],
  petugas_piket: ['/', '/permissions', '/violations', '/notifications'],
  sekretaris_kelas: ['/', '/schedules', '/assignments', '/permissions'],
  admin: ['/', '/master-data/students', '/permissions', '/reports'],
}

export function AppShell({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()
  const roles = user.roles.map((role) => role.toLowerCase().replaceAll(' ', '_'))
  const visibleGroups = menu
    .map((group) => ({ ...group, links: group.links.filter((link) => link.roles.some((role) => roles.includes(role))) }))
    .filter((group) => group.links.length > 0)
  const visibleLinks = visibleGroups.flatMap((group) => group.links)
  const activeLink = visibleLinks.find((link) => link.path === location.pathname)
  const activeResource = location.pathname.split('/').at(-1) || ''
  const title = activeLink?.label || (location.pathname.startsWith('/master-data/') ? activeResource.replaceAll('-', ' ') : location.pathname === '/profile' ? 'Profil saya' : 'SISKO')
  const primaryRole = ['guru', 'petugas_piket', 'sekretaris_kelas', 'wali_kelas', 'admin'].find((role) => roles.includes(role)) || 'guru'
  const preferredLinks = mobileOrder[primaryRole] || mobileOrder.guru
  const mobileLinks = preferredLinks.map((path) => visibleLinks.find((link) => link.path === path)).filter((link) => link !== undefined)
  const guarded = (allowed: string[], page: ReactNode) => <RoleGuard user={user} allowed={allowed}>{page}</RoleGuard>

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Always clear the client session, including when the server session has expired.
    } finally {
      queryClient.clear()
      onLogout()
      navigate('/login')
    }
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <img className="brand-mark" src="/logo-mark.png" alt="SISKO" />
          <div className="sidebar-brand-copy"><strong>SISKO</strong><small>Administrasi Sekolah</small></div>
          <button className="icon-button mobile-close" onClick={() => setMenuOpen(false)} aria-label="Tutup menu"><X size={19} /></button>
        </div>

        <nav className="sidebar-navigation" aria-label="Navigasi utama">
          {visibleGroups.map((group) => (
            <div className="nav-group" key={group.title}>
              <span className="nav-heading">{group.title}</span>
              {group.links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <link.icon size={18} strokeWidth={1.8} /><span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          {profileOpen && (
            <div className="profile-menu">
              <button onClick={() => { navigate('/profile'); setProfileOpen(false) }}>Profil saya</button>
              <button onClick={logout}>Keluar dari SISKO</button>
            </div>
          )}
          <button className="user-card" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen}>
            <span className="avatar">{user.name.slice(0, 1).toUpperCase()}</span>
            <span className="user-copy"><strong>{user.name}</strong><small>{user.roles.join(' · ')}</small></span>
            <ChevronDown size={16} />
          </button>
        </div>
      </aside>

      {menuOpen && <button className="scrim" onClick={() => setMenuOpen(false)} aria-label="Tutup navigasi" />}

      <section className="main-area">
        <header className="topbar">
          <button className="icon-button menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Buka menu"><Menu size={21} /></button>
          <div className="crumb"><span className="crumb-root">Ruang kerja</span><span className="crumb-sep">/</span><strong>{title}</strong></div>
          <div className="top-actions">
            <span className="today">{new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}</span>
            <NavLink to="/notifications" className="icon-button notification-trigger" aria-label="Notifikasi"><Bell size={19} /></NavLink>
            <button className="top-avatar" onClick={() => navigate('/profile')} aria-label={`Buka profil ${user.name}`}>{user.name.slice(0, 1).toUpperCase()}</button>
          </div>
        </header>

        <main className="page-content">
          <Routes>
            <Route path="/" element={guarded(['admin', 'wali_kelas', 'guru', 'petugas_piket', 'sekretaris_kelas'], <DashboardPage user={user} />)} />
            <Route path="/master-data/students" element={guarded(['admin', 'petugas_piket', 'wali_kelas', 'sekretaris_kelas', 'guru'], <StudentsPage user={user} />)} />
            <Route path="/master-data/teachers" element={guarded(['admin', 'guru'], <TeachersPage user={user} />)} />
            <Route path="/master-data/classes" element={guarded(['admin', 'petugas_piket', 'wali_kelas', 'sekretaris_kelas', 'guru'], <ClassesPage user={user} />)} />
            <Route path="/master-data/:resource" element={guarded(['admin'], <MasterDataResource resource={activeResource} user={user} />)} />
            <Route path="/permissions" element={guarded(['admin', 'petugas_piket', 'wali_kelas', 'sekretaris_kelas'], <PermissionsPage user={user} />)} />
            <Route path="/schedules" element={guarded(['admin', 'guru', 'wali_kelas', 'sekretaris_kelas'], <SchedulesPage user={user} />)} />
            <Route path="/teaching-sessions" element={guarded(['admin', 'guru', 'wali_kelas'], <TeachingSessionsPage user={user} />)} />
            <Route path="/teaching-journals" element={guarded(['admin', 'guru', 'wali_kelas'], <TeachingJournalsPage user={user} />)} />
            <Route path="/assignments" element={guarded(['admin', 'guru', 'wali_kelas', 'sekretaris_kelas'], <AssignmentsPage user={user} />)} />
            <Route path="/violations" element={guarded(['admin', 'petugas_piket', 'wali_kelas'], <ViolationsPage user={user} />)} />
            <Route path="/reports" element={guarded(['admin', 'wali_kelas', 'guru', 'sekretaris_kelas'], <ReportsPage user={user} />)} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={guarded(['admin', 'wali_kelas', 'guru', 'petugas_piket', 'sekretaris_kelas'], <ProfilePage user={user} />)} />
            <Route path="*" element={<div className="empty-state"><div className="empty-icon"><Search /></div><h3>Halaman tidak ditemukan</h3><p>Alamat yang Anda buka tidak tersedia.</p></div>} />
          </Routes>
        </main>
      </section>

      <nav className="mobile-nav" aria-label="Navigasi cepat">
        {mobileLinks.map((link) => (
          <NavLink key={link.path} to={link.path} end={link.path === '/'} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
            <link.icon size={20} strokeWidth={1.8} /><span>{link.label}</span>
          </NavLink>
        ))}
        <button className={`mobile-nav-link ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(true)}>
          <Menu size={20} strokeWidth={1.8} /><span>Lainnya</span>
        </button>
      </nav>
    </div>
  )
}
