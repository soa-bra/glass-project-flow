/**
 * ImageActions - أزرار الصور
 */

import React from "react";
import { Crop, Replace, Link } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ToolbarButton } from "../components";

interface ImageActionsProps {
  imageName: string;
  onImageRename: (name: string) => void;
  onCrop: () => void;
  onReplaceImage: () => void;
  onAddLink: () => void;
}

export const ImageActions: React.FC<ImageActionsProps> = ({
  imageName,
  onImageRename,
  onCrop,
  onReplaceImage,
  onAddLink,
}) => {
  return (
    <>
      <Input
        value={imageName}
        onChange={(e) => onImageRename(e.target.value)}
        className="h-8 w-[120px] text-xs"
        placeholder="اسم الصورة"
      />

      <Separator orientation="vertical" className="h-6 mx-1" />

      <ToolbarButton icon={<Crop size={16} />} onClick={onCrop} title="كروب" />
      <ToolbarButton icon={<Replace size={16} />} onClick={onReplaceImage} title="تبديل الصورة" />
      <ToolbarButton icon={<Link size={16} />} onClick={onAddLink} title="إضافة رابط" />

      <Separator orientation="vertical" className="h-6 mx-1" />
    </>
  );
};
