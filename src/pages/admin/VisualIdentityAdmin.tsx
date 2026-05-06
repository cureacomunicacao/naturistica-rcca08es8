import { useSettings } from '@/hooks/use-settings'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

export default function VisualIdentityAdmin() {
  const { settings, updateSetting, loading } = useSettings()
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading) {
      setValues({
        typography_blog_font_family: settings.typography_blog_font_family?.value || '',
        blog_h1_size: settings.blog_h1_size?.value || '',
        blog_h2_size: settings.blog_h2_size?.value || '',
        blog_h3_size: settings.blog_h3_size?.value || '',
        blog_body_size: settings.blog_body_size?.value || '',
        typography_treatment_font_family: settings.typography_treatment_font_family?.value || '',
        treatment_h1_size: settings.treatment_h1_size?.value || '',
        treatment_h2_size: settings.treatment_h2_size?.value || '',
        treatment_h3_size: settings.treatment_h3_size?.value || '',
        treatment_body_size: settings.treatment_body_size?.value || '',
      })
    }
  }, [settings, loading])

  const handleSave = async (prefix: 'blog' | 'treatment') => {
    setSaving(true)
    try {
      const keys = [
        `typography_${prefix}_font_family`,
        `${prefix}_h1_size`,
        `${prefix}_h2_size`,
        `${prefix}_h3_size`,
        `${prefix}_body_size`,
      ]      for (const key of keys) {
        await updateSetting(key, values[key] || '')
      }
      toast.success('Configurações de tipografia salvas com sucesso!')
    } catch (err) {
      toast.error('Erro ao salvar as configurações.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Identidade Visual</h2>
        <p className="text-muted-foreground">
          Gerencie a tipografia e estilos das páginas de Blog e Tratamentos.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tipografia - Blog</CardTitle>
            <CardDescription>Ajuste as fontes e tamanhos dos textos dos artigos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Família da Fonte (ex: 'Inter', sans-serif)</Label>
              <Input
                value={values.typography_blog_font_family || ''}
                onChange={(e) =>
                  setValues({ ...values, typography_blog_font_family: e.target.value })
                }
                placeholder="system-ui, sans-serif"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tamanho H1 (px)</Label>
                <Input
                  type="number"
                  value={values.blog_h1_size || ''}
                  onChange={(e) =>
                    setValues({ ...values, blog_h1_size: e.target.value })
                  }
                  placeholder="48"
                />
              </div>
              <div className="space-y-2">
                <Label>Tamanho H2 (px)</Label>
                <Input
                  type="number"
                  value={values.blog_h2_size || ''}
                  onChange={(e) =>
                    setValues({ ...values, blog_h2_size: e.target.value })
                  }
                  placeholder="32"
                />
              </div>
              <div className="space-y-2">
                <Label>Tamanho H3 (px)</Label>
                <Input
                  type="number"
                  value={values.blog_h3_size || ''}
                  onChange={(e) =>
                    setValues({ ...values, blog_h3_size: e.target.value })
                  }
                  placeholder="24"
                />
              </div>
              <div className="space-y-2">
                <Label>Tamanho Corpo (px)</Label>
                <Input
                  type="number"
                  value={values.blog_body_size || ''}
                  onChange={(e) => setValues({ ...values, blog_body_size: e.target.value })}
                  placeholder="18"
                />
              </div>
            </div>
            <Button onClick={() => handleSave('blog')} disabled={saving} className="w-full mt-4">
              <Save className="w-4 h-4 mr-2" /> Salvar Tipografia do Blog
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tipografia - Tratamentos</CardTitle>
            <CardDescription>
              Ajuste as fontes e tamanhos dos detalhes de tratamentos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Família da Fonte (ex: 'Inter', sans-serif)</Label>
              <Input
                value={values.typography_treatment_font_family || ''}
                onChange={(e) =>
                  setValues({ ...values, typography_treatment_font_family: e.target.value })
                }
                placeholder="system-ui, sans-serif"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tamanho H1 (px)</Label>
                <Input
                  type="number"
                  value={values.treatment_h1_size || ''}
                  onChange={(e) =>
                    setValues({ ...values, treatment_h1_size: e.target.value })
                  }
                  placeholder="48"
                />
              </div>
              <div className="space-y-2">
                <Label>Tamanho H2 (px)</Label>
                <Input
                  type="number"
                  value={values.treatment_h2_size || ''}
                  onChange={(e) =>
                    setValues({ ...values, treatment_h2_size: e.target.value })
                  }
                  placeholder="32"
                />
              </div>
              <div className="space-y-2">
                <Label>Tamanho H3 (px)</Label>
                <Input
                  type="number"
                  value={values.treatment_h3_size || ''}
                  onChange={(e) =>
                    setValues({ ...values, treatment_h3_size: e.target.value })
                  }
                  placeholder="24"
                />
              </div>
              <div className="space-y-2">
                <Label>Tamanho Corpo (px)</Label>
                <Input
                  type="number"
                  value={values.treatment_body_size || ''}
                  onChange={(e) =>
                    setValues({ ...values, treatment_body_size: e.target.value })
                  }
                  placeholder="18"
                />
              </div>
            </div>
            <Button
              onClick={() => handleSave('treatment')}
              disabled={saving}
              className="w-full mt-4"
            >
              <Save className="w-4 h-4 mr-2" /> Salvar Tipografia de Tratamentos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
