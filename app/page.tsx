'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sheet } from '@/types'
import Button from './_components/button'
import SpinWheel from './_components/spinWheel'

export default function HomePage() {
  const [sheets, setSheets] = useState<Sheet[]>([])
  const [newSheetName, setNewSheetName] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<boolean>(false)

  useEffect(() => {
    fetchSheets()
  }, [])

  const fetchSheets = async () => {
    try {
      const response = await fetch('/api/sheets')
      if (response.ok) {
        const data = await response.json()
        setSheets(data)
      }
    } catch (error) {
      console.error('Failed to fetch sheets:', error)
    } finally {
      setLoading(false)
    }
  }

  const createSheet = async () => {
    if (!newSheetName.trim()) return
    try {
      setUpdating(true)
      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSheetName,
          rows: 20,
          cols: 10,
        }),
      })

      if (response.ok) {
        const sheet = await response.json()
        setSheets([...sheets, sheet])
        setNewSheetName('')
      }
    } catch (error) {
      console.error('Failed to create sheet:', error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <div>Loading sheets...</div>

  return (
    <div className="h-lvh bg-white flex justify-center items-center">
      <div className="bg-gray-100 p-2 rounded-lg shadow-md flex-col items-center justify-center min-w-[500px] min-h-[200px]">
        <h1 className="text-4xl font-bold border-b border-gray-300 p-4 drop-shadow-2xl">
          TinyGrid
        </h1>

        <div className="flex-col space-y-2 hover:bg-gray-50 rounded-md p-4 my-4">
          <h2 className="text-2xl">Create New Sheet</h2>
          <div className="flex justify-between">
            <input
              className="rounded-xl border-cyan-600 border p-1 pl-2"
              type="text"
              value={newSheetName}
              onChange={(e) => setNewSheetName(e.target.value)}
              placeholder="Sheet name..."
            />
            <Button onClick={createSheet} disabled={updating} style={{minWidth: "90px"}}>
              {updating ? <SpinWheel /> : 'Create Sheet'}
            </Button>
          </div>
        </div>

        <div className="flex-col space-y-2 hover:bg-gray-50 rounded-md p-4">
          <h2 className="text-2xl">Your Sheets</h2>
          {sheets.length === 0 ? (
            <div>No sheets yet. Create your first sheet above!</div>
          ) : (
            <ul className="bg-gray-50 rounded-lg p-2 space-y-2 shadow-md">
              {sheets.map((sheet) => (
                <li key={sheet.id} className="text-lg">
                  <Link href={`/s/${sheet.id}`}>
                    {sheet.name} ({sheet.rows} × {sheet.cols})
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
