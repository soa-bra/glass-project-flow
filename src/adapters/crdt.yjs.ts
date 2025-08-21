import * as Y from "yjs";

export type YDocBundle = {
  doc: Y.Doc;
  maps: {
    frames: Y.Array<any>;
    widgets: Y.Array<any>;
    connectors: Y.Array<any>;
  };
};

export function createYDoc(): YDocBundle {
  const doc = new Y.Doc();
  const maps = {
    frames: doc.getArray<any>("frames"),
    widgets: doc.getArray<any>("widgets"),
    connectors: doc.getArray<any>("connectors"),
  };
  return { doc, maps };
}

export function applySnapshotY(maps: YDocBundle["maps"], snap:{frames:any[];widgets:any[];connectors:any[]}){
  maps.frames.delete(0, maps.frames.length); maps.frames.insert(0, snap.frames);
  maps.widgets.delete(0, maps.widgets.length); maps.widgets.insert(0, snap.widgets);
  maps.connectors.delete(0, maps.connectors.length); maps.connectors.insert(0, snap.connectors);
}
