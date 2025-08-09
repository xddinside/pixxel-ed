import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='flex justify-center h-[80vh] items-center'>
      <SignUp afterSignUpUrl="/role-selection" redirectUrl="/role-selection" />
    </div>
  )
}
