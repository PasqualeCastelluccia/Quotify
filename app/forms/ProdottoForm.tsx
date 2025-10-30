import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { prodottoSchema, type ProdottoFormData } from "@/lib/validations/prodotto"
import { Button } from "@/app/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"

interface ProdottoFormProps {
  onSubmit: (data: ProdottoFormData) => void
  defaultValues?: Partial<ProdottoFormData>
}

export default function ProdottoForm({ onSubmit, defaultValues }: ProdottoFormProps) {
  const form = useForm<ProdottoFormData>({
    resolver: zodResolver(prodottoSchema),
    defaultValues: {
      codice: defaultValues?.codice || "",
      descrizione: defaultValues?.descrizione || "",
      misura: defaultValues?.misura || "",
      prezzo: defaultValues?.prezzo || 0,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Prima riga: 3 colonne per codice, misura e prezzo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="codice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Codice <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Inserisci codice prodotto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="misura"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Misura</FormLabel>
                <FormControl>
                  <Input placeholder="Es: pz, kg, m, lt" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prezzo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prezzo <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Textarea grande per la descrizione */}
        <FormField
          control={form.control}
          name="descrizione"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrizione</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Inserisci descrizione dettagliata del prodotto"
                  className="min-h-[120px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" className="cursor-pointer">Crea Prodotto</Button>
        </div>
      </form>
    </Form>
  )
}
