import Link from 'next/link'
import styles from './styles.module.scss'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* 备案信息 - 按照要求放置在显著位置 */}
        <div className={styles.beianInfo}>
          <Link href='https://beian.miit.gov.cn' target='_blank' rel='noopener noreferrer' className={styles.beianLink}>
            蜀ICP备2025124804号-1
          </Link>
        </div>

        {/* 可以根据需要添加其他底部信息 */}
        <div className={styles.copyright}>© {new Date().getFullYear()} coco.yn.cn. 保留所有权利。</div>
      </div>
    </footer>
  )
}

export default Footer
