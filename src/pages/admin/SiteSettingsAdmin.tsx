import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
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
      'about_meta_title',
      'about_meta_description',
      'about_hero_image',
      'treatments_meta_title',
      'treatments_meta_description',
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
          href={pb.files.getUrl(settings[key], settings[key].image)}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-blue-600 ml-2 hover:underline"
        >
          Ver imagem atual
        </a>
      )
    }
    return <span className="text-sm text-muted-foreground ml-2">Nenhuma imagem definida</span>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6 text-primary" />
        <h1 className="text-3xl font-serif font-bold text-primary">Configurações do Site</h1>
      </div>

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="mb-6 flex flex-wrap h-auto bg-muted/50">
          <TabsTrigger value="global" className="gap-2">
            <Globe className="w-4 h-4" /> Global
          </TabsTrigger>
          <TabsTrigger value="home" className="gap-2">
            <Home className="w-4 h-4" /> Início
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-2">
            <Info className="w-4 h-4" /> Sobre
          </TabsTrigger>
          <TabsTrigger value="treatments" className="gap-2">
            <Stethoscope className="w-4 h-4" /> Tratamentos
          </TabsTrigger>
          <TabsTrigger value="blog" className="gap-2">
            <FileText className="w-4 h-4" /> Blog
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Globais</CardTitle>
              <CardDescription>
                Logo e informações de contato que aparecem no rodapé de todas as páginas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Logo do Site</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('global_logo', e.target.files?.[0] || null)}
                    className="max-w-sm"
                  />
                  {renderImagePreview('global_logo')}
                </div>
              </div>
              <div className="space-y-2 max-w-xl">
                <Label>Email de Contato</Label>
                <Input
                  value={formData['global_email']?.value || ''}
                  onChange={(e) => handleChange('global_email', e.target.value)}
                  placeholder="contato@naturistica.com.br"
                />
              </div>
              <div className="space-y-2 max-w-xl">
                <Label>Telefone (WhatsApp)</Label>
                <Input
                  value={formData['global_phone']?.value || ''}
                  onChange={(e) => handleChange('global_phone', e.target.value)}
                  placeholder="+55 (11) 99999-9999"
                />
              </div>
              <div className="space-y-2 max-w-xl">
                <Label>Link do Instagram</Label>
                <Input
                  value={formData['global_instagram']?.value || ''}
                  onChange={(e) => handleChange('global_instagram', e.target.value)}
                  placeholder="https://instagram.com/suaclinica"
                />
              </div>
              <div className="pt-2">
                <Button
                  disabled={loading}
                  onClick={() =>
                    handleSave(['global_logo', 'global_email', 'global_phone', 'global_instagram'])
                  }
                >
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="home">
          <Card>
            <CardHeader>
              <CardTitle>Página Inicial</CardTitle>
              <CardDescription>
                Gerencie as tags de SEO e a imagem de destaque (Hero) da página inicial.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-2xl">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input
                  value={formData['home_meta_title']?.value || ''}
                  onChange={(e) => handleChange('home_meta_title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Input
                  value={formData['home_meta_description']?.value || ''}
                  onChange={(e) => handleChange('home_meta_description', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Imagem Principal (Hero)</Label>
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
              <div className="pt-2">
                <Button
                  disabled={loading}
                  onClick={() =>
                    handleSave(['home_meta_title', 'home_meta_description', 'home_hero_image'])
                  }
                >
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>Página Sobre</CardTitle>
              <CardDescription>SEO e imagem de destaque da seção Sobre nós.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-2xl">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input
                  value={formData['about_meta_title']?.value || ''}
                  onChange={(e) => handleChange('about_meta_title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Input
                  value={formData['about_meta_description']?.value || ''}
                  onChange={(e) => handleChange('about_meta_description', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Imagem de Destaque</Label>
                <div className="flex items-center gap-2">
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
              <div className="pt-2">
                <Button
                  disabled={loading}
                  onClick={() =>
                    handleSave(['about_meta_title', 'about_meta_description', 'about_hero_image'])
                  }
                >
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatments">
          <Card>
            <CardHeader>
              <CardTitle>Página de Tratamentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-2xl">
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
              <div className="pt-2">
                <Button
                  disabled={loading}
                  onClick={() =>
                    handleSave(['treatments_meta_title', 'treatments_meta_description'])
                  }
                >
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog">
          <Card>
            <CardHeader>
              <CardTitle>Página do Blog</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-2xl">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input
                  value={formData['blog_meta_title']?.value || ''}
                  onChange={(e) => handleChange('blog_meta_title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Input
                  value={formData['blog_meta_description']?.value || ''}
                  onChange={(e) => handleChange('blog_meta_description', e.target.value)}
                />
              </div>
              <div className="pt-2">
                <Button
                  disabled={loading}
                  onClick={() => handleSave(['blog_meta_title', 'blog_meta_description'])}
                >
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
