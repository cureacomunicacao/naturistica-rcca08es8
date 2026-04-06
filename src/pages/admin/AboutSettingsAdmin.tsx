import { useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Save, Loader2, Image as ImageIcon } from 'lucide-react'

export default function AboutSettingsAdmin() {
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const { toast } = useToast()

  const [mainRecord, setMainRecord] = useState<any>(null)
  const [contentRecord, setContentRecord] = useState<any>(null)
  const [seoTitleRecord, setSeoTitleRecord] = useState<any>(null)
  const [seoDescRecord, setSeoDescRecord] = useState<any>(null)

  const [formData, setFormData] = useState({
    image_alt: '',
    content: '',
    seo_title: '',
    seo_description: '',
  })
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const records = await pb.collection('site_settings').getFullList()
      const main = records.find((r) => r.key === 'about_main')
      const content = records.find((r) => r.key === 'about_content')
      const seoTitle = records.find((r) => r.key === 'about_seo_title')
      const seoDesc = records.find((r) => r.key === 'about_seo_description')

      setMainRecord(main)
      setContentRecord(content)
      setSeoTitleRecord(seoTitle)
      setSeoDescRecord(seoDesc)

      setFormData({
        image_alt: main?.image_alt || '',
        content: content?.value || '',
        seo_title: seoTitle?.value || '',
        seo_description: seoDesc?.value || '',
      })
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Falha ao carregar configurações',
        variant: 'destructive',
      })
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const mainData = new FormData()
      mainData.append('key', 'about_main')
      mainData.append('image_alt', formData.image_alt)
      if (file) mainData.append('image', file)

      if (mainRecord) {
        await pb.collection('site_settings').update(mainRecord.id, mainData)
      } else {
        await pb.collection('site_settings').create(mainData)
      }

      const contentData = { key: 'about_content', value: formData.content }
      if (contentRecord) {
        await pb.collection('site_settings').update(contentRecord.id, contentData)
      } else {
        await pb.collection('site_settings').create(contentData)
      }

      const seoTitleData = { key: 'about_seo_title', value: formData.seo_title }
      if (seoTitleRecord) {
        await pb.collection('site_settings').update(seoTitleRecord.id, seoTitleData)
      } else {
        await pb.collection('site_settings').create(seoTitleData)
      }

      const seoDescData = { key: 'about_seo_description', value: formData.seo_description }
      if (seoDescRecord) {
        await pb.collection('site_settings').update(seoDescRecord.id, seoDescData)
      } else {
        await pb.collection('site_settings').create(seoDescData)
      }

      toast({ title: 'Sucesso', description: 'Configurações da Página Sobre salvas.' })
      fetchSettings()
      setFile(null)
    } catch (err: any) {
      toast({
        title: 'Erro',
        description: err.message || 'Falha ao salvar',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) return <div className="p-8">Carregando...</div>

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Página Sobre</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie o conteúdo, imagem e metadados de SEO da página "Nossa História".
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Imagem Principal</CardTitle>
            <CardDescription>A imagem de destaque ao lado do texto de introdução.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Imagem Atual</Label>
              <div className="flex items-center gap-6">
                {mainRecord?.image && !file ? (
                  <div className="relative h-40 w-40 rounded-xl overflow-hidden border">
                    <img
                      src={pb.files.getURL(mainRecord, mainRecord.image)}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                ) : file ? (
                  <div className="relative h-40 w-40 rounded-xl overflow-hidden border">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="New Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-40 w-40 bg-muted rounded-xl border flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm">Nenhuma imagem</span>
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <Label>Nova Imagem</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recomendado: Formato retrato, JPG ou WebP.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Título da Imagem (Alt Text)</Label>
              <Input
                value={formData.image_alt}
                onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
                placeholder="Ex: Dra Beatriz e Dr Felipe"
              />
              <p className="text-xs text-muted-foreground">Importante para acessibilidade e SEO.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conteúdo</CardTitle>
            <CardDescription>O texto principal de "A Jornada Naturistica".</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Texto da História</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Nossa história começou..."
                className="h-64"
              />
              <p className="text-xs text-muted-foreground">
                Você pode usar quebras de linha para separar os parágrafos.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO - Otimização para Buscas</CardTitle>
            <CardDescription>Como a página aparece no Google e redes sociais.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Título da Página (Meta Title)</Label>
              <Input
                value={formData.seo_title}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                placeholder="Ex: Nossa História | Naturistica"
              />
              <p className="text-xs text-muted-foreground">
                {formData.seo_title.length}/60 caracteres recomendados
              </p>
            </div>

            <div className="space-y-2">
              <Label>Descrição (Meta Description)</Label>
              <Textarea
                value={formData.seo_description}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                placeholder="Conheça a história da Naturistica..."
                className="h-24"
              />
              <p className="text-xs text-muted-foreground">
                {formData.seo_description.length}/160 caracteres recomendados
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} size="lg" className="text-white">
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Salvar Alterações
          </Button>
        </div>
      </form>
    </div>
  )
}
