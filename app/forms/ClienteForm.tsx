import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { clienteSchema, type ClienteFormData } from "@/lib/validations/cliente"
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
import { Separator } from "@/app/components/ui/separator"

interface ClienteFormProps {
  onSubmit: (data: ClienteFormData) => void
  defaultValues?: Partial<ClienteFormData>
  isEditMode?: boolean
}

export default function ClienteForm({ onSubmit, defaultValues, isEditMode = false }: ClienteFormProps) {
  const form = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      businessName: defaultValues?.businessName || "",
      email: defaultValues?.email || "",
      vatNumber: defaultValues?.vatNumber || "",
      address: defaultValues?.address || "",
      zipCode: defaultValues?.zipCode || "",
      city: defaultValues?.city || "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* General Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Informazioni Generali</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ragione Sociale <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Inserisci nome azienda o ditta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contatto@azienda.it" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="vatNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partita IVA <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="IT12345678901" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Address Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Indirizzo</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Via e Numero Civico</FormLabel>
                  <FormControl>
                    <Input placeholder="Via Roma, 123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CAP</FormLabel>
                  <FormControl>
                    <Input placeholder="00100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Città</FormLabel>
                  <FormControl>
                    <Input placeholder="Inserisci città" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" className="cursor-pointer">
            {isEditMode ? "Aggiorna Cliente" : "Crea Cliente"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
