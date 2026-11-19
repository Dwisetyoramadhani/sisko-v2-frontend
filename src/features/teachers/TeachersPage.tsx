import { MasterDataResource } from '../master-data/MasterDataResource'
import type { User } from '../../types/api'

export function TeachersPage({ user }: { user: User }) {
  return <MasterDataResource resource="teachers" user={user} />
}
