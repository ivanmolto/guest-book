import { useEffect, useState } from 'react'
import isEqual from 'lodash/isEqual'
import * as localStorage from './localStorage'

const POLL_INTERVAL = 5000

// TODO: set based on fn.name or similar
const CACHE = 'persisted-stuff'

async function refreshFromChain (fn, onUpdate, setState) {
  const fresh = await fn()
  const cached = localStorage.get(CACHE)

  if (!isEqual(fresh, cached)) {
    localStorage.set(CACHE, fresh)
    onUpdate(fresh)
    setState(fresh)
  }
}

export default function useSubscription (fn, { initialValue, onUpdate = () => {} } = {}) {
  const [state, setState] = useState(
    localStorage.get(CACHE) || initialValue
  )

  useEffect(() => {
    refreshFromChain(fn, onUpdate, setState)

    const interval = setInterval(
      () => refreshFromChain(fn, onUpdate, setState),
      POLL_INTERVAL
    )

    return () => clearInterval(interval)
  }, [])

  return state
}
