import { useEffect } from 'react'
import { useSettings } from '@/hooks/use-settings'
import pb from '@/lib/pocketbase/client'

interface SEOProps {
  title?: string
  description?: string
}

export function SEO({ title, description }: SEOProps) {
  const { settings } = useSettings()

  useEffect(() => {
    const finalTitle = title || settings.global_seo_title?.value || 'Naturistica'
    const finalDesc = description || settings.global_seo_description?.value || ''

    document.title = finalTitle

    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', finalDesc)

    const keywords = settings.global_seo_keywords?.value
    if (keywords) {
      let metaKw = document.querySelector('meta[name="keywords"]')
      if (!metaKw) {
        metaKw = document.createElement('meta')
        metaKw.setAttribute('name', 'keywords')
        document.head.appendChild(metaKw)
      }
      metaKw.setAttribute('content', keywords)
    }

    let metaOgTitle = document.querySelector('meta[property="og:title"]')
    if (!metaOgTitle) {
      metaOgTitle = document.createElement('meta')
      metaOgTitle.setAttribute('property', 'og:title')
      document.head.appendChild(metaOgTitle)
    }
    metaOgTitle.setAttribute('content', finalTitle)

    let metaOgDesc = document.querySelector('meta[property="og:description"]')
    if (!metaOgDesc) {
      metaOgDesc = document.createElement('meta')
      metaOgDesc.setAttribute('property', 'og:description')
      document.head.appendChild(metaOgDesc)
    }
    metaOgDesc.setAttribute('content', finalDesc)

    const ogImageRecord = settings.global_og_image
    if (ogImageRecord && ogImageRecord.image) {
      const imageUrl = pb.files.getURL(ogImageRecord, ogImageRecord.image)
      let metaOgImage = document.querySelector('meta[property="og:image"]')
      if (!metaOgImage) {
        metaOgImage = document.createElement('meta')
        metaOgImage.setAttribute('property', 'og:image')
        document.head.appendChild(metaOgImage)
      }
      metaOgImage.setAttribute('content', imageUrl)
    }
  }, [title, description, settings])

  return null
}
