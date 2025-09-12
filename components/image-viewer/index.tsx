import { FC, useCallback, useEffect, useMemo, useState } from 'react'

import cs from 'classnames'

import styles from './styles.module.scss'
import Image from 'next/image'

export type ImageType = {
  src: string
  alt?: string
}

interface ImageViewerProps {
  images: ImageType[]
  current?: number
  thumbnailsCount?: number
  showDownload?: boolean
  onClose: () => void
}

const ImageViewer: FC<ImageViewerProps> = ({
  images = [],
  current = 0,
  thumbnailsCount = 5,
  showDownload = true,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(current)
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(1)
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null)

  const currentImage = useMemo(() => images[currentIndex], [currentIndex, images])

  const imagesShow = useMemo(() => {
    const mid = Math.floor(thumbnailsCount / 2)
    let start = Math.max(0, currentIndex - mid)
    const end = Math.min(start + thumbnailsCount, images.length)
    if (end === images.length) {
      start = end - thumbnailsCount
    }
    return images.slice(start, end)
  }, [thumbnailsCount, currentIndex, images])

  // 获取图片数据
  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (!images[currentIndex]?.src) {
          throw new Error(`图片加载失败：${images[currentIndex]?.src}`)
        }
        const response = await fetch(images[currentIndex].src)
        if (!response.ok) throw new Error(`图片加载失败：${images[currentIndex].src}`)
        const blob = await response.blob()
        const blobUrl = URL.createObjectURL(blob)
        setImageBlobUrl(blobUrl)
        return () => URL.revokeObjectURL(blobUrl)
      } catch (error) {
        console.error('图片加载失败：', error)
        setImageBlobUrl(null)
      }
    }
    fetchImage()
  }, [currentIndex, images])

  // 切换上一张 / 下一张
  const navigateImage = useCallback(
    (direction: 'prev' | 'next') => {
      let newIndex = currentIndex
      if (direction === 'prev' && currentIndex > 0) {
        newIndex = currentIndex - 1
      } else if (direction === 'next' && currentIndex < images.length - 1) {
        newIndex = currentIndex + 1
      }
      setCurrentIndex(newIndex)
      resetTransform()
    },
    [currentIndex, images.length]
  )

  const rotateImage = useCallback((angle: number) => {
    setRotation(prev => (prev + angle) % 360)
  }, [])

  const zoomImage = useCallback((factor: number) => {
    setScale(prev => Math.max(0.5, Math.min(prev * factor, 3)))
  }, [])

  const resetTransform = useCallback(() => {
    setRotation(0)
    setScale(1)
  }, [])

  const onDownload = useCallback(async () => {
    if (!currentImage) {
      return
    }
    try {
      const response = await fetch(currentImage.src)
      if (!response.ok) {
        throw new Error(`图片下载失败：${currentImage.src}`)
      }
      const ext = response.headers.get('Content-Type')?.split('/')[1] || 'png'
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `image_${Date.now()}.${ext}`
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 100)
    } catch (error) {
      console.error('下载失败:', error)
    }
  }, [currentImage])

  if (!images.length) return null

  return (
    <div className={styles.viewerContainer}>
      {/* 切换上一张 / 下一张 */}
      <div className={styles.switchContainer}>
        <div
          className={cs([
            styles.switchPrev,
            {
              [styles.disabled]: currentIndex === 0
            }
          ])}
          onClick={() => navigateImage('prev')}
        />
        <div
          className={cs([
            styles.switchNext,
            {
              [styles.disabled]: currentIndex === images.length - 1
            }
          ])}
          onClick={() => navigateImage('next')}
        />
      </div>

      <div className={styles.closeContainer}>
        <button onClick={onClose} />
      </div>

      {/* 图片区域 */}
      <div className={styles.viewerContent}>
        <div className={styles.imageContainer}>
          {imageBlobUrl && (
            <Image
              src={imageBlobUrl}
              alt={currentImage.alt!}
              className={styles.mainImage}
              style={{
                transform: `rotate(${rotation}deg) scale(${scale})`,
                transition: 'transform 0.3s ease'
              }}
            />
          )}
        </div>

        {/* 工具栏 */}
        <div className={styles.toolbar}>
          <div className={styles.toolGroup}>
            <span className={styles.pageIndicator}>
              {currentIndex + 1} / {images.length}
            </span>
          </div>

          <div className={styles.toolGroup}>
            <button onClick={() => rotateImage(-90)} />
            <button onClick={() => rotateImage(90)} />
          </div>

          <div className={styles.toolGroup}>
            <button onClick={() => zoomImage(0.8)} />
            <span className={styles.zoomIndicator}>{Math.round(scale * 100)}%</span>
            <button onClick={() => zoomImage(1.2)} />
          </div>

          {showDownload && (
            <div className={styles.toolGroup}>
              <button onClick={onDownload} />
            </div>
          )}
        </div>

        {/* 缩略图区域 */}
        {images.length > 1 && (
          <div className={styles.thumbnailArea}>
            {imagesShow.map((img, index) => (
              <button
                key={index}
                className={`${styles.thumbnail} ${currentIndex % thumbnailsCount === index ? styles.thumbnailActive : ''}`}
                onClick={() => {
                  setCurrentIndex(index)
                  resetTransform()
                }}
                data-index={index + 1}
              >
                <Image src={img.src} alt={img.alt!} className={styles.thumbnailImage} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageViewer
