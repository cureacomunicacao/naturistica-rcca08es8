import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { RichTextEditor } from '@/components/RichTextEditor'
import { useToast } from '@/hooks/use-toast'
import { getPost, createPost, updatePost, getPostImageUrl, type PostRecord } from '@/services/posts'
import { getErrorMessage, extractFieldErrors } from '@/lib/pocketbase/errors'
import { ArrowLeft, Save } from 'lucide-react'
import { Link } from 'react-router-dom'

const CATEGORIES = [
  'ANSIEDADE',
  'INSÔNIA',
  'BURNOUT',
  'DOR CRÔNICA',
  'TRAUMA',
  'TDAH',
  'ENXAQUECA',
  'HISTÓRIA DA PLANTA',
  'ENTEÓGENOS',
  'AYURVEDA',
  'PSICOTERAPIA',
  'ABUSO DE SUBSTÂNCIAS',
  'ESTRESSE',
]

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

export default function BlogPostForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!id)
  const [post, setPost] = useState<PostRecord | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    category: '',
    status: 'draft',
    seo_title: '',
    seo_description: '',
  })

  useEffect(() => {
    if (id) {
      getPost(id)
        .then((data) => {
          setPost(data)
          setFormData({
            title: data.title,
            slug: data.slug,
            content: data.content || '',
            category: data.category || '',
            status: data.status || 'draft',
            seo_title: data.seo_title || '',
            seo_description: data.seo_description || '',
          })
        })
        .catch((err) => {
          if (err?.status === 404 || err?.response?.code === 404) {
            toast({
              title: 'Erro',
              description: 'O registro não existe mais.',
              variant: 'destructive',
            })
            navigate('/admin/blogs')
          } else {
            toast({ title: 'Erro ao carregar post', variant: 'destructive' })
          }
        })
        .finally(() => setInitialLoading(false))
    }
  }, [id, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === 'title' && !id) {
      setFormData((prev) => ({ ...prev, slug: slugify(value) }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Explicitly check for valid content but allow large capacities (> 2000 chars)
    if (!formData.content || formData.content.trim() === '') {
      toast({
        title: 'Aviso',
        description: 'O conteúdo do post não pode estar vazio.',
        variant: 'destructive',
      })
      return
    }

    // Max length check - 5MB roughly translated to 5M characters for safety
    if (formData.content.length > 5000000) {
      toast({
        title: 'Aviso',
        description: 'O conteúdo excedeu o limite máximo suportado de 5MB.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value)
      })
      if (imageFile) {
        data.append('image', imageFile)
      }

      if (id) {
        await updatePost(id, data)
        toast({ title: 'Post atualizado com sucesso!' })
      } else {
        await createPost(data)
        toast({ title: 'Post criado com sucesso!' })
      }
      navigate('/admin/blogs')
    } catch (error: any) {
      const is404 = error?.status === 404 || error?.response?.code === 404
      if (is404) {
        toast({
          title: 'Erro',
          description: 'O registro não existe mais.',
          variant: 'destructive',
        })
        navigate('/admin/blogs')
        return
      }

      const errors = extractFieldErrors(error)
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors)
        toast({
          title: 'Erro de validação',
          description: 'Verifique os campos destacados.',
          variant: 'destructive',
        })
      } else {
        const message = getErrorMessage(error)
        toast({
          title: 'Erro ao salvar o post',
          description:
            message ||
            'Houve um erro ao tentar salvar. Verifique sua conexão ou se o tamanho do conteúdo excedeu o limite.',
          variant: 'destructive',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) return <div>Carregando...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/blogs">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{id ? 'Editar Post' : 'Novo Post'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo Principal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                  {fieldErrors.title && <p className="text-sm text-red-500">{fieldErrors.title}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug URL</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                  />
                  {fieldErrors.slug && <p className="text-sm text-red-500">{fieldErrors.slug}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo</Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(val) => setFormData((prev) => ({ ...prev, content: val }))}
                    className="min-h-[400px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO & Google Positioning</CardTitle>
                <CardDescription>
                  Otimize como seu post aparece nos resultados de busca.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seo_title">Título SEO (Recomendado: 60-70 caracteres)</Label>
                  <Input
                    id="seo_title"
                    name="seo_title"
                    value={formData.seo_title}
                    onChange={handleChange}
                    maxLength={70}
                  />
                  <span className="text-xs text-muted-foreground">
                    {formData.seo_title.length}/70
                  </span>
                  {fieldErrors.seo_title && (
                    <p className="text-sm text-red-500">{fieldErrors.seo_title}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seo_description">
                    Meta Description (Recomendado: 150-160 caracteres)
                  </Label>
                  <Textarea
                    id="seo_description"
                    name="seo_description"
                    value={formData.seo_description}
                    onChange={handleChange}
                    maxLength={160}
                  />
                  <span className="text-xs text-muted-foreground">
                    {formData.seo_description.length}/160
                  </span>
                  {fieldErrors.seo_description && (
                    <p className="text-sm text-red-500">{fieldErrors.seo_description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => handleSelectChange('status', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => handleSelectChange('category', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Imagem de Capa</Label>
                  {post?.image && !imageFile && (
                    <img
                      src={getPostImageUrl(post)}
                      alt="Capa atual"
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                  )}
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Tamanho recomendado: 1200x800px.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Salvando...' : 'Salvar Post'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
