'use client'
import * as React from 'react'
import {Home, FileText, Users, Package, Settings, Moon, Sun } from 'lucide-react'
import { NavMain } from '@/app/components/nav-main'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/app/components/ui/sidebar'
import { useNavigation } from '@/app/context/NavigationContext'
import { useTheme } from '@/app/context/ThemeContext'

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { navigateTo, currentPage } = useNavigation()
  const { theme, toggleTheme } = useTheme()

  const navMain = [
    {
      title: 'Dashboard',
      page: 'dashboard' as const,
      icon: Home,
      isActive: currentPage === 'dashboard',
    },
    {
      title: 'Preventivi',
      page: 'quotes' as const,
      icon: FileText,
      isActive: currentPage === 'quotes' || currentPage === 'create-quote',
      items: [
        {
          title: 'Tutti i preventivi',
          page: 'quotes' as const,
        },
        {
          title: 'Crea preventivo',
          page: 'create-quote' as const,
        },
      ],
    },
    {
      title: 'Clienti',
      page: 'customers' as const,
      icon: Users,
      isActive: currentPage === 'customers' || currentPage === 'customer-create' || currentPage === 'customer',
      items: [
        {
          title: 'Tutti i clienti',
          page: 'customers' as const,
        },
        {
          title: 'Aggiungi cliente',
          page: 'customer-create' as const,
        },
      ],
    },
    {
      title: 'Prodotti',
      page: 'products' as const,
      icon: Package,
      isActive:
        currentPage === 'products' ||
        currentPage === 'create-product' ||
        currentPage === 'import-products-from-file',
      items: [
        {
          title: 'Tutti i prodotti',
          page: 'products' as const,
        },
        {
          title: 'Aggiungi prodotto',
          page: 'create-product' as const,
        },
        {
          title: 'Importa da File',
          page: 'import-products-from-file' as const,
        },
      ],
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={navMain} onNavigate={navigateTo} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleTheme} tooltip={theme === 'light' ? 'Modalità scura' : 'Modalità chiara'}>
              {theme === 'light' ? (
                <>
                  <Moon className="h-4 w-4" />
                  <span>Modalità scura</span>
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4" />
                  <span>Modalità chiara</span>
                </>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigateTo('settings')} tooltip="Impostazioni">
              <Settings className="h-4 w-4" />
              <span>Impostazioni</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
