import pb from '@/lib/pocketbase/client'

export async function trackEvent(eventType: string, path: string, label?: string) {
  try {
    await pb.collection('analytics_events').create({
      event_type: eventType,
      path,
      label: label || '',
    })
  } catch (e) {
    // Silent fail for analytics
    console.warn('Analytics track failed', e)
  }
}

export async function getAnalyticsEvents() {
  return await pb.collection('analytics_events').getFullList({
    sort: '-created',
  })
}

export async function getLeadsCount() {
  try {
    const result = await pb.collection('leads').getList(1, 1, {
      fields: 'id',
    })
    return result.totalItems
  } catch (e) {
    console.error('Failed to fetch leads count', e)
    return 0
  }
}
