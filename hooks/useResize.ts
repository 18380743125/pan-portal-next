import { useEffect } from 'react'

import debounce from '@/lib/utils/common/debounce'

function useResize(resizeFn: (...args: any[]) => void) {
  const resizeFnDebounce = debounce(resizeFn, {
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
