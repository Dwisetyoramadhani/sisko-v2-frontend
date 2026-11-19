import { GenericListPage } from '../operations/GenericListPage'
import type { User } from '../../types/api'

export function TeachingJournalsPage({ user }: { user: User }) {
  return <GenericListPage title="Jurnal mengajar" endpoint="/teaching-journals" user={user} />
}
