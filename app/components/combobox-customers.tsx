import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/app/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/app/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import type { Customer } from '@/app/types/customer'

interface CustomersComboboxProps {
  value?: number
  onChange: (customerId: number | undefined, customer: Customer | null) => void
  placeholder?: string
}

export function CustomersCombobox({ value, onChange, placeholder = 'Select client...' }: CustomersComboboxProps) {
  const [open, setOpen] = useState(false)

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => window.conveyor.customers.getAll(),
  })

  const selectedCustomer = customers.find((c) => c.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-12">
          {selectedCustomer ? (
            <span className="truncate">{selectedCustomer.businessName}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search client..." />
          <CommandList>
            <CommandEmpty>{isLoading ? 'Loading clients...' : 'No client found.'}</CommandEmpty>
            <CommandGroup>
              {customers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={`${customer.businessName} ${customer.email} ${customer.city || ''}`}
                  onSelect={() => {
                    onChange(customer.id, customer)
                    setOpen(false)
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === customer.id ? 'opacity-100' : 'opacity-0')} />
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="font-medium truncate">{customer.businessName}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {customer.email}
                      {customer.city && ` · ${customer.city}`}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}