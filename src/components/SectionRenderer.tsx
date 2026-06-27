import { PageSectionRecord } from '@/services/page_sections'
import pb from '@/lib/pocketbase/client'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ScrollReveal } from '@/components/ScrollReveal'
import { EditableInlineText, EditableImage } from '@/components/EditableSectionFields'
import { useAdminMode } from '@/hooks/use-admin-mode'
import { cn } from '@/lib/utils'

export function SectionRenderer({ section }: { section: PageSectionRecord }) {
  const { isEditingMode } = useAdminMode()

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
  const sectionStyle = { backgroundColor: bg, color: color, paddingTop: py, paddingBottom: py }
  const imageUrl = section.image ? pb.files.getURL(section, section.image) : null

  const handleUpdate = (field: string) => async (val: any) => {
    await pb.collection('page_sections').update(section.id, { [field]: val })
  }
  const handleUploadImage = async (file: File) => {
    await pb.collection('page_sections').update(section.id, { image: file })
  }

  const renderTitle = (className?: string) => (
    <EditableInlineText
      value={section.title}
      onSave={handleUpdate('title')}
      as="h2"
      className={cn('font-bold', className)}
      placeholder="Título da Seção"
    />
  )
  const renderDesc = (className?: string) => (
    <EditableInlineText
      value={section.description}
      onSave={handleUpdate('description')}
      as="div"
      className={cn('prose opacity-90', className)}
      isHtml
      multiline
      placeholder="Descrição da Seção"
      style={{ color }}
    />
  )
  const renderBtn = (className?: string) => {
    if (!section.button_text && !isEditingMode) return null

    const isWhatsApp =
      section.button_text?.toLowerCase().includes('whatsapp') ||
      section.button_link?.toLowerCase().includes('wa.me')

    if (isEditingMode) {
      return (
        <Button
          size="lg"
          className={cn(
            'mt-4 rounded-full shadow-lg h-auto whitespace-normal',
            className,
            isWhatsApp && 'bg-green-600 hover:bg-green-700 text-white',
          )}
        >
          <EditableInlineText
            value={section.button_text}
            onSave={handleUpdate('button_text')}
            as="span"
            placeholder="Texto do Botão"
          />
        </Button>
      )
    }

    if (isWhatsApp) {
      const parts = (section.button_text || '').split(/(whatsapp)/i)
      return (
        <Button
          asChild
          size="lg"
          className={cn(
            'mt-4 rounded-full shadow-lg text-center h-auto py-3 px-6 leading-tight bg-green-600 hover:bg-green-700 text-white border-none',
            className,
          )}
        >
          <a href={section.button_link || '#'} target="_blank" rel="noopener noreferrer">
            <span className="inline-flex flex-col sm:inline-block items-center justify-center">
              {parts.map((part, i) => {
                if (part.toLowerCase() === 'whatsapp') {
                  return (
                    <span key={i} className="font-bold sm:ml-1">
                      {part}
                    </span>
                  )
                }
                return (
                  <span key={i} className="opacity-90">
                    {part.trim()}
                  </span>
                )
              })}
            </span>
          </a>
        </Button>
      )
    }

    return (
      <Button
        asChild
        size="lg"
        className={cn('mt-4 rounded-full shadow-lg h-auto whitespace-normal', className)}
      >
        <Link to={section.button_link || '#'}>{section.button_text}</Link>
      </Button>
    )
  }

  if (section.type === 'hero') {
    return (
      <section
        style={sectionStyle}
        className="relative overflow-hidden flex items-center min-h-[60vh]"
      >
        {(imageUrl || isEditingMode) && (
          <div className="absolute inset-0 z-0 opacity-30">
            <EditableImage
              src={imageUrl}
              onUpload={handleUploadImage}
              className="w-full h-full"
              alt={section.title || ''}
            />
          </div>
        )}
        <div className="container relative z-10 text-center max-w-4xl mx-auto space-y-6">
          <ScrollReveal>
            <EditableInlineText
              value={section.title}
              onSave={handleUpdate('title')}
              as="h1"
              className="text-4xl md:text-6xl font-bold"
              placeholder="Título Hero"
            />
            {renderDesc('text-lg md:text-xl mt-6 mx-auto')}
            {renderBtn('mt-8')}
          </ScrollReveal>
        </div>
      </section>
    )
  }

  if (section.type === 'side_image_right' || section.type === 'side_image_left') {
    const isRight = section.type === 'side_image_right'
    return
    null
  }

  if (section.type === 'list') {
    const items = Array.isArray(section.content) ? section.content : []
    return (
      <section style={sectionStyle}>
        <div className="container max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-8">
              {renderTitle('text-3xl')} {renderDesc('mx-auto mt-4')}
            </div>
            <ul className="space-y-4">
              {items.map((item: any, i: number) => {
                const updateItem = (field: string) => async (val: string) => {
                  const newItems = [...items]
                  newItems[i] = { ...item, [field]: val }
                  await handleUpdate('content')(newItems)
                }
                const deleteItem = async () => {
                  const newItems = items.filter((_, idx) => idx !== i)
                  await handleUpdate('content')(newItems)
                }
                return (
                  <li
                    key={i}
                    className="flex gap-4 items-start p-6 rounded-2xl bg-black/5 dark:bg-white/5 relative group/item"
                  >
                    {isEditingMode && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover/item:opacity-100 text-red-500"
                        onClick={deleteItem}
                      >
                        x
                      </Button>
                    )}
                    <div className="flex-1">
                      <EditableInlineText
                        value={item.title}
                        onSave={updateItem('title')}
                        as="h3"
                        className="font-bold text-xl mb-2"
                        placeholder="Título do Item"
                      />
                      <EditableInlineText
                        value={item.description}
                        onSave={updateItem('description')}
                        as="p"
                        className="opacity-80"
                        placeholder="Descrição do Item"
                        multiline
                      />
                    </div>
                  </li>
                )
              })}
              {isEditingMode && (
                <li className="flex justify-center p-4">
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleUpdate('content')([
                        ...items,
                        { title: 'Novo Item', description: '...' },
                      ])
                    }
                  >
                    Adicionar Item
                  </Button>
                </li>
              )}
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
              {renderTitle('text-3xl')} {renderDesc('mx-auto')}
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {items.map((item: any, i: number) => {
                const updateItem = (field: string) => async (val: string) => {
                  const newItems = [...items]
                  newItems[i] = { ...item, [field]: val }
                  await handleUpdate('content')(newItems)
                }
                const deleteItem = async () => {
                  const newItems = items.filter((_, idx) => idx !== i)
                  await handleUpdate('content')(newItems)
                }
                return (
                  <div
                    key={i}
                    className="bg-black/5 dark:bg-white/5 rounded-2xl p-8 space-y-4 hover:bg-black/10 dark:hover:bg-white/10 transition-colors shadow-sm relative group/item"
                  >
                    {isEditingMode && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover/item:opacity-100 text-red-500"
                        onClick={deleteItem}
                      >
                        x
                      </Button>
                    )}
                    <EditableInlineText
                      value={item.title}
                      onSave={updateItem('title')}
                      as="h3"
                      className="font-bold text-xl"
                      placeholder="Título do Card"
                    />
                    <EditableInlineText
                      value={item.description}
                      onSave={updateItem('description')}
                      as="p"
                      className="opacity-80 leading-relaxed"
                      placeholder="Descrição do Card"
                      multiline
                    />
                  </div>
                )
              })}
              {isEditingMode && (
                <div className="flex items-center justify-center border-2 border-dashed border-primary/20 rounded-2xl p-8 min-h-[150px]">
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleUpdate('content')([
                        ...items,
                        { title: 'Novo Card', description: '...' },
                      ])
                    }
                  >
                    Adicionar Card
                  </Button>
                </div>
              )}
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
              {renderTitle('text-3xl')} {renderDesc('mx-auto')}
            </div>
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl bg-black relative">
              {section.video_url ? (
                <iframe
                  src={getEmbedUrl(section.video_url)}
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="flex items-center justify-center w-full h-full text-white/50">
                  {isEditingMode
                    ? 'Configure a URL do vídeo nas configurações da seção'
                    : 'Vídeo indisponível'}
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    )
  }

  return null
}
