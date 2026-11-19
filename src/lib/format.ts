import type { User } from '../types/api'

export function humanize(key:string){return key.replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase())}

export function formatValue(value:unknown){if(value===null||value===undefined)return '—';if(typeof value==='object')return JSON.stringify(value);return String(value)}

export function userHasAnyRole(user:User,roles:string[]){return user.roles.some(role=>roles.includes(role.toLowerCase()))}
