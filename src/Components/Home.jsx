import Skills from './Skills'

import TextPressure from './ui/TextPressure'
import Marquee from './ui/Marquee'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

const StatCounter = ({ value, duration = 2 }) => {
  const spring = useSpring(0, { stiffness: 30, damping: 20 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
};

const AnimatedHeroTitle = () => {
  const container = {
    visible: {
      transition: { staggerChildren: 0.02, delayChildren: 0.1 }
    }
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: 90,
      filter: 'blur(10px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 150
      }
    }
  };

  const renderWord = (word, keyPrefix, isSpecial = false) => (
    <span key={keyPrefix} className="inline-block whitespace-nowrap mr-2">
      {word.split("").map((char, i) => (
        <motion.span
          key={`${keyPrefix}-${i}`}
          variants={child}
          className={`inline-block cursor-pointer ${isSpecial ? 'bg-gradient-to-r from-[#F9D423] to-[#aacc00] animate-gradient bg-clip-text text-transparent' : ''}`}
          whileHover={isSpecial
            ? { scale: 1.2, rotate: -5, y: -3, transition: { duration: 0.2 } }
            : { scale: 1.3, color: '#F9D423', rotate: 5, y: -5, transition: { duration: 0.2 } }
          }
        >
          {char}
        </motion.span>
      ))}
    </span>
  );

  return (
    <motion.h2
      className='text-2xl sm:text-4xl font-bold leading-tight flex flex-wrap'
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {renderWord("Building", "building")}
      {renderWord("Digital", "digital", true)}
      {renderWord("Experiences", "experiences", true)}
      {"that blend aesthetic perfection with seamless functionality.".split(" ").map((word, i) => (
        renderWord(word, `word-${i}`)
      ))}
    </motion.h2>
  );
};

