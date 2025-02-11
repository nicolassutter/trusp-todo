import { Loader2 } from 'lucide-react'

export const SpinLoader = () => {
  return (
    <>
      <Loader2 className='animate-spin' />
      <span className='sr-only'>loading...</span>
    </>
  )
}
