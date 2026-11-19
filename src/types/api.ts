export type User = { id: string | number; name: string; email: string; roles: string[]; permissions?: string[] }
export type PageInfo = { current_page?: number; last_page?: number; total?: number }
export type Envelope<T> = { success: boolean; message?: string; data: T; meta?: PageInfo }
