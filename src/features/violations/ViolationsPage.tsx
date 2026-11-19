import { GenericListPage } from '../operations/GenericListPage'
import type { User } from '../../types/api'

export function ViolationsPage({ user }: { user: User }) {
  return <GenericListPage title="Pelanggaran siswa" endpoint="/violations" user={user} />
}
