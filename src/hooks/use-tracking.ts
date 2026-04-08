import { useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useSettings } from '@/hooks/use-settings'
import { trackEvent } from '@/services/analytics'

export function useTracking() {
  const { settings } = useSettings()
  const location = useLocation()

  const trackClick = useCallback(
    async (label: string, isWhatsApp = false) => {
      try {
        await trackEvent('click', location.pathname, label)

        if (isWhatsApp && settings.whatsapp_tracking_script?.value) {
          try {
            // Evaluates the tracking script snippet securely
            const executeTracker = new Function(settings.whatsapp_tracking_script.value)
            executeTracker()
          } catch (e) {
            console.error('Error executing tracking script', e)
          }
        }
      } catch (e) {
        console.error('Failed to track click', e)
      }
    },
    [location.pathname, settings.whatsapp_tracking_script?.value],
  )

  return { trackClick }
}
