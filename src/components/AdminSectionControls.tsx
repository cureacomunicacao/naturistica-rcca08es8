import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, ArrowUp, ArrowDown, Settings as SettingsIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import pb from '@/lib/pocketbase/client'
import { PageSectionRecord } from '@/services/page_sections'

export function AddSectionButton({
  pageSlug,
  order,
  sections,
}: {
  pageSlug: string
  order: number
  sections: PageSectionRecord[]
}) {
  const [open, setOpen] = useState(false)

  const handleAdd = async (type: string) => {
    const toShift = sections.filter((s) => s.order >= order)
    for (const s of toShift) {
      await pb.collection('page_sections').update(s.id, { order: s.order + 1 })
    }
    await pb.collection('page_sections').create({
      page_slug: pageSlug,
      type,
      order,
      active: true,
      background_color: '',
      text_color: '',
      padding_y: 64,
    })
    setOpen(false)
  }

  return (
    <div className="relative py-4 flex justify-center opacity-0 hover:opacity-100 transition-opacity z-40 my-2">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t-2 border-dashed border-primary/50" />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="relative rounded-full shadow-lg gap-2 bg-primary text-white">
            <Plus className="w-4 h-4" /> Adicionar Seção
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escolha o tipo de seção</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {['hero', 'list', 'side_image_right', 'side_image_left', 'video', 'cards'].map((t) => (
              <Button key={t} variant="outline" onClick={() => handleAdd(t)} className="capitalize">
                {t.replace(/_/g, ' ')}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function EditableSectionWrapper({
  section,
  sections,
  children,
}: {
  section: PageSectionRecord
  sections: PageSectionRecord[]
  children: React.ReactNode
}) {
  const handleDelete = async () => {
    if (confirm('Deletar seção permanentemente?')) {
      await pb.collection('page_sections').delete(section.id)
    }
  }

  const move = async (dir: 1 | -1) => {
    const targetOrder = section.order + dir
    const swap = sections.find((s) => s.order === targetOrder)
    if (swap) {
      await pb.collection('page_sections').update(swap.id, { order: section.order })
    }
    await pb.collection('page_sections').update(section.id, { order: targetOrder })
  }

  const [bg, setBg] = useState(section.background_color || '')
  const [color, setColor] = useState(section.text_color || '')
  const [py, setPy] = useState(section.padding_y?.toString() || '64')
  const [videoUrl, setVideoUrl] = useState(section.video_url || '')
  const [btnLink, setBtnLink] = useState(section.button_link || '')

  const handleSaveSettings = async () => {
    await pb.collection('page_sections').update(section.id, {
      background_color: bg,
      text_color: color,
      padding_y: parseInt(py) || 0,
      video_url: videoUrl,
      button_link: btnLink,
    })
  }

  return (
    <div className="relative group/section outline-2 outline-transparent hover:outline-primary/20 outline-dashed transition-all">
      <div className="absolute top-4 right-4 z-50 opacity-0 group-hover/section:opacity-100 transition-opacity flex items-center gap-1 bg-background p-1.5 rounded-lg shadow-xl border">
        <Button variant="ghost" size="icon" onClick={() => move(-1)} className="h-8 w-8">
          <ArrowUp className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => move(1)} className="h-8 w-8">
          <ArrowDown className="w-4 h-4" />
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SettingsIcon className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurações da Seção</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Cor de Fundo (Ex: #ffffff, transparent)</Label>
                <Input value={bg} onChange={(e) => setBg(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Cor do Texto (Ex: #000000, inherit)</Label>
                <Input value={color} onChange={(e) => setColor(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Padding Vertical (px)</Label>
                <Input type="number" value={py} onChange={(e) => setPy(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Link do Botão</Label>
                <Input
                  value={btnLink}
                  onChange={(e) => setBtnLink(e.target.value)}
                  placeholder="/contato"
                />
              </div>
              {section.type === 'video' && (
                <div className="grid gap-2">
                  <Label>URL do YouTube</Label>
                  <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                </div>
              )}
              <Button onClick={handleSaveSettings}>Salvar Configurações</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      {children}
    </div>
  )
}
