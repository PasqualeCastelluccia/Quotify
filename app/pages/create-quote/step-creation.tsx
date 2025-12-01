import { Card } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { QuoteDataTable } from '@/app/data-tables/quote-data-table'
import { CustomersCombobox } from '@/app/components/combobox-customers'
import type { Customer } from '@/app/types/customer'
import type { QuoteItemUI } from '@/app/types/quote-item'
import type { Product } from '@/app/types/product'
import type { CompanyProfile } from '@/lib/conveyor/api/profiles-api'

interface StepCreationProps {
  quoteNumber: number
  quoteRevision: number
  quoteDate: string
  notes: string
  rows: QuoteItemUI[]
  selectedCustomerId: number | undefined
  selectedProfileId: number | undefined
  profiles: CompanyProfile[]
  onQuoteRevisionChange: (revision: number) => void
  onQuoteDateChange: (date: string) => void
  onNotesChange: (notes: string) => void
  onAddRow: (product: Product, config: QuoteItemUI) => void
  onUpdateRow: (rowId: number, product: Product, config: QuoteItemUI) => void
  onDeleteRow: (rowId: number) => void
  onUpdateNetUnitPrice: (rowId: number, newNetPrice: number) => void
  onCustomerChange: (customerId: number | undefined, customer: Customer | null) => void
  onProfileChange: (profileId: number) => void
}

export function StepCreation({
  quoteNumber,
  quoteRevision,
  quoteDate,
  notes,
  rows,
  selectedCustomerId,
  selectedProfileId,
  profiles,
  onQuoteRevisionChange,
  onQuoteDateChange,
  onNotesChange,
  onAddRow,
  onUpdateRow,
  onDeleteRow,
  onUpdateNetUnitPrice,
  onCustomerChange,
  onProfileChange,
}: StepCreationProps) {
  return (
    <>
      {/* Quote Information */}
      <Card className="p-4">
        <div className="grid grid-cols-5 gap-4">
          <div>
            <Label htmlFor="profilo" className="mb-2 block">
              Profilo Aziendale <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedProfileId?.toString()} onValueChange={(value) => onProfileChange(parseInt(value))}>
              <SelectTrigger className="!h-12 w-full">
                <SelectValue placeholder="Seleziona profilo" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id.toString()}>
                    {profile.profileName}
                    {profile.isDefault && ' ⭐'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="numero" className="mb-2 block">
              Numero Preventivo
            </Label>
            <Input
              id="numero"
              value={quoteNumber}
              readOnly
              disabled
              className="bg-muted"
              placeholder="Generazione automatica..."
            />
          </div>
          <div>
            <Label htmlFor="revision" className="mb-2 block">
              Revisione
            </Label>
            <Input
              id="revision"
              type="number"
              value={quoteRevision}
              onChange={(e) => onQuoteRevisionChange(parseInt(e.target.value) || 0)}
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="data" className="mb-2 block">
              Data <span className="text-red-500">*</span>
            </Label>
            <Input id="data" type="date" value={quoteDate} onChange={(e) => onQuoteDateChange(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="cliente" className="mb-2 block">
              Cliente <span className="text-red-500">*</span>
            </Label>
            <CustomersCombobox
              value={selectedCustomerId}
              onChange={onCustomerChange}
              placeholder="Seleziona cliente..."
            />
          </div>
        </div>
      </Card>

      {/* Products/Services Table */}
      <Card className="p-4 flex-1">
        <QuoteDataTable
          rows={rows}
          onAddRow={onAddRow}
          onUpdateRow={onUpdateRow}
          onDeleteRow={onDeleteRow}
          onUpdateNetUnitPrice={onUpdateNetUnitPrice}
        />
      </Card>

      {/* Notes */}
      <Card className="p-4">
        <Label htmlFor="note">Note</Label>
        <Textarea
          id="note"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Aggiungi note o condizioni particolari..."
          className="mt-2"
          rows={3}
        />
      </Card>
    </>
  )
}
