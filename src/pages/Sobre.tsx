import { ScrollReveal } from '@/components/ScrollReveal'
import { useSettings } from '@/hooks/use-settings'
import pb from '@/lib/pocketbase/client'
import { SEO } from '@/components/SEO'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ScheduleDialog } from '@/components/ScheduleDialog'

export default function Sobre() {
  const { settings, loading: settingsLoading } = useSettings()
  const [faqs, setFaqs] = useState<any[]>([])
  const [loadingFaqs, setLoadingFaqs] = useState(true)

  useEffect(() => {
    pb.collection('faqs')
      .getFullList({ sort: 'order' })
      .then(setFaqs)
      .catch(console.error)
      .finally(() => setLoadingFaqs(false))
  }, [])

  const getImageUrl = (record: any, fallback: string) => {
    if (record?.image && record?.id) {
      return `${import.meta.env.VITE_POCKETBASE_URL}/api/files/site_settings/${record.id}/${record.image}`
    }
    return fallback
  }

  const mainImage = getImageUrl(
    settings.about_hero_image || settings.about_main,
    'https://img.usecurling.com/p/1200/600?q=nature%20clinic&color=green',
  )
  const imgAlt =
    (settings.about_hero_image?.image_alt || settings.about_main?.image_alt) ??
    'Clínica Naturistica'

  const felipeRecord = settings.doctor_felipe_image || settings.about_felipe_image
  const felipeImgUrl = getImageUrl(
    felipeRecord,
    'https://img.usecurling.com/ppl/large?gender=male&seed=felipe',
  )

  const beatrizRecord = settings.doctor_beatriz_image || settings.about_beatriz_image
  const beatrizImgUrl = getImageUrl(
    beatrizRecord,
    'https://img.usecurling.com/ppl/large?gender=female&seed=beatriz',
  )

  const fallbackFelipe =
    '<p>Especialista em abordagens mente-corpo, o Dr. Felipe integrou seus estudos em medicina com a psicoterapia Gestalt e conhecimentos profundos sobre enteógenos e plantas medicinais.</p><p>Sua escuta atenta busca desvendar as raízes emocionais dos sintomas físicos, guiando os pacientes para a autonomia de sua própria saúde.</p>'

  const fallbackBeatriz =
    '<p>Com foco em saúde feminina, Ayurveda e medicina canabinoide, a Dra. Beatriz traz uma perspectiva holística onde nutrição, rotina e tratamentos naturais se encontram.</p><p>Sua abordagem gentil e baseada em evidências científicas modernas proporciona um ambiente seguro para transformações profundas de estilo de vida.</p>'

  return (
    <div className="pb-24">
      <SEO
        title={
          settings.about_meta_title?.value ||
          settings.about_seo_title?.value ||
          'Nossa História | Naturistica'
        }
        description={
          settings.about_meta_description?.value ||
          settings.about_seo_description?.value ||
          'Conheça a história da Naturistica e nossos fundadores.'
        }
      />

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-primary/90">
        <img
          src={mainImage}
          alt={imgAlt}
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="relative z-10 text-center space-y-6 px-4 max-w-4xl mx-auto mt-12">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-bold text-white font-serif">
              {settings.about_hero_title?.value || 'Nossa História'}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-serif mt-4 max-w-2xl mx-auto">
              {settings.about_hero_subtitle?.value ||
                'Da ciência moderna à sabedoria ancestral para uma saúde integral.'}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="container max-w-5xl mt-[-4rem] relative z-20">
        {/* Journey Sections (Z-Pattern) */}
        <div className="space-y-16 md:space-y-24 mb-24">
          {settingsLoading
            ? [1, 2, 3, 4, 5, 6].map((num, idx) => {
                const isImageLeft = idx % 2 !== 0
                return (
                  <div
                    key={num}
                    className={`flex flex-col ${
                      isImageLeft ? 'lg:flex-row-reverse' : 'lg:flex-row'
                    } gap-12 lg:gap-16 items-center bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-border/50`}
                  >
                    <div className="flex-1 space-y-6 w-full">
                      <Skeleton className="h-10 w-3/4" />
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-5/6" />
                    </div>
                    <Skeleton className="w-full lg:w-5/12 h-[350px] md:h-[400px] rounded-3xl shrink-0" />
                  </div>
                )
              })
            : [1, 2, 3, 4, 5, 6].map((num, idx) => {
                const titleKey = `about_journey_s${num}_title`
                const contentKey = `about_journey_s${num}_content`
                const imageKey = `about_journey_s${num}_image`

                const fallbacks = [
                  {
                    title: 'Nossa Origem',
                    text: '<p>Nossa história começou nos corredores da Universidade Estadual de Londrina (UEL), onde a paixão pela medicina se encontrou com o desejo de ir além do tratamento de sintomas.</p>',
                  },
                  {
                    title: 'O Nascimento da Naturistica',
                    text: '<p>A Naturistica nasceu da necessidade de unir o rigor científico da nossa formação com a sabedoria ancestral, criando um espaço de cura integrativa focado no ser humano como um todo.</p>',
                  },
                  {
                    title: 'Além dos Sintomas',
                    text: '<p>Percebemos que o tratamento convencional muitas vezes apenas mascarava as raízes dos problemas. Nosso objetivo sempre foi investigar as causas profundas e emocionais de cada paciente.</p>',
                  },
                  {
                    title: 'Medicinas Tradicionais',
                    text: '<p>Decidimos buscar conhecimento nas medicinas tradicionais, incorporando práticas como Ayurveda e fitoterapia, que enxergam o indivíduo em sua totalidade sistêmica.</p>',
                  },
                  {
                    title: 'Novas Perspectivas de Cura',
                    text: '<p>O estudo aprofundado do uso de enteógenos e da medicina canabinoide nos trouxe ferramentas inovadoras e poderosas para transformações de vida consistentes.</p>',
                  },
                  {
                    title: 'O Nosso Propósito',
                    text: '<p>Hoje, oferecemos um espaço seguro, acolhedor e fundamentado na ciência, guiando nossos pacientes para a autonomia e protagonismo de sua própria saúde.</p>',
                  },
                ]

                const defaultFallback = fallbacks[idx]
                const title = settings[titleKey]?.value || defaultFallback.title
                const content = settings[contentKey]?.value || defaultFallback.text
                const imageRecord = settings[imageKey]
                const imageUrl = getImageUrl(
                  imageRecord,
                  `https://img.usecurling.com/p/800/800?q=nature%20therapy&seed=${num}`,
                )
                const imageAlt = imageRecord?.image_alt || title

                // Z-Pattern: Even index (0, 2, 4) -> Image Right, Text Left. Odd index (1, 3, 5) -> Image Left, Text Right
                const isImageLeft = idx % 2 !== 0

                return (
                  <ScrollReveal
                    key={num}
                    className={`flex flex-col ${
                      isImageLeft ? 'lg:flex-row-reverse' : 'lg:flex-row'
                    } gap-12 lg:gap-16 items-center bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-border/50`}
                  >
                    <div className="flex-1 space-y-6">
                      <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif">
                        {title}
                      </h2>
                      <div
                        className="prose prose-lg text-muted-foreground prose-headings:text-primary prose-headings:font-serif prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground prose-strong:font-semibold prose-ul:list-disc prose-ol:list-decimal prose-li:text-muted-foreground font-sans leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                    </div>
                    <div className="relative w-full lg:w-5/12 h-[350px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl shrink-0">
                      <img
                        src={imageUrl}
                        alt={imageAlt}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </ScrollReveal>
                )
              })}
        </div>

        {/* Doctors Section */}
        <div className="space-y-12 mb-24">
          {settingsLoading ? (
            <>
              <Card className="overflow-hidden border-none shadow-lg rounded-3xl">
                <div className="grid md:grid-cols-2">
                  <Skeleton className="h-[400px] md:h-auto rounded-none" />
                  <CardContent className="p-8 md:p-12 flex flex-col justify-center bg-white gap-4">
                    <Skeleton className="h-10 w-2/3" />
                    <Skeleton className="h-4 w-1/3 mb-6" />
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </div>
              </Card>
              <Card className="overflow-hidden border-none shadow-lg rounded-3xl">
                <div className="grid md:grid-cols-2">
                  <CardContent className="order-2 md:order-1 p-8 md:p-12 flex flex-col justify-center bg-white gap-4">
                    <Skeleton className="h-10 w-2/3" />
                    <Skeleton className="h-4 w-1/3 mb-6" />
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                  <Skeleton className="order-1 md:order-2 h-[400px] md:h-auto rounded-none" />
                </div>
              </Card>
            </>
          ) : (
            <>
              <ScrollReveal>
                <Card className="overflow-hidden border-none shadow-lg rounded-3xl">
                  <div className="grid md:grid-cols-2 group">
                    <div className="relative h-[400px] md:h-auto overflow-hidden bg-muted">
                      <img
                        src={felipeImgUrl}
                        alt={felipeRecord?.image_alt || 'Dr. Felipe Zamboni'}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <CardContent className="p-8 md:p-12 flex flex-col justify-center bg-white">
                      <h3 className="text-3xl font-bold text-primary font-serif mb-2">
                        {settings.about_felipe_title?.value || 'Dr. Felipe Zamboni'}
                      </h3>
                      <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-6">
                        Co-fundador & Diretor Clínico
                      </p>
                      <Separator className="w-12 h-1 bg-primary mb-6" />
                      <div
                        className="prose prose-base md:prose-lg text-muted-foreground prose-strong:text-foreground prose-strong:font-semibold leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: settings.about_felipe_content?.value || fallbackFelipe,
                        }}
                      />
                    </CardContent>
                  </div>
                </Card>
              </ScrollReveal>

              <ScrollReveal>
                <Card className="overflow-hidden border-none shadow-lg rounded-3xl">
                  <div className="grid md:grid-cols-2 group">
                    <CardContent className="order-2 md:order-1 p-8 md:p-12 flex flex-col justify-center bg-white">
                      <h3 className="text-3xl font-bold text-primary font-serif mb-2">
                        {settings.about_beatriz_title?.value || 'Dra. Beatriz Mulari'}
                      </h3>
                      <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-6">
                        Co-fundadora & Diretora Clínica
                      </p>
                      <Separator className="w-12 h-1 bg-primary mb-6" />
                      <div
                        className="prose prose-base md:prose-lg text-muted-foreground prose-strong:text-foreground prose-strong:font-semibold leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: settings.about_beatriz_content?.value || fallbackBeatriz,
                        }}
                      />
                    </CardContent>
                    <div className="order-1 md:order-2 relative h-[400px] md:h-auto overflow-hidden bg-muted">
                      <img
                        src={beatrizImgUrl}
                        alt={beatrizRecord?.image_alt || 'Dra. Beatriz Mulari'}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </Card>
              </ScrollReveal>
            </>
          )}
        </div>

        {/* FAQs Section */}
        {loadingFaqs ? (
          <div className="max-w-3xl mx-auto mb-24 bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-border/50">
            <Skeleton className="h-10 w-64 mx-auto mb-8" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ) : (
          faqs.length > 0 && (
            <ScrollReveal className="max-w-3xl mx-auto mb-24 bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-border/50">
              <h2 className="text-3xl font-bold text-primary font-serif text-center mb-8">
                {settings.about_faq_title?.value || 'Perguntas Frequentes'}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left font-medium text-lg hover:text-primary transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollReveal>
          )
        )}

        <ScrollReveal className="text-center max-w-3xl mx-auto space-y-8 bg-primary/5 p-12 rounded-3xl border border-primary/10">
          <h2 className="text-3xl font-bold font-serif text-primary">
            {settings.about_cta_title?.value || 'Inicie sua jornada de cura'}
          </h2>
          <p className="text-lg text-muted-foreground">
            {settings.about_cta_desc?.value ||
              'Agende sua consulta e dê o primeiro passo para uma vida com mais saúde, consciência e bem-estar com a equipe Naturistica.'}
          </p>
          <ScheduleDialog>
            <button className="inline-flex items-center justify-center rounded-full bg-primary text-white px-8 py-4 text-lg font-medium transition-transform hover:scale-105 shadow-md cursor-pointer">
              {settings.about_whatsapp_label?.value || 'Fale conosco pelo WhatsApp'}
            </button>
          </ScheduleDialog>
        </ScrollReveal>
      </div>
    </div>
  )
}
