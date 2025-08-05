import React, { useRef, useState } from "react";
export default function FileUploadPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<{ name: string; url?: string }[]>([]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const list = Array.from(e.dataTransfer.files).map(f => ({ name: f.name }));
    setFiles(prev => [...prev, ...list]);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || []).map(f => ({ name: f.name }));
    setFiles(prev => [...prev, ...list]);
  };

  return (
    <div onDragOver={(e)=>e.preventDefault()} onDrop={onDrop}>
      <div style={{ fontWeight:600, marginBottom:8 }}>رفع المرفقات</div>
      <div style={{ border:"2px dashed #cbd5e1", padding:16, borderRadius:12, marginBottom:8, textAlign:"center" }}>
        اسحب الملفات هنا
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:8 }}>
        <button onClick={()=>inputRef.current?.click()}>اختر ملف</button>
        <input ref={inputRef} type="file" multiple style={{ display:"none" }} onChange={onChange} />
      </div>
      <div>
        {files.map((f,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0", borderBottom:"1px solid #e5e7eb" }}>
            <span style={{ flex:1 }}>{f.name}</span>
            <button>حذف</button>
            <button>إدراج</button>
            <button>إدراج ذكي</button>
          </div>
        ))}
      </div>
    </div>
  );
}
