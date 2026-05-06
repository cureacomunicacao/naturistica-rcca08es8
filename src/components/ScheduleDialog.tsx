import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useSettings } from '@/hooks/use-settings'
import { ReactNode } from 'react'

interface ScheduleDialogProps {
  children: ReactNode
}

export function ScheduleDialog({ children }: ScheduleDialogProps) {
  const { settings } = useSettings()

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar Consulta</DialogTitle>
          <DialogDescription>
            Com qual especialista você gostaria de agendar sua consulta?
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <Button
            asChild
            variant="outline"
            className="h-auto py-6 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 whitespace-normal text-center"
          >
            <a
              href={settings.whatsapp_felipe?.value || 'https://wa.me/5543991692047'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-semibold text-lg">Dr. Felipe Zamboni</span>
              <span className="text-xs text-muted-foreground block mt-1">
                Psicoterapia e Medicina Integrativa
              </span>
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-auto py-6 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 whitespace-normal text-center"
          >
            <a
              href={settings.whatsapp_beatriz?.value || 'https://wa.me/5543991692047'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-semibold text-lg">Dra. Beatriz Mulari</span>
              <span className="text-xs text-muted-foreground block mt-1">
                Ayurveda e Medicina Canabinoide
              </span>
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
