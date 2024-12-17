'use client'

import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react'
import { Modal, Tree } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-regular-svg-icons'

import { getFolderTreeApi, transferFileApi } from '@/api/features/file'
import { shallowEqualApp, useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { message } from '@/lib/AntdGlobal'
import { getFileAction } from '@/lib/store/features/fileSlice'
import { PanEnum } from '@/lib/constants'
import { FileItem } from '@/types/file'
import styles from '@/components/button-list/copy-button/styles.module.scss'

const TransferFC = forwardRef((_, ref) => {
  const dispatch = useAppDispatch()

  const { pathList, fileType } = useAppSelector(
    state => ({
      fileType: state.file.fileType,
      pathList: state.file.breadcrumbList
    }),
    shallowEqualApp
  )
  const [visible, setVisible] = useState(false)
  const [rows, setRows] = useState<FileItem[]>()
  const [treeList, setTreeList] = useState<Record<string, any>[]>([])
  const [selectKeys, setSelectKeys] = useState<string[]>([])

  // 文件名等
  const simpleFilename = useMemo(() => {
    const names = rows?.map(item => item.filename).join(', ')
    const minName = `${names?.slice(0, 32)}`
    return minName.length >= 30 ? minName + '...' : minName
  }, [rows])

  // 组装树型结构
  const processTreeList = useCallback((data: Record<string, any>[]) => {
    const list = [] as Record<string, any>[]
    for (const item of data) {
      item.key = item.id
      list.push(item)
      if (item.children?.length) {
        item.children = processTreeList(item.children)
      }
    }
    return list
  }, [])

  const open = async (rows: FileItem[]) => {
    setVisible(true)
    setRows(rows)
    const treeList = await getFolderTreeApi()
    const tree = processTreeList(treeList)
    setTreeList(tree)
  }

  const close = () => {
    setVisible(false)
  }

  useImperativeHandle(ref, () => ({
    open,
    close
  }))

  const onCancel = () => {
    close()
  }

  const onOk = async () => {
    const targetParentId = selectKeys[0]
    const fileIds = rows?.map(row => row.fileId).join(PanEnum.COMMON_SEPARATOR)
    await transferFileApi(targetParentId, fileIds as string)
    message.success('移动成功')

    // 刷新文件列表
    const current = pathList[pathList.length - 1]
    dispatch(getFileAction({ parentId: current.id, fileType }))
    close()
  }

  const onSelect = (keys: string[]) => {
    setSelectKeys(keys)
  }

  return (
    <Modal
      width={720}
      title={`移动文件（${simpleFilename}）`}
      maskClosable={false}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
    >
      <section className={styles.root}>
        {treeList.length > 0 ? (
          <Tree
            className={styles.tree}
            blockNode
            defaultExpandAll
            onSelect={keys => onSelect(keys as string[])}
            treeData={treeList}
            titleRender={node => (
              <div key={node.id}>
                <FontAwesomeIcon size={'lg'} color={'#999'} icon={faFolder} />
                <span style={{ marginLeft: 10 }}>{node.label}</span>
              </div>
            )}
          />
        ) : null}
      </section>
    </Modal>
  )
})

TransferFC.displayName = 'TransferFC'

export default TransferFC
