import React, { useState, useLayoutEffect, useRef } from 'react'
...
const DepartmentsSidebar: React.FC<Props> = ({ isOpen, toggleMain, departmentsData }) => {
  const [deptCollapsed, setDeptCollapsed] = useState(false)
  const [notchTop, setNotchTop] = useState<number>(0)
  const itemsRef = useRef<Array<HTMLDivElement | null>>([])

  // احسب موقع العنصر النشط بعد كل رندر
  useLayoutEffect(() => {
    const activeIdx = departmentsData.findIndex(d => d.active)
    const el = itemsRef.current[activeIdx]
    if (el) {
      const sidebarRect = el.parentElement?.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      setNotchTop(elRect.top - (sidebarRect?.top ?? 0) + elRect.height / 2)
    }
  }, [departmentsData, deptCollapsed])

  const toggleDeptSidebar = () => setDeptCollapsed(prev => !prev)

  return (
    <aside className={`sidebar departments-sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      {/* أزرار الطي */}
      ...
      {/* القائمة */}
      <div className="flex flex-col">
        {departmentsData.map((dept, idx) => (
          <div
            key={dept.id}
            ref={el => (itemsRef.current[idx] = el)}
            className={`sidebar-item relative overflow-visible ${dept.active ? 'active' : ''}`}
          >
            {/* الأيقونة والنص */}
          </div>
        ))}
      </div>

      {/* اللوحة */}
      <DepartmentPanel
        data={departmentsData}
        collapsed={deptCollapsed}
        notchTop={notchTop}
      />
    </aside>
  )
}
