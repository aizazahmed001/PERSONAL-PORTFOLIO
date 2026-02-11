import React from 'react'
function Card({certificate , pdf}) {
  return (
    <>
    <div className='border-[5px] border-[#FF5733] my-10 mx-5 pt-10 rounded-2xl bg-[#910C3F]'>

        <div className='w-full px-2'><img src={certificate} /></div>
        <div className='flex justify-center my-5'>

          <a className=' text-white/80 px-6 py-2 mx-10 text-center text-lg font-semibold rounded-[25px] bg-gradient-to-br from-[#e40000] to-[#c703ce]  hover:scale-105 hover:from-[#a50000] hover:to-black' href={pdf} download>View PDF</a>

        </div>
    </div>
    </>
  )
}

export default Card