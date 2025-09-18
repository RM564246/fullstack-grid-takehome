import { memo, useEffect } from 'react'
import { useSheetStore } from '../_store/sheetStore'
import { CellAddress } from '@/types'

const FormulaBar = memo(() => {
  const selectedCell = useSheetStore((s) => s.selectedCell)
  const activeContent = useSheetStore((s) => s.activeContent)
  const setActiveContent = useSheetStore((s) => s.setActiveContent)
  const updateCell = useSheetStore((s) => s.updateCell)
  const sheet = useSheetStore((s) => s.sheet)
  const setSheet = useSheetStore((s) => s.setSheet)
  const setError = useSheetStore((s) => s.setError)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    return setActiveContent(e.target.value)
  }
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && selectedCell && sheet) {
      e.preventDefault()
      // Optimistic local update
      const prev = sheet.cells[selectedCell as CellAddress]
      updateCell(selectedCell, activeContent)
      // Patch server
      const isFormula = activeContent.startsWith('=')
      const body = {
        edits: [
          isFormula
            ? { addr: selectedCell, kind: 'formula', formula: activeContent }
            : { addr: selectedCell, kind: 'literal', value: activeContent },
        ],
      }
      try {
        const response = await fetch(`/api/sheets/${sheet.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (response.ok) {
          const data = await response.json()
          setSheet(data)
        } else {
          // rollback
          setError('Failed to update sheet')
          setSheet({
            ...sheet,
            cells: { ...sheet.cells, [selectedCell]: prev },
          })
        }
      } catch (err) {
        console.error('Failed to patch from FormulaBar', err)
        // rollback
        setError('Failed to update sheet')
        setSheet({ ...sheet, cells: { ...sheet.cells, [selectedCell]: prev } })
      }
    }
  }

  useEffect(() => {
    if (!selectedCell || !sheet) return
    const cell = sheet.cells[selectedCell as CellAddress]
    if (!cell) {
      setActiveContent('')
      return
    }
    const v =
      cell.kind === 'literal'
        ? String(cell.value)
        : cell.kind === 'formula'
        ? cell.src
        : `#${cell.code}!`
    setActiveContent(v)
  }, [selectedCell, sheet, setActiveContent])

  return (
    <div className="flex items-center space-x-3 pl-10 pt-2 my-2 min-w-8 min-h-6">
      {selectedCell && (
        <>
          <span>{selectedCell}</span>
          <input
            className="rounded-md"
            disabled={!selectedCell}
            type="text"
            value={activeContent}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </>
      )}
    </div>
  )
})

export default FormulaBar
