import { MasterDataResource } from '../master-data/MasterDataResource'
import type { User } from '../../types/api'

export function ClassesPage({ user }: { user: User }) {
  return <MasterDataResource resource="classes" user={user} />
}
