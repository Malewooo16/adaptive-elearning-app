import { getUserSessionInclusive } from '@/actions/user'
import WelcomeGoals from '@/components/WelcomeGoals'
import { redirect } from 'next/navigation';


export default async function page() {
  const userDetails = await getUserSessionInclusive();

  if(userDetails && !userDetails.newUser){
    redirect('/topics')
  }
  return (
    <WelcomeGoals userId={userDetails?.id as string}/>
  )
}
