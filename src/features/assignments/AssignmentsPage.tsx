import { GenericListPage } from '../operations/GenericListPage'
import type { User } from '../../types/api'

export function AssignmentsPage({ user }: { user: User }) {
  return <GenericListPage title="Tugas pengganti" endpoint="/assignments" user={user} />
}
