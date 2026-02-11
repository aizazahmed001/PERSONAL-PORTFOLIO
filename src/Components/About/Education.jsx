import React from 'react'

function Education() {
  return (
    <>
    <div className='flex flex-col gap-16 text-white px-10 py-10 bg-[#581b45] w-full'>
    <div className='flex flex-col place-items-center'>
      <p className='text-center text-xl text-[#FF5733]'>{'( 2021-2027 )'}</p>
      <h1 className='text-center text-3xl border-black bg-black rounded-xl font-bold text-white my-10 border-[5px] w-80 py-2'>Education Quality</h1>
    </div>
   
    <div>
      <h1  className='md:text-4xl sm:text-2xl text-lg pl-1 font-bold text-[#FF5733]'>BS Software Engineering</h1>
      <p className='md:text-lg font-semibold pt-2 pl-1 text-[#FF5733]'>Bahria University Islamabad {'(2023-2027)'} <span  className=' rounded-md px-3 py-1 font-bold absolute right-8 text-white bg-black -mt-10'>In Progress</span> </p>
      <p className='md:text-lg w-[80%] mt-5 text-white/75'>Currently pursuing my Bachelor of Science in Software Engineering at Bahria University Islamabad, focusing on software design, data structures, algorithms, and AI/ML foundations. The university environment has been instrumental in developing my technical expertise through hands-on projects in full-stack web development, machine learning, and intelligent systems. These formative years are preparing me to deliver impactful contributions to the software industry with a strong foundation in both theory and practical application.</p>
    </div>

    <div>
      <h1  className='md:text-4xl sm:text-2xl text-lg font-bold text-[#FF5733]'>FSc Pre-Engineering</h1>
      <p className='md:text-lg text-[#FF5733] pt-2'>Bahria College Karsaz Karachi {'(2021-2023)'} <span  className=' rounded-md px-3 py-1 font-bold absolute right-8 text-white bg-black -mt-16'>79%</span></p>
      <p className='md:text-lg mt-5 w-[80%] text-white/75'>Completed FSc Pre-Engineering from Bahria College Karsaz Karachi with strong emphasis on mathematics and physics fundamentals. This rigorous academic foundation enhanced my analytical thinking and problem-solving capabilities, which became essential building blocks for my software engineering career. The collaborative engineering projects during this period strengthened my teamwork skills and technical aptitude.</p>
    </div>
    </div>
    </>
  )
}

export default Education