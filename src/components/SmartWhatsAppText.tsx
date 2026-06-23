import { Fragment } from 'react'

export function SmartWhatsAppText({ text }: { text: string }) {
  if (!text) return null

  if (!text.toLowerCase().includes('whatsapp')) {
    return <>{text}</>
  }

  const parts = text.split(/(whatsapp)/i)

  return (
    <>
      {parts.map((part, i) => {
        if (part.toLowerCase() === 'whatsapp') {
          return (
            <Fragment key={i}>
              <br className="block sm:hidden" />
              {part}
            </Fragment>
          )
        }
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}
