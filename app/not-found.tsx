import Image from 'next/image'


export default function loading() {
  return (
    <div className='w-full h-screen flex flex-col items-center py-20'>
        <Image className='w-1/4' src={"/foxxie.gif"} alt="Loading Giff" width={800} height={559} priority />
        <h1 className="text-3xl font-extrabold tracking-tight my-4">OOPS !!</h1>
      <p className="text-lg text-blue-100 max-w-md text-center">
        The resource you're looking for doesn't seem to exist.
      </p>
    </div>
  )
}
