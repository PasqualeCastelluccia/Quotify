import { ColumnDef } from '@tanstack/react-table'
import { QuoteItemUI } from '@/app/types/quote-item'
import { Input } from '@/app/components/ui/input'
import { useState } from 'react'

interface NetUnitPriceColumnProps {
  onUpdateNetPrice: (rowId: number, newNetPrice: number) => void
}

export const createNetUnitPriceColumn = (
  onUpdateNetPrice: NetUnitPriceColumnProps['onUpdateNetPrice']
): ColumnDef<QuoteItemUI> => ({
  accessorKey: 'netUnitPrice',
  header: 'Netto Un.',
  size: 90,
  cell: ({ row }) => {
    const [value, setValue] = useState(row.original.netUnitPrice.toFixed(2))
    const [isFocused, setIsFocused] = useState(false)

    const handleBlur = () => {
      setIsFocused(false)
      const newNetPrice = parseFloat(value)
      if (!isNaN(newNetPrice) && newNetPrice !== row.original.netUnitPrice) {
        onUpdateNetPrice(row.original.id, newNetPrice)
      } else {
        setValue(row.original.netUnitPrice.toFixed(2))
      }
    }

    return (
      <div className="flex items-center justify-center h-full px-1">
        <Input
          type="number"
          step="0.01"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur()
            }
          }}
          className={`text-xs h-7 w-full text-center ${
            isFocused ? 'ring-2 ring-primary' : ''
          }`}
        />
      </div>
    )
  },
})

// Legacy export for backward compatibility
export const netUnitPriceColumn: ColumnDef<QuoteItemUI> = {
  accessorKey: 'netUnitPrice',
  header: 'Netto Un.',
  size: 90,
  cell: ({ row }) => (
    <div className="flex items-center justify-center h-full text-xs px-1">€{row.original.netUnitPrice.toFixed(2)}</div>
  ),
}
