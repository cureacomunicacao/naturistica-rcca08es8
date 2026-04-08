import pb from '@/lib/pocketbase/client'

export const trackEvent = async (event_type: string, path: string, label?: string) => {
  try {
    await pb.collection('analytics_events').create({
      event_type,
      path,
      label,
    })
  } catch (err) {
    console.error('Analytics tracking failed', err)
  }
}

export const getAnalyticsEvents = async (filter?: string) => {
  return pb.collection('analytics_events').getFullList({ filter, sort: '-created' })
}

export const getLeadsCount = async () => {
  try {
    const result = await pb.collection('leads').getList(1, 1)
    return result.totalItems
  } catch (err) {
    return 0
  }
}
