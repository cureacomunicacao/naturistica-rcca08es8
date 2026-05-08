import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Copy } from 'lucide-react'
import {
  getPostImages,
  createPostImage,
  updatePostImage,
  deletePostImage,
  getPostGalleryImageUrl,
  type PostImageRecord,
} from '@/services/posts'
import { useToast } from '@/hooks/use-toast'
import { Card } from '@/components/ui/card'

export function PostImageGallery({ postId }: { postId: string }) {
  const [images, setImages] = useState<PostImageRecord[]>([])
  const [altTexts, setAltTexts] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadImages = async () => {
    try {
      const data = await getPostImages(postId)
      setImages(data)
      const alts: Record<string, string> = {}
      data.forEach((img) => (alts[img.id] = img.alt_text || ''))
      setAltTexts(alts)
    } catch {
      toast({ title: 'Erro ao carregar imagens da galeria', variant: 'destructive' })
    }
  }

  const handleAltChange = (id: string, val: string) => {
    setAltTexts((p) => ({ ...p, [id]: val }))
  }

  const handleAltBlur = async (id: string) => {
    const img = images.find((i) => i.id === id)
    if (img && img.alt_text !== altTexts[id]) {
      try {
        await updatePostImage(id, { alt_text: altTexts[id] })
        setImages(images.map((i) => (i.id === id ? { ...i, alt_text: altTexts[id] } : i)))
        toast({ title: 'Texto alternativo salvo' })
      } catch {
        toast({ title: 'Erro ao salvar texto alternativo', variant: 'destructive' })
      }
    }
  }

  useEffect(() => {
    loadImages()
  }, [postId])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('post_ref', postId)
      formData.append('image', file)

      const nextOrder = images.length > 0 ? Math.max(...images.map((img) => img.sort_order)) + 1 : 1
      formData.append('sort_order', String(nextOrder))

      await createPostImage(formData)
      toast({ title: 'Imagem enviada com sucesso!' })
      loadImages()
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch {
      toast({ title: 'Erro ao enviar imagem', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta imagem? O shortcode deixará de funcionar.')) return
    try {
      await deletePostImage(id)
      loadImages()
    } catch {
      toast({ title: 'Erro ao excluir imagem', variant: 'destructive' })
    }
  }

  const copyShortcode = (order: number) => {
    navigator.clipboard.writeText(`[image-${order}]`)
    toast({ title: 'Shortcode copiado!', description: `Use no texto: [image-${order}]` })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="flex-1"
          onChange={handleUpload}
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {images.map((img) => (
          <Card key={img.id} className="overflow-hidden relative group border flex flex-col">
            <img
              src={getPostGalleryImageUrl(img)}
              alt=""
              className="w-full h-32 object-cover object-top"
            />
            <div className="p-2 space-y-2 bg-muted/50 border-t flex-1 flex flex-col justify-end">
              <Input
                placeholder="Texto alternativo (Alt)"
                value={altTexts[img.id] ?? ''}
                onChange={(e) => handleAltChange(img.id, e.target.value)}
                onBlur={() => handleAltBlur(img.id)}
                className="h-7 text-xs"
              />
              <div className="flex items-center justify-between">
                <span className="font-mono font-medium text-xs">[image-{img.sort_order}]</span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyShortcode(img.sort_order)}
                    title="Copiar Shortcode"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(img.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {images.length === 0 && !loading && (
          <div className="col-span-full text-center text-sm text-muted-foreground py-8">
            Nenhuma imagem na galeria ainda.
          </div>
        )}
      </div>
    </div>
  )
}
