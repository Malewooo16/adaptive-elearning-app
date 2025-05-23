import Image from 'next/image'


export default function loading() {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
        <Image className='w-1/3' src={"/foxxie.gif"} alt="Loading Giff" width={800} height={559} priority />
    </div>
  )
}
