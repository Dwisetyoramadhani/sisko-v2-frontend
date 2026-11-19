import { GenericListPage } from '../operations/GenericListPage'
import type { User } from '../../types/api'

export function TeachingSessionsPage({ user }: { user: User }) {
  return <GenericListPage title="Sesi mengajar" endpoint="/teaching-sessions" user={user} />
}
