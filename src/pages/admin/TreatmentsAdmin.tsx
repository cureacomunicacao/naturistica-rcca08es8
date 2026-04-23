import { useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/RichTextEditor'
import { useToast } from '@/hooks/use-toast'
import { Pencil } from 'lucide-react'
import { useRealtime } from '@/hooks/use-realtime'

export default function TreatmentsAdmin() {
  const [treatments, setTreatments] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    seo_title: '',
    seo_description: '',
    image_alt: '',
  })
  const [file, setFile] = useState<File | null>(null)

  const fetchTreatments = async () => {
    const records = await pb.collection('treatments').getFullList({ sort: 'title' })
    setTreatments(records)
  }

  useEffect(() => {
    fetchTreatments()
  }, [])

  useRealtime('treatments', fetchTreatments)

  const currentTreatment = editingId ? treatments.find((t) => t.id === editingId) : null

  const handleEdit = (t: any) => {
    setEditingId(t.id)
    setFormData({
      title: t.title,
      slug: t.slug,
      content: t.content,
      seo_title: t.seo_title || '',
      seo_description: t.seo_description || '',
      image_alt: t.image_alt || '',
    })
    setFile(null)
    setOpen(true)
  }

  const handleCreate = () => {
    setEditingId(null)
    setFormData({
      title: '',
      slug: '',
      content: '',
      seo_title: '',
      seo_description: '',
      image_alt: '',
    })
    setFile(null)
    setOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = new FormData()
      Object.entries(formData).forEach(([k, v]) => data.append(k, v))
      if (file) data.append('image', file)

      if (editingId) {
        if (typeof editingId !== 'string' || editingId.trim() === '') {
          toast({
            title: 'Erro',
            description: 'ID de tratamento inválido.',
            variant: 'destructive',
          })
          return
        }

        const existsLocally = treatments.some((t) => t.id === editingId)
        if (!existsLocally) {
          toast({
            title: 'Erro',
            description: 'O registro não pôde ser encontrado. Pode ter sido excluído.',
            variant: 'destructive',
          })
          setOpen(false)
          fetchTreatments()
          return
        }

        await pb.collection('treatments').update(editingId, data)
        toast({ title: 'Sucesso', description: 'Tratamento atualizado.' })
      } else {
        await pb.collection('treatments').create(data)
        toast({ title: 'Sucesso', description: 'Tratamento criado.' })
      }
      setOpen(false)
      fetchTreatments()
    } catch (err: any) {
      const is404 = err?.status === 404 || err?.response?.code === 404
      if (is404) {
        toast({
          title: 'Erro',
          description: 'O registro não pôde ser encontrado. Pode ter sido excluído.',
          variant: 'destructive',
        })
        setOpen(false)
        fetchTreatments()
      } else {
        toast({
          title: 'Erro',
          description: err?.message || 'Erro ao salvar tratamento',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tratamentos</h1>
        <Button onClick={handleCreate} className="text-white">
          Novo Tratamento
        </Button>
      </div>

      <div className="bg-white border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {treatments.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.title}</TableCell>
                <TableCell>{t.slug}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(t)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Tratamento' : 'Novo Tratamento'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Imagem de Destaque</Label>
              {currentTreatment && currentTreatment.image && !file && (
                <div className="mb-4">
                  <img
                    src={pb.files.getURL(currentTreatment, currentTreatment.image)}
                    alt="Current preview"
                    className="h-32 w-48 object-cover rounded-md border"
                  />
                </div>
              )}
              {file && (
                <div className="mb-4">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="New preview"
                    className="h-32 w-48 object-cover rounded-md border"
                  />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-muted-foreground mt-1">Tamanho recomendado: 1200x800px.</p>
            </div>
            <div className="space-y-2">
              <Label>Alt Text da Imagem</Label>
              <Input
                value={formData.image_alt}
                onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
                placeholder="Descrição para acessibilidade e SEO"
              />
            </div>
            <div className="space-y-2">
              <Label>Conteúdo</Label>
              <RichTextEditor
                value={formData.content}
                onChange={(v) => setFormData({ ...formData, content: v })}
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
