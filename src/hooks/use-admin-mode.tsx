import { createContext, useContext, useState, ReactNode } from 'react'
import { useAuth } from '@/hooks/use-auth'

interface AdminModeContextType {
  isEditingMode: boolean
  setIsEditingMode: (v: boolean) => void
}

const AdminModeContext = createContext<AdminModeContextType>({
  isEditingMode: false,
  setIsEditingMode: () => {},
})

export const AdminModeProvider = ({ children }: { children: ReactNode }) => {
  const [isEditingMode, setIsEditingMode] = useState(false)
  const { isAdmin } = useAuth()

  return (
    <AdminModeContext.Provider
      value={{ isEditingMode: isAdmin && isEditingMode, setIsEditingMode }}
    >
      {children}
    </AdminModeContext.Provider>
  )
}

export const useAdminMode = () => useContext(AdminModeContext)
