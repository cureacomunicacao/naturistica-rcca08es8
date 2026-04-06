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

  const [felipeTitleRecord, setFelipeTitleRecord] = useState<any>(null)
  const [felipeContentRecord, setFelipeContentRecord] = useState<any>(null)
  const [felipeImageRecord, setFelipeImageRecord] = useState<any>(null)

  const [waLabelRecord, setWaLabelRecord] = useState<any>(null)
  const [waUrlRecord, setWaUrlRecord] = useState<any>(null)

  const [formData, setFormData] = useState({
    image_alt: '',
    content: '',
    seo_title: '',
    seo_description: '',
    felipe_title: '',
    felipe_content: '',
    felipe_image_alt: '',
    wa_label: '',
    wa_url: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [felipeFile, setFelipeFile] = useState<File | null>(null)

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

      const felipeTitle = records.find((r) => r.key === 'about_felipe_title')
      const felipeContent = records.find((r) => r.key === 'about_felipe_content')
      const felipeImage = records.find((r) => r.key === 'about_felipe_image')

      const waLabel = records.find((r) => r.key === 'about_whatsapp_label')
      const waUrl = records.find((r) => r.key === 'about_whatsapp_url')

      setMainRecord(main)
      setContentRecord(content)
      setSeoTitleRecord(seoTitle)
      setSeoDescRecord(seoDesc)

      setFelipeTitleRecord(felipeTitle)
      setFelipeContentRecord(felipeContent)
      setFelipeImageRecord(felipeImage)

      setWaLabelRecord(waLabel)
      setWaUrlRecord(waUrl)

      setFormData({
        image_alt: main?.image_alt || '',
        content: content?.value || '',
        seo_title: seoTitle?.value || '',
        seo_description: seoDesc?.value || '',
        felipe_title: felipeTitle?.value || '',
        felipe_content: felipeContent?.value || '',
        felipe_image_alt: felipeImage?.image_alt || '',
        wa_label: waLabel?.value || '',
        wa_url: waUrl?.value || '',
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

      const felipeTitleData = { key: 'about_felipe_title', value: formData.felipe_title }
      if (felipeTitleRecord) {
        await pb.collection('site_settings').update(felipeTitleRecord.id, felipeTitleData)
      } else {
        await pb.collection('site_settings').create(felipeTitleData)
      }

      const felipeContentData = { key: 'about_felipe_content', value: formData.felipe_content }
      if (felipeContentRecord) {
        await pb.collection('site_settings').update(felipeContentRecord.id, felipeContentData)
      } else {
        await pb.collection('site_settings').create(felipeContentData)
      }

      const felipeImageData = new FormData()
      felipeImageData.append('key', 'about_felipe_image')
      felipeImageData.append('image_alt', formData.felipe_image_alt)
      if (felipeFile) felipeImageData.append('image', felipeFile)

      if (felipeImageRecord) {
        await pb.collection('site_settings').update(felipeImageRecord.id, felipeImageData)
      } else {
        await pb.collection('site_settings').create(felipeImageData)
      }

      const waLabelData = { key: 'about_whatsapp_label', value: formData.wa_label }
      if (waLabelRecord) {
        await pb.collection('site_settings').update(waLabelRecord.id, waLabelData)
      } else {
        await pb.collection('site_settings').create(waLabelData)
      }

      const waUrlData = { key: 'about_whatsapp_url', value: formData.wa_url }
      if (waUrlRecord) {
        await pb.collection('site_settings').update(waUrlRecord.id, waUrlData)
      } else {
        await pb.collection('site_settings').create(waUrlData)
      }

      toast({ title: 'Sucesso', description: 'Configurações da Página Sobre salvas.' })
      fetchSettings()
      setFile(null)
      setFelipeFile(null)
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
            <CardTitle>Dr. Felipe Zamboni</CardTitle>
            <CardDescription>Seção dedicada à apresentação do Dr. Felipe.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Foto do Perfil</Label>
              <div className="flex items-center gap-6">
                {felipeImageRecord?.image && !felipeFile ? (
                  <div className="relative h-40 w-40 rounded-xl overflow-hidden border">
                    <img
                      src={pb.files.getURL(felipeImageRecord, felipeImageRecord.image)}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                ) : felipeFile ? (
                  <div className="relative h-40 w-40 rounded-xl overflow-hidden border">
                    <img
                      src={URL.createObjectURL(felipeFile)}
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
                    onChange={(e) => setFelipeFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recomendado: Formato quadrado ou retrato, JPG ou WebP.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Texto Alternativo da Imagem (SEO)</Label>
              <Input
                value={formData.felipe_image_alt}
                onChange={(e) => setFormData({ ...formData, felipe_image_alt: e.target.value })}
                placeholder="Ex: Foto do Dr. Felipe Zamboni sorrindo"
              />
            </div>

            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                value={formData.felipe_title}
                onChange={(e) => setFormData({ ...formData, felipe_title: e.target.value })}
                placeholder="Ex: Dr. Felipe Zamboni"
              />
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={formData.felipe_content}
                onChange={(e) => setFormData({ ...formData, felipe_content: e.target.value })}
                placeholder="Especialista em abordagens..."
                className="h-32"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chamada WhatsApp (CTA)</CardTitle>
            <CardDescription>Botão de contato exibido no final da página Sobre.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Texto do Botão</Label>
              <Input
                value={formData.wa_label}
                onChange={(e) => setFormData({ ...formData, wa_label: e.target.value })}
                placeholder="Ex: Fale conosco pelo WhatsApp"
              />
            </div>

            <div className="space-y-2">
              <Label>Link do WhatsApp</Label>
              <Input
                value={formData.wa_url}
                onChange={(e) => setFormData({ ...formData, wa_url: e.target.value })}
                placeholder="Ex: https://wa.me/5511999999999"
              />
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

        <div className="flex justify-end pb-8">
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
