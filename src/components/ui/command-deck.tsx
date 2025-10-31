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
import { Copy, Trash, Edit2, User, FolderPlus, Tag } from "lucide-react";

export default function CommandDeck() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="grid h-[180px] w-[360px] place-items-center rounded-xl border-2 border-dashed border-[hsl(var(--border))] p-4 text-center text-sm text-[hsl(var(--ink-60))] hover:bg-[hsl(var(--panel))] cursor-pointer transition-all">
        انقر بزر الماوس الأيمن هنا لإجراءات المشروع المتقدمة
      </ContextMenuTrigger>

      <ContextMenuContent className="w-64">
        {/* File / Item Actions */}
        <div className="border-b border-[hsl(var(--border))] mb-1">
          <ContextMenuItem>
            <Edit2 className="mr-2 h-4 w-4 text-[hsl(var(--ink-60))]" /> إعادة تسمية
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <Trash className="mr-2 h-4 w-4 text-[hsl(var(--accent-red))]" /> حذف
            <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <Copy className="mr-2 h-4 w-4 text-[hsl(var(--ink-60))]" /> نسخ الرابط
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
        </div>

        {/* Project Submenu */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <FolderPlus className="mr-2 h-4 w-4 text-[hsl(var(--ink-60))]" /> نقل إلى مشروع
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-52">
            <ContextMenuItem>التسويق</ContextMenuItem>
            <ContextMenuItem>التطوير</ContextMenuItem>
            <ContextMenuItem>التصميم</ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger>إنشاء مشروع جديد</ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-44">
                <ContextMenuItem>مشروع داخلي</ContextMenuItem>
                <ContextMenuItem>مشروع عميل</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuSubContent>
        </ContextMenuSub>

        {/* Assignment Submenu */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <User className="mr-2 h-4 w-4 text-[hsl(var(--ink-60))]" /> تعيين إلى
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>أليس</ContextMenuItem>
            <ContextMenuItem>بوب</ContextMenuItem>
            <ContextMenuItem>تشارلي</ContextMenuItem>
            <ContextMenuItem>قائد الفريق</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        {/* Tagging / Metadata */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Tag className="mr-2 h-4 w-4 text-[hsl(var(--ink-60))]" /> إضافة وسوم
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>عاجل</ContextMenuItem>
            <ContextMenuItem>أولوية عالية</ContextMenuItem>
            <ContextMenuItem>أولوية منخفضة</ContextMenuItem>
            <ContextMenuItem>إنشاء وسم جديد</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        {/* Other Quick Actions */}
        <div className="border-t border-[hsl(var(--border))] mt-1">
          <ContextMenuItem>تكرار</ContextMenuItem>
          <ContextMenuItem>مشاركة</ContextMenuItem>
          <ContextMenuItem>عرض السجل</ContextMenuItem>
        </div>
      </ContextMenuContent>
    </ContextMenu>
  );
}
