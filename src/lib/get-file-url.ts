import pb from '@/lib/pocketbase/client'

/**
 * Centralized utility to construct file URLs for PocketBase.
 * Ensures the correct pattern is used across the application.
 */
export function getFileUrl(record: any, fileName: string): string {
  if (!record || !fileName) return ''

  const baseUrl = import.meta.env.VITE_POCKETBASE_URL || ''
  const collectionId = record.collectionId || record.collectionName
  const recordId = record.id

  if (baseUrl && collectionId && recordId) {
    return `${baseUrl}/api/files/${collectionId}/${recordId}/${fileName}`
  }

  try {
    return pb.files.getUrl(record, fileName)
  } catch (e) {
    return ''
  }
}
