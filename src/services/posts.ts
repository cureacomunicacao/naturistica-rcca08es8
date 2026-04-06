import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface PostRecord extends RecordModel {
  title: string
  slug: string
  content?: string
  category?: string
  image?: string
  status?: 'draft' | 'published'
  seo_title?: string
  seo_description?: string
}

export const getPosts = async (filter?: string) => {
  return pb.collection('posts').getFullList<PostRecord>({
    filter,
    sort: '-created',
  })
}

export const getPost = async (id: string) => {
  return pb.collection('posts').getOne<PostRecord>(id)
}

export const getPostBySlug = async (slug: string) => {
  return pb.collection('posts').getFirstListItem<PostRecord>(`slug="${slug}"`)
}

export const createPost = async (data: FormData) => {
  return pb.collection('posts').create<PostRecord>(data)
}

export const updatePost = async (id: string, data: FormData) => {
  return pb.collection('posts').update<PostRecord>(id, data)
}

export const deletePost = async (id: string) => {
  return pb.collection('posts').delete(id)
}

export const getPostImageUrl = (record: PostRecord) => {
  if (!record.image) return 'https://img.usecurling.com/p/800/600?q=nature&color=green'
  return pb.files.getURL(record, record.image)
}
