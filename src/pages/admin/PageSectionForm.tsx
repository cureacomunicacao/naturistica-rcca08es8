import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { RichTextEditor } from '@/components/RichTextEditor'
import pb from '@/lib/pocketbase/client'
import { Loader2 } from 'lucide-react'

export default function PageSectionForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    page_slug: 'home',
    type: 'hero',
    title: '',
    description: '',
    video_url: '',
    button_text: '',
    button_link: '',
    background_color: '#ffffff',
    text_color: '#000000',
    padding_y: 64,
    content: [] as any[],
  })

  useEffect(() => {
    if (id) {
      pb.collection('page_sections')
        .getOne(id)
        .then((record) => {
          setFormData({
            page_slug: record.page_slug,
            type: record.type,
            title: record.title || '',
            description: record.description || '',
            video_url: record.video_url || '',
            button_text: record.button_text || '',
            button_link: record.button_link || '',
            background_color: record.background_color || '#ffffff',
            text_color: record.text_color || '#000000',
            padding_y: record.padding_y !== undefined ? record.padding_y : 64,
            content: Array.isArray(record.content) ? record.content : [],
          })
        })
        .catch((e) => {
          toast({
            title: 'Erro',
            description: 'Não foi possível carregar a seção',
            variant: 'destructive',
          })
        })
    }
  }, [id, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      data.append('page_slug', formData.page_slug)
      data.append('type', formData.type)
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('video_url', formData.video_url)
      data.append('button_text', formData.button_text)
      data.append('button_link', formData.button_link)
      data.append('background_color', formData.background_color)
      data.append('text_color', formData.text_color)
      data.append('padding_y', formData.padding_y.toString())
      data.append('content', JSON.stringify(formData.content))

      if (!id) {
        data.append('active', 'true')
      }

      if (file) {
        data.append('image', file)
      }

      if (id) {
        await pb.collection('page_sections').update(id, data)
      } else {
        const list = await pb.collection('page_sections').getFullList({
          filter: `page_slug="${formData.page_slug}"`,
        })
        data.append('order', list.length.toString())
        await pb.collection('page_sections').create(data)
      }
      toast({ title: 'Seção salva com sucesso' })
      navigate('/admin/sections')
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const addContentItem = () => {
    setFormData({ ...formData, content: [...formData.content, { title: '', description: '' }] })
  }

  const updateContentItem = (index: number, key: string, val: string) => {
    const newContent = [...formData.content]
    newContent[index][key] = val
    setFormData({ ...formData, content: newContent })
  }

  const removeContentItem = (index: number) => {
    setFormData({ ...formData, content: formData.content.filter((_, i) => i !== index) })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{id ? 'Editar Seção' : 'Nova Seção'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Layout</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero (Destaque Principal)</SelectItem>
                    <SelectItem value="list">Lista</SelectItem>
                    <SelectItem value="side_image_right">Imagem à Direita</SelectItem>
                    <SelectItem value="side_image_left">Imagem à Esquerda</SelectItem>
                    <SelectItem value="video">Vídeo do YouTube</SelectItem>
                    <SelectItem value="cards">Grade de Cards</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Página</Label>
                <Input
                  value={formData.page_slug}
                  onChange={(e) => setFormData({ ...formData, page_slug: e.target.value })}
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Título Principal</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Descrição / Texto</Label>
              <RichTextEditor
                content={formData.description}
                onChange={(v) => setFormData({ ...formData, description: v })}
                placeholder="Insira o conteúdo da seção..."
              />
            </div>

            {['hero', 'side_image_right', 'side_image_left'].includes(formData.type) && (
              <div className="space-y-2">
                <Label>Imagem da Seção</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
            )}

            {formData.type === 'video' && (
              <div className="space-y-2">
                <Label>URL do YouTube</Label>
                <Input
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            )}

            {['hero', 'side_image_right', 'side_image_left'].includes(formData.type) && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Texto do Botão (Opcional)</Label>
                  <Input
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link do Botão</Label>
                  <Input
                    value={formData.button_link}
                    onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                  />
                </div>
              </div>
            )}

            {['list', 'cards'].includes(formData.type) && (
              <div className="space-y-4 pt-4 border-t">
                <Label>Itens ({formData.type === 'list' ? 'Lista' : 'Cards'})</Label>
                {formData.content.map((item, i) => (
                  <div key={i} className="flex gap-4 items-start bg-muted/50 p-4 rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={item.title}
                        onChange={(e) => updateContentItem(i, 'title', e.target.value)}
                        placeholder="Título do item"
                      />
                      <Input
                        value={item.description}
                        onChange={(e) => updateContentItem(i, 'description', e.target.value)}
                        placeholder="Descrição do item"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeContentItem(i)}
                    >
                      X
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addContentItem}>
                  Adicionar Item
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Cor de Fundo</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  className="w-12 h-10 p-1"
                  value={formData.background_color}
                  onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                />
                <Input
                  className="flex-1"
                  value={formData.background_color}
                  onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cor do Texto</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  className="w-12 h-10 p-1"
                  value={formData.text_color}
                  onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                />
                <Input
                  className="flex-1"
                  value={formData.text_color}
                  onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Espaçamento Vertical (px)</Label>
              <Input
                type="number"
                value={formData.padding_y}
                onChange={(e) => setFormData({ ...formData, padding_y: Number(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pb-10">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/sections')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Salvar Seção
          </Button>
        </div>
      </form>
    </div>
  )
}
