
import React, { useState, useRef, useEffect } from 'react';

interface TaskCardStatusIndicatorsProps {
  status: string;
  statusColor: string;
  date: string;
  assignee: string;
  members: string;
}

const TaskCardStatusIndicators = ({
  status,
  statusColor,
  date,
  assignee,
  members
}: TaskCardStatusIndicatorsProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pillStyle = {
    backgroundColor: '#F7FFFF',
    borderRadius: '15px',
    padding: '3px 8px',
    fontSize: '10px',
    fontWeight: 500,
    color: '#858789',
    fontFamily: 'IBM Plex Sans Arabic'
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    console.log('تعديل المهمة');
    setShowDropdown(false);
  };

  const handleArchive = () => {
    console.log('أرشفة المهمة');
    setShowDropdown(false);
  };

  const handleDelete = () => {
    console.log('حذف المهمة');
    setShowDropdown(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '6px',
      flexWrap: 'wrap',
      marginTop: '8px'
    }}>
      <div style={{
        ...pillStyle,
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: statusColor
        }}></div>
        {status}
      </div>

      <div style={pillStyle}>{date}</div>
      <div style={pillStyle}>{assignee}</div>
      <div style={pillStyle}>{members}</div>
      
      {/* الكبسولة الدائرية بثلاث نقاط مع القائمة المنسدلة */}
      <div 
        ref={dropdownRef}
        style={{ position: 'relative', display: 'inline-block' }}
      >
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: '#F7FFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            fontSize: '10px',
            fontWeight: 500,
            color: '#858789',
            fontFamily: 'IBM Plex Sans Arabic'
          }}
        >
          <div style={{
            display: 'flex',
            gap: '2px',
            alignItems: 'center'
          }}>
            <div style={{
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              backgroundColor: '#858789'
            }}></div>
            <div style={{
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              backgroundColor: '#858789'
            }}></div>
            <div style={{
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              backgroundColor: '#858789'
            }}></div>
          </div>
        </button>

        {showDropdown && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            marginTop: '4px',
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            minWidth: '120px',
            overflow: 'hidden'
          }}>
            <button
              onClick={handleEdit}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                background: 'white',
                textAlign: 'right',
                cursor: 'pointer',
                fontSize: '12px',
                fontFamily: 'IBM Plex Sans Arabic',
                color: '#333',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              تعديل
            </button>
            <button
              onClick={handleArchive}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                background: 'white',
                textAlign: 'right',
                cursor: 'pointer',
                fontSize: '12px',
                fontFamily: 'IBM Plex Sans Arabic',
                color: '#333',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              أرشفة
            </button>
            <button
              onClick={handleDelete}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                background: 'white',
                textAlign: 'right',
                cursor: 'pointer',
                fontSize: '12px',
                fontFamily: 'IBM Plex Sans Arabic',
                color: '#d32f2f',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              حذف
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCardStatusIndicators;
