import { AppSidebar } from '@/app/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/app/components/ui/breadcrumb'
import { Separator } from '@/app/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/app/components/ui/sidebar'
import { NavigationProvider, useNavigation } from '@/app/context/NavigationContext'
import { ThemeProvider } from '@/app/context/ThemeContext'
import Dashboard from '@/app/pages/dashboard'
import Customers from '@/app/pages/customers'
import CreateCustomer from '@/app/pages/create-customer'
import CustomerUpdate from '@/app/pages/customer-update'
import Customer from '@/app/pages/customer'
import Products from '@/app/pages/products'
import CreateProduct from '@/app/pages/create-product'
import ImportProductsFromFile from '@/app/pages/import-products-from-file'
import QuotesList from '@/app/pages/quote-list'
import CreateQuote from '@/app/pages/create-quote/index'
import QuoteView from '@/app/pages/quote-view'
import SendQuoteEmail from '@/app/pages/send-quote-email'
import Settings from '@/app/pages/Settings'
import { Toaster } from '@/app/components/ui/sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './styles/app.css'

const queryClient = new QueryClient()

function AppContent() {
  const { currentPage, params } = useNavigation()

  const getBreadcrumbs = () => {
    switch (currentPage) {
      case 'dashboard':
        return { section: 'Home', page: 'Dashboard' }
      case 'customers':
        return { section: '', page: 'Clienti' }
      case 'customer-create':
        return { section: 'Clienti', page: 'Aggiungi Cliente' }
      case 'customer-update':
        return { section: 'Clienti', page: 'Modifica Cliente' }
      case 'customer':
        return { section: 'Clienti', page: (params.customer as any)?.businessName || 'Dettaglio Cliente' }
      case 'products':
        return { section: '', page: 'Prodotti' }
      case 'create-product':
        return { section: 'Prodotti', page: 'Aggiungi Prodotto' }
      case 'import-products-from-file':
        return { section: 'Prodotti', page: 'Importa da File' }
      case 'quotes':
        return { section: 'Gestione', page: 'Preventivi' }
      case 'create-quote':
        return { section: 'Preventivi', page: 'Crea Preventivo' }
      case 'quote-view':
        return { section: 'Preventivi', page: 'Visualizza Preventivo' }
      case 'send-quote-email':
        return { section: 'Preventivi', page: 'Invia Email' }
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
      case 'customers':
        return <Customers />
      case 'customer-create':
        return <CreateCustomer />
      case 'customer-update':
        return <CustomerUpdate />
      case 'customer':
        return <Customer />
      case 'products':
        return <Products />
      case 'create-product':
        return <CreateProduct />
      case 'import-products-from-file':
        return <ImportProductsFromFile />
      case 'quotes':
        return <QuotesList />
      case 'create-quote':
        return <CreateQuote />
      case 'quote-view':
        return <QuoteView />
      case 'send-quote-email':
        return <SendQuoteEmail />
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
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.section && (
                  <>
                    <BreadcrumbItem className="hidden md:block">{breadcrumbs.section}</BreadcrumbItem>
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
        <main className="flex-1 overflow-y-auto">{renderPage()}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationProvider>
          <AppContent />
          <Toaster />
        </NavigationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
