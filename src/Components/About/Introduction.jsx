import React from 'react'

function Introduction() {
  return (
    <>
      <div className='flex place-items-center flex-col gap-5 bg-[#581b45] w-full'>

        <h1 className='text-center text-3xl border-black bg-black rounded-xl font-bold text-white my-10 border-[5px] w-80 py-2'>
          Short Intro
        </h1>

        <div className='md:flex'>

          <div className='flex flex-col md:w-1/2 pb-20 gap-3 md:gap-10 px-10 '>
            <h1 className='text-[#FF5733] text-2xl font-bold'>Objective:</h1>
            <p className='text-justify text-lg text-white/50'>
              I am a motivated Frontend Developer and Software Engineering undergraduate with hands-on industry experience in building responsive, performance-focused web applications. Proficient in HTML, CSS, JavaScript, React, and Tailwind CSS, with exposure to backend integration, cloud workflows, and AI/ML concepts. Through multiple internships and real-world projects, I have contributed to production-level applications, agile team environments, and entrepreneurial initiatives. I am driven to deliver scalable, user-centric digital solutions while continuously strengthening my technical and problem-solving skills.
            </p>
          </div>

          <div className='flex flex-col px-10 md:w-1/2 h-screen gap-3 md:gap-10'>
            <h1 className='text-[#FF5733] text-2xl font-bold'>Education and skills:</h1>
            <p className='text-justify pb-20 text-lg text-white/50'>
              Currently pursuing a Bachelor of Science in Software Engineering, with a strong foundation in frontend development, software design, and data-driven systems. Skilled in React.js, Tailwind CSS, JavaScript, Git/GitHub, Jira, and modern development workflows, with additional exposure to Node.js, databases, and AI/ML fundamentals. Experienced in collaborative environments through internships at multiple technology firms, applying practical engineering, product thinking, and continuous learning to real-world software solutions.
            </p>
          </div>

        </div>
      </div>
    </>
  )
}

export default Introduction
