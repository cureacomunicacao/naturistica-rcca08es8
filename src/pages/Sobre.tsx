import { ScrollReveal } from '@/components/ScrollReveal'
import { useSettings } from '@/hooks/use-settings'
import pb from '@/lib/pocketbase/client'
import { SEO } from '@/components/SEO'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function Sobre() {
  const { settings } = useSettings()

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

  const fallbackAbout =
    '<p>Nossa história começou nos corredores da Universidade Estadual de Londrina (UEL), onde a paixão pela medicina se encontrou com o desejo de ir além do tratamento de sintomas.</p><p>A Naturistica nasceu da necessidade de unir o rigor científico da nossa formação com a sabedoria ancestral, criando um espaço de cura integrativa focado no ser humano como um todo.</p>'

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
            <h1 className="text-4xl md:text-6xl font-bold text-white font-serif">Nossa História</h1>
            <p className="text-xl md:text-2xl text-white/90 font-serif mt-4 max-w-2xl mx-auto">
              Da ciência moderna à sabedoria ancestral para uma saúde integral.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="container max-w-5xl mt-[-4rem] relative z-20">
        <ScrollReveal className="bg-white rounded-3xl p-8 md:p-16 shadow-xl border border-border/50 mb-24">
          <h2 className="text-3xl font-bold text-primary mb-8 font-serif text-center">
            A Jornada Naturistica
          </h2>
          <div
            className="prose prose-lg max-w-none text-muted-foreground prose-headings:text-primary prose-a:text-primary font-sans leading-relaxed text-center"
            dangerouslySetInnerHTML={{ __html: settings.about_content?.value || fallbackAbout }}
          />
        </ScrollReveal>

        {/* Doctors Section */}
        <div className="space-y-12">
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
                    className="prose prose-base text-muted-foreground leading-relaxed"
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
                    className="prose prose-base text-muted-foreground leading-relaxed"
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
        </div>

        <ScrollReveal className="mt-24 text-center max-w-3xl mx-auto space-y-8 bg-primary/5 p-12 rounded-3xl border border-primary/10">
          <h2 className="text-3xl font-bold font-serif text-primary">Inicie sua jornada de cura</h2>
          <p className="text-lg text-muted-foreground">
            Agende sua consulta e dê o primeiro passo para uma vida com mais saúde, consciência e
            bem-estar com a equipe Naturistica.
          </p>
          <a
            href={settings.about_whatsapp_url?.value || 'https://wa.me/5511999999999'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-primary text-white px-8 py-4 text-lg font-medium transition-transform hover:scale-105 shadow-md"
          >
            {settings.about_whatsapp_label?.value || 'Fale conosco pelo WhatsApp'}
          </a>
        </ScrollReveal>
      </div>
    </div>
  )
}
