import React, { useState } from "react";
type Cell = string|number;
type Props = { rows?:number; cols?:number; initial?:Cell[][]; onChange?:(cells:Cell[][])=>void };

export function InteractiveSheet({ rows=6, cols=6, initial, onChange }:Props){
  const [cells, setCells] = useState<Cell[][]>(()=> initial ?? Array.from({length:rows},()=>Array.from({length:cols},()=> "")));
  function set(r:number,c:number,v:Cell){
    const next = cells.map((row,ri)=> row.map((cv,ci)=> ri===r&&ci===c ? v : cv ));
    setCells(next); onChange?.(next);
  }
  return (
    <div className="inline-block border rounded-xl bg-white overflow-hidden">
      <table className="border-collapse">
        <tbody>
        {cells.map((row,ri)=>(
          <tr key={ri}>
            {row.map((cv,ci)=>(
              <td key={ci} className="border border-slate-200">
                <input className="px-2 py-1 w-28 outline-none" value={cv as any}
                  onChange={e=>set(ri,ci,e.target.value)} />
              </td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
