import CopyButton from '@/components/button-list/copy-button'
import CreateFolderButton from '@/components/button-list/create-folder-button'
import DeleteButton from '@/components/button-list/delete-button'
import DownloadButton from '@/components/button-list/download-button'
import RenameButton from '@/components/button-list/rename-button'
import ShareButton from '@/components/button-list/share-button'
import TransferButton from '@/components/button-list/transfer-button'
import UploadButton from '@/components/button-list/upload-button'

import styles from './styles.module.scss'

const FileButtonGroup = () => {
  return (
    <section className={styles.root}>
      <UploadButton />
      <CreateFolderButton />
      <DownloadButton />
      <DeleteButton />
      <RenameButton />
      <ShareButton />
      <CopyButton />
      <TransferButton />
    </section>
  )
}

export default FileButtonGroup
