import type { ReactNode } from 'react'
import { ShieldAlert } from 'lucide-react'
import type { User } from '../../types/api'

function canAccessRole(user: User, allowed: string[]) {
  const roles = user.roles.map((role) => role.toLowerCase().replaceAll(' ', '_'))
  return allowed.some((role) => roles.includes(role))
}

export function RoleGuard({ user, allowed, children }: { user: User; allowed: string[]; children: ReactNode }) {
  if (canAccessRole(user, allowed)) return children
  return <div className="empty-state"><div className="empty-icon"><ShieldAlert /></div><h3>Halaman tidak tersedia untuk peran Anda</h3><p>Gunakan menu yang tersedia untuk membuka informasi sesuai akses akun.</p></div>
}
