import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/app/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover"
import type { Cliente } from "@/app/types/cliente"

interface ClienteComboboxProps {
  value?: number
  onChange: (clienteId: number | undefined, cliente: Cliente | null) => void
  placeholder?: string
}

export function ClienteCombobox({ value, onChange, placeholder = "Select client..." }: ClienteComboboxProps) {
  const [open, setOpen] = useState(false)
  const [clienti, setClienti] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadClienti = async () => {
      try {
        const data = await window.conveyor.clienti.getAll()
        setClienti(data)
      } catch (error) {
        console.error("Error loading clients:", error)
      } finally {
        setLoading(false)
      }
    }

    loadClienti()
  }, [])

  const selectedCliente = clienti.find((c) => c.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12"
        >
          {selectedCliente ? (
            <span className="truncate">{selectedCliente.businessName}</span>
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
            <CommandEmpty>
              {loading ? "Loading clients..." : "No client found."}
            </CommandEmpty>
            <CommandGroup>
              {clienti.map((cliente) => (
                <CommandItem
                  key={cliente.id}
                  value={`${cliente.businessName} ${cliente.email} ${cliente.city || ""}`}
                  onSelect={() => {
                    onChange(cliente.id, cliente)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === cliente.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="font-medium truncate">{cliente.businessName}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {cliente.email}
                      {cliente.city && ` · ${cliente.city}`}
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
