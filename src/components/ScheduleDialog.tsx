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
            className="h-auto py-4 px-4 hover:border-primary hover:bg-primary/5 w-full"
          >
            <a
              href={settings.whatsapp_felipe?.value || 'https://wa.me/5543991692047'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-row items-center justify-center gap-3"
            >
              <Avatar className="h-10 w-10 border shrink-0">
                <AvatarImage
                  src={
                    felipeSetting?.image
                      ? pb.files.getURL(felipeSetting, felipeSetting.image)
                      : undefined
                  }
                  alt="Dr. Felipe Zamboni"
                />
                <AvatarFallback>FZ</AvatarFallback>
              </Avatar>
              <span className="font-semibold text-base sm:text-lg whitespace-nowrap">
                Dr. Felipe Zamboni
              </span>
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-auto py-4 px-4 hover:border-primary hover:bg-primary/5 w-full"
          >
            <a
              href={settings.whatsapp_beatriz?.value || 'https://wa.me/5543991692047'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-row items-center justify-center gap-3"
            >
              <Avatar className="h-10 w-10 border shrink-0">
                <AvatarImage
                  src={
                    beatrizSetting?.image
                      ? pb.files.getURL(beatrizSetting, beatrizSetting.image)
                      : undefined
                  }
                  alt="Dra. Beatriz Mulari"
                />
                <AvatarFallback>BM</AvatarFallback>
              </Avatar>
              <span className="font-semibold text-base sm:text-lg whitespace-nowrap">
                Dra. Beatriz Mulari
              </span>
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
