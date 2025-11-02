import { AppSidebar } from "@/app/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb"
import { Separator } from "@/app/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/app/components/ui/sidebar"
import { NavigationProvider, useNavigation } from "@/app/context/NavigationContext"
import { ThemeProvider } from "@/app/context/ThemeContext"
import Dashboard from "@/app/pages/Dashboard"
import ClientiList from "@/app/pages/ClientiList"
import AggiungiCliente from "@/app/pages/AggiungiCliente"
import ModificaCliente from "@/app/pages/ModificaCliente"
import ClienteDettaglio from "@/app/pages/ClienteDettaglio"
import ProdottiList from "@/app/pages/ProdottiList"
import AggiungiProdotto from "@/app/pages/AggiungiProdotto"
import ImportaProdotti from "@/app/pages/ImportaProdotti"
import PreventiviList from "@/app/pages/PreventiviList"
import CreaPreventivo from "@/app/pages/CreaPreventivo"
import Settings from "@/app/pages/Settings"
import { Toaster } from "@/app/components/ui/sonner"
import './styles/app.css'

function AppContent() {
  const { currentPage, params } = useNavigation()

  const getBreadcrumbs = () => {
    switch (currentPage) {
      case 'dashboard':
        return { section: 'Home', page: 'Dashboard' }
      case 'clienti':
        return { section: '', page: 'Clienti' }
      case 'aggiungi-cliente':
        return { section: 'Clienti', page: 'Aggiungi Cliente' }
      case 'modifica-cliente':
        return { section: 'Clienti', page: 'Modifica Cliente' }
      case 'dettaglio-cliente':
        return { section: 'Clienti', page: params.clienteBusinessName || 'Dettaglio Cliente' }
      case 'prodotti':
        return { section: '', page: 'Prodotti' }
      case 'aggiungi-prodotto':
        return { section: 'Prodotti', page: 'Aggiungi Prodotto' }
      case 'importa-prodotti':
        return { section: 'Prodotti', page: 'Importa da File' }
      case 'preventivi':
        return { section: 'Gestione', page: 'Preventivi' }
      case 'crea-preventivo':
        return { section: 'Preventivi', page: 'Crea Preventivo' }
      case 'settings':
        return { section: '', page: 'Impostazioni' }
      default:
        return { section: 'Home', page: 'Dashboard' }
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'clienti':
        return <ClientiList />
      case 'aggiungi-cliente':
        return <AggiungiCliente />
      case 'modifica-cliente':
        return <ModificaCliente />
      case 'dettaglio-cliente':
        return <ClienteDettaglio />
      case 'prodotti':
        return <ProdottiList />
      case 'aggiungi-prodotto':
        return <AggiungiProdotto />
      case 'importa-prodotti':
        return <ImportaProdotti />
      case 'preventivi':
        return <PreventiviList />
      case 'crea-preventivo':
        return <CreaPreventivo />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <SidebarProvider className="h-screen flex">
      <AppSidebar />
      <SidebarInset className="flex flex-col flex-1 overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.section && (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      {breadcrumbs.section}
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                )}
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumbs.page}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <AppContent />
        <Toaster />
      </NavigationProvider>
    </ThemeProvider>
  )
}