function Home() {
  const [isDownloading, setIsDownloading] = useState(false);

  // Mouse tracking for bio text animation
  const bioMouseX = useMotionValue(0);
  const bioMouseY = useMotionValue(0);

  const handleBioMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    bioMouseX.set(e.clientX - centerX);
    bioMouseY.set(e.clientY - centerY);
  };

  const handleBioMouseLeave = () => {
    bioMouseX.set(0);
    bioMouseY.set(0);
  };

  const handleDownload = (e) => {
    // Note: We don't preventDefault so the download still happens
    setIsDownloading(true);
    setTimeout(() => setIsDownloading(false), 2000);
  };

  return (
    <>
      <div className='flex flex-col bg-black min-h-screen font-sans text-white'>

        {/* Hero Section */}
        <section className='flex flex-col w-full pt-10 pb-20 px-6 sm:px-12'>

          {/* 1. Name Header */}
          <div className='w-full mb-8 z-10 flex flex-col gap-0'>
            <motion.div
              className="relative w-full h-[150px] sm:h-[300px] lg:h-[400px]"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            >
              <TextPressure
                text="AIZAZ  "
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor="#ffffff"
                minFontSize={24}
              />
            </motion.div>
            <motion.div
              className="relative w-full h-[150px] sm:h-[300px] lg:h-[400px] -mt-4 sm:-mt-8 lg:-mt-12"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            >
              <TextPressure
                text="  AHMED"
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor="#ffffff"
                minFontSize={24}
              />
            </motion.div>
          </div>

          {/* 2. Tagline Bar */}
          <motion.div
            className='w-[calc(100%+3rem)] sm:w-[calc(100%+6rem)] -ml-6 sm:-ml-12 border-y border-black/20 mb-12 overflow-hidden bg-gradient-to-r from-[#F9D423] to-[#aacc00] animate-gradient z-20 relative'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Marquee baseVelocity={3} className='py-6 text-2xl sm:text-3xl md:text-4xl font-black tracking-widest text-black uppercase'>
              <div className="flex gap-16">
                <span>#Development</span>
                <span>#MERN STACK</span>
                <span>#Frontend</span>
                <span>#CREATIVE</span>
                <span>#UIUX</span>
              </div>
            </Marquee>
          </motion.div>

          {/* 3. Main Content Grid */}
          <motion.div
            className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-start'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >

            {/* Left Col: Image */}
            <div className='lg:col-span-4 flex justify-center lg:justify-start'>
              <div className='relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden bg-gray-900 border border-white/10'>
                <img
                  className='w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700'
                  src="/Aizaz.jpeg"
                  alt="AIZAZ AHMED"
                />
              </div>
            </div>

            {/* Right Col: Bio & CTA */}
            <div className='lg:col-span-8 flex flex-col justify-between h-full pt-4'>
              <div className='flex flex-col gap-8'>
                <AnimatedHeroTitle />
                <div
                  className='text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl cursor-default'
                  onMouseMove={handleBioMouseMove}
                  onMouseLeave={handleBioMouseLeave}
                >
                  {'I am a Frontend Developer with a strong passion for creating user-friendly websites with expertise in HTML, CSS, JavaScript, React, Tailwind CSS, GSAP, and MongoDB. I build responsive websites and focus on delivering seamless animations and smooth interactions.'.split(' ').map((word, index) => {
                    return (
                      <motion.span
                        key={index}
                        className="inline-block mr-[0.25em]"
                        animate={{
                          y: bioMouseY.get() !== 0 ? Math.sin((index * 0.5) + (bioMouseX.get() * 0.01)) * 5 : 0,
                          scale: bioMouseY.get() !== 0 ? 1 + (Math.abs(Math.sin((index * 0.3) + (bioMouseX.get() * 0.008))) * 0.1) : 1,
                          rotateZ: bioMouseY.get() !== 0 ? Math.sin((index * 0.4) + (bioMouseX.get() * 0.01)) * 3 : 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          mass: 0.4,
                        }}
                        whileHover={{
                          scale: 1.1,
                          color: '#F9D423',
                          y: -5,
                          transition: { duration: 0.2 }
                        }}
                      >
                        {word}
                      </motion.span>
                    );
                  })}
                </div>

                <div className='flex flex-wrap gap-6 mt-4'>
                  <a
                    href="./AizazAhmed-SE-CV.pdf"
                    download
                    onClick={handleDownload}
                    className='group relative flex items-center justify-center gap-3 px-8 py-4 rounded-full text-lg font-bold border-2 border-transparent hover:border-[#F9D423] text-black hover:text-[#F9D423] transition-all duration-300 shadow-[0_0_20px_rgba(170,204,0,0.3)] overflow-hidden'
                  >
                    {/* Animated Gradient Background */}
                    <span className="absolute inset-0 bg-gradient-to-r from-[#F9D423] to-[#aacc00] animate-gradient opacity-100 group-hover:opacity-0 transition-opacity duration-300"></span>

                    {/* Button Content */}
                    <span className="relative z-10 flex items-center gap-3">
                      Download Resume
                      {/* Interactive Icon */}
                      <AnimatePresence mode="wait">
                        {isDownloading ? (
                          <motion.svg
                            key="check"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                            initial={{ scale: 0, rotate: -90, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </motion.svg>
                        ) : (
                          <motion.svg
                            key="download"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                            initial={{ scale: 1, rotate: 0, opacity: 1 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 3v13.5M12 16.5l-3.75-3.75M12 16.5l3.75-3.75" />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </span>
                  </a>
                </div>
              </div>

              {/* Rating / Footer of Hero - NEXT LEVEL ANIMATIONS */}
              <div className='mt-16 sm:mt-24 pt-12 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 relative overflow-hidden'>

                {/* 5-Star Rating Card */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className='flex flex-col gap-3 group'
                >
                  <div className='flex text-[#F9D423] gap-2'>
                    {[...Array(5)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0, rotate: -45 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                          delay: 0.5 + (i * 0.1)
                        }}
                        whileHover={{ scale: 1.4, filter: 'brightness(1.2)' }}
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                  <motion.p
                    className='text-sm text-gray-400 font-medium italic relative inline-block'
                    whileHover={{ scale: 1.02 }}
                  >
                    "Exceptional attention to detail."
                    <motion.span className="absolute -bottom-1 left-0 h-[1px] bg-[#F9D423]/50 w-0 group-hover:w-full transition-all duration-500" />
                  </motion.p>
                </motion.div>

                {/* Experience Stat */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className='flex flex-col gap-2 sm:border-l border-white/10 sm:pl-8 relative group'
                >
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: '70%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.6 }}
                    className="absolute left-0 top-1.5 w-[1px] bg-gradient-to-b from-[#F9D423] to-transparent hidden sm:block"
                  />
                  <h4 className='text-4xl font-black text-white flex items-baseline gap-1'>
                    <StatCounter value={2} />
                    <span className="text-[#aacc00] text-2xl">+</span>
                  </h4>
                  <p className='text-xs text-gray-400 font-bold uppercase tracking-[0.3em]'>Years Exp.</p>
                </motion.div>

                {/* Projects Stat */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className='flex flex-col gap-2 sm:border-l border-white/10 sm:pl-8 relative group'
                >
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: '70%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.8 }}
                    className="absolute left-0 top-1.5 w-[1px] bg-gradient-to-b from-[#F9D423] to-transparent hidden sm:block"
                  />
                  <h4 className='text-4xl font-black text-white flex items-baseline gap-1'>
                    <StatCounter value={20} />
                    <span className="text-[#aacc00] text-2xl">+</span>
                  </h4>
                  <p className='text-xs text-gray-400 font-bold uppercase tracking-[0.3em]'>Projects</p>
                </motion.div>
              </div>
            </div>
          </motion.div>

        </section>

        <Skills />

      </div>
    </>
  )
}

export default Home