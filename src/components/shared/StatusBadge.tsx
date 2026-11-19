import { humanize } from '../../lib/format'

export function StatusBadge({value}:{value:string}){const normalized=value.toLowerCase();const kind=['approved','present','distributed','active','aktif'].includes(normalized)?'good':['pending','late'].includes(normalized)?'warn':['rejected','absent','cancelled'].includes(normalized)?'bad':'neutral';return <span className={`status ${kind}`}>{humanize(value)}</span>}
