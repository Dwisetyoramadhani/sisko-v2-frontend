import type React from 'react'

export function PageHeader({title,description,action}:{title:string;description:string;action?:React.ReactNode}){return <div className="page-heading"><div><div className="eyebrow">SISKO / SEKOLAH</div><h1>{title}</h1><p>{description}</p></div>{action}</div>}
