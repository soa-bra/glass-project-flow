import React from "react";
export default function TextPanel() {
  return (
    <div>
      <div style={{ fontWeight:600, marginBottom:8 }}>النص</div>
      <div style={{ display:"grid", gridTemplateColumns:"140px 1fr", gap:8, alignItems:"center" }}>
        <label>نوع النص</label>
        <select>
          <option>نص</option>
          <option>مربع نص</option>
          <option>نص إلى مكون</option>
        </select>

        <label>الخط</label>
        <select>
          <option>Inter</option>
          <option>Cairo</option>
          <option>Tajawal</option>
        </select>

        <label>الوزن</label>
        <select>
          <option>عادي</option>
          <option>عريض</option>
          <option>دقيق</option>
        </select>

        <label>الحجم</label>
        <input type="number" defaultValue={16} />

        <label>المحاذاة</label>
        <div>
          <button>يمين</button><button>وسط</button><button>يسار</button>
        </div>

        <label>لون النص</label>
        <input type="color" defaultValue="#111827" />

        <label>تنسيقات</label>
        <div>
          <button>عريض</button><button>مائل</button><button>تحته خط</button>
        </div>
      </div>
    </div>
  );
}
