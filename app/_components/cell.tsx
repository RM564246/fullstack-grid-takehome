import { CellAddress, Cell as ICell } from '@/types'
import { memo, useEffect, useRef, useState } from 'react'
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

type IStatus = 'committed' | 'editing' | 'overright'

const cellStatus = {
  COMMITTED: 'committed' as IStatus,
  EDITING: 'editing' as IStatus,
  OVERRIGHT: 'overright' as IStatus,
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
    const selectedCell = useSheetStore((s) => s.selectedCell)
    const setSelectedCell = useSheetStore((s) => s.setSelectedCell)
    const setActiveContent = useSheetStore((s) => s.setActiveContent)
    const updateCell = useSheetStore((s) => s.updateCell)

    const [status, setStatus] = useState<IStatus>(cellStatus.COMMITTED)
    const [content, setContent] = useState<string>('')
    const inputRef = useRef<HTMLInputElement | null>(null)
    const singleClickTimerRef = useRef<number | null>(null)

    let isSelected = selectedCell === cellAddr

    // Keep local content in sync with data when not editing
    useEffect(() => {
      if (status !== cellStatus.EDITING) {
        const v = getCommittedData(data)
        setContent(v)
      }
    }, [data, status])

    // Focus and select input when selected
    useEffect(() => {
      if (isSelected) {
        inputRef.current?.focus()
        inputRef.current?.select()
      }
      setStatus(cellStatus.COMMITTED)
    }, [isSelected])

    useEffect(() => {
      return () => {
        if (singleClickTimerRef.current) {
          window.clearTimeout(singleClickTimerRef.current)
          singleClickTimerRef.current = null
        }
      }
    }, [])

    const patchSheet = async (addr: CellAddress, input: string) => {
      if (!sheet) return
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
        } else {
          const err = await response.json().catch(() => ({}))
          console.error('Patch failed', err)
        }
      } catch (error: any) {
        console.error('Failed to patch sheet:', error)
      } finally {
        setUpdating(false)
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value
      if (status === cellStatus.OVERRIGHT) {
        setContent(v)
      }
      setContent(v)
      setActiveContent(v)
    }

    const handleSingleClick = () => {
      if (singleClickTimerRef.current) {
        window.clearTimeout(singleClickTimerRef.current)
        singleClickTimerRef.current = null
      }
      singleClickTimerRef.current = window.setTimeout(() => {
        setSelectedCell(cellAddr)

        setStatus(cellStatus.OVERRIGHT)
        singleClickTimerRef.current = null
      }, 200)
    }

    const handleDoubleClick = () => {
      if (singleClickTimerRef.current) {
        window.clearTimeout(singleClickTimerRef.current)
        singleClickTimerRef.current = null
      }
      setSelectedCell(cellAddr)
      const v = getCommittedData(data)
      setContent(v)
      setActiveContent(v)
      setStatus(cellStatus.EDITING)
      inputRef.current?.focus()
      inputRef.current?.select()
    }

    const commitData = async () => {
      updateCell(cellAddr, content) // local update first
      await patchSheet(cellAddr, content) // then server patch
      setStatus(cellStatus.COMMITTED)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        commitData()
        const match = cellAddr.match(/^([A-Z]+)(\d+)$/)
        if (match) {
          const col = match[1]
          const row = parseInt(match[2], 10) + 1
          const nextAddr = `${col}${row}` as CellAddress
          setSelectedCell(nextAddr)
          setStatus(cellStatus.COMMITTED)
        }
      }
    }

    return (
      <input
        className={`${isSelected ? 'border border-cyan-400' : ''} ${
          status === cellStatus.EDITING
            ? 'bg-white caret-inherit'
            : status === cellStatus.OVERRIGHT
            ? 'bg-blue-50'
            : ''
        } w-20 caret-transparent`}
        ref={inputRef}
        onClick={handleSingleClick}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        value={
          status === cellStatus.EDITING || status === cellStatus.OVERRIGHT
            ? content
            : getCommittedData(data)
        }
        key={cellAddr}
        type="text"
      />
    )
  },
)

export default Cell
