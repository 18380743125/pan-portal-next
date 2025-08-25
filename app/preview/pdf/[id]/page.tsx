'use client'

import { AlertCircle, Loader2, RefreshCw } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { config } from '@/lib/constants/base'
import { shallowEqualApp, useAppSelector } from '@/lib/store/hooks'

import styles from './styles.module.scss'

export default function PdfPage({ params }: { params: { id: string } }) {
  const { id } = params

  const searchParams = useSearchParams()

  useEffect(() => {
    const title = searchParams.get('filename')
    window.document.title = title || 'PDF 预览'
  }, [])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null)

  const { token } = useAppSelector(
    state => ({
      token: state.user.token
    }),
    shallowEqualApp
  )

  const fetchPdfStream = async () => {
    try {
      setLoading(true)
      setError(null)

      const requestUrl = `${config.previewUrl}/file/preview?fileId=${decodeURIComponent(id)}&authorization=${token}`

      const response = await fetch(requestUrl, {
        method: 'GET'
      })

      if (!response.ok) {
        if (response.status === 500) {
          throw new Error('系统内部异常，请稍后重试')
        }
        throw new Error(`请求失败：${response.status} ${response.statusText}`)
      }

      const blob = await response.blob()

      let pdfBlob = blob
      if (!blob.type || !blob.type.includes('pdf')) {
        pdfBlob = new Blob([blob], { type: 'application/pdf' })
      }

      const blobUrl = URL.createObjectURL(pdfBlob)
      setPdfBlobUrl(blobUrl)
    } catch (err) {
      console.error('PDF 加载失败：', err)
      setError(err instanceof Error ? err.message : '加载 PDF 时发生未知错误')
      setPdfBlobUrl(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPdfStream()

    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl)
      }
    }
  }, [id])

  const handleRetry = () => {
    fetchPdfStream()
  }

  return (
    <div className={styles.container}>
      {loading && (
        <div className={styles.loadingWrap}>
          <Loader2 className={styles.loading} />
          <p className={styles.loadingText}>正在加载 PDF 文件...</p>
        </div>
      )}

      {!loading && error && (
        <div className={styles.errorWrap}>
          <AlertCircle className={styles.errorIcon} />
          <h3 className={styles.errorTitle}>加载失败</h3>
          <p className={styles.errorMsg}>{error}</p>
          <button onClick={handleRetry} className={styles.retryBtn}>
            <RefreshCw /> 重试
          </button>
        </div>
      )}

      {!loading && !error && pdfBlobUrl && (
        <div className={styles.pdfWrap}>
          <iframe src={`/pdfjs-5.4.54-dist/web/viewer.html?file=${pdfBlobUrl}`} className={styles.pdfIframe} loading='lazy' />
        </div>
      )}

      {!loading && !error && !pdfBlobUrl && (
        <div className={styles.emptyWrap}>
          <p className={styles.emptyText}>未找到对应的 PDF 文件</p>
          <button onClick={handleRetry} className={styles.reloadBtn}>
            重新加载
          </button>
        </div>
      )}
    </div>
  )
}
