import React from "react";
export default function CommentPanel() {
  return (
    <div>
      <div style={{ fontWeight:600, marginBottom:8 }}>التعليقات</div>
      <div style={{ marginBottom:8 }}>
        <div style={{ fontSize:12, opacity:0.7, marginBottom:4 }}>تعليق نصي</div>
        <textarea placeholder="اكتب تعليقك" style={{ width:"100%", minHeight:80, padding:8, border:"1px solid #e5e7eb", borderRadius:8 }} />
        <div style={{ display:"flex", gap:8, marginTop:8 }}>
          <button>إضافة</button><button>تثبيت</button><button>إلغاء</button>
        </div>
      </div>
      <div>
        <div style={{ fontSize:12, opacity:0.7, marginBottom:4 }}>رسم توضيحي</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <button>قلم</button><button>دائرة</button><button>مربع</button><button>سهم</button><button>مسح الكل</button>
        </div>
      </div>
    </div>
  );
}
