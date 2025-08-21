"use client";
import React, { useRef } from "react";
import { useTools } from "@/src/features/planning/store/tools.store";
import { useCanvas } from "@/src/features/planning/hooks/useCanvas";
import { usePanels } from "@/src/features/planning/store/panels.store";

const FileUploaderTool: React.FC = () => {
  const { activeTool, setActiveTool } = useTools();
  const { insertAssetsSmart } = useCanvas();
  const { openPanel } = usePanels();
  const inputRef = useRef<HTMLInputElement>(null);

  const onPick = () => inputRef.current?.click();
  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    await insertAssetsSmart(Array.from(e.target.files));
    e.target.value = "";
  };

  return (
    <>
      <button
        aria-label="File Uploader (U)"
        onClick={() => { setActiveTool("uploader"); openPanel("file_upload_panel"); }}
        onDoubleClick={onPick}
        className={`w-10 h-10 rounded border ${activeTool==="uploader" ? "bg-blue-50 border-blue-300" : "bg-white"}`}
        title="File Uploader (double-click to pick)"
      >
        ⬆️
      </button>
      <input ref={inputRef} type="file" multiple className="hidden" onChange={onFiles} />
    </>
  );
};
export default FileUploaderTool;
