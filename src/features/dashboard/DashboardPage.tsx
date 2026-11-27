import { useQueries } from '@tanstack/react-query'
import { Activity, BookOpen, CalendarDays, ClipboardCheck, FileBarChart2, GraduationCap, ShieldAlert, Users } from 'lucide-react'
import { PageHeader } from '../../components/shared/PageHeader'
import { api, errorMessage } from '../../services/api'
import type { User } from '../../types/api'

type Metric = { label: string; endpoint: string; icon: typeof Activity; roles: string[] }
const allRoles = ['admin', 'petugas_piket', 'guru', 'wali_kelas', 'sekretaris_kelas']
const metrics: Metric[] = [
  { label: 'Siswa', endpoint: '/master-data/students', icon: GraduationCap, roles: allRoles },
  { label: 'Guru', endpoint: '/master-data/teachers', icon: Users, roles: ['admin', 'guru'] },
  { label: 'Kelas', endpoint: '/master-data/classes', icon: BookOpen, roles: allRoles },
  { label: 'Pengajuan izin', endpoint: '/permissions', icon: ClipboardCheck, roles: ['admin', 'petugas_piket', 'wali_kelas', 'sekretaris_kelas'] },
  { label: 'Sesi mengajar', endpoint: '/teaching-sessions', icon: CalendarDays, roles: ['admin', 'guru', 'wali_kelas'] },
  { label: 'Pelanggaran', endpoint: '/violations', icon: ShieldAlert, roles: ['admin', 'petugas_piket', 'wali_kelas'] },
  { label: 'Laporan kehadiran', endpoint: '/reports/daily-attendance', icon: FileBarChart2, roles: ['admin', 'wali_kelas', 'sekretaris_kelas'] },
  { label: 'Jurnal mengajar', endpoint: '/teaching-journals', icon: BookOpen, roles: ['guru'] },
  { label: 'Tugas pengganti', endpoint: '/assignments', icon: Activity, roles: ['guru', 'wali_kelas', 'sekretaris_kelas'] },
  { label: 'Kehadiran guru', endpoint: '/reports/teacher-attendance', icon: Activity, roles: ['guru'] },
]

function rowsCount(payload: unknown): number {
  if (Array.isArray(payload)) return payload.length
  if (!payload || typeof payload !== 'object') return 0
  const record = payload as { data?: unknown; meta?: { total?: number }; total?: number }
  if (typeof record.meta?.total === 'number') return record.meta.total
  if (typeof record.total === 'number') return record.total
  if (Array.isArray(record.data)) return record.data.length
  return record.data && typeof record.data === 'object' ? 1 : 0
}

export function DashboardPage({ user }: { user: User }) {
  const roles = user.roles.map((role) => role.toLowerCase().replaceAll(' ', '_'))
  const available = metrics.filter((metric) => metric.roles.some((role) => roles.includes(role)))
  const results = useQueries({ queries: available.map((metric) => ({
    queryKey: ['dashboard', metric.endpoint],
    queryFn: async () => (await api.get(metric.endpoint, metric.endpoint.startsWith('/reports/') ? { params: { from: new Date().toISOString().slice(0, 10), to: new Date().toISOString().slice(0, 10) } } : undefined)).data,
    retry: false,
  })) })
  const failed = results.some((result) => result.isError)
  const shown = available.map((metric, index) => ({ metric, result: results[index] })).filter(({ result }) => result.isSuccess)

  return <>
    <PageHeader title={`Selamat pagi, ${user.name.split(' ')[0]}`} description="Ringkasan informasi yang tersedia untuk peran Anda." />
    {failed && <div className="alert error" role="status">Sebagian ringkasan belum dapat dimuat. {results.find((result) => result.isError)?.error ? errorMessage(results.find((result) => result.isError)?.error) : ''}</div>}
    {shown.length > 0 ? <section className="stats-grid" aria-label="Ringkasan data">
      {shown.map(({ metric, result }) => <article className="stat-card" key={metric.endpoint}>
        <div className="stat-icon"><metric.icon size={19} /></div><span>{metric.label}</span>
        <strong>{rowsCount(result.data).toLocaleString('id-ID')}</strong>
      </article>)}
    </section> : results.some((result) => result.isLoading) ? <div className="loading-lines"><i /><i /><i /></div> : !failed ? <div className="empty-state"><div className="empty-icon"><Activity /></div><h3>Belum ada ringkasan</h3><p>Data ringkasan belum tersedia untuk peran Anda.</p></div> : null}
  </>
}
