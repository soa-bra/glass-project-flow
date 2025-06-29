// src/components/DepartmentPanel.tsx
import React from 'react'

interface Dept {
  id: string
  name: string
  active: boolean
}

interface Props {
  data: Dept[]
  collapsed: boolean
  notchTop: number
}

const DepartmentPanel: React.FC<Props> = ({ data, collapsed, notchTop }) => (
  <div
    className={`departments-panel relative overflow-visible ${
      collapsed ? 'collapsed' : ''
    }`}
    style={{ '--notch-top': `${notchTop}px` } as React.CSSProperties}
  >
    {data.map(dept => (
      <div key={dept.id} className="department-item p-3">
        {dept.name}
      </div>
    ))}
  </div>
)

export default DepartmentPanel
