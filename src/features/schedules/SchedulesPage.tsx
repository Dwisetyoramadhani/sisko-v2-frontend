import { GenericListPage } from '../operations/GenericListPage'
import type { User } from '../../types/api'

export function SchedulesPage({ user }: { user: User }) {
  return <GenericListPage title="Jadwal pembelajaran" endpoint="/schedules" user={user} />
}
