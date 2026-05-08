import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/RichTextEditor'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { toast } from 'sonner'
import {
  Settings,
  Globe,
  Home,
  Info,
  Stethoscope,
  FileText,
  MessageSquare,
  Menu,
} from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { useSettings } from '@/hooks/use-settings'

export default function SiteSettingsAdmin() {
  const { settings, refresh } = useSettings()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<
    Record<string, { value: string; file: File | null; image_alt: string }>
  >({})

  useEffect(() => {
    const initial: any = {}
    const keys = [
      'global_email',
      'contact_email',
      'contact_address',
      'global_phone',
      'whatsapp_contact_number',
      'global_instagram',
      'global_logo',
      'global_cta_text',
      'global_cta_link',
      'home_meta_title',
      'home_meta_description',
      'home_hero_image',
      'home_hero_btn1_text',
      'home_hero_btn1_link',
      'home_hero_btn2_text',
      'home_hero_btn2_link',
      'expectations_title',
      'expectations_items',
      'expectations_button_text',
      'expectations_image',
      'expectations_image_alt',
      'expectations_button_link',
      'home_philosophy_title',
      'home_philosophy_text',
      'testimonials_title',
      'testimonials_subtitle_felipe',
      'testimonials_subtitle_beatriz',
      'featured_treatment_badge',
      'featured_treatment_btn',
      'global_brand_name',
      'footer_description',
      'footer_nav_title',
      'footer_treatments_title',
      'footer_contact_title',
      'footer_instagram_btn',
      'footer_copyright',
      'home_blog_title',
      'home_blog_desc',
      'home_blog_btn_text',
      'home_blog_btn_link',
      'contact_label_name',
      'contact_label_phone',
      'contact_label_email',
      'contact_label_treatment',
      'contact_placeholder_treatment',
      'contact_label_message',
      'contact_btn_submit',
      'contact_btn_submitting',
      'nav_home',
      'nav_about',
      'nav_treatments',
      'nav_contact',
      'nav_blog',
      'main_menu_order',
      // About
      'about_meta_title',
      'about_meta_description',
      'about_hero_image',
      'about_journey_image',
      'about_content',
      'about_hero_title',
      ...[1, 2, 3, 4, 5, 6].flatMap((n) => [
        `about_journey_s${n}_title`,
        `about_journey_s${n}_content`,
        `about_journey_s${n}_image`,
      ]),
      'about_hero_subtitle',
      'about_faq_title',
      'about_cta_title',
      'about_cta_desc',
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
      'treatments_banner_title',
      'treatments_banner_subtitle',
      'treatments_grid_title',
      'treatments_approach_title',
      'treatments_approach_content',
      'treatments_approach_image',
      'treatments_testim_title',
      'treatments_testim_desc',
      // Blog
      'blog_meta_title',
      'blog_meta_description',
      // Contact
      'contact_hero_title',
      'contact_hero_desc',
      'contact_form_title',
      'contact_info_title',
      'contact_info_desc',
      'contact_hours',
      'contact_benefits_title',
      'contact_benefit1_title',
      'contact_benefit1_desc',
      'contact_benefit2_title',
      'contact_benefit2_desc',
      'contact_benefit3_title',
      'contact_benefit3_desc',
      'whatsapp_felipe',
      'whatsapp_beatriz',
    ]
    keys.forEach((k) => {
      initial[k] = {
        value: settings[k]?.value || '',
        file: null,
        image_alt: settings[k]?.image_alt || '',
      }
    })
    setFormData(initial)
  }, [settings])

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: { ...prev[key], value } }))
  }

  const handleChangeAlt = (key: string, image_alt: string) => {
    setFormData((prev) => ({ ...prev, [key]: { ...prev[key], image_alt } }))
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
        if (formData[key].image_alt !== undefined) {
          fd.append('image_alt', formData[key].image_alt)
        }

        let recordId = settings[key]?.id

        if (!recordId) {
          try {
            const existingRecord = await pb
              .collection('site_settings')
              .getFirstListItem(`key="${key}"`)
            recordId = existingRecord.id
          } catch (e: any) {
            // Not found
          }
        }

        if (recordId) {
          await pb.collection('site_settings').update(recordId, fd)
        } else {
          try {
            await pb.collection('site_settings').create(fd)
          } catch (createErr: any) {
            if (createErr.status === 400 || createErr.response?.code === 400) {
              const existingRecord = await pb
                .collection('site_settings')
                .getFirstListItem(`key="${key}"`)
              await pb.collection('site_settings').update(existingRecord.id, fd)
            } else {
              throw createErr
            }
          }
        }
      }
      toast.success('Configurações salvas com sucesso!')
      await refresh()
    } catch (err: any) {
      console.error(err)
      const errorData = err?.response?.data
      if (errorData && typeof errorData === 'object' && Object.keys(errorData).length > 0) {
        toast.error('Erro de validação: Verifique os formatos enviados.')
      } else {
        toast.error(err?.message || 'Erro ao salvar as configurações.')
      }
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
          <TabsTrigger value="contact" className="gap-2">
            <MessageSquare className="w-4 h-4" /> Contato
          </TabsTrigger>
          <TabsTrigger value="blog" className="gap-2">
            <FileText className="w-4 h-4" /> Blog
          </TabsTrigger>
          <TabsTrigger value="navigation" className="gap-2">
            <Menu className="w-4 h-4" /> Navegação
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
                  <Label>Nome da Marca (Texto alternativo à logo)</Label>
                  <Input
                    value={formData['global_brand_name']?.value || ''}
                    onChange={(e) => handleChange('global_brand_name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email de Contato</Label>
                  <Input
                    value={formData['contact_email']?.value || ''}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    placeholder="contato@naturistica.com.br"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Endereço Físico</Label>
                  <Input
                    value={formData['contact_address']?.value || ''}
                    onChange={(e) => handleChange('contact_address', e.target.value)}
                    placeholder="Sua Clínica, Rua X"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone Exibição (Ex: (11) 99999-9999)</Label>
                  <Input
                    value={formData['global_phone']?.value || ''}
                    onChange={(e) => handleChange('global_phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Número WhatsApp para Redirecionamento (Somente números)</Label>
                  <Input
                    value={formData['whatsapp_contact_number']?.value || ''}
                    onChange={(e) => handleChange('whatsapp_contact_number', e.target.value)}
                    placeholder="Ex: 5511999999999"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link WhatsApp - Dr. Felipe</Label>
                  <Input
                    value={formData['whatsapp_felipe']?.value || ''}
                    onChange={(e) => handleChange('whatsapp_felipe', e.target.value)}
                    placeholder="https://wa.me/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link WhatsApp - Dra. Beatriz</Label>
                  <Input
                    value={formData['whatsapp_beatriz']?.value || ''}
                    onChange={(e) => handleChange('whatsapp_beatriz', e.target.value)}
                    placeholder="https://wa.me/..."
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
                  <Label>Texto do Botão CTA Global</Label>
                  <Input
                    value={formData['global_cta_text']?.value || ''}
                    onChange={(e) => handleChange('global_cta_text', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link do Botão CTA Global</Label>
                  <Input
                    value={formData['global_cta_link']?.value || ''}
                    onChange={(e) => handleChange('global_cta_link', e.target.value)}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Logo do Site</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('global_logo', e.target.files?.[0] || null)}
                    />
                    {renderImagePreview('global_logo')}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tamanho recomendado: 400x400px (1:1).
                  </p>
                </div>
              </div>
              <Button
                disabled={loading}
                onClick={() =>
                  handleSave([
                    'global_brand_name',
                    'global_logo',
                    'contact_email',
                    'contact_address',
                    'global_phone',
                    'whatsapp_contact_number',
                    'whatsapp_felipe',
                    'whatsapp_beatriz',
                    'global_instagram',
                    'global_cta_text',
                    'global_cta_link',
                  ])
                }
              >
                {loading ? 'Salvando...' : 'Salvar Geral'}
              </Button>

              <Separator className="my-6" />
              <h3 className="text-lg font-semibold">Rodapé (Footer)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <Label>Descrição do Rodapé</Label>
                  <Textarea
                    value={formData['footer_description']?.value || ''}
                    onChange={(e) => handleChange('footer_description', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Título Navegação</Label>
                  <Input
                    value={formData['footer_nav_title']?.value || ''}
                    onChange={(e) => handleChange('footer_nav_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Título Tratamentos</Label>
                  <Input
                    value={formData['footer_treatments_title']?.value || ''}
                    onChange={(e) => handleChange('footer_treatments_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Título Contato</Label>
                  <Input
                    value={formData['footer_contact_title']?.value || ''}
                    onChange={(e) => handleChange('footer_contact_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Botão Instagram</Label>
                  <Input
                    value={formData['footer_instagram_btn']?.value || ''}
                    onChange={(e) => handleChange('footer_instagram_btn', e.target.value)}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Texto de Copyright (use {`{year}`} para o ano atual)</Label>
                  <Input
                    value={formData['footer_copyright']?.value || ''}
                    onChange={(e) => handleChange('footer_copyright', e.target.value)}
                  />
                </div>
              </div>
              <Button
                className="mt-4"
                disabled={loading}
                onClick={() =>
                  handleSave([
                    'footer_description',
                    'footer_nav_title',
                    'footer_treatments_title',
                    'footer_contact_title',
                    'footer_instagram_btn',
                    'footer_copyright',
                  ])
                }
              >
                {loading ? 'Salvando...' : 'Salvar Rodapé'}
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
                <p className="text-xs text-muted-foreground mt-1">
                  Tamanho recomendado: 1920x1080px.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label>Texto do Botão Principal</Label>
                  <Input
                    value={formData['home_hero_btn1_text']?.value || ''}
                    onChange={(e) => handleChange('home_hero_btn1_text', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link do Botão Principal</Label>
                  <Input
                    value={formData['home_hero_btn1_link']?.value || ''}
                    onChange={(e) => handleChange('home_hero_btn1_link', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Texto do Botão Secundário</Label>
                  <Input
                    value={formData['home_hero_btn2_text']?.value || ''}
                    onChange={(e) => handleChange('home_hero_btn2_text', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link do Botão Secundário</Label>
                  <Input
                    value={formData['home_hero_btn2_link']?.value || ''}
                    onChange={(e) => handleChange('home_hero_btn2_link', e.target.value)}
                  />
                </div>
              </div>

              <Button
                className="mt-4"
                disabled={loading}
                onClick={() =>
                  handleSave([
                    'home_meta_title',
                    'home_meta_description',
                    'home_hero_image',
                    'home_hero_btn1_text',
                    'home_hero_btn1_link',
                    'home_hero_btn2_text',
                    'home_hero_btn2_link',
                  ])
                }
              >
                {loading ? 'Salvando...' : 'Salvar Início'}
              </Button>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Sessão: Consulta e Acompanhamento</h3>
                <div className="space-y-2">
                  <Label>Título da Seção</Label>
                  <Input
                    value={formData['expectations_title']?.value || ''}
                    onChange={(e) => handleChange('expectations_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Benefícios / Itens (Um por linha)</Label>
                  <Textarea
                    rows={5}
                    value={formData['expectations_items']?.value || ''}
                    onChange={(e) => handleChange('expectations_items', e.target.value)}
                    placeholder="Consultas longas (1h30 de duração)...&#10;Atendimento 100% online..."
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Texto do Botão</Label>
                    <Input
                      value={formData['expectations_button_text']?.value || ''}
                      onChange={(e) => handleChange('expectations_button_text', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link do Botão</Label>
                    <Input
                      value={formData['expectations_button_link']?.value || ''}
                      onChange={(e) => handleChange('expectations_button_link', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Imagem da Seção</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange('expectations_image', e.target.files?.[0] || null)
                        }
                      />
                      {renderImagePreview('expectations_image')}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tamanho recomendado: 600x800px.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Texto Alternativo da Imagem (SEO)</Label>
                    <Input
                      value={formData['expectations_image_alt']?.value || ''}
                      onChange={(e) => handleChange('expectations_image_alt', e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  disabled={loading}
                  onClick={() =>
                    handleSave([
                      'expectations_title',
                      'expectations_items',
                      'expectations_button_text',
                      'expectations_button_link',
                      'expectations_image',
                      'expectations_image_alt',
                    ])
                  }
                >
                  {loading ? 'Salvando...' : 'Salvar Expectativas'}
                </Button>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Filosofia</h3>
                <div className="space-y-2">
                  <Label>Título da Filosofia</Label>
                  <Input
                    value={formData['home_philosophy_title']?.value || ''}
                    onChange={(e) => handleChange('home_philosophy_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Texto da Filosofia</Label>
                  <RichTextEditor
                    value={formData['home_philosophy_text']?.value || ''}
                    onChange={(v) => handleChange('home_philosophy_text', v)}
                  />
                </div>
                <Button
                  disabled={loading}
                  onClick={() => handleSave(['home_philosophy_title', 'home_philosophy_text'])}
                >
                  Salvar Filosofia
                </Button>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Depoimentos</h3>
                <div className="space-y-2">
                  <Label>Título dos Depoimentos</Label>
                  <Input
                    value={formData['testimonials_title']?.value || ''}
                    onChange={(e) => handleChange('testimonials_title', e.target.value)}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Subtítulo Dr. Felipe</Label>
                    <Input
                      value={formData['testimonials_subtitle_felipe']?.value || ''}
                      onChange={(e) => handleChange('testimonials_subtitle_felipe', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtítulo Dra. Beatriz</Label>
                    <Input
                      value={formData['testimonials_subtitle_beatriz']?.value || ''}
                      onChange={(e) =>
                        handleChange('testimonials_subtitle_beatriz', e.target.value)
                      }
                    />
                  </div>
                </div>
                <Button
                  disabled={loading}
                  onClick={() =>
                    handleSave([
                      'testimonials_title',
                      'testimonials_subtitle_felipe',
                      'testimonials_subtitle_beatriz',
                    ])
                  }
                >
                  Salvar Depoimentos
                </Button>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tratamento em Destaque</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Texto do Badge (Rótulo)</Label>
                    <Input
                      value={formData['featured_treatment_badge']?.value || ''}
                      onChange={(e) => handleChange('featured_treatment_badge', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Texto do Botão</Label>
                    <Input
                      value={formData['featured_treatment_btn']?.value || ''}
                      onChange={(e) => handleChange('featured_treatment_btn', e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  disabled={loading}
                  onClick={() => handleSave(['featured_treatment_badge', 'featured_treatment_btn'])}
                >
                  Salvar Destaque
                </Button>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Blog</h3>
                <div className="space-y-2">
                  <Label>Título do Blog</Label>
                  <Input
                    value={formData['home_blog_title']?.value || ''}
                    onChange={(e) => handleChange('home_blog_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição do Blog</Label>
                  <Textarea
                    value={formData['home_blog_desc']?.value || ''}
                    onChange={(e) => handleChange('home_blog_desc', e.target.value)}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Texto do Botão do Blog</Label>
                    <Input
                      value={formData['home_blog_btn_text']?.value || ''}
                      onChange={(e) => handleChange('home_blog_btn_text', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link do Botão do Blog</Label>
                    <Input
                      value={formData['home_blog_btn_link']?.value || ''}
                      onChange={(e) => handleChange('home_blog_btn_link', e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  disabled={loading}
                  onClick={() =>
                    handleSave([
                      'home_blog_title',
                      'home_blog_desc',
                      'home_blog_btn_text',
                      'home_blog_btn_link',
                    ])
                  }
                >
                  Salvar Blog Início
                </Button>
              </div>
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
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Títulos e Textos</h3>
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
                  <div className="space-y-2">
                    <Label>Título Hero</Label>
                    <Input
                      value={formData['about_hero_title']?.value || ''}
                      onChange={(e) => handleChange('about_hero_title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtítulo Hero</Label>
                    <Input
                      value={formData['about_hero_subtitle']?.value || ''}
                      onChange={(e) => handleChange('about_hero_subtitle', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Título FAQ</Label>
                    <Input
                      value={formData['about_faq_title']?.value || ''}
                      onChange={(e) => handleChange('about_faq_title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Título CTA</Label>
                    <Input
                      value={formData['about_cta_title']?.value || ''}
                      onChange={(e) => handleChange('about_cta_title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Descrição CTA</Label>
                    <Textarea
                      value={formData['about_cta_desc']?.value || ''}
                      onChange={(e) => handleChange('about_cta_desc', e.target.value)}
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Tamanho recomendado: 1920x1080px.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Texto Alternativo da Imagem Hero (SEO)</Label>
                  <Input
                    value={formData['about_hero_image']?.image_alt || ''}
                    onChange={(e) => handleChangeAlt('about_hero_image', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Imagem da Jornada</Label>
                  <div className="flex items-center gap-2 max-w-xl">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange('about_journey_image', e.target.files?.[0] || null)
                      }
                    />
                    {renderImagePreview('about_journey_image')}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tamanho recomendado: 800x800px.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Texto Alternativo da Jornada (SEO)</Label>
                  <Input
                    value={formData['about_journey_image']?.image_alt || ''}
                    onChange={(e) => handleChangeAlt('about_journey_image', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Texto da Jornada (Legado)</Label>
                  <RichTextEditor
                    value={formData['about_content']?.value || ''}
                    onChange={(val) => handleChange('about_content', val)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Nossa Jornada (6 Seções Alternadas)</h3>
                <Accordion type="single" collapsible className="w-full">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <AccordionItem key={num} value={`s${num}`}>
                      <AccordionTrigger>Sessão {num}</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4 px-1">
                        <div className="space-y-2">
                          <Label>Título da Sessão {num}</Label>
                          <Input
                            value={formData[`about_journey_s${num}_title`]?.value || ''}
                            onChange={(e) =>
                              handleChange(`about_journey_s${num}_title`, e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Texto da Sessão {num}</Label>
                          <RichTextEditor
                            value={formData[`about_journey_s${num}_content`]?.value || ''}
                            onChange={(val) => handleChange(`about_journey_s${num}_content`, val)}
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Imagem da Sessão {num}</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleFileChange(
                                    `about_journey_s${num}_image`,
                                    e.target.files?.[0] || null,
                                  )
                                }
                              />
                              {renderImagePreview(`about_journey_s${num}_image`)}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Texto Alt da Imagem (SEO)</Label>
                            <Input
                              value={formData[`about_journey_s${num}_image`]?.image_alt || ''}
                              onChange={(e) =>
                                handleChangeAlt(`about_journey_s${num}_image`, e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <Button
                  variant="secondary"
                  disabled={loading}
                  onClick={() =>
                    handleSave(
                      [1, 2, 3, 4, 5, 6].flatMap((n) => [
                        `about_journey_s${n}_title`,
                        `about_journey_s${n}_content`,
                        `about_journey_s${n}_image`,
                      ]),
                    )
                  }
                >
                  {loading ? 'Salvando...' : 'Salvar Apenas Jornada'}
                </Button>
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
                    <Label>Biografia</Label>
                    <RichTextEditor
                      value={formData['about_felipe_content']?.value || ''}
                      onChange={(val) => handleChange('about_felipe_content', val)}
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Tamanho recomendado: 400x400px (1:1).
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Texto Alternativo da Foto do Dr. Felipe</Label>
                    <Input
                      value={formData['doctor_felipe_image']?.image_alt || ''}
                      onChange={(e) => handleChangeAlt('doctor_felipe_image', e.target.value)}
                    />
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
                    <Label>Biografia</Label>
                    <RichTextEditor
                      value={formData['about_beatriz_content']?.value || ''}
                      onChange={(val) => handleChange('about_beatriz_content', val)}
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Tamanho recomendado: 400x400px (1:1).
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Texto Alternativo da Foto da Dra. Beatriz</Label>
                    <Input
                      value={formData['doctor_beatriz_image']?.image_alt || ''}
                      onChange={(e) => handleChangeAlt('doctor_beatriz_image', e.target.value)}
                    />
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
                    'about_journey_image',
                    'about_content',
                    'about_hero_title',
                    'about_hero_subtitle',
                    'about_faq_title',
                    'about_cta_title',
                    'about_cta_desc',
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
                {loading ? 'Salvando...' : 'Salvar Página Sobre'}
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
                <h3 className="text-lg font-semibold">Títulos e Textos</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Meta Title (SEO)</Label>
                    <Input
                      value={formData['treatments_meta_title']?.value || ''}
                      onChange={(e) => handleChange('treatments_meta_title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Description (SEO)</Label>
                    <Input
                      value={formData['treatments_meta_description']?.value || ''}
                      onChange={(e) => handleChange('treatments_meta_description', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Título do Banner</Label>
                    <Input
                      value={formData['treatments_banner_title']?.value || ''}
                      onChange={(e) => handleChange('treatments_banner_title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtítulo do Banner</Label>
                    <Input
                      value={formData['treatments_banner_subtitle']?.value || ''}
                      onChange={(e) => handleChange('treatments_banner_subtitle', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Título da Grade de Tratamentos</Label>
                    <Input
                      value={formData['treatments_grid_title']?.value || ''}
                      onChange={(e) => handleChange('treatments_grid_title', e.target.value)}
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Tamanho recomendado: 1920x1080px.
                  </p>
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
                  <Label>Texto da Abordagem</Label>
                  <RichTextEditor
                    value={formData['treatments_approach_content']?.value || ''}
                    onChange={(val) => handleChange('treatments_approach_content', val)}
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Tamanho recomendado: 1200x800px.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4 max-w-3xl">
                <h3 className="text-lg font-semibold">Seção: Depoimentos</h3>
                <div className="space-y-2">
                  <Label>Título dos Depoimentos</Label>
                  <Input
                    value={formData['treatments_testim_title']?.value || ''}
                    onChange={(e) => handleChange('treatments_testim_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição dos Depoimentos</Label>
                  <Textarea
                    value={formData['treatments_testim_desc']?.value || ''}
                    onChange={(e) => handleChange('treatments_testim_desc', e.target.value)}
                  />
                </div>
              </div>

              <Button
                disabled={loading}
                onClick={() =>
                  handleSave([
                    'treatments_meta_title',
                    'treatments_meta_description',
                    'treatments_banner_image',
                    'treatments_banner_title',
                    'treatments_banner_subtitle',
                    'treatments_grid_title',
                    'treatments_approach_title',
                    'treatments_approach_content',
                    'treatments_approach_image',
                    'treatments_testim_title',
                    'treatments_testim_desc',
                  ])
                }
              >
                {loading ? 'Salvando...' : 'Salvar Página Tratamentos'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- CONTACT --- */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Página de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-lg font-semibold">Hero / Introdução</h3>
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    value={formData['contact_hero_title']?.value || ''}
                    onChange={(e) => handleChange('contact_hero_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={formData['contact_hero_desc']?.value || ''}
                    onChange={(e) => handleChange('contact_hero_desc', e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4 max-w-3xl">
                <h3 className="text-lg font-semibold">Formulário e Informações</h3>
                <div className="space-y-2">
                  <Label>Título do Formulário</Label>
                  <Input
                    value={formData['contact_form_title']?.value || ''}
                    onChange={(e) => handleChange('contact_form_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Título das Informações</Label>
                  <Input
                    value={formData['contact_info_title']?.value || ''}
                    onChange={(e) => handleChange('contact_info_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição das Informações</Label>
                  <Textarea
                    value={formData['contact_info_desc']?.value || ''}
                    onChange={(e) => handleChange('contact_info_desc', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Horário de Atendimento</Label>
                  <Input
                    value={formData['contact_hours']?.value || ''}
                    onChange={(e) => handleChange('contact_hours', e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4 max-w-3xl">
                <h3 className="text-lg font-semibold">Benefícios</h3>
                <div className="space-y-2">
                  <Label>Título da Seção de Benefícios</Label>
                  <Input
                    value={formData['contact_benefits_title']?.value || ''}
                    onChange={(e) => handleChange('contact_benefits_title', e.target.value)}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Benefício 1 - Título</Label>
                    <Input
                      value={formData['contact_benefit1_title']?.value || ''}
                      onChange={(e) => handleChange('contact_benefit1_title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Benefício 1 - Descrição</Label>
                    <Textarea
                      value={formData['contact_benefit1_desc']?.value || ''}
                      onChange={(e) => handleChange('contact_benefit1_desc', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Benefício 2 - Título</Label>
                    <Input
                      value={formData['contact_benefit2_title']?.value || ''}
                      onChange={(e) => handleChange('contact_benefit2_title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Benefício 2 - Descrição</Label>
                    <Textarea
                      value={formData['contact_benefit2_desc']?.value || ''}
                      onChange={(e) => handleChange('contact_benefit2_desc', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Benefício 3 - Título</Label>
                    <Input
                      value={formData['contact_benefit3_title']?.value || ''}
                      onChange={(e) => handleChange('contact_benefit3_title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Benefício 3 - Descrição</Label>
                    <Textarea
                      value={formData['contact_benefit3_desc']?.value || ''}
                      onChange={(e) => handleChange('contact_benefit3_desc', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4 max-w-3xl">
                <h3 className="text-lg font-semibold">Textos do Formulário</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Rótulo: Nome</Label>
                    <Input
                      value={formData['contact_label_name']?.value || ''}
                      onChange={(e) => handleChange('contact_label_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rótulo: Telefone</Label>
                    <Input
                      value={formData['contact_label_phone']?.value || ''}
                      onChange={(e) => handleChange('contact_label_phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rótulo: Email</Label>
                    <Input
                      value={formData['contact_label_email']?.value || ''}
                      onChange={(e) => handleChange('contact_label_email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rótulo: Tratamento</Label>
                    <Input
                      value={formData['contact_label_treatment']?.value || ''}
                      onChange={(e) => handleChange('contact_label_treatment', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Placeholder: Tratamento</Label>
                    <Input
                      value={formData['contact_placeholder_treatment']?.value || ''}
                      onChange={(e) =>
                        handleChange('contact_placeholder_treatment', e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rótulo: Mensagem</Label>
                    <Input
                      value={formData['contact_label_message']?.value || ''}
                      onChange={(e) => handleChange('contact_label_message', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Botão Enviar (Normal)</Label>
                    <Input
                      value={formData['contact_btn_submit']?.value || ''}
                      onChange={(e) => handleChange('contact_btn_submit', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Botão Enviar (Carregando)</Label>
                    <Input
                      value={formData['contact_btn_submitting']?.value || ''}
                      onChange={(e) => handleChange('contact_btn_submitting', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button
                disabled={loading}
                onClick={() =>
                  handleSave([
                    'contact_hero_title',
                    'contact_hero_desc',
                    'contact_form_title',
                    'contact_info_title',
                    'contact_info_desc',
                    'contact_hours',
                    'contact_benefits_title',
                    'contact_benefit1_title',
                    'contact_benefit1_desc',
                    'contact_benefit2_title',
                    'contact_benefit2_desc',
                    'contact_benefit3_title',
                    'contact_benefit3_desc',
                    'contact_label_name',
                    'contact_label_phone',
                    'contact_label_email',
                    'contact_label_treatment',
                    'contact_placeholder_treatment',
                    'contact_label_message',
                    'contact_btn_submit',
                    'contact_btn_submitting',
                  ])
                }
              >
                {loading ? 'Salvando...' : 'Salvar Página Contato'}
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
                {loading ? 'Salvando...' : 'Salvar Página Blog'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- NAVIGATION --- */}
        <TabsContent value="navigation">
          <NavigationManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NavigationManager() {
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchLinks = () => {
    pb.collection('navigation_links')
      .getFullList({ sort: 'order,created' })
      .then(setLinks)
      .catch(console.error)
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      for (const link of links) {
        if (link.id) {
          await pb.collection('navigation_links').update(link.id, link)
        } else {
          await pb.collection('navigation_links').create(link)
        }
      }
      toast.success('Links de navegação salvos com sucesso!')
      fetchLinks()
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao salvar os links.')
    } finally {
      setLoading(false)
    }
  }

  const addNewLink = () => {
    setLinks([...links, { label: '', href: '', order: links.length + 1, active: true }])
  }

  const removeLink = async (index: number) => {
    const link = links[index]
    if (link.id) {
      try {
        await pb.collection('navigation_links').delete(link.id)
      } catch (e) {
        console.error(e)
      }
    }
    const newLinks = [...links]
    newLinks.splice(index, 1)
    setLinks(newLinks)
  }

  const updateLink = (index: number, field: string, value: any) => {
    const newLinks = [...links]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setLinks(newLinks)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Links de Navegação Principal</CardTitle>
        <CardDescription>
          Adicione, remova e ordene os links que aparecem no cabeçalho do site. A aba "Tratamentos"
          precisa apontar para "/tratamentos" para abrir o submenu.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {links.map((link, idx) => (
            <div
              key={link.id || idx}
              className="flex flex-col md:flex-row items-center gap-4 bg-muted/30 p-4 rounded-xl border"
            >
              <div className="flex-1 space-y-1 w-full">
                <Label>Rótulo</Label>
                <Input
                  value={link.label}
                  onChange={(e) => updateLink(idx, 'label', e.target.value)}
                />
              </div>
              <div className="flex-1 space-y-1 w-full">
                <Label>Link (URL)</Label>
                <Input
                  value={link.href}
                  onChange={(e) => updateLink(idx, 'href', e.target.value)}
                />
              </div>
              <div className="w-full md:w-24 space-y-1">
                <Label>Ordem</Label>
                <Input
                  type="number"
                  value={link.order}
                  onChange={(e) => updateLink(idx, 'order', Number(e.target.value))}
                />
              </div>
              <div className="flex items-center gap-2 mt-4 md:mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateLink(idx, 'active', !link.active)}
                >
                  {link.active ? 'Ativo' : 'Oculto'}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => removeLink(idx)}>
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={addNewLink}>
            Adicionar Novo Link
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
