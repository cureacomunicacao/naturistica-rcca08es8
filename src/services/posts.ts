import pb from '@/lib/pocketbase/client'

export interface PostRecord {
  id: string
  title: string
  slug: string
  content: string
  category?: string
  image?: string
  status: 'draft' | 'published'
  seo_title?: string
  seo_description?: string
  created: string
  updated: string
}

export async function getPosts(filter = '') {
  return await pb.collection('posts').getFullList<PostRecord>({
    filter,
    sort: '-created',
  })
}

export async function getPostBySlug(slug: string) {
  return await pb.collection('posts').getFirstListItem<PostRecord>(`slug="${slug}"`)
}

export async function deletePost(id: string) {
  return await pb.collection('posts').delete(id)
}

export function getPostImageUrl(post: PostRecord) {
  if (post.image) {
    return pb.files.getURL(post, post.image)
  }
  return `https://img.usecurling.com/p/1200/800?q=${encodeURIComponent(post.title)}&color=green`
}
