'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import FormulaBar from '@/app/_components/FormulaBar'
import Grid from '@/app/_components/Grid'
import { useSheetStore } from '@/app/_store/sheetStore'
import Button from '@/app/_components/Button'
import Link from 'next/link'
import SpinWheel from '@/app/_components/SpinWheel'

export default function SheetPage() {
  const params = useParams()
  const sheetId = params.id as String

  const sheet = useSheetStore((s) => s.sheet)
  const setSheet = useSheetStore((s) => s.setSheet)
  const lastError = useSheetStore((s) => s.lastError)
  const setError = useSheetStore((s) => s.setError)
  const [loading, setLoading] = useState<boolean>(true)
  const [updating, setUpdating] = useState<boolean>(false)

  useEffect(() => {
    fetchSheet()
  }, [sheetId])

  const fetchSheet = async () => {
    try {
      const response = await fetch(`/api/sheets/${sheetId}`)
      if (response.ok) {
        const data = await response.json()
        setSheet(data)
      }
    } catch (error) {
      console.error('Failed to fetch sheet:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading sheet...</div>
  if (!sheet) return <div>Sheet not found</div>

  // TODO: implement sort and expo functions
  const handleSortButton = () => {}
  const handleExpo = () => {}

  return (
    <div className="flex justify-center items-center h-lvh">
      <div className="bg-gray-100 rounded-lg shadow-lg relative">
        {lastError && (
          <div className="absolute -top-10 left-0 right-0 mx-auto w-fit bg-red-100 text-red-700 border border-red-300 rounded px-3 py-1 text-sm shadow">
            <span>{lastError}</span>
            <button className="ml-2 underline" onClick={() => setError(null)}>
              dismiss
            </button>
          </div>
        )}
        <div className="absolute top-[-4em] left-0">
          <Button onClick={() => {}}>
            <Link href="/">Back</Link>
          </Button>
        </div>
        {/* Toolbar */}
        <div className="flex justify-between items-center p-3 border-b shadow-md">
          <h1 className="text-3xl font-bold flex items-center">
            {sheet.name}{' '}
            {updating && (
              <span className="mx-2">
                <SpinWheel />
              </span>
            )}
          </h1>
          <div className="flex items-center space-x-3">
            <Button>Sort</Button>
            <Button>Export csv</Button>
          </div>
        </div>
        {/* Formula Bar */}
        <FormulaBar />
        {/* Grid - just display cells in a table */}
        <Grid setUpdating={setUpdating} />
      </div>
    </div>
  )
}
