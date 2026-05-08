import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useSettings } from '@/hooks/use-settings'
import { ReactNode } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import pb from '@/lib/pocketbase/client'

interface ScheduleDialogProps {
  children: ReactNode
}

export function ScheduleDialog({ children }: ScheduleDialogProps) {
  const { settings } = useSettings()

  const felipeSetting =
    settings.doctor_felipe_image || settings.doctor_felipe || settings.felipe_image
  const beatrizSetting =
    settings.doctor_beatriz_image || settings.doctor_beatriz || settings.beatriz_image

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-center text-2xl font-semibold tracking-tight">
            Agendar Consulta
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Selecione o especialista para seu atendimento
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-6 pb-4 sm:grid-cols-2 sm:gap-8">
          <a
            href={`https://wa.me/${(settings.whatsapp_felipe?.value || '554391575911').replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-center justify-center gap-6 rounded-2xl border border-border/50 bg-card p-8 text-card-foreground shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-muted/30 ring-1 ring-border/50 transition-all duration-500 group-hover:scale-105 group-hover:ring-primary/20">
              <Avatar className="h-full w-full">
                <AvatarImage
                  src={
                    felipeSetting?.image
                      ? pb.files.getURL(felipeSetting, felipeSetting.image)
                      : undefined
                  }
                  alt="Dr. Felipe Zamboni"
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl font-light text-muted-foreground">
                  FZ
                </AvatarFallback>
              </Avatar>
            </div>
            <span className="whitespace-nowrap text-lg font-medium tracking-tight text-foreground transition-colors group-hover:text-primary">
              Dr. Felipe Zamboni
            </span>
          </a>

          <a
            href={`https://wa.me/${(settings.whatsapp_beatriz?.value || '5543991692047').replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-center justify-center gap-6 rounded-2xl border border-border/50 bg-card p-8 text-card-foreground shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-muted/30 ring-1 ring-border/50 transition-all duration-500 group-hover:scale-105 group-hover:ring-primary/20">
              <Avatar className="h-full w-full">
                <AvatarImage
                  src={
                    beatrizSetting?.image
                      ? pb.files.getURL(beatrizSetting, beatrizSetting.image)
                      : undefined
                  }
                  alt="Dra. Beatriz Mulari"
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl font-light text-muted-foreground">
                  BM
                </AvatarFallback>
              </Avatar>
            </div>
            <span className="whitespace-nowrap text-lg font-medium tracking-tight text-foreground transition-colors group-hover:text-primary">
              Dra. Beatriz Mulari
            </span>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
