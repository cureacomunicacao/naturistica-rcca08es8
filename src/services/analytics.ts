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
