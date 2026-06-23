import pb from '@/lib/pocketbase/client'

export interface PageSectionRecord {
  id: string
  page_slug: string
  type: 'hero' | 'list' | 'side_image_right' | 'side_image_left' | 'video' | 'cards'
  title?: string
  description?: string
  content?: any
  image?: string
  video_url?: string
  button_text?: string
  button_link?: string
  background_color?: string
  text_color?: string
  padding_y?: number
  order: number
  active: boolean
  collectionId: string
  created: string
  updated: string
}

export const getPageSections = (pageSlug: string) => {
  return pb.collection('page_sections').getFullList<PageSectionRecord>({
    filter: `page_slug = "${pageSlug}" && active = true`,
    sort: 'order',
  })
}

export const getAllPageSectionsAdmin = (pageSlug: string) => {
  return pb.collection('page_sections').getFullList<PageSectionRecord>({
    filter: `page_slug = "${pageSlug}"`,
    sort: 'order',
  })
}

export const updatePageSectionOrder = async (id: string, order: number) => {
  return pb.collection('page_sections').update(id, { order })
}

export const togglePageSectionActive = async (id: string, active: boolean) => {
  return pb.collection('page_sections').update(id, { active })
}

export const deletePageSection = async (id: string) => {
  return pb.collection('page_sections').delete(id)
}
