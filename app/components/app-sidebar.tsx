"use client"
import * as React from "react"
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Home,
  FileText,
  Users,
  Package,
  Moon,
  Sun,
} from "lucide-react"
import { NavMain } from "@/app/components/nav-main"
import { NavUser } from "@/app/components/nav-user"
import { TeamSwitcher } from "@/app/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/app/components/ui/sidebar"
import { useNavigation } from "@/app/context/NavigationContext"
import { useTheme } from "@/app/context/ThemeContext"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { navigateTo, currentPage } = useNavigation()
  const { theme, toggleTheme } = useTheme()

  const navMain = [
    {
      title: "Dashboard",
      page: "dashboard" as const,
      icon: Home,
      isActive: currentPage === "dashboard",
    },
    {
      title: "Preventivi",
      page: "preventivi" as const,
      icon: FileText,
      isActive: currentPage === "preventivi" || currentPage === "crea-preventivo",
      items: [
        {
          title: "Tutti i preventivi",
          page: "preventivi" as const,
        },
        {
          title: "Crea preventivo",
          page: "crea-preventivo" as const,
        },
      ],
    },
    {
      title: "Clienti",
      page: "clienti" as const,
      icon: Users,
      isActive: currentPage === "clienti" || currentPage === "aggiungi-cliente" || currentPage === "dettaglio-cliente",
      items: [
        {
          title: "Tutti i clienti",
          page: "clienti" as const,
        },
        {
          title: "Aggiungi cliente",
          page: "aggiungi-cliente" as const,
        },
      ],
    },
    {
      title: "Prodotti",
      page: "prodotti" as const,
      icon: Package,
      isActive: currentPage === "prodotti" || currentPage === "aggiungi-prodotto" || currentPage === "importa-prodotti" || currentPage === "dettaglio-prodotto",
      items: [
        {
          title: "Tutti i prodotti",
          page: "prodotti" as const,
        },
        {
          title: "Aggiungi prodotto",
          page: "aggiungi-prodotto" as const,
        },
        {
          title: "Importa da File",
          page: "importa-prodotti" as const,
        },
      ],
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
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
        </SidebarMenu>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}