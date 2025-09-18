import { create } from 'zustand'
import type {
  Sheet,
  CellAddress,
  FormulaCell,
  LiteralCell,
  Cell,
} from "@/types";

type SheetStore = {
  sheet: Sheet | null;
  selectedCell: CellAddress | null;
  activeContent: string;
  lastError: string | null;
  isEditing: boolean;
  setSheet: (sheet: Sheet | null) => void;
  setSelectedCell: (addr: CellAddress | null) => void;
  setActiveContent: (v: string) => void;
  updateCell: (addr: CellAddress, input: string) => void;
  setCell: (addr: CellAddress, cell: Cell | undefined) => void;
  setError: (msg: string | null) => void;
  setEditing: (v: boolean) => void;
};

export const useSheetStore = create<SheetStore>((set) => ({
  sheet: null,
  selectedCell: null,
  activeContent: "",
  lastError: null,
  isEditing: false,
  setSheet: (sheet) => set({ sheet }),
  setSelectedCell: (addr) => set({ selectedCell: addr }),
  setActiveContent: (v) => set({ activeContent: v }),
  updateCell: (addr, input) =>
    set((state) => {
      if (!state.sheet) return state;
      const isFormula = input.startsWith("=");
      const next = { ...state.sheet, cells: { ...state.sheet.cells } };
      next.cells[addr] = isFormula
        ? ({ kind: "formula", src: input } as FormulaCell)
        : ({ kind: "literal", value: input } as LiteralCell);
      return { sheet: next };
    }),
  setCell: (addr, cell) =>
    set((state) => {
      if (!state.sheet) return state;
      const next = { ...state.sheet, cells: { ...state.sheet.cells } };
      if (typeof cell === "undefined") {
        delete next.cells[addr];
      } else {
        next.cells[addr] = cell;
      }
      return { sheet: next };
    }),
  setError: (msg) => set({ lastError: msg }),
  setEditing: (v) => set({ isEditing: v }),
}));