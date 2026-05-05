import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useSettings } from '@/hooks/use-settings'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Pencil } from 'lucide-react'

export function EditableText({
  settingKey,
  defaultText,
  as: Component = 'span',
  className,
  multiline = false,
  isHtml = false,
  children,
}: {
  settingKey: string
  defaultText: string
  as?: any
  className?: string
  multiline?: boolean
  isHtml?: boolean
  children?: React.ReactNode
}) {
  const { isAdmin } = useAuth()
  const { settings, updateSetting } = useSettings()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const currentText = settings[settingKey]?.value ?? defaultText

  useEffect(() => {
    setValue(currentText)
  }, [currentText])

  if (!isAdmin) {
    if (children) return <Component className={className}>{children}</Component>
    if (isHtml)
      return <Component className={className} dangerouslySetInnerHTML={{ __html: currentText }} />
    return <Component className={className}>{currentText}</Component>
  }

  const handleSave = async () => {
    if (value === currentText) {
      setIsEditing(false)
      return
    }

    setIsLoading(true)
    try {
      await updateSetting(settingKey, value)
      toast({ title: 'Alteração salva com sucesso' })
      setIsEditing(false)
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar',
        description: err.message,
        variant: 'destructive',
      })
      setValue(currentText) // revert
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
    if (e.key === 'Escape') {
      setValue(currentText)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div className={cn('relative w-full', className)}>
        {multiline ? (
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            disabled={isLoading}
            className="min-h-[120px] w-full text-foreground font-sans text-base p-3 bg-background border-primary shadow-sm z-50 relative resize-y"
          />
        ) : (
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            disabled={isLoading}
            className="w-full text-foreground font-sans text-base p-3 bg-background border-primary shadow-sm z-50 relative"
          />
        )}
        {isLoading && (
          <span className="absolute right-3 top-3 text-xs text-muted-foreground z-50">
            Salvando...
          </span>
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
      onClick={(e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsEditing(true)
      }}
    >
      {children ? (
        children
      ) : isHtml ? (
        <span dangerouslySetInnerHTML={{ __html: currentText }} />
      ) : (
        currentText
      )}
      <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10 pointer-events-none">
        <Pencil className="w-3.5 h-3.5" />
      </div>
    </Component>
  )
}
