// src/components/DepartmentsSidebar.tsx
import React, { useState, useLayoutEffect, useRef } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import DepartmentPanel from './DepartmentPanel'

interface Dept {
  id: string
  name: string
  active: boolean
}

interface Props {
  isOpen: boolean
  toggleMain: () => void
  departmentsData: Dept[]
}

const DepartmentsSidebar: React.FC<Props> = ({
  isOpen,
  toggleMain,
  departmentsData,
}) => {
  /* 1) حالة طي لوحة الإدارات */
  const [deptCollapsed, setDeptCollapsed] = useState(false)
  const toggleDeptSidebar = () => setDeptCollapsed(prev => !prev)

  /* 2) نحسب مكان اللسان ديناميكيّاً */
  const [notchTop, setNotchTop] = useState<number>(0)
  const itemsRef = useRef<Array<HTMLDivElement | null>>([])

  useLayoutEffect(() => {
    const activeIdx = departmentsData.findIndex(d => d.active)
    const el = itemsRef.current[activeIdx]
    if (el && el.parentElement) {
      const sidebarRect = el.parentElement.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      setNotchTop(elRect.top - sidebarRect.top + elRect.height / 2)
    }
  }, [departmentsData, deptCollapsed])

  return (
    <aside
      className={`sidebar departments-sidebar ${
        isOpen ? 'open' : 'collapsed'
      }`}
    >
      {/* رأس الشريط وأزرار الطي */}
      <div className="sidebar-header flex items-center p-2">
        <button onClick={toggleMain} className="arrow-btn">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button onClick={toggleDeptSidebar} className="arrow-btn ml-2">
          {deptCollapsed ? (
            <ChevronRightIcon className="w-6 h-6" />
          ) : (
            <ChevronLeftIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* قائمة الإدارات */}
      <div className="flex flex-col gap-2 px-2">
        {departmentsData.map((dept, idx) => (
          <div
            key={dept.id}
            ref={el => (itemsRef.current[idx] = el)}
            className={`sidebar-item relative overflow-visible ${
              dept.active ? 'active' : ''
            }`}
          >
            {/* أيقونة + اسم (عدِّل حسب الحاجة) */}
            <span className="w-full h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition">
              {dept.name}
            </span>
          </div>
        ))}
      </div>

      {/* لوحة التفاصيل مع تمرير notchTop */}
      <DepartmentPanel
        data={departmentsData}
        collapsed={deptCollapsed}
        notchTop={notchTop}
      />
    </aside>
  )
}

export default DepartmentsSidebar
