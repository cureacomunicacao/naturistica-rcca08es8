import { useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSettings } from '@/hooks/use-settings'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pencil } from 'lucide-react'

function SectionSettings({
  prefix,
  title,
  settingsList,
}: {
  prefix: string
  title: string
  settingsList: any[]
}) {
  const { toast } = useToast()
  const { refresh } = useSettings()

  const [seoTitle, setSeoTitle] = useState('')
  const [seoDesc, setSeoDesc] = useState('')
  const [imgValue, setImgValue] = useState('')
  const [imgAlt, setImgAlt] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const imgKey =
    prefix === 'home'
      ? 'home_hero_image'
      : prefix === 'about'
        ? 'about_main_image'
        : 'treatments_banner_image'

  useEffect(() => {
    const t = settingsList.find((s) => s.key === `${prefix}_seo_title`)
    const d = settingsList.find((s) => s.key === `${prefix}_seo_description`)
    const i = settingsList.find((s) => s.key === imgKey)

    if (t) setSeoTitle(t.value)
    if (d) setSeoDesc(d.value)
    if (i) {
      setImgValue(i.value)
      setImgAlt(i.image_alt || '')
    }
  }, [settingsList, prefix, imgKey])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const updates = [
        { key: `${prefix}_seo_title`, value: seoTitle },
        { key: `${prefix}_seo_description`, value: seoDesc },
      ]

      for (const u of updates) {
        let record = settingsList.find((s) => s.key === u.key)
        if (record) {
          await pb.collection('site_settings').update(record.id, { value: u.value })
        }
      }

      let imgRecord = settingsList.find((s) => s.key === imgKey)
      if (imgRecord) {
        const formData = new FormData()
        formData.append('value', imgValue)
        formData.append('image_alt', imgAlt)
        if (file) formData.append('image', file)
        await pb.collection('site_settings').update(imgRecord.id, formData)
      }

      toast({ title: 'Sucesso', description: 'Configurações salvas.' })
      refresh()
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Gerencie as meta tags e a imagem de destaque desta página.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">SEO da Página</h3>
            <div className="space-y-2">
              <Label>Título da Página (Meta Title)</Label>
              <Input
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Ex: Naturística | Página Inicial"
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição da Página (Meta Description)</Label>
              <Textarea
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                placeholder="Resumo do conteúdo da página para buscadores..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Mídia Principal</h3>
            <div className="space-y-2">
              <Label>Imagem de Destaque</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tamanho recomendado: 1920x1080px (Banner full-width).
              </p>
            </div>
            <div className="space-y-2">
              <Label>Título da Imagem (SEO Title)</Label>
              <Input
                value={imgValue}
                onChange={(e) => setImgValue(e.target.value)}
                placeholder="Título da imagem..."
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição da Imagem (Alt Text)</Label>
              <Textarea
                value={imgAlt}
                onChange={(e) => setImgAlt(e.target.value)}
                placeholder="Descrição detalhada para acessibilidade..."
              />
            </div>
          </div>

          <Button type="submit" className="text-white">
            Salvar Alterações
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function TreatmentsSeoList() {
  const [treatments, setTreatments] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({ seo_title: '', seo_description: '', image_alt: '' })
  const { toast } = useToast()

  const load = async () => {
    const records = await pb.collection('treatments').getFullList({ sort: 'title' })
    setTreatments(records)
  }

  useEffect(() => {
    load()
  }, [])

  const handleEdit = (t: any) => {
    setEditing(t)
    setFormData({
      seo_title: t.seo_title || '',
      seo_description: t.seo_description || '',
      image_alt: t.image_alt || '',
    })
    setFile(null)
    setOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    try {
      const data = new FormData()
      Object.entries(formData).forEach(([k, v]) => data.append(k, v))
      if (file) data.append('image', file)

      await pb.collection('treatments').update(editing.id, data)
      toast({ title: 'Sucesso', description: 'Tratamento atualizado.' })
      setOpen(false)
      load()
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-xl font-bold">SEO Individual dos Tratamentos</h3>
      <div className="bg-white border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tratamento</TableHead>
              <TableHead>SEO Title</TableHead>
              <TableHead className="w-[180px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {treatments.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.title}</TableCell>
                <TableCell>{t.seo_title || '-'}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(t)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar SEO/Imagem
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar SEO - {editing?.title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Imagem</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tamanho recomendado: 800x600px (Proporção 4:3).
              </p>
            </div>
            <div className="space-y-2">
              <Label>Alt Text da Imagem</Label>
              <Input
                value={formData.image_alt}
                onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>SEO Title</Label>
              <Input
                value={formData.seo_title}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>SEO Description</Label>
              <Textarea
                value={formData.seo_description}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="text-white">
                Salvar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function MediaSettingsAdmin() {
  const [settingsList, setSettingsList] = useState<any[]>([])

  const loadSettings = async () => {
    const records = await pb.collection('site_settings').getFullList()
    setSettingsList(records)
  }

  useEffect(() => {
    loadSettings()
  }, [])

  if (!settingsList.length) return <div className="p-8">Carregando...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Media & SEO Management
        </h1>
        <p className="text-muted-foreground">
          Gerencie imagens e metadados de SEO das páginas principais.
        </p>
      </div>

      <Tabs defaultValue="home">
        <TabsList className="mb-4">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="home">Página Inicial</TabsTrigger>
          <TabsTrigger value="about">Sobre Nós</TabsTrigger>
          <TabsTrigger value="treatments">Tratamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle>Geral</CardTitle>
              <CardDescription>Configurações globais de mídia e SEO.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Use as outras abas para configurar as páginas específicas. Em breve mais opções
                gerais.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="home">
          <SectionSettings prefix="home" title="Página Inicial" settingsList={settingsList} />
        </TabsContent>

        <TabsContent value="about">
          <SectionSettings prefix="about" title="Sobre Nós" settingsList={settingsList} />
        </TabsContent>

        <TabsContent value="treatments">
          <SectionSettings
            prefix="treatments"
            title="Página de Tratamentos (Geral)"
            settingsList={settingsList}
          />
          <TreatmentsSeoList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
