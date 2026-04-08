import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackEvent } from '@/services/analytics'
import { useSettings } from '@/hooks/use-settings'

export function AnalyticsTracker() {
  const location = useLocation()

  useEffect(() => {
    // Exclude admin routes from public tracking
    if (!location.pathname.startsWith('/admin')) {
      trackEvent('page_view', location.pathname).catch(() => {})
    }
  }, [location.pathname])

  return null
}

export function ScriptInjector() {
  const { settings } = useSettings()

  useEffect(() => {
    if (!settings) return
    if (!settings.header_scripts?.value && !settings.body_scripts?.value) return

    const injectScripts = (html: string, target: HTMLElement) => {
      if (!html) return
      const fragment = document.createRange().createContextualFragment(html)

      // Ensure script tags actually execute
      const scripts = fragment.querySelectorAll('script')
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script')
        Array.from(oldScript.attributes).forEach((attr) =>
          newScript.setAttribute(attr.name, attr.value),
        )
        newScript.text = oldScript.innerHTML
        oldScript.parentNode?.replaceChild(newScript, oldScript)
      })

      target.appendChild(fragment)
    }

    const headContainer = document.createElement('div')
    headContainer.setAttribute('data-injected', 'true')

    const bodyContainer = document.createElement('div')
    bodyContainer.setAttribute('data-injected', 'true')

    if (settings.header_scripts?.value) injectScripts(settings.header_scripts.value, headContainer)
    if (settings.body_scripts?.value) injectScripts(settings.body_scripts.value, bodyContainer)

    document.head.appendChild(headContainer)
    document.body.appendChild(bodyContainer)

    return () => {
      headContainer.remove()
      bodyContainer.remove()
    }
  }, [settings?.header_scripts?.value, settings?.body_scripts?.value])

  return null
}
