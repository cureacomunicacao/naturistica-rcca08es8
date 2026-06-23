import { PageSectionRecord } from '@/services/page_sections'
import pb from '@/lib/pocketbase/client'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ScrollReveal } from '@/components/ScrollReveal'

export function PageSections({ sections }: { sections: PageSectionRecord[] }) {
  return (
    <div className="flex flex-col">
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  )
}

function SectionRenderer({ section }: { section: PageSectionRecord }) {
  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url)
        const v = urlObj.searchParams.get('v')
        return v ? `https://www.youtube.com/embed/${v}` : url
      }
      if (url.includes('youtu.be/')) {
        const v = url.split('youtu.be/')[1].split('?')[0]
        return `https://www.youtube.com/embed/${v}`
      }
    } catch (e) {
      return url
    }
    return url
  }

  const bg = section.background_color || 'transparent'
  const color = section.text_color || 'inherit'
  const py = section.padding_y !== undefined ? `${section.padding_y}px` : '4rem'

  const sectionStyle = {
    backgroundColor: bg,
    color: color,
    paddingTop: py,
    paddingBottom: py,
  }

  const imageUrl = section.image ? pb.files.getURL(section, section.image) : null

  if (section.type === 'hero') {
    return (
      <section
        style={sectionStyle}
        className="relative overflow-hidden flex items-center min-h-[60vh]"
      >
        {imageUrl && (
          <div className="absolute inset-0 z-0">
            <img
              src={imageUrl}
              alt={section.title || ''}
              className="w-full h-full object-cover opacity-30"
            />
          </div>
        )}
        <div className="container relative z-10 text-center max-w-4xl mx-auto space-y-6">
          <ScrollReveal>
            {section.title && <h1 className="text-4xl md:text-6xl font-bold">{section.title}</h1>}
            {section.description && (
              <div
                className="text-lg md:text-xl opacity-90 mt-6 prose mx-auto"
                style={{ color }}
                dangerouslySetInnerHTML={{ __html: section.description }}
              />
            )}
            {section.button_text && section.button_link && (
              <Button asChild size="lg" className="mt-8 rounded-full shadow-lg">
                <Link to={section.button_link}>{section.button_text}</Link>
              </Button>
            )}
          </ScrollReveal>
        </div>
      </section>
    )
  }

  if (section.type === 'side_image_right' || section.type === 'side_image_left') {
    const isRight = section.type === 'side_image_right'
    return (
      <section style={sectionStyle}>
        <div className="container">
          <ScrollReveal>
            <div
              className={`grid md:grid-cols-2 gap-12 items-center ${!isRight ? 'md:grid-flow-col-dense' : ''}`}
            >
              <div className={`space-y-6 ${!isRight ? 'md:col-start-2' : ''}`}>
                {section.title && <h2 className="text-3xl font-bold">{section.title}</h2>}
                {section.description && (
                  <div
                    className="prose max-w-none opacity-90"
                    style={{ color }}
                    dangerouslySetInnerHTML={{ __html: section.description }}
                  />
                )}
                {section.button_text && section.button_link && (
                  <Button asChild className="rounded-full shadow-md mt-4">
                    <Link to={section.button_link}>{section.button_text}</Link>
                  </Button>
                )}
              </div>
              {imageUrl && (
                <div className={`${!isRight ? 'md:col-start-1' : ''} order-first md:order-none`}>
                  <img
                    src={imageUrl}
                    alt={section.title || ''}
                    className="w-full rounded-2xl shadow-lg object-cover"
                  />
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    )
  }

  if (section.type === 'list') {
    const items = Array.isArray(section.content) ? section.content : []
    return (
      <section style={sectionStyle}>
        <div className="container max-w-4xl mx-auto">
          <ScrollReveal>
            {section.title && (
              <h2 className="text-3xl font-bold mb-8 text-center">{section.title}</h2>
            )}
            {section.description && (
              <div
                className="prose max-w-none opacity-90 mb-8 text-center mx-auto"
                style={{ color }}
                dangerouslySetInnerHTML={{ __html: section.description }}
              />
            )}
            <ul className="space-y-4">
              {items.map((item: any, i: number) => (
                <li
                  key={i}
                  className="flex gap-4 items-start p-6 rounded-2xl bg-black/5 dark:bg-white/5"
                >
                  <div className="flex-1">
                    {item.title && <h3 className="font-bold text-xl mb-2">{item.title}</h3>}
                    {item.description && <p className="opacity-80">{item.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>
    )
  }

  if (section.type === 'cards') {
    const items = Array.isArray(section.content) ? section.content : []
    return (
      <section style={sectionStyle}>
        <div className="container">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
              {section.title && <h2 className="text-3xl font-bold">{section.title}</h2>}
              {section.description && (
                <div
                  className="prose max-w-none opacity-90 mx-auto"
                  style={{ color }}
                  dangerouslySetInnerHTML={{ __html: section.description }}
                />
              )}
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {items.map((item: any, i: number) => (
                <div
                  key={i}
                  className="bg-black/5 dark:bg-white/5 rounded-2xl p-8 space-y-4 hover:bg-black/10 dark:hover:bg-white/10 transition-colors shadow-sm"
                >
                  {item.title && <h3 className="font-bold text-xl">{item.title}</h3>}
                  {item.description && (
                    <p className="opacity-80 leading-relaxed">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    )
  }

  if (section.type === 'video') {
    return (
      <section style={sectionStyle}>
        <div className="container max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center space-y-4 mb-8">
              {section.title && <h2 className="text-3xl font-bold">{section.title}</h2>}
              {section.description && (
                <div
                  className="prose max-w-none opacity-90 mx-auto"
                  style={{ color }}
                  dangerouslySetInnerHTML={{ __html: section.description }}
                />
              )}
            </div>
            {section.video_url && (
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl bg-black">
                <iframe
                  src={getEmbedUrl(section.video_url)}
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>
    )
  }

  return null
}
