'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import FormulaBar from '@/app/_components/formulaBar'
import Grid from '@/app/_components/grid'
import { useSheetStore } from '@/app/_store/sheetStore'
import Button from '@/app/_components/button'
import Link from 'next/link'
import SpinWheel from '@/app/_components/spinWheel'

export default function SheetPage() {
  const params = useParams()
  const sheetId = params.id as String

  const sheet = useSheetStore((s) => s.sheet)
  const setSheet = useSheetStore((s) => s.setSheet)
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

  const handleSortButton = () => {}

  const handleExpo = () => {}

  return (
    <div className="flex justify-center items-center h-lvh">
      <div className="bg-gray-100 rounded-lg shadow-lg relative">
        <div className="absolute top-[-4em] left-0">
          <Button content={<Link href="/">Back</Link>} action={() => {}} />
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
            <Button content={`Sort`} action={handleSortButton} />
            <Button content={`Export CSV`} action={handleExpo} />
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
