import { createContext, useContext, useState, ReactNode } from 'react'
import type { PageType } from '@/app/types/navigation'
import type { Customer } from '@/app/types/customer'

interface NavigationParams {
  customer?: Customer
  customerId?: number
  [key: string]: any
}

interface NavigationContextType {
  currentPage: PageType
  params: NavigationParams
  navigateTo: (page: PageType, params?: NavigationParams) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard')
  const [params, setParams] = useState<NavigationParams>({})

  const navigateTo = (page: PageType, newParams?: NavigationParams) => {
    setCurrentPage(page)
    setParams(newParams || {})
  }

  return <NavigationContext.Provider value={{ currentPage, params, navigateTo }}>{children}</NavigationContext.Provider>
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
