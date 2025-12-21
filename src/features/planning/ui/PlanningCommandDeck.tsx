import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import { 
  Copy, 
  Trash, 
  Edit2, 
  FolderPlus, 
  Grid3x3,
  Square,
  Circle,
  Triangle,
  FileText,
  Image,
  Sparkles,
  Download,
  Share2,
  Layers
} from "lucide-react";

interface PlanningCommandDeckProps {
  children: React.ReactNode;
  onCreateBoard?: () => void;
  onDeleteBoard?: () => void;
  onRenameBoard?: () => void;
  onDuplicateBoard?: () => void;
  onAddElement?: (type: string) => void;
  onGridSettings?: () => void;
  onExport?: () => void;
  onShare?: () => void;
}

export default function PlanningCommandDeck({
  children,
  onCreateBoard,
  onDeleteBoard,
  onRenameBoard,
  onDuplicateBoard,
  onAddElement,
  onGridSettings,
  onExport,
  onShare
}: PlanningCommandDeckProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>

      <ContextMenuContent className="w-64">
        {/* Board Actions */}
        <div className="border-b border-[hsl(var(--border))] mb-1">
          <ContextMenuItem onClick={onCreateBoard}>
            <FolderPlus className="mr-2 h-4 w-4 text-[hsl(var(--ink-60))]" /> لوحة جديدة
            <ContextMenuShortcut>⌘N</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={onRenameBoard}>
            <Edit2 className="mr-2 h-4 w-4 text-[hsl(var(--ink-60))]" /> إعادة تسمية اللوحة
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={onDuplicateBoard}>
            <Copy className="mr-2 h-4 w-4 text-[hsl(var(--ink-60))]" /> نسخ اللوحة
            <ContextMenuShortcut>⌘D</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={onDeleteBoard}>
            <Trash className="mr-2 h-4 w-4 text-[hsl(var(--accent-red))]" /> حذف اللوحة
            <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </div>

        {/* Add Elements Submenu */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Layers className="mr-2 h-4 w-4 text-[hsl(var(--ink-60))]" /> إضافة عنصر
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-52">
            <ContextMenuItem onClick={() => onAddElement?.('frame')}>
              <Square className="mr-2 h-4 w-4" /> إطار
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onAddElement?.('text')}>
              <FileText className="mr-2 h-4 w-4" /> نص
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onAddElement?.('image')}>
              <Image className="mr-2 h-4 w-4" /> صورة
            </ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger>أشكال</ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-44">
                <ContextMenuItem onClick={() => onAddElement?.('rectangle')}>
                  <Square className="mr-2 h-4 w-4" /> مستطيل
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onAddElement?.('circle')}>
                  <Circle className="mr-2 h-4 w-4" /> دائرة
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onAddElement?.('triangle')}>
                  <Triangle className="mr-2 h-4 w-4" /> مثلث
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuItem onClick={() => onAddElement?.('smart')}>
              <Sparkles className="mr-2 h-4 w-4 text-[hsl(var(--accent-yellow))]" /> عنصر ذكي
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        {/* Grid Settings Submenu */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Grid3x3 className="mr-2 h-4 w-4 text-[hsl(var(--ink-60))]" /> إعدادات الشبكة
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onClick={() => onGridSettings?.()}>
              إظهار الشبكة
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onGridSettings?.()}>
              تفعيل الالتقاط
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onGridSettings?.()}>
              نقاط
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onGridSettings?.()}>
              شبكة مربعة
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onGridSettings?.()}>
              شبكة سداسية
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        {/* Export & Share Actions */}
        <div className="border-t border-[hsl(var(--border))] mt-1">
          <ContextMenuItem onClick={onExport}>
            <Download className="mr-2 h-4 w-4 text-[hsl(var(--ink-60))]" /> تصدير
            <ContextMenuShortcut>⌘E</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={onShare}>
            <Share2 className="mr-2 h-4 w-4 text-[hsl(var(--ink-60))]" /> مشاركة
            <ContextMenuShortcut>⌘S</ContextMenuShortcut>
          </ContextMenuItem>
        </div>
      </ContextMenuContent>
    </ContextMenu>
  );
}
