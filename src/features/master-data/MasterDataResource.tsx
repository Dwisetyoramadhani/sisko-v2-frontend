import { GenericListPage } from '../operations/GenericListPage'
import type { User } from '../../types/api'

const resourceNames: Record<string, string> = {
  students: 'Siswa',
  teachers: 'Guru',
  classes: 'Kelas',
  subjects: 'Mata pelajaran',
  'academic-years': 'Tahun ajaran',
  holidays: 'Hari libur',
  'violation-categories': 'Kategori pelanggaran',
}

export function MasterDataResource({ resource, user }: { resource: string; user: User }) {
  const title = resourceNames[resource] || 'Data sekolah'
  const isAdmin = user.roles.some((role) => role.toLowerCase() === 'admin')

  return (
    <GenericListPage
      title={title}
      description={`Kelola dan telusuri data ${title.toLowerCase()} sesuai akses Anda.`}
      endpoint={`/master-data/${resource}`}
      user={user}
      admin={isAdmin}
    />
  )
}
