import { GenericListPage } from '../operations/GenericListPage'
import type { User } from '../../types/api'

export function PermissionsPage({ user }: { user: User }) {
  return <GenericListPage title="Pengajuan izin" endpoint="/permissions" user={user} />
}
