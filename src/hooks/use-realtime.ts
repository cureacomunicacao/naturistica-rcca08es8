import { useEffect, useRef } from 'react'
import pb from '@/lib/pocketbase/client'
import type { RecordSubscription } from 'pocketbase'

/**
 * Hook for real-time subscriptions to a PocketBase collection.
 * ALWAYS use this hook instead of subscribing inline.
 * Uses the per-listener UnsubscribeFunc so multiple components
 * can safely subscribe to the same collection without conflicts.
 */
export function useRealtime(
  collectionName: string,
  callback: (data: RecordSubscription<any>) => void,
  enabled: boolean = true,
) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!enabled) return

    let unsubscribeFn: (() => Promise<void>) | undefined
    let cancelled = false
    let retryTimer: ReturnType<typeof setTimeout>

    const initSubscription = async () => {
      try {
        const fn = await pb.collection(collectionName).subscribe('*', (e) => {
          callbackRef.current(e)
        })

        if (cancelled) {
          fn().catch(() => {})
        } else {
          unsubscribeFn = fn
        }
      } catch (err: any) {
        if (cancelled) return

        // Handle "Missing or invalid client id" (usually 400) which occurs
        // during React Strict Mode rapid mount/unmount cycles before SSE is ready.
        if (
          err?.status === 400 ||
          err?.status === 0 ||
          err?.message?.toLowerCase().includes('client id')
        ) {
          retryTimer = setTimeout(initSubscription, 1000)
        } else {
          console.warn(`Realtime subscription error for ${collectionName}:`, err)
        }
      }
    }

    initSubscription()

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
      if (unsubscribeFn) {
        unsubscribeFn().catch(() => {})
      }
    }
  }, [collectionName, enabled])
}

export default useRealtime
