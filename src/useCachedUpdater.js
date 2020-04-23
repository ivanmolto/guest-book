import { useCallback, useState } from 'react'
import * as localStorage from './localStorage'

// TODO: set based on fn.name or similar
const CACHE = 'syncing-stuff'

export default function useCache (fn, { initializeCacheTo, onFunctionCall }) {
  if (!localStorage.get(CACHE)) {
    localStorage.set(CACHE, initializeCacheTo)
  }

  const [state, setState] = useState(localStorage.get(CACHE))

  const wrappedFn = useCallback((args, gas, amount) => {
    const newState = onFunctionCall(state, args)
    setState(newState)
    localStorage.set(CACHE, newState)
    fn(args, gas, amount)
  }, [fn, onFunctionCall])

  const setCache = useCallback(newCache => {
    setState(newCache)
    localStorage.set(CACHE, newCache)
  }, [])

  return [wrappedFn, state, setCache]
}
