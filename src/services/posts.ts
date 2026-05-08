import pb from '@/lib/pocketbase/client'

export interface BlogCategoryRecord {
  id: string
  name: string
  slug: string
  created: string
  updated: string
}

export interface PostImageRecord {
  id: string
  post_ref: string
  image: string
  alt_text?: string
  sort_order: number
  created: string
  updated: string
}

export interface PostRecord {
  id: string
  title: string
  slug: string
  content: string
  category?: string
  category_ref?: string
  expand?: {
    category_ref?: BlogCategoryRecord
  }
  image?: string
  image_alt?: string
  status: 'draft' | 'published'
  published_at?: string
  seo_title?: string
  seo_description?: string
  created: string
  updated: string
}

export async function getPosts(filter = '') {
  return await pb.collection('posts').getFullList<PostRecord>({
    filter,
    sort: '-published_at,-created',
    expand: 'category_ref',
  })
}

export async function getPostBySlug(slug: string) {
  return await pb.collection('posts').getFirstListItem<PostRecord>(`slug="${slug}"`, {
    expand: 'category_ref',
  })
}

export async function getPost(id: string) {
  return await pb.collection('posts').getOne<PostRecord>(id, {
    expand: 'category_ref',
  })
}

export async function getBlogCategories() {
  return await pb.collection('blog_categories').getFullList<BlogCategoryRecord>({
    sort: 'name',
  })
}

export async function createBlogCategory(data: any) {
  return await pb.collection('blog_categories').create<BlogCategoryRecord>(data)
}

export async function updateBlogCategory(id: string, data: any) {
  return await pb.collection('blog_categories').update<BlogCategoryRecord>(id, data)
}

export async function deleteBlogCategory(id: string) {
  return await pb.collection('blog_categories').delete(id)
}

export async function checkCategoryHasPosts(categoryId: string) {
  const result = await pb
    .collection('posts')
    .getList(1, 1, { filter: `category_ref="${categoryId}"` })
  return result.totalItems > 0
}

export async function clearPostsCategory(categoryId: string) {
  const posts = await pb.collection('posts').getFullList({ filter: `category_ref="${categoryId}"` })
  for (const post of posts) {
    await pb.collection('posts').update(post.id, { category_ref: null })
  }
}

export async function getPostImages(postId: string) {
  return await pb.collection('post_images').getFullList<PostImageRecord>({
    filter: `post_ref="${postId}"`,
    sort: 'sort_order',
  })
}

export async function createPostImage(data: any) {
  return await pb.collection('post_images').create<PostImageRecord>(data)
}

export async function updatePostImage(id: string, data: any) {
  return await pb.collection('post_images').update<PostImageRecord>(id, data)
}

export async function deletePostImage(id: string) {
  return await pb.collection('post_images').delete(id)
}

export async function createPost(data: any) {
  return await pb.collection('posts').create<PostRecord>(data)
}

export async function updatePost(id: string, data: any) {
  return await pb.collection('posts').update<PostRecord>(id, data)
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

export function getPostGalleryImageUrl(record: PostImageRecord) {
  if (record.image) {
    return pb.files.getURL(record, record.image)
  }
  return ''
}
