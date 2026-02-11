import React, { useState, useRef } from 'react'
import TextPressure from './ui/TextPressure'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import './Certificates.css'

function Certificates() {
  const achievements = [
    { cert: '/certificate 1.png', pdf: '/pdf 1.pdf', title: 'META React Basics' },
    { cert: '/certificate 2.png', pdf: '/pdf 2.pdf', title: 'Foundations of User Experience (UX) Design' },
    { cert: '/certificate 3.jpg', pdf: '/pdf 3.pdf', title: 'Google Soft Skills Program' },
    { cert: '/certificate 4.png', pdf: '/pdf 4.pdf', title: 'AI For Everyone' },
    { cert: '/certificate 5.png', pdf: '/pdf 5.pdf', title: 'Artificial Intelligence (AI) for Social Impact' },
    { cert: '/certificate 6.jpg', pdf: '/pdf 6.pdf', title: 'C++ Programming Beginner to Advanced' },
    { cert: '/certificate 7.png', pdf: '/pdf 7.pdf', title: 'Information Technology (IT) Fundamentals for Everyone' },
    { cert: '/certificate 8.png', pdf: '/pdf 8.pdf', title: 'Foundations of Project Management' },
    { cert: '/certificate 9.png', pdf: '/pdf 9.pdf', title: 'Supervised Machine Learning: Regression and Classification' },
    { cert: '/certificate 10.png', pdf: '/pdf 10.pdf', title: 'Generativex AI: Prompt Engineering Basics' },
    { cert: '/certificate 11.png', pdf: '/pdf 11.pdf', title: 'Python Essentials 1' },
    { cert: '/certificate 12.png', pdf: '/pdf 12.pdf', title: '2025 Complete SQL Bootcamp from Zero to Hero in SQL' },
    { cert: '/certificate 13.png', pdf: '/pdf 13.pdf', title: 'What is Technology Entrepreneurship andInnovation?' },
    { cert: '/certificate 14.png', pdf: '/pdf 14.pdf', title: 'Foundations of User Experience (UX) Design' },
    { cert: '/certificate 15.png', pdf: '/pdf 15.pdf', title: 'Speak English Professionally: In Person, Online & On the Phone' },
  ]

  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [viewingIndex, setViewingIndex] = useState(null)

  const handleView = (index) => {
    setViewingIndex(index)
    setTimeout(() => setViewingIndex(null), 800)
  }

  return (
    <div className='bg-black py-20 min-h-screen overflow-hidden relative'>
      {/* Animated background grid */}
      <div className='absolute inset-0 bg-grid-pattern opacity-10'></div>

      {/* Title Section */}
      <div className='w-full mb-20 z-10 flex flex-col items-center gap-0 px-6 relative'>
        <div className="relative w-full max-w-6xl h-[100px] sm:h-[200px]">
          <TextPressure
            text="ACHIEVEMENTS"
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#ffffff"
            minFontSize={24}
          />
        </div>

        {/* Subtitle */}
        <motion.p
          className='text-gray-400 text-lg sm:text-xl mt-4 text-center max-w-2xl'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Certified excellence in modern web development, AI, project management, Design & Entrepreneurship & many more.
        </motion.p>
      </div>

      <div className='max-w-[1600px] mx-auto px-4 relative z-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10'>
          {achievements.map((item, index) => (
            <CertificateCard
              key={index}
              item={item}
              index={index}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              viewingIndex={viewingIndex}
              handleView={handleView}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function CertificateCard({ item, index, hoveredIndex, setHoveredIndex, viewingIndex, handleView }) {
  const [isUnblurred, setIsUnblurred] = useState(false)
  const cardRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [25, -25]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-25, 25]), { stiffness: 300, damping: 30 })
  const translateX = useSpring(useTransform(mouseX, [-1, 1], [-20, 20]), { stiffness: 300, damping: 30 })
  const translateY = useSpring(useTransform(mouseY, [-1, 1], [-20, 20]), { stiffness: 300, damping: 30 })

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set((e.clientX - centerX) / (rect.width / 2))
    mouseY.set((e.clientY - centerY) / (rect.height / 2))
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setHoveredIndex(null)
  }

  return (
    <motion.div
      ref={cardRef}
      className='certificate-card-container'
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.15,
        duration: 0.7,
        type: "spring",
        stiffness: 100
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHoveredIndex(index)}
      onClick={() => setIsUnblurred(!isUnblurred)}
    >
      <motion.div
        className='certificate-card-3d'
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Holographic overlay */}
        <div className='holographic-overlay'></div>

        {/* Main card */}
        <div className='certificate-main-card border border-white/5'>


          {/* Certificate image container */}
          <div className='certificate-img-container'>
            <motion.img
              src={item.cert}
              alt={item.title}
              className='certificate-img'
              animate={{
                filter: isUnblurred
                  ? 'blur(0px) brightness(0.9) contrast(1.1)'
                  : 'blur(15px) brightness(0.6)'
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />

            {/* Centered Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-[15] pointer-events-none p-6">
              <AnimatePresence>
                {hoveredIndex === index && !isUnblurred && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-3 rounded-xl shadow-2xl mb-4"
                  >
                    <p className="text-white font-bold tracking-[0.3em] text-[10px] uppercase m-0 text-center">
                      Inspect
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Certificate Title */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{
                  opacity: isUnblurred ? 0 : 0.4,
                  scale: (hoveredIndex === index && !isUnblurred) ? 0.8 : 1
                }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <h3 className="certificate-title text-white m-0 text-center leading-tight">
                  {item.title}
                </h3>
              </motion.div>
            </div>
          </div>

          {/* Particle effects on hover */}
          {hoveredIndex === index && (
            <div className='particles-container'>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className='particle'
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    x: Math.cos((i * Math.PI * 2) / 6) * 100,
                    y: Math.sin((i * Math.PI * 2) / 6) * 100,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Premium button - Moved outside 3D container for stability */}
      <motion.a
        href={item.pdf}
        download
        onClick={(e) => {
          e.stopPropagation();
          handleView(index);
        }}
        className='group relative flex items-center justify-center gap-3 mt-5 px-8 py-4 rounded-full text-lg font-bold border-2 border-transparent hover:border-[#F9D423] text-black hover:text-[#F9D423] transition-all duration-300 shadow-[0_0_20px_rgba(170,204,0,0.3)] overflow-hidden'
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#F9D423] to-[#aacc00] animate-gradient opacity-100 group-hover:opacity-0 transition-opacity duration-300" />

        <span className='button-content relative z-10'>
          <span className='button-text text-inherit'>Download PDF</span>

          <AnimatePresence mode="wait">
            {viewingIndex === index ? (
              <motion.div
                key="success"
                className='eye-icon'
                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </motion.div>
            ) : (
              <motion.div
                key="download"
                className='eye-icon'
                initial={{ scale: 1 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                whileHover={{ y: [0, 2, 0], transition: { repeat: Infinity, duration: 0.6 } }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </span>
      </motion.a>
    </motion.div>
  )
}

export default Certificates
