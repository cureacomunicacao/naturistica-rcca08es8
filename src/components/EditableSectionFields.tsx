import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Pencil } from 'lucide-react'
import { useAdminMode } from '@/hooks/use-admin-mode'

export function EditableInlineText({
  value,
  onSave,
  as: Component = 'div',
  className,
  isHtml = false,
  multiline = false,
  placeholder = 'Clique para editar...',
  style,
}: any) {
  const { isEditingMode } = useAdminMode()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [val, setVal] = useState(value || '')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setVal(value || '')
  }, [value])

  if (!isEditingMode) {
    if (!value) return null
    if (isHtml)
      return (
        <Component
          className={className}
          dangerouslySetInnerHTML={{ __html: value }}
          style={style}
        />
      )
    return (
      <Component className={className} style={style}>
        {value}
      </Component>
    )
  }

  const handleSave = async () => {
    if (val === value) {
      setIsEditing(false)
      return
    }
    setIsLoading(true)
    try {
      await onSave(val)
      toast({ title: 'Salvo com sucesso' })
      setIsEditing(false)
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' })
      setVal(value || '')
    } finally {
      setIsLoading(false)
    }
  }

  if (isEditing) {
    return (
      <div className={cn('relative w-full', className)} style={style}>
        {multiline ? (
          <Textarea
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onBlur={handleSave}
            autoFocus
            disabled={isLoading}
            className="min-h-[120px] w-full text-foreground font-sans text-base p-3 bg-background border-primary shadow-sm z-50 relative resize-y"
          />
        ) : (
          <Input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave()
              if (e.key === 'Escape') {
                setVal(value || '')
                setIsEditing(false)
              }
            }}
            autoFocus
            disabled={isLoading}
            className="w-full text-foreground font-sans text-base p-3 bg-background border-primary shadow-sm z-50 relative"
          />
        )}
      </div>
    )
  }

  return (
    <Component
      className={cn(
        className,
        'relative group cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-primary/50 hover:outline-offset-4 rounded transition-all duration-200',
      )}
      style={style}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsEditing(true)
      }}
    >
      {isHtml ? (
        <span dangerouslySetInnerHTML={{ __html: val || placeholder }} />
      ) : (
        val || placeholder
      )}
      <span className="absolute -top-3 -right-3 bg-primary text-primary-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10 pointer-events-none flex items-center justify-center">
        <Pencil className="w-3.5 h-3.5" />
      </span>
    </Component>
  )
}

export function EditableImage({ src, onUpload, className, alt }: any) {
  const { isEditingMode } = useAdminMode()
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)

  if (!isEditingMode) return src ? <img src={src} alt={alt} className={className} /> : null

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    try {
      await onUpload(file)
      toast({ title: 'Imagem atualizada' })
    } catch (err: any) {
      toast({ title: 'Erro ao atualizar', description: err.message, variant: 'destructive' })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={cn('relative group overflow-hidden', className)}>
      <img
        src={src || 'https://img.usecurling.com/p/800/600?q=placeholder&color=gray'}
        alt={alt}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
        <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-full font-medium shadow-lg hover:scale-105 transition-transform">
          {isUploading ? 'Enviando...' : 'Trocar Imagem'}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            disabled={isUploading}
            onChange={(e) => {
              if (e.target.files?.[0]) handleUpload(e.target.files[0])
            }}
          />
        </label>
      </div>
    </div>
  )
}
