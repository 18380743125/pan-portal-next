import { FileItem } from '@/types/file'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFileText, faFileCode } from '@fortawesome/free-regular-svg-icons'
import {
  faFile,
  faFileImage,
  faFileAudio,
  faFileVideo,
  faFileArchive,
  faFileExcel,
  faFileWord,
  faFilePdf,
  faFilePowerpoint
} from '@fortawesome/free-solid-svg-icons'

export const getFileFontElement = (row: FileItem) => {
  const type = row.fileType

  let icon = faFile
  switch (type) {
    case 0:
      icon = faFolder
      break
    case 2:
      icon = faFileArchive
      break
    case 3:
      icon = faFileExcel
      break
    case 4:
      icon = faFileWord
      break
    case 5:
      icon = faFilePdf
      break
    case 6:
      icon = faFileText
      break
    case 7:
      icon = faFileImage
      break
    case 8:
      icon = faFileAudio
      break
    case 9:
      icon = faFileVideo
      break
    case 10:
      icon = faFilePowerpoint
      break
    case 11:
      icon = faFileCode
      break
    default:
      break
  }
  return <FontAwesomeIcon size={'lg'} color={'#999'} icon={icon} />
}
