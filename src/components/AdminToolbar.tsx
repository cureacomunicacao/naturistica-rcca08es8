import { useAuth } from '@/hooks/use-auth'
import { useAdminMode } from '@/hooks/use-admin-mode'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useSettings } from '@/hooks/use-settings'
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

export function AdminToolbar() {
  const { isAdmin } = useAuth()
  const { isEditingMode, setIsEditingMode } = useAdminMode()
  const { settings, updateSetting } = useSettings()
  const { toast } = useToast()

  const [felipeLink, setFelipeLink] = useState('')
  const [beatrizLink, setBeatrizLink] = useState('')
  const [whatsappLink, setWhatsappLink] = useState('')

  useEffect(() => {
    setFelipeLink(settings.dr_felipe_link?.value || '')
    setBeatrizLink(settings.dra_beatriz_link?.value || '')
    setWhatsappLink(settings.whatsapp_link?.value || '')
  }, [settings])

  if (!isAdmin) return null

  const handleSaveLinks = async () => {
    try {
      await updateSetting('dr_felipe_link', felipeLink)
      await updateSetting('dra_beatriz_link', beatrizLink)
      await updateSetting('whatsapp_link', whatsappLink)
      toast({ title: 'Links atualizados com sucesso' })
    } catch (e: any) {
      toast({ title: 'Erro ao atualizar links', description: e.message, variant: 'destructive' })
    }
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/90 text-white px-6 py-3 rounded-full shadow-2xl z-[100] flex items-center gap-6 backdrop-blur-sm border border-white/10 animate-fade-in-up">
      <div className="flex items-center gap-2">
        <Switch
          id="editing-mode"
          checked={isEditingMode}
          onCheckedChange={setIsEditingMode}
          className="data-[state=checked]:bg-primary"
        />
        <Label htmlFor="editing-mode" className="text-sm font-medium cursor-pointer text-white">
          Modo Edição
        </Label>
      </div>

      <div className="w-px h-6 bg-white/20" />

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white/80 hover:bg-white/10 h-8 px-3 rounded-full"
          >
            <Settings className="w-4 h-4 mr-2" />
            Links Globais
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configurações Globais</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Link do WhatsApp (Geral)</Label>
              <Input
                value={whatsappLink}
                onChange={(e) => setWhatsappLink(e.target.value)}
                placeholder="https://wa.me/..."
              />
            </div>
            <div className="grid gap-2">
              <Label>Link de Agendamento - Dr. Felipe</Label>
              <Input
                value={felipeLink}
                onChange={(e) => setFelipeLink(e.target.value)}
                placeholder="https://wa.me/..."
              />
            </div>
            <div className="grid gap-2">
              <Label>Link de Agendamento - Dra. Beatriz</Label>
              <Input
                value={beatrizLink}
                onChange={(e) => setBeatrizLink(e.target.value)}
                placeholder="https://wa.me/..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={handleSaveLinks}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
