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
import { useToast } from '@/hooks/use-toast'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    patient_name: '',
    doctor: '',
    content: '',
    active: true,
  })
  const [file, setFile] = useState<File | null>(null)

  const fetchTestimonials = async () => {
    try {
      const records = await pb.collection('testimonials').getFullList({ sort: '-created' })
      setTestimonials(records)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const handleEdit = (t: any) => {
    setEditingId(t.id)
    setFormData({
      patient_name: t.patient_name,
      doctor: t.doctor || '',
      content: t.content || '',
      active: t.active !== false,
    })
    setFile(null)
    setOpen(true)
  }

  const handleCreate = () => {
    setEditingId(null)
    setFormData({
      patient_name: '',
      doctor: '',
      content: '',
      active: true,
    })
    setFile(null)
    setOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir?')) return
    try {
      await pb.collection('testimonials').delete(id)
      toast({ title: 'Sucesso', description: 'Depoimento excluído.' })
      fetchTestimonials()
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = new FormData()
      Object.entries(formData).forEach(([k, v]) => data.append(k, String(v)))
      if (file) data.append('image', file)

      if (editingId) {
        await pb.collection('testimonials').update(editingId, data)
        toast({ title: 'Sucesso', description: 'Depoimento atualizado.' })
      } else {
        await pb.collection('testimonials').create(data)
        toast({ title: 'Sucesso', description: 'Depoimento criado.' })
      }
      setOpen(false)
      fetchTestimonials()
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Depoimentos</h1>
        <Button onClick={handleCreate} className="text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Depoimento
        </Button>
      </div>

      <div className="bg-white border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Médico(a)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[150px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.patient_name}</TableCell>
                <TableCell>{t.doctor || '-'}</TableCell>
                <TableCell>{t.active ? 'Ativo' : 'Inativo'}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(t)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(t.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {testimonials.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhum depoimento encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Depoimento' : 'Novo Depoimento'}</DialogTitle>
            <DialogDescription className="sr-only">
              Preencha os detalhes do depoimento abaixo.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do Paciente</Label>
                <Input
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Médico(a)</Label>
                <Select
                  value={formData.doctor}
                  onValueChange={(v) => setFormData({ ...formData, doctor: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Felipe">Dr. Felipe</SelectItem>
                    <SelectItem value="Beatriz">Dra. Beatriz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Foto do Paciente</Label>
              {editingId && testimonials.find((t) => t.id === editingId)?.image && !file && (
                <div className="mb-4">
                  <img
                    src={pb.files.getURL(
                      testimonials.find((t) => t.id === editingId),
                      testimonials.find((t) => t.id === editingId).image,
                    )}
                    alt="Current preview"
                    className="h-20 w-20 object-cover rounded-full border"
                  />
                </div>
              )}
              {file && (
                <div className="mb-4">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="New preview"
                    className="h-20 w-20 object-cover rounded-full border"
                  />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tamanho recomendado: 400x400px (1:1).
              </p>
            </div>

            <div className="space-y-2">
              <Label>Depoimento (Conteúdo)</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="h-32"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.active}
                onCheckedChange={(c) => setFormData({ ...formData, active: c })}
              />
              <Label>Exibir no site</Label>
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
