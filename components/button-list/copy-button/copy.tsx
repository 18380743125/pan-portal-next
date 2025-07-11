'use client'

import { faFolder } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal, Tree } from 'antd'
import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { copyFileApi, getFolderTreeApi } from '@/api/features/file'
import { getFileAction } from '@/lib/store/features/fileSlice'
import { shallowEqualApp, useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { FileItem } from '@/types/file'

import { PanEnum } from '@/lib/constants/base'

import styles from './styles.module.scss'

const CopyFC = forwardRef((_, ref) => {
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
    if (selectKeys.length === 0) {
      return toast.warning('请选择文件夹')
    }
    const targetParentId = selectKeys[0]
    const fileIds = rows?.map(row => row.fileId).join(PanEnum.COMMON_SEPARATOR)
    await copyFileApi(targetParentId, fileIds as string)
    toast.success('复制成功')
    // 刷新文件列表
    const current = pathList[pathList.length - 1]

    // 刷新文件列表
    dispatch(getFileAction({ parentId: current.id, fileType }))
    close()
  }

  const onSelect = (keys: string[]) => {
    setSelectKeys(keys)
  }

  return (
    <Modal
      width={720}
      title={`复制文件（${simpleFilename}）`}
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

CopyFC.displayName = 'CopyFC'

export default CopyFC
