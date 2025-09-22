import { memo, useEffect, useCallback } from 'react'
import { CellAddress } from '@/types'
import Cell from './Cell'
import { useSheetStore } from '../_store/sheetStore'

const Grid = memo(
  ({
    setUpdating,
  }: {
    setUpdating: React.Dispatch<React.SetStateAction<boolean>>
  }) => {
    const sheet = useSheetStore((s) => s.sheet)
    const selectedCell = useSheetStore((s) => s.selectedCell)
    const setSelectedCell = useSheetStore((s) => s.setSelectedCell)
    const isEditing = useSheetStore((s) => s.isEditing)
    // const setEditing = useSheetStore((s) => s.setEditing)
    // Para commitar valor da célula
    const updateCell = useSheetStore((s) => s.updateCell)
    const activeContent = useSheetStore((s) => s.activeContent)

    if (!sheet) {
      return (
        <div className="">
          <h1>Sheet not found</h1>
        </div>
      )
    }

    // Keyboard navigation handler
    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (!sheet) return
        if (!selectedCell) return
        const maxRows = Math.min(sheet.rows, 20)
        const maxCols = Math.min(sheet.cols, 10)
        const addr = selectedCell as string
        const colLetter = addr.match(/^[A-Z]+/i)?.[0] || 'A'
        const rowNum = parseInt(addr.replace(/^[A-Z]+/i, ''))
        let col = colLetter.charCodeAt(0) - 65
        let row = rowNum - 1
        let nextAddr: string | null = null

        // Enter: commita valor e move para baixo (se não estiver editando)
        if (e.key === 'Enter' && !isEditing) {
          e.preventDefault()
          // Commitar valor da célula selecionada
          updateCell(selectedCell, activeContent ?? '')
          // Move seleção para baixo
          if (row < maxRows - 1) {
            nextAddr = `${String.fromCharCode(65 + col)}${row + 2}`
            setSelectedCell(nextAddr as CellAddress)
          }
          return
        }

        if (isEditing) return

        if (
          [
            'ArrowUp',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
            'Tab',
            'Home',
            'End',
          ].includes(e.key)
        ) {
          e.preventDefault()
        }

        if (e.key === 'ArrowUp') {
          if (row > 0) nextAddr = `${String.fromCharCode(65 + col)}${row}`
        } else if (e.key === 'ArrowDown') {
          if (row < maxRows - 1)
            nextAddr = `${String.fromCharCode(65 + col)}${row + 2}`
        } else if (e.key === 'ArrowLeft') {
          if (col > 0)
            nextAddr = `${String.fromCharCode(65 + col - 1)}${row + 1}`
        } else if (e.key === 'ArrowRight') {
          if (col < maxCols - 1)
            nextAddr = `${String.fromCharCode(65 + col + 1)}${row + 1}`
        } else if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (col > 0)
              nextAddr = `${String.fromCharCode(65 + col - 1)}${row + 1}`
            else if (row > 0)
              nextAddr = `${String.fromCharCode(65 + maxCols - 1)}${row}`
          } else {
            if (col < maxCols - 1)
              nextAddr = `${String.fromCharCode(65 + col + 1)}${row + 1}`
            else if (row < maxRows - 1)
              nextAddr = `${String.fromCharCode(65)}${row + 2}`
          }
        } else if (e.key === 'Home') {
          nextAddr = `${String.fromCharCode(65)}${row + 1}`
        } else if (e.key === 'End') {
          nextAddr = `${String.fromCharCode(65 + maxCols - 1)}${row + 1}`
        }

        if (nextAddr) {
          setSelectedCell(nextAddr as CellAddress)
        }
      },
      [
        sheet,
        selectedCell,
        isEditing,
        setSelectedCell,
        updateCell,
        activeContent,
      ],
    )

    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    return (
      <div className=" bg-gray-50">
        <div className="relative">
          <table>
            <thead>
              <tr className="">
                <th className="bg-gray-300"></th>
                {Array.from({ length: Math.min(sheet.cols, 10) }, (_, i) => (
                  <th
                    className="bg-gray-200 nth-of-type-2:rounded-tl-md last-of-type:rounded-tr-md border-gray-300"
                    key={i}
                  >
                    {String.fromCharCode(65 + i)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.min(sheet.rows, 20) }, (_, row) => (
                <tr key={row}>
                  <td className="bg-gray-200 pl-3">{row + 1}</td>
                  {Array.from(
                    { length: Math.min(sheet.cols, 10) },
                    (_, col) => {
                      const addr = `${String.fromCharCode(65 + col)}${row + 1}`
                      const cell = sheet.cells[addr as CellAddress]
                      return (
                        <td
                          className="border-collapse border-gray-300 border"
                          key={col}
                        >
                          <Cell
                            data={cell}
                            cellAddr={addr as CellAddress}
                            setUpdating={setUpdating}
                          />
                        </td>
                      )
                    },
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
)

export default Grid
