import { MasterDataResource } from '../master-data/MasterDataResource'
import type { User } from '../../types/api'

export function StudentsPage({ user }: { user: User }) {
  return <MasterDataResource resource="students" user={user} />
}
