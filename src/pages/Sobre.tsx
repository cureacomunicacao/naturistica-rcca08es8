import { ScrollReveal } from '@/components/ScrollReveal'
import { useSettings } from '@/hooks/use-settings'
import pb from '@/lib/pocketbase/client'
import { SEO } from '@/components/SEO'

export default function Sobre() {
  const { settings } = useSettings()

  const getImageUrl = (record: any, fallback: string) => {
    if (record?.image && record?.id) {
      return `${import.meta.env.VITE_POCKETBASE_URL}/api/files/site_settings/${record.id}/${record.image}`
    }
    return fallback
  }

  const mainImage = getImageUrl(
    settings.about_main,
    'https://img.usecurling.com/p/600/800?q=doctor%20plants&color=green',
  )
  const imgAlt = settings.about_main?.image_alt || 'Dra Beatriz e Dr Felipe'

  const felipeRecord = settings.about_doctor_felipe_image || settings.about_felipe_image
  const felipeImgUrl = getImageUrl(
    felipeRecord,
    'https://img.usecurling.com/ppl/large?gender=male&seed=felipe',
  )

  const beatrizRecord = settings.about_doctor_beatriz_image || settings.about_beatriz_image
  const beatrizImgUrl = getImageUrl(
    beatrizRecord,
    'https://img.usecurling.com/ppl/large?gender=female&seed=beatriz',
  )

  return (
    <div className="container max-w-5xl py-12 md:py-20">
      <SEO
        title={settings.about_seo_title?.value || 'Nossa História | Naturistica'}
        description={
          settings.about_seo_description?.value ||
          'Conheça a história da Naturistica e nossos fundadores.'
        }
      />
      <ScrollReveal className="space-y-8 text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold text-balance">Nossa História</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-serif">
          Da Universidade Estadual de Londrina (UEL) para a criação de um espaço de cura
          integrativa.
        </p>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
        <ScrollReveal
          delay={100}
          className="order-2 md:order-1 relative h-[500px] rounded-3xl overflow-hidden"
        >
          <img
            src={mainImage}
            alt={imgAlt}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </ScrollReveal>
        <ScrollReveal
          delay={200}
          className="order-1 md:order-2 space-y-6 text-lg text-muted-foreground"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">A Jornada Naturistica</h2>
          <div className="whitespace-pre-wrap">
            {settings.about_content?.value ||
              'Nossa história começou nos corredores da Universidade Estadual de Londrina (UEL), onde a paixão pela medicina se encontrou com o desejo de ir além do tratamento de sintomas.\n\nA Naturistica nasceu da necessidade de unir o rigor científico da nossa formação com a sabedoria ancestral.'}
          </div>
        </ScrollReveal>
      </div>

      <div className="mb-12">
        <ScrollReveal className="bg-white p-8 md:p-12 rounded-3xl border border-border/50 flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden relative">
            <img
              src={felipeImgUrl}
              alt={felipeRecord?.image_alt || 'Dr. Felipe Zamboni'}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-2/3 space-y-6">
            <h3 className="text-3xl font-bold text-primary">
              {settings.about_felipe_title?.value || 'Dr. Felipe Zamboni'}
            </h3>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {settings.about_felipe_content?.value ||
                'Especialista em abordagens mente-corpo, o Dr. Felipe integrou seus estudos em medicina com a psicoterapia Gestalt e conhecimentos profundos sobre enteógenos e plantas medicinais. Sua escuta atenta busca desvendar as raízes emocionais dos sintomas físicos, guiando os pacientes para a autonomia de sua própria saúde.'}
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="mb-24">
        <ScrollReveal className="bg-white p-8 md:p-12 rounded-3xl border border-border/50 flex flex-col md:flex-row-reverse gap-12 items-center">
          <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden relative">
            <img
              src={beatrizImgUrl}
              alt={beatrizRecord?.image_alt || 'Dra. Beatriz Mulari'}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-2/3 space-y-6">
            <h3 className="text-3xl font-bold text-primary">
              {settings.about_beatriz_title?.value || 'Dra. Beatriz Mulari'}
            </h3>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {settings.about_beatriz_content?.value ||
                'Com foco em saúde feminina, Ayurveda e medicina canabinoide, a Dra. Beatriz traz uma perspectiva holística onde nutrição, rotina e tratamentos naturais se encontram. Sua abordagem gentil e baseada em evidências científicas modernas proporciona um ambiente seguro para transformações profundas de estilo de vida.'}
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="mb-24">
        <ScrollReveal className="space-y-6 bg-primary/5 p-8 md:p-12 rounded-3xl text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold font-serif">Nossa Filosofia</h2>
          <p className="text-lg text-muted-foreground">
            Trabalhamos com Cannabis Medicinal, Psicoterapia, Ayurveda e Enteógenos não como
            alternativas isoladas, mas como ferramentas complementares. Acreditamos que a cura
            acontece quando restauramos a comunicação perdida entre a mente, o corpo e a natureza
            que nos cerca.
          </p>
        </ScrollReveal>
      </div>

      <ScrollReveal className="text-center max-w-3xl mx-auto space-y-8 bg-primary p-12 rounded-3xl text-primary-foreground mb-24">
        <h2 className="text-3xl font-bold font-serif">Inicie sua jornada de cura</h2>
        <p className="text-lg text-primary-foreground/90">
          Agende sua consulta e dê o primeiro passo para uma vida com mais saúde, consciência e
          bem-estar.
        </p>
        <a
          href={settings.about_whatsapp_url?.value || 'https://wa.me/5511999999999'}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-white text-primary px-8 py-4 text-lg font-medium transition-transform hover:scale-105"
        >
          {settings.about_whatsapp_label?.value || 'Fale conosco pelo WhatsApp'}
        </a>
      </ScrollReveal>
    </div>
  )
}
