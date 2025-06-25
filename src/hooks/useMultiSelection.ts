
import { useState } from 'react';

export const useMultiSelection = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  const toggleSelection = (itemId: string, columnType: string) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setActiveColumn(columnType);
      setSelectedItems([itemId]);
    } else {
      setSelectedItems(prev => {
        if (prev.includes(itemId)) {
          const newSelection = prev.filter(id => id !== itemId);
          if (newSelection.length === 0) {
            setIsSelectionMode(false);
            setActiveColumn(null);
          }
          return newSelection;
        } else {
          return [...prev, itemId];
        }
      });
    }
  };

  const clearSelection = () => {
    setSelectedItems([]);
    setIsSelectionMode(false);
    setActiveColumn(null);
  };

  const isSelected = (itemId: string) => selectedItems.includes(itemId);

  const bulkDelete = () => {
    console.log('حذف العناصر المحددة:', selectedItems);
    // منطق الحذف هنا
    clearSelection();
  };

  const bulkArchive = () => {
    console.log('أرشفة العناصر المحددة:', selectedItems);
    // منطق الأرشفة هنا
    clearSelection();
  };

  return {
    selectedItems,
    isSelectionMode,
    activeColumn,
    toggleSelection,
    clearSelection,
    isSelected,
    bulkDelete,
    bulkArchive
  };
};
