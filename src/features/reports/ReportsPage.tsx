import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download, FileBarChart2 } from 'lucide-react'

import { DataTable } from '../../components/tables/DataTable'
import { PageHeader } from '../../components/shared/PageHeader'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { formatValue, humanize } from '../../lib/format'
import { api, errorMessage } from '../../services/api'
import type { User } from '../../types/api'

type ReportRow = Record<string, unknown>

const reportTypes = [
  { value: 'daily-attendance', label: 'Kehadiran harian' },
  { value: 'monthly-attendance', label: 'Kehadiran bulanan' },
  { value: 'semester-attendance', label: 'Kehadiran semester' },
  { value: 'teacher-attendance', label: 'Kehadiran guru' },
]

export function ReportsPage({ user }: { user: User }) {
  const roles = user.roles.map((role) => role.toLowerCase().replaceAll(' ', '_'))
  const canSeeDaily = roles.some((role) => ['admin', 'wali_kelas', 'sekretaris_kelas'].includes(role))
  const canSeeTeacher = roles.some((role) => ['admin', 'guru'].includes(role))
  const availableTypes = reportTypes.filter((type) => type.value === 'teacher-attendance' ? canSeeTeacher : canSeeDaily)
  const defaultKind = canSeeDaily ? 'daily-attendance' : 'teacher-attendance'
  const [from, setFrom] = useState(new Date().toISOString().slice(0, 10))
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10))
  const [kind, setKind] = useState(defaultKind)
  const query = useQuery({
    queryKey: ['reports', kind, from, to],
    queryFn: async () => (await api.get(`/reports/${kind}`, { params: { from, to } })).data,
  })

  const rows = useMemo(() => {
    const payload = query.data?.data as unknown
    if (Array.isArray(payload)) return payload as ReportRow[]
    if (payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)) {
      return (payload as { data: ReportRow[] }).data
    }
    return []
  }, [query.data])
  const columns = useMemo(() => {
    const keys = rows[0] ? Object.keys(rows[0]).filter((key) => key !== 'id') : []
    return keys.map((key) => ({
      key,
      label: humanize(key),
      render: (row: ReportRow) => key === 'status'
        ? <StatusBadge value={String(row[key] ?? '—')} />
        : formatValue(row[key]),
    }))
  }, [rows])
  const total = rows.reduce((sum, row) => sum + (Number(row.total) || 1), 0)
  const downloadCsv = () => {
    window.location.href = `${api.defaults.baseURL}/reports/${kind}?from=${from}&to=${to}&export=csv`
  }

  return (
    <>
      <PageHeader title="Laporan sekolah" description="Tinjau rekap kehadiran sesuai rentang tanggal." />

      <section className="panel report-panel">
        <div className="report-filters">
          <label>Jenis laporan
            <select value={kind} onChange={(event) => setKind(event.target.value)}>
              {availableTypes.map((type) => <option value={type.value} key={type.value}>{type.label}</option>)}
            </select>
          </label>
          <label>Dari tanggal<input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></label>
          <label>Sampai tanggal<input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></label>
          {kind !== 'teacher-attendance' && <button className="secondary-button" onClick={downloadCsv}><Download size={16} />Unduh CSV</button>}
        </div>

        {query.isLoading ? (
          <div className="loading-lines"><i /><i /><i /></div>
        ) : query.isError ? (
          <div className="error-state"><div className="empty-icon"><FileBarChart2 /></div><h3>Laporan tidak dapat dimuat</h3><p>{errorMessage(query.error)}</p><button className="secondary-button" onClick={() => query.refetch()}>Coba lagi</button></div>
        ) : rows.length === 0 ? (
          <div className="empty-state"><div className="empty-icon"><FileBarChart2 /></div><h3>Belum ada data pada rentang ini</h3><p>Ubah tanggal atau pilih jenis laporan lain.</p></div>
        ) : (
          <div className="report-results">
            <div className="report-summary">
              <div className="report-summary-card"><span>Periode laporan</span><strong>{from === to ? from : `${from} – ${to}`}</strong></div>
              <div className="report-summary-card"><span>{kind === 'teacher-attendance' ? 'Catatan guru' : 'Total kehadiran'}</span><strong>{total.toLocaleString('id-ID')}</strong></div>
              <div className="report-summary-card"><span>Baris laporan</span><strong>{rows.length.toLocaleString('id-ID')}</strong></div>
            </div>
            <div className="panel table-panel report-table"><DataTable columns={columns} rows={rows} rowKey={(row, index) => String(row.id ?? `${row.date ?? row.session_date ?? 'row'}-${index}`)} /></div>
          </div>
        )}
      </section>
    </>
  )
}
