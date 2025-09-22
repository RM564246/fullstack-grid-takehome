import { CellAddress, Cell as ICell } from '@/types'
import React, { memo, useEffect, useState, startTransition } from 'react'
import { useSheetStore } from '../_store/sheetStore'

const getCommittedData = (data: ICell) => {
  return (
    (data &&
      (data.kind === 'literal'
        ? String(data.value)
        : data.kind === 'formula'
        ? data.src
        : data.kind === 'error'
        ? `#${data.code}!`
        : '')) ||
    ''
  )
}

type IStatus = 'committed' | 'editing' | 'overwrite'

const cellStatus = {
  COMMITTED: 'committed' as IStatus,
  EDITING: 'editing' as IStatus,
  OVERWRITE: 'overwrite' as IStatus,
}

const Cell = memo(
  ({
    data,
    cellAddr,
    setUpdating,
  }: {
    data: ICell
    cellAddr: CellAddress
    setUpdating: React.Dispatch<React.SetStateAction<boolean>>
  }) => {
    const sheet = useSheetStore((s) => s.sheet)
    const setSheet = useSheetStore((s) => s.setSheet)
    const setError = useSheetStore((s) => s.setError)
    const updateCell = useSheetStore((s) => s.updateCell)
    const setCell = useSheetStore((s) => s.setCell)

    const isSelected = useSheetStore((s) => s.selectedCell === cellAddr)
    const setSelectedCell = useSheetStore((s) => s.setSelectedCell)
    const setActiveContent = useSheetStore((s) => s.setActiveContent)
    const isEditing = useSheetStore((s) => s.isEditing)
    const setEditing = useSheetStore((s) => s.setEditing)

    const [status, setStatus] = useState<IStatus>(cellStatus.COMMITTED)
    const [content, setContent] = useState<string>('')
    const singleClickRef = { current: null as number | null }

    useEffect(() => {
      if (status !== cellStatus.EDITING) {
        setContent(getCommittedData(data))
      }
    }, [data, status])

    useEffect(() => {
      setStatus(
        isEditing && isSelected
          ? cellStatus.EDITING
          : isSelected
          ? cellStatus.OVERWRITE
          : cellStatus.COMMITTED,
      )
    }, [isEditing, isSelected])

    useEffect(() => {
      return () => {
        if (singleClickRef.current) {
          window.clearTimeout(singleClickRef.current)
          singleClickRef.current = null
        }
      }
    }, [])

    const patchSheet = async (addr: CellAddress, input: string) => {
      if (!sheet) return true
      try {
        setUpdating(true)
        const isFormula = input.startsWith('=')
        const body = {
          edits: [
            isFormula
              ? { addr, kind: 'formula', formula: input }
              : { addr, kind: 'literal', value: input },
          ],
        }
        const response = await fetch(`/api/sheets/${sheet.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (response.ok) {
          const data = await response.json()
          setSheet(data)
          return true
        } else {
          const err = await response.json().catch(() => ({}))
          console.error('Patch failed', err)
          setError(
            typeof err?.error === 'string'
              ? err.error
              : 'Failed to update sheet',
          )
          return false
        }
      } catch (error) {
        console.error('Failed to patch sheet:', error)
        setError('Failed to update sheet')
        return false
      } finally {
        setUpdating(false)
      }
    }

    const handleSingleClick = () => {
      if (singleClickRef.current) {
        window.clearTimeout(singleClickRef.current)
        singleClickRef.current = null
      }
      singleClickRef.current = window.setTimeout(() => {
        startTransition(() => setSelectedCell(cellAddr))
        const v = getCommittedData(data)
        setContent(v)
        setActiveContent(v)
        setEditing(false)
        setStatus(cellStatus.OVERWRITE)
        singleClickRef.current = null
      }, 200)
    }

    const handleDoubleClick = () => {
      if (singleClickRef.current) {
        window.clearTimeout(singleClickRef.current)
        singleClickRef.current = null
      }
      startTransition(() => setSelectedCell(cellAddr))
      const v = getCommittedData(data)
      setContent(v)
      setActiveContent(v)
      setEditing(true)
      setStatus(cellStatus.EDITING)
    }

    const commitData = async () => {
      const prevCell = sheet?.cells[cellAddr]
      updateCell(cellAddr, content)
      const ok = await patchSheet(cellAddr, content)
      if (!ok) {
        if (typeof prevCell === 'undefined') setCell(cellAddr, undefined)
        else setCell(cellAddr, prevCell)
      }
      setStatus(cellStatus.COMMITTED)
      setEditing(false)
    }

    const display =
      status === cellStatus.EDITING || status === cellStatus.OVERWRITE
        ? content
        : getCommittedData(data)

    // Handler to overwrite cell content
    const handleKeyDownDiv = async (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (status === cellStatus.OVERWRITE && isSelected && !isEditing) {
        // Ignore navigation keys
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          setContent(e.key)
          setActiveContent(e.key)
          setEditing(true)
          setStatus(cellStatus.EDITING)
          e.preventDefault()
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          setContent('')
          setActiveContent('')
          setEditing(true)
          setStatus(cellStatus.EDITING)
          e.preventDefault()
        } 
      }
    }

    // Ref to ensure auto focus in the selected cell
    const cellRef = React.useRef<HTMLDivElement>(null)
    useEffect(() => {
      if (isSelected && !isEditing && cellRef.current) {
        cellRef.current.focus()
      }
      return () => {
        // Optionally blur the cell when it is unselected or editing starts
        if (cellRef.current) {
          cellRef.current.blur()
        }
      }
    }, [isSelected, isEditing])

    return (
      <div
        ref={cellRef}
        className={`relative ${
          isSelected ? 'outline outline-1 outline-cyan-400' : ''
        } ${
          status === cellStatus.EDITING
            ? 'bg-white'
            : status === cellStatus.OVERWRITE
            ? 'bg-blue-50'
            : ''
        } w-20 px-1 py-0.5 min-h-[1.75rem] overflow-hidden text-nowrap`}
        onClick={handleSingleClick}
        onDoubleClick={handleDoubleClick}
        tabIndex={0}
        onKeyDown={handleKeyDownDiv}
      >
        {display}
        {isEditing && isSelected && (
          <input
            className="absolute inset-0 w-full h-full bg-white px-1 py-0.5"
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
              setActiveContent(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitData()
              if (e.key === 'Escape') setEditing(false)
            }}
            autoFocus
          />
        )}
      </div>
    )
  },
)

export default Cell
