import React from 'react'
import ProgressBar from '@ramonak/react-progress-bar'


function Skills() {
  return (
    <>
      <div className='bg-[#581b45] '>

        <div className='flex flex-col place-items-center py-16 gap-3 '>
          <p className='text-[#FF5733] text-xl '>Features</p>
          <h1 className='text-center text-3xl border-black bg-black rounded-xl font-bold text-white my-10 border-[5px] w-80 py-2' >Development Skills</h1>
        </div>

        <div className='text-center gap-10 flex flex-col font-medium text-white'>
          <div className='mx-20'>
            <p>HTML 5</p>
            <ProgressBar height='22px' bgColor='#FF5733' labelColor='black' completed={100} animateOnRender={true} />
          </div>

          <div className='mx-20'>
            <p>CSS 3</p>
            <ProgressBar height='22px' bgColor='#1572B6' labelColor='black' completed={100} animateOnRender={true} />
          </div>

          <div className='mx-20'>
            <p>JavaScript</p>
            <ProgressBar height='22px' bgColor='#F7DF1E' labelColor='black' completed={90} animateOnRender={true} />
          </div>

          <div className='mx-20'>
            <p>Tailwind</p>
            <ProgressBar height='22px' bgColor='#38BDF8' labelColor='black' completed={95}
              animateOnRender={true} />
          </div>

          <div className='mx-20'>
            <p>GSAP {'(Green Sock Animation Platform)'}</p>
            <ProgressBar height='22px' bgColor='#88CC00' labelColor='black' completed={90}
              animateOnRender={true} />
          </div>

          <div className='mx-20'>
            <p>React</p>
            <ProgressBar height='22px' bgColor='#61DAFB' labelColor='black' completed={80}
              animateOnRender={true} />
          </div>

          <div className='mx-20 mb-20'>
            <p>MongoDB</p>
            <ProgressBar height='22px' bgColor='#00ED64' labelColor='black' completed={95}
              animateOnRender={true} />
          </div>
          



        </div>

      </div>
    </>
  )
}

export default Skills