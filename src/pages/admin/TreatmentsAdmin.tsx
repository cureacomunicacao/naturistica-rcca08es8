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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/RichTextEditor'
import { useToast } from '@/hooks/use-toast'
import { Pencil, Trash2 } from 'lucide-react'
import { useRealtime } from '@/hooks/use-realtime'
import { Switch } from '@/components/ui/switch'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

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
    order: 0,
    active: true,
  })
  const [file, setFile] = useState<File | null>(null)
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [itemToDelete, setItemToDelete] = useState<any>(null)

  const fetchTreatments = async () => {
    const records = await pb.collection('treatments').getFullList({ sort: 'order,title' })
    setTreatments(records)
  }

  useEffect(() => {
    fetchTreatments()
  }, [])

  useRealtime('treatments', fetchTreatments)

  const currentTreatment = editingId ? treatments.find((t) => t.id === editingId) : null

  const handleEdit = async (t: any) => {
    try {
      const record = await pb.collection('treatments').getOne(t.id)
      setEditingId(record.id)
      setFormData({
        title: record.title,
        slug: record.slug,
        content: record.content || '',
        seo_title: record.seo_title || '',
        seo_description: record.seo_description || '',
        image_alt: record.image_alt || '',
        order: record.order || 0,
        active: record.active !== false,
      })
      setFile(null)
      setIconFile(null)
      setFieldErrors({})
      setOpen(true)
    } catch (error: any) {
      if (error?.status === 404 || error?.response?.code === 404) {
        toast({
          title: 'Erro',
          description: 'O registro não existe mais.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao carregar o registro. A lista foi atualizada.',
          variant: 'destructive',
        })
      }
      fetchTreatments()
    }
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
      order: 0,
      active: true,
    })
    setFile(null)
    setIconFile(null)
    setFieldErrors({})
    setOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFieldErrors({})
    try {
      const data = new FormData()
      Object.entries(formData).forEach(([k, v]) => data.append(k, v))
      if (file) data.append('image', file)
      if (iconFile) data.append('icon', iconFile)

      if (editingId) {
        if (typeof editingId !== 'string' || editingId.trim() === '') {
          toast({
            title: 'Erro',
            description: 'ID de tratamento inválido.',
            variant: 'destructive',
          })
          return
        }

        await pb.collection('treatments').update(editingId, data)
        toast({ title: 'Sucesso', description: 'Tratamento atualizado.' })
      } else {
        await pb.collection('treatments').create(data)
        toast({ title: 'Sucesso', description: 'Tratamento criado.' })
      }
      setEditingId(null)
      setFile(null)
      setIconFile(null)
      setFormData({
        title: '',
        slug: '',
        content: '',
        seo_title: '',
        seo_description: '',
        image_alt: '',
        order: 0,
        active: true,
      })
      setOpen(false)
      fetchTreatments()
    } catch (err: any) {
      const is404 = err?.status === 404 || err?.response?.code === 404
      const isAuthError = err?.status === 401 || err?.status === 403

      if (is404) {
        toast({
          title: 'Erro',
          description: 'O registro não existe mais.',
          variant: 'destructive',
        })
        setEditingId(null)
        setFile(null)
        setIconFile(null)
        setFormData({
          title: '',
          slug: '',
          content: '',
          seo_title: '',
          seo_description: '',
          image_alt: '',
          order: 0,
          active: true,
        })
        setOpen(false)
        fetchTreatments()
      } else if (isAuthError) {
        toast({
          title: 'Sessão Expirada',
          description: 'Sua sessão expirou ou você não tem permissão.',
          variant: 'destructive',
        })
        setOpen(false)
      } else {
        const errors = err?.response?.data || {}
        const extractedErrors: Record<string, string> = {}
        Object.keys(errors).forEach((key) => {
          extractedErrors[key] = errors[key]?.message || 'Campo inválido'
        })

        if (Object.keys(extractedErrors).length > 0) {
          setFieldErrors(extractedErrors)
          toast({
            title: 'Erro de validação',
            description: 'Verifique os campos destacados.',
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Erro',
            description:
              err?.message || 'Erro ao salvar tratamento. Verifique os dados e tente novamente.',
            variant: 'destructive',
          })
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!itemToDelete) return
    try {
      await pb.collection('treatments').delete(itemToDelete.id)
      toast({ title: 'Sucesso', description: 'Tratamento excluído.' })
      fetchTreatments()
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao excluir tratamento.', variant: 'destructive' })
    } finally {
      setItemToDelete(null)
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
              <TableHead>Ordem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {treatments.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.title}</TableCell>
                <TableCell>{t.slug}</TableCell>
                <TableCell>{t.order || 0}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${t.active !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {t.active !== false ? 'Ativo' : 'Inativo'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(t)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setItemToDelete(t)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este tratamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Tratamento' : 'Novo Tratamento'}</DialogTitle>
            <DialogDescription className="sr-only">
              Preencha os detalhes do tratamento abaixo.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ordem de Exibição</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2 flex flex-col justify-center">
                <Label>Status</Label>
                <div className="flex items-center space-x-2 h-10">
                  <Switch
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <span className="text-sm text-muted-foreground">
                    {formData.active ? 'Ativo (Visível)' : 'Inativo (Oculto)'}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                {fieldErrors.title && <p className="text-sm text-red-500">{fieldErrors.title}</p>}
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
                {fieldErrors.slug && <p className="text-sm text-red-500">{fieldErrors.slug}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ícone do Tratamento</Label>
              {currentTreatment && currentTreatment.icon && !iconFile && (
                <div className="mb-4">
                  <img
                    src={pb.files.getURL(currentTreatment, currentTreatment.icon)}
                    alt="Current icon preview"
                    className="h-16 w-16 object-contain rounded-md border bg-muted"
                  />
                </div>
              )}
              {iconFile && (
                <div className="mb-4">
                  <img
                    src={URL.createObjectURL(iconFile)}
                    alt="New icon preview"
                    className="h-16 w-16 object-contain rounded-md border bg-muted"
                  />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setIconFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tamanho recomendado: SVG ou PNG (Ex: 128x128).
              </p>
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" className="text-white" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
