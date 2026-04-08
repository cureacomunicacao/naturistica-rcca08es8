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

  const [settings, setSettings] = useState<Record<string, any>>({})
  const [formData, setFormData] = useState({
    image_alt: '',
    content: '',
    seo_title: '',
    seo_description: '',
    felipe_title: '',
    felipe_content: '',
    felipe_image_alt: '',
    beatriz_title: '',
    beatriz_content: '',
    beatriz_image_alt: '',
    wa_label: '',
    wa_url: '',
  })
  const [files, setFiles] = useState<Record<string, File | null>>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const list = await pb.collection('site_settings').getFullList()
      const map = list.reduce((acc, curr) => ({ ...acc, [curr.key]: curr }), {})
      setSettings(map)
      setFormData({
        image_alt: map.about_main?.image_alt || '',
        content: map.about_content?.value || '',
        seo_title: map.about_seo_title?.value || '',
        seo_description: map.about_seo_description?.value || '',
        felipe_title: map.about_felipe_title?.value || '',
        felipe_content: map.about_felipe_content?.value || '',
        felipe_image_alt:
          (map.about_doctor_felipe_image || map.about_felipe_image)?.image_alt || '',
        beatriz_title: map.about_beatriz_title?.value || '',
        beatriz_content: map.about_beatriz_content?.value || '',
        beatriz_image_alt: map.about_doctor_beatriz_image?.image_alt || '',
        wa_label: map.about_whatsapp_label?.value || '',
        wa_url: map.about_whatsapp_url?.value || '',
      })
    } catch (err) {
      toast({ title: 'Erro', description: 'Falha ao carregar', variant: 'destructive' })
    } finally {
      setInitialLoading(false)
    }
  }

  const saveSetting = async (key: string, data: any) => {
    const record =
      settings[key] || (key === 'about_doctor_felipe_image' ? settings['about_felipe_image'] : null)
    if (record) return pb.collection('site_settings').update(record.id, data)
    return pb.collection('site_settings').create(data instanceof FormData ? data : { key, ...data })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const mainData = new FormData()
      mainData.append('key', 'about_main')
      mainData.append('image_alt', formData.image_alt)
      if (files.main) mainData.append('image', files.main)
      await saveSetting('about_main', mainData)

      const felipeData = new FormData()
      felipeData.append('key', 'about_doctor_felipe_image')
      felipeData.append('image_alt', formData.felipe_image_alt)
      if (files.felipe) felipeData.append('image', files.felipe)
      await saveSetting('about_doctor_felipe_image', felipeData)

      const beatrizData = new FormData()
      beatrizData.append('key', 'about_doctor_beatriz_image')
      beatrizData.append('image_alt', formData.beatriz_image_alt)
      if (files.beatriz) beatrizData.append('image', files.beatriz)
      await saveSetting('about_doctor_beatriz_image', beatrizData)

      await saveSetting('about_content', { key: 'about_content', value: formData.content })
      await saveSetting('about_seo_title', { key: 'about_seo_title', value: formData.seo_title })
      await saveSetting('about_seo_description', {
        key: 'about_seo_description',
        value: formData.seo_description,
      })
      await saveSetting('about_felipe_title', {
        key: 'about_felipe_title',
        value: formData.felipe_title,
      })
      await saveSetting('about_felipe_content', {
        key: 'about_felipe_content',
        value: formData.felipe_content,
      })
      await saveSetting('about_beatriz_title', {
        key: 'about_beatriz_title',
        value: formData.beatriz_title,
      })
      await saveSetting('about_beatriz_content', {
        key: 'about_beatriz_content',
        value: formData.beatriz_content,
      })
      await saveSetting('about_whatsapp_label', {
        key: 'about_whatsapp_label',
        value: formData.wa_label,
      })
      await saveSetting('about_whatsapp_url', { key: 'about_whatsapp_url', value: formData.wa_url })

      toast({ title: 'Sucesso', description: 'Configurações salvas.' })
      fetchSettings()
      setFiles({})
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const renderImageUpload = (key: string, fileKey: string, altKey: keyof typeof formData) => {
    const record =
      settings[key] || (key === 'about_doctor_felipe_image' ? settings['about_felipe_image'] : null)
    const file = files[fileKey]
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-6">
          {record?.image && !file ? (
            <div className="relative h-40 w-40 rounded-xl overflow-hidden border">
              <img
                src={pb.files.getURL(record, record.image)}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          ) : file ? (
            <div className="relative h-40 w-40 rounded-xl overflow-hidden border">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
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
              onChange={(e) => setFiles((p) => ({ ...p, [fileKey]: e.target.files?.[0] || null }))}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {key === 'about_main'
                ? 'Tamanho recomendado: 1920x1080px (Banner full-width).'
                : 'Tamanho recomendado: 1000x1200px para retrato de alta qualidade.'}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Texto Alternativo (SEO)</Label>
          <Input
            value={formData[altKey]}
            onChange={(e) => setFormData({ ...formData, [altKey]: e.target.value })}
          />
        </div>
      </div>
    )
  }

  if (initialLoading) return <div className="p-8">Carregando...</div>

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Página Sobre</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie o conteúdo e imagens da página "Nossa História".
        </p>
      </div>
      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Imagem Principal</CardTitle>
          </CardHeader>
          <CardContent>{renderImageUpload('about_main', 'main', 'image_alt')}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>História</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="h-64"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Foto do Dr. Felipe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderImageUpload('about_doctor_felipe_image', 'felipe', 'felipe_image_alt')}
            <Input
              placeholder="Título (Ex: Dr. Felipe Zamboni)"
              value={formData.felipe_title}
              onChange={(e) => setFormData({ ...formData, felipe_title: e.target.value })}
            />
            <Textarea
              placeholder="Descrição..."
              value={formData.felipe_content}
              onChange={(e) => setFormData({ ...formData, felipe_content: e.target.value })}
              className="h-32"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Foto da Dra. Beatriz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderImageUpload('about_doctor_beatriz_image', 'beatriz', 'beatriz_image_alt')}
            <Input
              placeholder="Título (Ex: Dra. Beatriz Mulari)"
              value={formData.beatriz_title}
              onChange={(e) => setFormData({ ...formData, beatriz_title: e.target.value })}
            />
            <Textarea
              placeholder="Descrição..."
              value={formData.beatriz_content}
              onChange={(e) => setFormData({ ...formData, beatriz_content: e.target.value })}
              className="h-32"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp (CTA)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Rótulo"
              value={formData.wa_label}
              onChange={(e) => setFormData({ ...formData, wa_label: e.target.value })}
            />
            <Input
              placeholder="URL"
              value={formData.wa_url}
              onChange={(e) => setFormData({ ...formData, wa_url: e.target.value })}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Title"
              value={formData.seo_title}
              onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={formData.seo_description}
              onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
            />
          </CardContent>
        </Card>
        <div className="flex justify-end pb-8">
          <Button type="submit" disabled={loading} size="lg">
            <Save className="w-4 h-4 mr-2" /> Salvar
          </Button>
        </div>
      </form>
    </div>
  )
}
