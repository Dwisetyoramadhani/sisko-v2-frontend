import type { User } from '../../types/api'
import { PageHeader } from '../../components/shared/PageHeader'

export function ProfilePage({user}:{user:User}){return <><PageHeader title="Profil saya" description="Informasi akun yang digunakan untuk mengakses SISKO."/><section className="panel profile-panel"><div className="profile-avatar">{user.name.slice(0,1).toUpperCase()}</div><div><h2>{user.name}</h2><p>{user.email}</p><div className="role-chips">{user.roles.map(role=><span key={role}>{role}</span>)}</div></div></section><div className="alert info">Perubahan profil dan kata sandi belum tersedia karena backend belum menyediakan endpoint tersebut.</div></>}
