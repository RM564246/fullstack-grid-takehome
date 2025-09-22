import { create } from 'zustand'
import type { Sheet, CellAddress, FormulaCell, LiteralCell } from '@/types'

type SheetStore = {
  sheet: Sheet | null
  selectedCell: CellAddress | null
  activeContent: string
  setSheet: (sheet: Sheet | null) => void
  setSelectedCell: (addr: CellAddress | null) => void
  setActiveContent: (v: string) => void
  updateCell: (addr: CellAddress, input: string) => void
}

export const useSheetStore = create<SheetStore>((set) => ({
  sheet: null,
  selectedCell: null,
  activeContent: '',
  setSheet: (sheet) => set({ sheet }),
  setSelectedCell: (addr) => set({ selectedCell: addr }),
  setActiveContent: (v) => set({ activeContent: v }),
  updateCell: (addr, input) =>
    set((state) => {
      if (!state.sheet) return state
      const isFormula = input.startsWith('=')
      const next = { ...state.sheet, cells: { ...state.sheet.cells } }
      next.cells[addr] = isFormula
        ? ({ kind: 'formula', src: input } as FormulaCell)
        : ({ kind: 'literal', value: input } as LiteralCell)
      return { sheet: next }
    }),
}))
