import AppHeaderFC from '@/components/header'

export default function ListPageLayout({ children }) {
  return (
    <>
      <AppHeaderFC />
      {children}
    </>
  )
}
