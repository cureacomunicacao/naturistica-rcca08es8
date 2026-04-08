import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSettings } from '@/hooks/use-settings'
import { toast } from 'sonner'
import pb from '@/lib/pocketbase/client'

export default function ScriptsTab() {
  const { settings, refresh } = useSettings()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    headerScripts: '',
    bodyScripts: '',
    whatsappScript: '',
    gmbUrl: '',
  })

  useEffect(() => {
    setFormData({
      headerScripts: settings.header_scripts?.value || '',
      bodyScripts: settings.body_scripts?.value || '',
      whatsappScript: settings.whatsapp_tracking_script?.value || '',
      gmbUrl: settings.google_business_url?.value || '',
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
      await saveSetting('header_scripts', formData.headerScripts)
      await saveSetting('body_scripts', formData.bodyScripts)
      await saveSetting('whatsapp_tracking_script', formData.whatsappScript)
      await saveSetting('google_business_url', formData.gmbUrl)
      await refresh()
      toast.success('Scripts salvos com sucesso')
    } catch (err) {
      toast.error('Erro ao salvar configurações')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scripts de Rastreamento</CardTitle>
          <CardDescription>
            Injete códigos de ferramentas como Google Analytics e Facebook Pixel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Scripts Globais no {'<head>'}</Label>
            <Textarea
              className="font-mono text-sm h-32"
              value={formData.headerScripts}
              onChange={(e) => setFormData({ ...formData, headerScripts: e.target.value })}
              placeholder="<script>...</script>"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label>Scripts Globais no início do {'<body>'}</Label>
            <Textarea
              className="font-mono text-sm h-32"
              value={formData.bodyScripts}
              onChange={(e) => setFormData({ ...formData, bodyScripts: e.target.value })}
              placeholder="<noscript>...</noscript>"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label>Script de Conversão (Clique WhatsApp)</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Este código JavaScript será executado em cada clique aos botões de WhatsApp.
            </p>
            <Textarea
              className="font-mono text-sm"
              value={formData.whatsappScript}
              onChange={(e) => setFormData({ ...formData, whatsappScript: e.target.value })}
              placeholder="fbq('track', 'Contact'); gtag('event', 'conversion', {...});"
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Google My Business</CardTitle>
          <CardDescription>
            Link para incentivar os pacientes a avaliarem sua clínica.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>URL do Perfil Google</Label>
            <Input
              value={formData.gmbUrl}
              onChange={(e) => setFormData({ ...formData, gmbUrl: e.target.value })}
              placeholder="https://g.page/r/..."
              disabled={loading}
            />
          </div>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Scripts & GMB'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
