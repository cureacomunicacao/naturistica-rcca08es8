import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
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
import { PostImageGallery } from '@/components/admin/PostImageGallery'
import { useToast } from '@/hooks/use-toast'
import {
  getPost,
  createPost,
  updatePost,
  getPostImageUrl,
  getBlogCategories,
  type PostRecord,
  type BlogCategoryRecord,
} from '@/services/posts'
import { getErrorMessage, extractFieldErrors } from '@/lib/pocketbase/errors'
import { ArrowLeft, Save } from 'lucide-react'

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
  const [categories, setCategories] = useState<BlogCategoryRecord[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    category_ref: '',
    status: 'draft',
    seo_title: '',
    seo_description: '',
    image_alt: '',
    published_at: new Date().toISOString().slice(0, 16),
  })

  useEffect(() => {
    getBlogCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    if (id) {
      getPost(id)
        .then((data) => {
          setPost(data)
          setFormData({
            title: data.title,
            slug: data.slug,
            content: data.content || '',
            category_ref: data.category_ref || '',
            status: data.status || 'draft',
            seo_title: data.seo_title || '',
            seo_description: data.seo_description || '',
            image_alt: data.image_alt || '',
            published_at: data.published_at
              ? new Date(data.published_at).toISOString().slice(0, 16)
              : new Date().toISOString().slice(0, 16),
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
  }, [id, toast, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === 'title' && !id) {
      setFormData((prev) => ({ ...prev, slug: slugify(value) }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value === 'none' ? '' : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.content || formData.content.trim() === '') {
      toast({
        title: 'Aviso',
        description: 'O conteúdo não pode estar vazio.',
        variant: 'destructive',
      })
      return
    }

    if (formData.content.length > 5000000) {
      toast({
        title: 'Aviso',
        description: 'O conteúdo excedeu o limite de 5MB.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'published_at') {
          if (value) {
            data.append(key, new Date(value as string).toISOString())
          } else {
            data.append(key, new Date().toISOString())
          }
        } else {
          data.append(key, String(value))
        }
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
      const errors = extractFieldErrors(error)
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors)
        toast({
          title: 'Erro de validação',
          description: 'Verifique os campos destacados.',
          variant: 'destructive',
        })
      } else {
        toast({ title: 'Erro', description: getErrorMessage(error), variant: 'destructive' })
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
                <CardTitle>Imagens no Conteúdo</CardTitle>
                <CardDescription>
                  Faça upload de imagens e use tags como [img-1] no editor de texto para inseri-las.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!id ? (
                  <p className="text-sm text-muted-foreground">
                    Salve o post primeiro para poder adicionar imagens ao conteúdo.
                  </p>
                ) : (
                  <PostImageGallery postId={id} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO & Google Positioning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seo_title">Título SEO</Label>
                  <Input
                    id="seo_title"
                    name="seo_title"
                    value={formData.seo_title}
                    onChange={handleChange}
                    maxLength={70}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seo_description">Meta Description</Label>
                  <Textarea
                    id="seo_description"
                    name="seo_description"
                    value={formData.seo_description}
                    onChange={handleChange}
                    maxLength={160}
                  />
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
                  <Label htmlFor="category_ref">Categoria</Label>
                  <Select
                    value={formData.category_ref || 'none'}
                    onValueChange={(v) => handleSelectChange('category_ref', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem categoria</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="published_at">Data de Publicação</Label>
                  <Input
                    id="published_at"
                    name="published_at"
                    type="datetime-local"
                    value={formData.published_at}
                    onChange={handleChange}
                  />
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_alt">Texto Alternativo da Capa (Alt-Text)</Label>
                  <Input
                    id="image_alt"
                    name="image_alt"
                    value={formData.image_alt}
                    onChange={handleChange}
                    placeholder="Descrição da imagem para acessibilidade"
                  />
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
