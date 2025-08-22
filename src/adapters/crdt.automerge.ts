import * as A from "@automerge/automerge";

export type Doc = A.Doc<{ frames:any[]; widgets:any[]; connectors:any[] }>;

export function createAutoDoc(){
  let doc: Doc = A.from({ frames:[], widgets:[], connectors:[] });
  return doc;
}

export function applySnapshotAuto(doc: Doc, snap:{frames:any[];widgets:any[];connectors:any[]}) {
  return A.change(doc, (d: any) => {
    d.frames = snap.frames; d.widgets = snap.widgets; d.connectors = snap.connectors;
  });
}
