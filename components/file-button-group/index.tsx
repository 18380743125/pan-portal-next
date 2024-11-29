import UploadButton from '@/components/button-list/upload-button'
import CreateFolderButton from '@/components/button-list/create-folder-button'
import DownloadButton from '@/components/button-list/download-button'
import DeleteButton from '@/components/button-list/delete-button'
import RenameButton from '@/components/button-list/rename-button'
import ShareButton from '@/components/button-list/share-button'
import CopyButton from '@/components/button-list/copy-button'
import TransferButton from '@/components/button-list/transfer-button'

import styles from './styles.module.scss'

const FileButtonGroupFC = () => {
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

export default FileButtonGroupFC
