import React from "react";
export default function SelectionPanel() {
  return (
    <div>
      <div style={{ fontWeight:600, marginBottom:8 }}>التحديد</div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <button>قص</button><button>نسخ</button><button>لصق</button><button>حذف</button>
        <button>تجميع</button><button>فك التجميع</button>
        <button>قفل</button><button>إلغاء قفل</button>
        <button>عكس أفقي</button><button>عكس عمودي</button>
        <button>محاذاة يمين</button><button>محاذاة يسار</button><button>محاذاة وسط</button>
      </div>
    </div>
  );
}
