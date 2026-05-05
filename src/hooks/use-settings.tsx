import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'

export type SiteSettings = Record<string, any>

interface SettingsContextType {
  settings: SiteSettings
  loading: boolean
  refresh: () => Promise<void>
  updateSetting: (key: string, value: string) => Promise<void>
}

const SettingsContext = createContext<SettingsContextType>({
  settings: {},
  loading: true,
  refresh: async () => {},
  updateSetting: async () => {},
})

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [loading, setLoading] = useState(true)

  const updateSetting = async (key: string, value: string) => {
    const existing = settings[key]
    if (existing) {
      await pb.collection('site_settings').update(existing.id, { value })
    } else {
      await pb.collection('site_settings').create({ key, value })
    }
    // Optimistic update
    setSettings((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || { key }), value },
    }))
  }

  const refresh = async () => {
    try {
      const list = await pb.collection('site_settings').getFullList()
      const s = list.reduce((acc, curr) => ({ ...acc, [curr.key]: curr }), {})
      setSettings(s)
    } catch (err) {
      console.error('Failed to load settings', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  useRealtime('site_settings', () => {
    refresh()
  })

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
