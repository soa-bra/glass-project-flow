import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Table, Download, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CellData {
  value: string;
  formula?: string;
  format?: 'text' | 'number' | 'currency' | 'percentage';
  align?: 'right' | 'center' | 'left';
  bold?: boolean;
  backgroundColor?: string;
}

interface InteractiveSheetData {
  cells: Record<string, CellData>;
  columns: number;
  rows: number;
  columnWidths?: Record<number, number>;
}

interface InteractiveSheetProps {
  data: InteractiveSheetData;
  onUpdate: (data: Partial<InteractiveSheetData>) => void;
}

const getColumnLabel = (index: number): string => {
  let label = '';
  while (index >= 0) {
    label = String.fromCharCode(65 + (index % 26)) + label;
    index = Math.floor(index / 26) - 1;
  }
  return label;
};

const getCellId = (row: number, col: number): string => `${getColumnLabel(col)}${row + 1}`;

const parseCellRef = (ref: string): { row: number; col: number } | null => {
  const match = ref.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  
  let col = 0;
  for (let i = 0; i < match[1].length; i++) {
    col = col * 26 + (match[1].charCodeAt(i) - 64);
  }
  return { row: parseInt(match[2]) - 1, col: col - 1 };
};

export const InteractiveSheet: React.FC<InteractiveSheetProps> = ({ data, onUpdate }) => {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const cells = data.cells || {};
  const columns = data.columns || 5;
  const rows = data.rows || 10;

  const updateCells = useCallback((newCells: Record<string, CellData>) => {
    onUpdate({ cells: newCells });
  }, [onUpdate]);

  const evaluateFormula = useCallback((formula: string): string => {
    try {
      // Simple formula evaluation (SUM, AVG, COUNT)
      const sumMatch = formula.match(/^=SUM\(([A-Z]+\d+):([A-Z]+\d+)\)$/i);
      if (sumMatch) {
        const start = parseCellRef(sumMatch[1].toUpperCase());
        const end = parseCellRef(sumMatch[2].toUpperCase());
        if (!start || !end) return '#REF!';
        
        let sum = 0;
        for (let r = start.row; r <= end.row; r++) {
          for (let c = start.col; c <= end.col; c++) {
            const cellId = getCellId(r, c);
            const val = parseFloat(cells[cellId]?.value || '0');
            if (!isNaN(val)) sum += val;
          }
        }
        return sum.toString();
      }

      const avgMatch = formula.match(/^=AVG\(([A-Z]+\d+):([A-Z]+\d+)\)$/i);
      if (avgMatch) {
        const start = parseCellRef(avgMatch[1].toUpperCase());
        const end = parseCellRef(avgMatch[2].toUpperCase());
        if (!start || !end) return '#REF!';
        
        let sum = 0;
        let count = 0;
        for (let r = start.row; r <= end.row; r++) {
          for (let c = start.col; c <= end.col; c++) {
            const cellId = getCellId(r, c);
            const val = parseFloat(cells[cellId]?.value || '');
            if (!isNaN(val)) {
              sum += val;
              count++;
            }
          }
        }
        return count > 0 ? (sum / count).toFixed(2) : '0';
      }

      const countMatch = formula.match(/^=COUNT\(([A-Z]+\d+):([A-Z]+\d+)\)$/i);
      if (countMatch) {
        const start = parseCellRef(countMatch[1].toUpperCase());
        const end = parseCellRef(countMatch[2].toUpperCase());
        if (!start || !end) return '#REF!';
        
        let count = 0;
        for (let r = start.row; r <= end.row; r++) {
          for (let c = start.col; c <= end.col; c++) {
            const cellId = getCellId(r, c);
            if (cells[cellId]?.value) count++;
          }
        }
        return count.toString();
      }

      // Simple cell reference
      const refMatch = formula.match(/^=([A-Z]+\d+)$/i);
      if (refMatch) {
        const ref = parseCellRef(refMatch[1].toUpperCase());
        if (!ref) return '#REF!';
        return cells[getCellId(ref.row, ref.col)]?.value || '';
      }

      // Basic arithmetic
      if (formula.startsWith('=')) {
        let expr = formula.substring(1);
        // Replace cell references with values
        expr = expr.replace(/([A-Z]+\d+)/gi, (match) => {
          const ref = parseCellRef(match.toUpperCase());
          if (!ref) return '0';
          return cells[getCellId(ref.row, ref.col)]?.value || '0';
        });
        // Evaluate (simple cases only)
        try {
          // eslint-disable-next-line no-eval
          return eval(expr).toString();
        } catch {
          return '#ERROR!';
        }
      }

      return formula;
    } catch {
      return '#ERROR!';
    }
  }, [cells]);

  const getCellDisplayValue = useCallback((cellId: string): string => {
    const cell = cells[cellId];
    if (!cell) return '';
    if (cell.formula) {
      return evaluateFormula(cell.formula);
    }
    return cell.value || '';
  }, [cells, evaluateFormula]);

  const startEditing = (cellId: string) => {
    const cell = cells[cellId];
    setEditingCell(cellId);
    setEditValue(cell?.formula || cell?.value || '');
  };

  const saveEdit = () => {
    if (!editingCell) return;
    
    const isFormula = editValue.startsWith('=');
    const newCell: CellData = {
      ...cells[editingCell],
      value: isFormula ? '' : editValue,
      formula: isFormula ? editValue : undefined,
    };

    updateCells({ ...cells, [editingCell]: newCell });
    setEditingCell(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const addRow = () => {
    onUpdate({ rows: rows + 1 });
  };

  const addColumn = () => {
    onUpdate({ columns: columns + 1 });
  };

  const deleteRow = () => {
    if (rows <= 1) return;
    
    const newCells: Record<string, CellData> = {};
    Object.entries(cells).forEach(([id, cell]) => {
      const ref = parseCellRef(id);
      if (ref && ref.row < rows - 1) {
        newCells[id] = cell;
      }
    });
    
    onUpdate({ rows: rows - 1, cells: newCells });
  };

  const deleteColumn = () => {
    if (columns <= 1) return;
    
    const newCells: Record<string, CellData> = {};
    Object.entries(cells).forEach(([id, cell]) => {
      const ref = parseCellRef(id);
      if (ref && ref.col < columns - 1) {
        newCells[id] = cell;
      }
    });
    
    onUpdate({ columns: columns - 1, cells: newCells });
  };

  const formatCell = (format: CellData['format']) => {
    if (!selectedCell) return;
    updateCells({
      ...cells,
      [selectedCell]: { ...cells[selectedCell], format }
    });
  };

  const toggleBold = () => {
    if (!selectedCell) return;
    updateCells({
      ...cells,
      [selectedCell]: { 
        ...cells[selectedCell], 
        bold: !cells[selectedCell]?.bold 
      }
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-background rounded-lg border border-border overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-panel">
        <div className="flex items-center gap-2">
          <Table className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">جدول تفاعلي</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={addColumn}>
            <Plus className="h-3 w-3 ml-1" />
            عمود
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={addRow}>
            <Plus className="h-3 w-3 ml-1" />
            صف
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={deleteColumn}>
            <Trash2 className="h-3 w-3 ml-1" />
            عمود
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={deleteRow}>
            <Trash2 className="h-3 w-3 ml-1" />
            صف
          </Button>
        </div>
      </div>

      {/* Formula Bar */}
      {selectedCell && (
        <div className="flex items-center gap-2 p-2 border-b border-border bg-muted/30">
          <span className="text-xs font-mono bg-background px-2 py-1 rounded border">
            {selectedCell}
          </span>
          <Calculator className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground flex-1 truncate">
            {cells[selectedCell]?.formula || cells[selectedCell]?.value || ''}
          </span>
          
          <div className="flex items-center gap-1 border-r border-border pr-2 mr-2">
            <Button
              variant={cells[selectedCell]?.bold ? 'default' : 'ghost'}
              size="icon"
              className="h-6 w-6 text-xs font-bold"
              onClick={toggleBold}
            >
              B
            </Button>
            <Button
              variant={cells[selectedCell]?.format === 'number' ? 'default' : 'ghost'}
              size="sm"
              className="h-6 text-xs px-2"
              onClick={() => formatCell('number')}
            >
              123
            </Button>
            <Button
              variant={cells[selectedCell]?.format === 'currency' ? 'default' : 'ghost'}
              size="sm"
              className="h-6 text-xs px-2"
              onClick={() => formatCell('currency')}
            >
              ﷼
            </Button>
            <Button
              variant={cells[selectedCell]?.format === 'percentage' ? 'default' : 'ghost'}
              size="sm"
              className="h-6 text-xs px-2"
              onClick={() => formatCell('percentage')}
            >
              %
            </Button>
          </div>
        </div>
      )}

      {/* Sheet */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-panel">
            <tr>
              <th className="w-10 min-w-[40px] h-8 border border-border bg-muted text-xs text-muted-foreground" />
              {Array.from({ length: columns }).map((_, colIndex) => (
                <th
                  key={colIndex}
                  className="min-w-[80px] h-8 border border-border bg-muted text-xs text-muted-foreground font-medium"
                >
                  {getColumnLabel(colIndex)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                <td className="h-8 border border-border bg-muted text-center text-xs text-muted-foreground font-medium">
                  {rowIndex + 1}
                </td>
                {Array.from({ length: columns }).map((_, colIndex) => {
                  const cellId = getCellId(rowIndex, colIndex);
                  const cell = cells[cellId];
                  const isEditing = editingCell === cellId;
                  const isSelected = selectedCell === cellId;
                  const displayValue = getCellDisplayValue(cellId);
                  
                  const formatValue = (val: string) => {
                    if (!cell?.format || !val) return val;
                    const num = parseFloat(val);
                    if (isNaN(num)) return val;
                    
                    switch (cell.format) {
                      case 'currency':
                        return `${num.toLocaleString('ar-SA')} ﷼`;
                      case 'percentage':
                        return `${num}%`;
                      case 'number':
                        return num.toLocaleString('ar-SA');
                      default:
                        return val;
                    }
                  };
                  
                  return (
                    <td
                      key={colIndex}
                      className={cn(
                        "h-8 border border-border transition-colors cursor-cell",
                        isSelected && "ring-2 ring-primary ring-inset",
                        cell?.backgroundColor
                      )}
                      style={{ 
                        backgroundColor: cell?.backgroundColor,
                        textAlign: cell?.align || 'right'
                      }}
                      onClick={() => setSelectedCell(cellId)}
                      onDoubleClick={() => startEditing(cellId)}
                    >
                      {isEditing ? (
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-full w-full border-0 rounded-none text-xs focus-visible:ring-0"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') cancelEdit();
                            if (e.key === 'Tab') {
                              e.preventDefault();
                              saveEdit();
                              const nextCol = colIndex + 1;
                              if (nextCol < columns) {
                                setSelectedCell(getCellId(rowIndex, nextCol));
                              }
                            }
                          }}
                          onBlur={saveEdit}
                        />
                      ) : (
                        <span 
                          className={cn(
                            "block px-2 text-xs truncate",
                            cell?.bold && "font-bold"
                          )}
                        >
                          {formatValue(displayValue)}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Instructions */}
      <div className="p-2 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          انقر مرتين للتحرير • استخدم = للصيغ (مثال: =SUM(A1:A5), =AVG(B1:B3), =A1+B1)
        </p>
      </div>
    </div>
  );
};
