import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Settings, Globe, Home, Info, Stethoscope, FileText } from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { useSettings } from '@/hooks/use-settings'

export default function SiteSettingsAdmin() {
  const { settings, refresh } = useSettings()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<Record<string, { value: string; file: File | null }>>({})

  useEffect(() => {
    const initial: any = {}
    const keys = [
      'global_email',
      'global_phone',
      'global_instagram',
      'global_logo',
      'home_meta_title',
      'home_meta_description',
      'home_hero_image',
      // About
      'about_meta_title',
      'about_meta_description',
      'about_hero_image',
      'about_content',
      'about_felipe_title',
      'about_felipe_content',
      'doctor_felipe_image',
      'about_beatriz_title',
      'about_beatriz_content',
      'doctor_beatriz_image',
      'about_whatsapp_url',
      'about_whatsapp_label',
      // Treatments
      'treatments_meta_title',
      'treatments_meta_description',
      'treatments_banner_image',
      'treatments_approach_title',
      'treatments_approach_content',
      'treatments_approach_image',
      // Blog
      'blog_meta_title',
      'blog_meta_description',
    ]
    keys.forEach((k) => {
      initial[k] = { value: settings[k]?.value || '', file: null }
    })
    setFormData(initial)
  }, [settings])

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: { ...prev[key], value } }))
  }

  const handleFileChange = (key: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [key]: { ...prev[key], file } }))
  }

  const handleSave = async (keysToSave: string[]) => {
    setLoading(true)
    try {
      for (const key of keysToSave) {
        if (!formData[key]) continue

        const fd = new FormData()
        fd.append('key', key)
        fd.append('value', formData[key].value)
        if (formData[key].file) {
          fd.append('image', formData[key].file as Blob)
        }

        if (settings[key]) {
          await pb.collection('site_settings').update(settings[key].id, fd)
        } else {
          await pb.collection('site_settings').create(fd)
        }
      }
      toast.success('Configurações salvas com sucesso!')
      await refresh()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao salvar as configurações.')
    } finally {
      setLoading(false)
    }
  }

  const renderImagePreview = (key: string) => {
    if (formData[key]?.file) {
      return <span className="text-sm text-green-600 ml-2">Nova imagem pronta para salvar</span>
    }
    if (settings[key]?.image) {
      return (
        <a
          href={pb.files.getURL(settings[key], settings[key].image)}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-blue-600 ml-2 hover:underline inline-flex items-center gap-1"
        >
          <img
            src={pb.files.getURL(settings[key], settings[key].image)}
            alt="Preview"
            className="h-8 w-8 object-cover rounded"
          />
          Ver atual
        </a>
      )
    }
    return <span className="text-sm text-muted-foreground ml-2">Sem imagem</span>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Configurações do Site (CMS)</h1>
      </div>

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="mb-6 flex flex-wrap h-auto bg-muted/50 p-1 rounded-lg">
          <TabsTrigger value="global" className="gap-2">
            <Globe className="w-4 h-4" /> Geral
          </TabsTrigger>
          <TabsTrigger value="home" className="gap-2">
            <Home className="w-4 h-4" /> Início
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-2">
            <Info className="w-4 h-4" /> Sobre Nós
          </TabsTrigger>
          <TabsTrigger value="treatments" className="gap-2">
            <Stethoscope className="w-4 h-4" /> Tratamentos
          </TabsTrigger>
          <TabsTrigger value="blog" className="gap-2">
            <FileText className="w-4 h-4" /> Blog
          </TabsTrigger>
        </TabsList>

        {/* --- GLOBAL --- */}
        <TabsContent value="global">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Globais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Email de Contato</Label>
                  <Input
                    value={formData['global_email']?.value || ''}
                    onChange={(e) => handleChange('global_email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone (WhatsApp)</Label>
                  <Input
                    value={formData['global_phone']?.value || ''}
                    onChange={(e) => handleChange('global_phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link do Instagram</Label>
                  <Input
                    value={formData['global_instagram']?.value || ''}
                    onChange={(e) => handleChange('global_instagram', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Logo do Site</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('global_logo', e.target.files?.[0] || null)}
                    />
                    {renderImagePreview('global_logo')}
                  </div>
                </div>
              </div>
              <Button
                disabled={loading}
                onClick={() =>
                  handleSave(['global_logo', 'global_email', 'global_phone', 'global_instagram'])
                }
              >
                Salvar Geral
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- HOME --- */}
        <TabsContent value="home">
          <Card>
            <CardHeader>
              <CardTitle>Página Inicial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-3xl">
              <div className="space-y-2">
                <Label>Meta Title (SEO)</Label>
                <Input
                  value={formData['home_meta_title']?.value || ''}
                  onChange={(e) => handleChange('home_meta_title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Description (SEO)</Label>
                <Textarea
                  value={formData['home_meta_description']?.value || ''}
                  onChange={(e) => handleChange('home_meta_description', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Imagem Principal (Hero Banner)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange('home_hero_image', e.target.files?.[0] || null)
                    }
                  />
                  {renderImagePreview('home_hero_image')}
                </div>
              </div>
              <Button
                disabled={loading}
                onClick={() =>
                  handleSave(['home_meta_title', 'home_meta_description', 'home_hero_image'])
                }
              >
                Salvar Início
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- ABOUT --- */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>Página Sobre Nós</CardTitle>
              <CardDescription>
                Gerencie textos e fotos da página institucional. Suporta HTML básico para formatação
                de texto.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Seção Principal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Introdução (Hero)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Meta Title (SEO)</Label>
                    <Input
                      value={formData['about_meta_title']?.value || ''}
                      onChange={(e) => handleChange('about_meta_title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Description (SEO)</Label>
                    <Input
                      value={formData['about_meta_description']?.value || ''}
                      onChange={(e) => handleChange('about_meta_description', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Imagem de Capa (Hero)</Label>
                  <div className="flex items-center gap-2 max-w-xl">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange('about_hero_image', e.target.files?.[0] || null)
                      }
                    />
                    {renderImagePreview('about_hero_image')}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Texto de Introdução (Suporta HTML)</Label>
                  <Textarea
                    className="min-h-[100px]"
                    value={formData['about_content']?.value || ''}
                    onChange={(e) => handleChange('about_content', e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              {/* Equipe */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Dr Felipe */}
                <div className="space-y-4 bg-muted/20 p-4 rounded-xl border border-border/50">
                  <h3 className="text-lg font-semibold">Perfil: Dr. Felipe</h3>
                  <div className="space-y-2">
                    <Label>Nome / Título</Label>
                    <Input
                      value={formData['about_felipe_title']?.value || ''}
                      onChange={(e) => handleChange('about_felipe_title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Biografia (Suporta HTML)</Label>
                    <Textarea
                      className="min-h-[150px]"
                      value={formData['about_felipe_content']?.value || ''}
                      onChange={(e) => handleChange('about_felipe_content', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Foto Dr. Felipe</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange('doctor_felipe_image', e.target.files?.[0] || null)
                        }
                      />
                      {renderImagePreview('doctor_felipe_image')}
                    </div>
                  </div>
                </div>

                {/* Dra Beatriz */}
                <div className="space-y-4 bg-muted/20 p-4 rounded-xl border border-border/50">
                  <h3 className="text-lg font-semibold">Perfil: Dra. Beatriz</h3>
                  <div className="space-y-2">
                    <Label>Nome / Título</Label>
                    <Input
                      value={formData['about_beatriz_title']?.value || ''}
                      onChange={(e) => handleChange('about_beatriz_title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Biografia (Suporta HTML)</Label>
                    <Textarea
                      className="min-h-[150px]"
                      value={formData['about_beatriz_content']?.value || ''}
                      onChange={(e) => handleChange('about_beatriz_content', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Foto Dra. Beatriz</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange('doctor_beatriz_image', e.target.files?.[0] || null)
                        }
                      />
                      {renderImagePreview('doctor_beatriz_image')}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Call to Action (CTA)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Texto do Botão WhatsApp</Label>
                    <Input
                      value={formData['about_whatsapp_label']?.value || ''}
                      onChange={(e) => handleChange('about_whatsapp_label', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link do WhatsApp</Label>
                    <Input
                      value={formData['about_whatsapp_url']?.value || ''}
                      onChange={(e) => handleChange('about_whatsapp_url', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button
                disabled={loading}
                onClick={() =>
                  handleSave([
                    'about_meta_title',
                    'about_meta_description',
                    'about_hero_image',
                    'about_content',
                    'about_felipe_title',
                    'about_felipe_content',
                    'doctor_felipe_image',
                    'about_beatriz_title',
                    'about_beatriz_content',
                    'doctor_beatriz_image',
                    'about_whatsapp_url',
                    'about_whatsapp_label',
                  ])
                }
              >
                Salvar Página Sobre
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- TREATMENTS --- */}
        <TabsContent value="treatments">
          <Card>
            <CardHeader>
              <CardTitle>Página de Tratamentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-lg font-semibold">SEO e Banner</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Meta Title</Label>
                    <Input
                      value={formData['treatments_meta_title']?.value || ''}
                      onChange={(e) => handleChange('treatments_meta_title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <Input
                      value={formData['treatments_meta_description']?.value || ''}
                      onChange={(e) => handleChange('treatments_meta_description', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Imagem de Banner Topo</Label>
                  <div className="flex items-center gap-2 max-w-xl">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange('treatments_banner_image', e.target.files?.[0] || null)
                      }
                    />
                    {renderImagePreview('treatments_banner_image')}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4 max-w-3xl">
                <h3 className="text-lg font-semibold">Seção: Nossa Abordagem Clínica</h3>
                <div className="space-y-2">
                  <Label>Título da Abordagem</Label>
                  <Input
                    value={formData['treatments_approach_title']?.value || ''}
                    onChange={(e) => handleChange('treatments_approach_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Texto da Abordagem (Suporta HTML)</Label>
                  <Textarea
                    className="min-h-[150px]"
                    value={formData['treatments_approach_content']?.value || ''}
                    onChange={(e) => handleChange('treatments_approach_content', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Imagem da Abordagem</Label>
                  <div className="flex items-center gap-2 max-w-xl">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange('treatments_approach_image', e.target.files?.[0] || null)
                      }
                    />
                    {renderImagePreview('treatments_approach_image')}
                  </div>
                </div>
              </div>

              <Button
                disabled={loading}
                onClick={() =>
                  handleSave([
                    'treatments_meta_title',
                    'treatments_meta_description',
                    'treatments_banner_image',
                    'treatments_approach_title',
                    'treatments_approach_content',
                    'treatments_approach_image',
                  ])
                }
              >
                Salvar Página Tratamentos
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- BLOG --- */}
        <TabsContent value="blog">
          <Card>
            <CardHeader>
              <CardTitle>Página do Blog</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-3xl">
              <div className="space-y-2">
                <Label>Meta Title (SEO)</Label>
                <Input
                  value={formData['blog_meta_title']?.value || ''}
                  onChange={(e) => handleChange('blog_meta_title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Description (SEO)</Label>
                <Textarea
                  value={formData['blog_meta_description']?.value || ''}
                  onChange={(e) => handleChange('blog_meta_description', e.target.value)}
                />
              </div>
              <Button
                disabled={loading}
                onClick={() => handleSave(['blog_meta_title', 'blog_meta_description'])}
              >
                Salvar Página Blog
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
