import { FC, useCallback, useEffect, useState } from 'react'

import styles from './styles.module.scss'

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
  if (!images.length) return null

  const [currentIndex, setCurrentIndex] = useState(current)
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(1)
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null)

  // 获取图片数据
  useEffect(() => {
    const fetchImage = async () => {
      try {
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

  const currentImage = images[currentIndex]

  return (
    <div className={styles.viewerContainer} onClick={onClose}>
      <div className={styles.viewerContent} onClick={e => e.stopPropagation()}>
        {/* 主图片区域 */}
        <div className={styles.imageContainer}>
          {imageBlobUrl ? (
            <img
              src={imageBlobUrl}
              alt={currentImage.alt}
              className={styles.mainImage}
              style={{
                transform: `rotate(${rotation}deg) scale(${scale})`,
                transition: 'transform 0.3s ease'
              }}
            />
          ) : (
            <div className={styles.loadingPlaceholder}>图片加载中...</div>
          )}
        </div>

        {/* 操作工具栏 */}
        <div className={styles.toolbar}>
          <div className={styles.toolGroup}>
            <button onClick={() => navigateImage('prev')} disabled={currentIndex === 0}>
              <i className={styles.iconPrev} />
            </button>
            <span className={styles.pageIndicator}>
              {currentIndex + 1} / {images.length}
            </span>
            <button onClick={() => navigateImage('next')} disabled={currentIndex === images.length - 1}>
              <i className={styles.iconNext}></i>
            </button>
          </div>

          <div className={styles.toolGroup}>
            <button onClick={() => rotateImage(-90)} title='向左旋转'>
              <i className={styles.iconRotateLeft}></i>
            </button>
            <button onClick={() => rotateImage(90)} title='向右旋转'>
              <i className={styles.iconRotateRight}></i>
            </button>
          </div>

          <div className={styles.toolGroup}>
            <button onClick={() => zoomImage(0.8)} title='缩小'>
              <i className={styles.iconZoomOut}></i>
            </button>
            <span className={styles.zoomIndicator}>{Math.round(scale * 100)}%</span>
            <button onClick={() => zoomImage(1.2)} title='放大'>
              <i className={styles.iconZoomIn}></i>
            </button>
          </div>

          {showDownload && (
            <div className={styles.toolGroup}>
              <button title='下载'>
                <i className={styles.iconDownload}></i>
              </button>
            </div>
          )}

          <div className={styles.toolGroup}>
            <button onClick={onClose} title='关闭'>
              <i className={styles.iconClose}></i>
            </button>
          </div>
        </div>

        {/* 缩略图区域 */}
        {images.length > 1 && (
          <div className={styles.thumbnailArea}>
            {images.slice(0, thumbnailsCount).map((img, index) => (
              <button
                key={index}
                className={`${styles.thumbnail} ${currentIndex === index ? styles.thumbnailActive : ''}`}
                onClick={() => {
                  setCurrentIndex(index)
                  resetTransform()
                }}
                data-index={index + 1}
              >
                <img src={img.src} alt={img.alt} className={styles.thumbnailImage} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageViewer
