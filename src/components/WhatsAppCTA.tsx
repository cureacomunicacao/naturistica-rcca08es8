import { Button } from '@/components/ui/button'
import { useSettings } from '@/hooks/use-settings'
import { formatWhatsAppLink } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { MessageCircle } from 'lucide-react'

interface WhatsAppCTAProps {
  className?: string
  text?: string
  showIcon?: boolean
}

export function WhatsAppCTA({
  className,
  text = 'Agendar Consulta via WhatsApp',
  showIcon = true,
}: WhatsAppCTAProps) {
  const { settings } = useSettings()
  const whatsappLink = settings.whatsapp_link?.value || 'https://wa.me/5511999999999'

  const parts = text.split(/(whatsapp)/i)

  return (
    <Button
      asChild
      size="lg"
      className={cn(
        'rounded-full shadow-lg text-center h-auto py-3 px-6 leading-tight',
        'bg-green-600 hover:bg-green-700 text-white border-none',
        className,
      )}
    >
      <a
        href={formatWhatsAppLink(whatsappLink)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
      >
        {showIcon && <MessageCircle className="w-5 h-5 hidden sm:block" />}
        <span className="inline-flex flex-col sm:inline-block items-center justify-center">
          {parts.map((part, i) => {
            if (part.toLowerCase() === 'whatsapp') {
              return (
                <span key={i} className="font-bold sm:ml-1 flex items-center gap-1 justify-center">
                  {showIcon && <MessageCircle className="w-4 h-4 sm:hidden" />}
                  {part}
                </span>
              )
            }
            return (
              <span key={i} className="opacity-90">
                {part.trim()}
              </span>
            )
          })}
        </span>
      </a>
    </Button>
  )
}
