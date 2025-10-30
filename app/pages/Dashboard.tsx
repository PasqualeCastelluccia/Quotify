import { useState, useEffect } from "react"
import { StatsCard } from "@/app/components/StatsCard"
import { Users, Package, FileText } from "lucide-react"
import { useNavigation } from "@/app/context/NavigationContext"
import { Preventivo } from "@/app/types/preventivo"
import { Card } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"

export default function Dashboard() {
  const { navigateTo } = useNavigation()
  const [stats, setStats] = useState({
    clienti: 0,
    prodotti: 0,
    preventivi: 0,
  })
  const [recentPreventivi, setRecentPreventivi] = useState<Preventivo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setIsLoading(true)

      // Load all data
      const [clienti, prodotti, preventivi] = await Promise.all([
        window.conveyor.clienti.getAll(),
        window.conveyor.prodotti.getAll(),
        window.conveyor.preventivi.getAll(),
      ])

      setStats({
        clienti: clienti.length,
        prodotti: prodotti.length,
        preventivi: preventivi.length,
      })

      // Get last 10 preventivi sorted by date (most recent first)
      const sorted = [...preventivi].sort((a, b) => {
        return new Date(b.data).getTime() - new Date(a.data).getTime()
      })
      setRecentPreventivi(sorted.slice(0, 10))
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
      draft: { label: "Bozza", variant: "secondary" },
      sent: { label: "Inviato", variant: "default" },
      accepted: { label: "Accettato", variant: "outline" },
      rejected: { label: "Rifiutato", variant: "destructive" },
    }

    const config = variants[status] || { label: status, variant: "secondary" }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Panoramica generale</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Clienti Registrati"
          value={stats.clienti}
          icon={Users}
          iconColor="text-blue-600"
          onNavigate={() => navigateTo("clienti")}
        />
        <StatsCard
          title="Prodotti Registrati"
          value={stats.prodotti}
          icon={Package}
          iconColor="text-green-600"
          onNavigate={() => navigateTo("prodotti")}
        />
        <StatsCard
          title="Preventivi Creati"
          value={stats.preventivi}
          icon={FileText}
          iconColor="text-purple-600"
          onNavigate={() => navigateTo("preventivi")}
        />
      </div>

      {/* Ultimi Preventivi */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Ultimi Preventivi</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Ultimi 10 preventivi creati
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTo("preventivi")}
          >
            Vedi Tutti
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Caricamento...
          </div>
        ) : recentPreventivi.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nessun preventivo trovato
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numero</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Totale</TableHead>
                  <TableHead>Stato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPreventivi.map((preventivo) => (
                  <TableRow
                    key={preventivo.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigateTo("preventivi")}
                  >
                    <TableCell>
                      <Badge variant="outline" className="font-mono font-semibold">
                        {preventivo.numero}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {new Date(preventivo.data).toLocaleDateString("it-IT")}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {preventivo.clienteBusinessName}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {new Intl.NumberFormat("it-IT", {
                        style: "currency",
                        currency: "EUR",
                      }).format(preventivo.total)}
                    </TableCell>
                    <TableCell>{getStatusBadge(preventivo.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  )
}
