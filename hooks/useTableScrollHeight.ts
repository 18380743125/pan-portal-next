import { RefObject, useCallback, useEffect, useState } from 'react'
import useResize from '@/hooks/useResize'

/**
 * antd table 滚动高度
 * @param ref
 * @param extraOffset
 */
function useTableScrollHeight(ref: RefObject<HTMLElement>, extraOffset = 12) {
  const [tableScrollY, setTableScrollY] = useState<string>()

  useResize(() => {
    _handle()
  })

  const _handle = useCallback(() => {
    const theadHeightEl = ref.current?.querySelector('.ant-table-thead') as HTMLElement
    if (!theadHeightEl) {
      return
    }
    const rect = theadHeightEl.getBoundingClientRect()
    setTableScrollY(`calc(100vh - ${(rect?.top as number) + rect.height + extraOffset}px)`)
  }, [ref])

  useEffect(() => {
    _handle()
  }, [_handle])

  return [tableScrollY, extraOffset]
}

export default useTableScrollHeight
