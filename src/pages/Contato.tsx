import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import pb from '@/lib/pocketbase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Phone, Mail, MapPin, CheckCircle2, MessageSquare, Clock } from 'lucide-react'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import { toast } from 'sonner'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useSettings } from '@/hooks/use-settings'

const formSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().min(8, 'Telefone é obrigatório'),
  message: z.string().optional(),
  treatment_ref: z.string().optional(),
})

export default function Contato() {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const [treatments, setTreatments] = useState<any[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [faqs, setFaqs] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', phone: '', message: '', treatment_ref: '' },
  })

  useEffect(() => {
    pb.collection('treatments')
      .getFullList({ sort: 'title', requestKey: null })
      .then(setTreatments)
      .catch(console.error)
    pb.collection('testimonials')
      .getFullList({ filter: 'active=true', sort: '-created', requestKey: null })
      .then(setTestimonials)
      .catch(console.error)
    pb.collection('faqs')
      .getFullList({ sort: 'order', requestKey: null })
      .then(setFaqs)
      .catch(console.error)
  }, [])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      const payload: any = { ...values }
      if (!payload.treatment_ref) delete payload.treatment_ref

      await pb.collection('leads').create(payload)

      const treatmentName = values.treatment_ref
        ? treatments.find((t) => t.id === values.treatment_ref)?.title || ''
        : ''

      navigate('/obrigado', { state: { ...values, treatmentName } })
    } catch (err) {
      console.error(err)
      const fieldErrors = extractFieldErrors(err)
      if (Object.keys(fieldErrors).length > 0) {
        Object.entries(fieldErrors).forEach(([field, msg]) => {
          form.setError(field as any, { message: msg })
        })
      } else {
        toast.error('Erro ao enviar contato. Tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Section 1: Hero */}
      <section className="bg-muted py-20 px-4">
        <div className="container max-w-4xl text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            {settings.contact_hero_title?.value || 'Fale Conosco'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {settings.contact_hero_desc?.value ||
              'Dê o primeiro passo para o seu bem-estar. Preencha o formulário abaixo e nossa equipe entrará em contato com você pelo WhatsApp.'}
          </p>
        </div>
      </section>

      {/* Section 2 & 3: Form and Contact Details */}
      <section className="py-16 px-4">
        <div className="container grid md:grid-cols-2 gap-12 max-w-6xl">
          {/* Form */}
          <div className="bg-card p-8 rounded-2xl shadow-sm border">
            <h2 className="text-2xl font-semibold mb-6">
              {settings.contact_form_title?.value || 'Envie sua mensagem'}
            </h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {settings.contact_label_name?.value || 'Nome Completo *'}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{settings.contact_label_phone?.value || 'WhatsApp *'}</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{settings.contact_label_email?.value || 'Email'}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="seu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="treatment_ref"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {settings.contact_label_treatment?.value || 'Qual tratamento você procura?'}
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                settings.contact_placeholder_treatment?.value ||
                                'Selecione um tratamento...'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {treatments.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {settings.contact_label_message?.value || 'Mensagem (Opcional)'}
                      </FormLabel>
                      <FormControl>
                        <Textarea placeholder="Como podemos ajudar?" rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting
                    ? settings.contact_btn_submitting?.value || 'Enviando...'
                    : settings.contact_btn_submit?.value || 'Enviar e Continuar no WhatsApp'}
                </Button>
              </form>
            </Form>
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                {settings.contact_info_title?.value || 'Informações de Contato'}
              </h2>
              <p className="text-muted-foreground mb-8">
                {settings.contact_info_desc?.value ||
                  'Estamos prontos para atender você com o maior cuidado e profissionalismo. Entre em contato pelos nossos canais diretos.'}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Telefone / WhatsApp</h3>
                    <p className="text-muted-foreground">
                      {settings['global_phone']?.value || '(11) 99999-9999'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">
                      {settings['global_email']?.value || 'contato@naturistica.com.br'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Horário de Atendimento</h3>
                    <p className="text-muted-foreground">
                      {settings.contact_hours?.value || 'Segunda a Sexta, das 8h às 18h'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Benefits */}
      <section className="py-16 bg-muted/50 px-4">
        <div className="container max-w-5xl text-center">
          <h2 className="text-3xl font-semibold mb-12">
            {settings.contact_benefits_title?.value || 'Por que escolher a Naturistica?'}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-primary" />
              <h3 className="text-xl font-medium">
                {settings.contact_benefit1_title?.value || 'Atendimento Humanizado'}
              </h3>
              <p className="text-muted-foreground">
                {settings.contact_benefit1_desc?.value ||
                  'Ouvimos você de verdade, com consultas longas e focadas na raiz do problema.'}
              </p>
            </div>
            <div className="flex flex-col items-center p-6 space-y-4">
              <MessageSquare className="w-12 h-12 text-primary" />
              <h3 className="text-xl font-medium">
                {settings.contact_benefit2_title?.value || 'Suporte Contínuo'}
              </h3>
              <p className="text-muted-foreground">
                {settings.contact_benefit2_desc?.value ||
                  'Acompanhamento próximo via WhatsApp durante todo o tratamento.'}
              </p>
            </div>
            <div className="flex flex-col items-center p-6 space-y-4">
              <MapPin className="w-12 h-12 text-primary" />
              <h3 className="text-xl font-medium">
                {settings.contact_benefit3_title?.value || '100% Online'}
              </h3>
              <p className="text-muted-foreground">
                {settings.contact_benefit3_desc?.value ||
                  'Consultas e retornos sem precisar sair de casa, com segurança e praticidade.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16 px-4">
          <div className="container max-w-5xl">
            <h2 className="text-3xl font-semibold mb-12 text-center">
              {settings.treatments_testim_title?.value || 'O que dizem nossos pacientes'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.slice(0, 4).map((t) => (
                <div
                  key={t.id}
                  className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col justify-between"
                >
                  <p className="text-muted-foreground italic mb-4">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    {t.image ? (
                      <img
                        src={pb.files.getURL(t, t.image)}
                        alt={t.patient_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {t.patient_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm">{t.patient_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.doctor ? `Paciente Dr(a). ${t.doctor}` : 'Paciente Naturistica'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 6: FAQ */}
      {faqs.length > 0 && (
        <section className="py-16 bg-card px-4 border-t">
          <div className="container max-w-3xl">
            <h2 className="text-3xl font-semibold mb-8 text-center">Dúvidas Frequentes</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}
    </div>
  )
}
