import { memo } from 'react'
import { CellAddress } from '@/types'
import Cell from './cell'
import { useSheetStore } from '../_store/sheetStore'

const Grid = memo(
  ({
    setUpdating,
  }: {
    setUpdating: React.Dispatch<React.SetStateAction<boolean>>
  }) => {
    const sheet = useSheetStore((s) => s.sheet)

    if (!sheet) {
      return (
        <div className="">
          <h1>Sheet not found</h1>
        </div>
      )
    }

    return (
      sheet && (
        <div className="pl-4 bg-gray-50">
          <table>
            <thead>
              <tr className="">
                <th className=""></th>
                {Array.from({ length: Math.min(sheet.cols, 10) }, (_, i) => (
                  <th
                    className="bg-gray-200 first-of-type:rounded-tl-lg last-of-type:rounded-tr-md border-gray-300"
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
                  <td>{row + 1}</td>
                  {Array.from(
                    { length: Math.min(sheet.cols, 10) },
                    (_, col) => {
                      const addr = `${String.fromCharCode(65 + col)}${row + 1}`
                      const cell = sheet.cells[addr as CellAddress]
                      return (
                        <td
                          className="border-collapse border-gray-200 border"
                          key={col}
                        >
                          <Cell data={cell} cellAddr={addr as CellAddress} setUpdating={setUpdating} />
                        </td>
                      )
                    },
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    )
  },
)

export default Grid
