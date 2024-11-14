import { useEffect } from 'react'
import debounceUtil from '@/lib/utils/debounce.util.ts'

function useResize(resizeFn: (...args: any[]) => void) {
  const resizeFnDebounce = debounceUtil(resizeFn, {
    delay: 300
  })

  useEffect(() => {
    window.addEventListener('resize', resizeFnDebounce)

    return () => {
      window.removeEventListener('resize', resizeFnDebounce)
    }
  }, [resizeFnDebounce])
}

export default useResize
