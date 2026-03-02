import React from 'react'

function ProjectVideo({ path, number }) {


  return (
    <div className='flex bg-slate-800/50 md:w-1/2 text-white rounded-xl flex-col gap-5  py-4'>
      <video className='border-[5px] mx-4' controls muted>
        <source src={path} type="video/mp4" />
        <source src={path.replace('.mp4', '.webm')} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      <h1 className='text-center font-bold text-2xl'>Project {number}</h1>
    </div>
  )
}

export default ProjectVideo