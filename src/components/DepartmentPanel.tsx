interface Props {
  data: Dept[]
  collapsed: boolean
  notchTop: number
}

const DepartmentPanel: React.FC<Props> = ({ data, collapsed, notchTop }) => (
  <div
    className={`departments-panel relative overflow-visible ${collapsed ? 'collapsed' : ''}`}
    style={{ '--notch-top': `${notchTop}px` } as React.CSSProperties}
  >
    {/* محتوى اللوحة */}
  </div>
)
