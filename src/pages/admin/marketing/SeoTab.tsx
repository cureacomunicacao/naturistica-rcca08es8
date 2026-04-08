import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useSettings } from '@/hooks/use-settings'
import { toast } from 'sonner'
import pb from '@/lib/pocketbase/client'

export default function SeoTab() {
  const { settings, refresh } = useSettings()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
  })
  const [ogImage, setOgImage] = useState<File | null>(null)

  useEffect(() => {
    setFormData({
      title: settings.global_seo_title?.value || '',
      description: settings.global_seo_description?.value || '',
      keywords: settings.global_seo_keywords?.value || '',
    })
  }, [settings])

  const saveSetting = async (key: string, value: string) => {
    let record
    try {
      record = await pb.collection('site_settings').getFirstListItem(`key="${key}"`)
      await pb.collection('site_settings').update(record.id, { value })
    } catch {
      await pb.collection('site_settings').create({ key, value })
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await saveSetting('global_seo_title', formData.title)
      await saveSetting('global_seo_description', formData.description)
      await saveSetting('global_seo_keywords', formData.keywords)

      if (ogImage) {
        let record
        try {
          record = await pb.collection('site_settings').getFirstListItem(`key="global_og_image"`)
        } catch {
          record = await pb.collection('site_settings').create({ key: 'global_og_image' })
        }
        const fd = new FormData()
        fd.append('image', ogImage)
        await pb.collection('site_settings').update(record.id, fd)
      }

      await refresh()
      toast.success('SEO Global salvo com sucesso')
      setOgImage(null)
    } catch (err) {
      toast.error('Erro ao salvar as configurações de SEO')
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de SEO</CardTitle>
        <CardDescription>
          Defina as tags globais que aparecerão nos resultados de busca e redes sociais.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Título Global</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label>Descrição Global</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label>Palavras-chave (Keywords)</Label>
          <Input
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            placeholder="saúde, bem-estar..."
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label>Imagem OpenGraph (Compartilhamento em Redes Sociais)</Label>
          <p className="text-xs text-muted-foreground mb-2">
            Recomendado: 1200x630px para compartilhamento via WhatsApp/Facebook.
          </p>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setOgImage(e.target.files?.[0] || null)}
            disabled={loading}
          />
          {settings.global_og_image?.image && !ogImage && (
            <img
              src={pb.files.getURL(settings.global_og_image, settings.global_og_image.image)}
              alt="OG Preview"
              className="h-32 w-auto object-cover rounded mt-2 border"
            />
          )}
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar SEO'}
        </Button>
      </CardContent>
    </Card>
  )
}
