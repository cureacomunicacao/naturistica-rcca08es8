import { useSettings } from '@/hooks/use-settings'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GoogleReviewLinkProps {
  className?: string
}

export function GoogleReviewLink({ className }: GoogleReviewLinkProps) {
  const { settings } = useSettings()
  const gmbUrl = settings.google_business_url?.value

  if (!gmbUrl) return null

  return (
    <a
      href={gmbUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors',
        className,
      )}
    >
      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
      Avalie-nos no Google
    </a>
  )
}
