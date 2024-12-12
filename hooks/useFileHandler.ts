import type { FileItem } from '@/types/file'

const useFileHandler = () => {
  const onDownload = (row: FileItem) => {
    console.log('onDownload', row)
  }

  const onRename = (row: FileItem) => {
    console.log('onRename', row)
  }

  const onDelete = (row: FileItem) => {
    console.log('onDelete', row)
  }

  const onShare = (row: FileItem) => {
    console.log('onShare', row)
  }

  const onCopy = (row: FileItem) => {
    console.log('onCopy', row)
  }

  const onMove = (row: FileItem) => {
    console.log('onMove', row)
  }

  return {
    onDownload,
    onRename,
    onDelete,
    onShare,
    onCopy,
    onMove
  }
}

export default useFileHandler
