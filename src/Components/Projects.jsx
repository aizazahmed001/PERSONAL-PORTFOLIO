import React, { useState, useRef } from 'react'
import TextPressure from './ui/TextPressure'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import './Projects.css'

function Projects() {
  const projects = [
    {
      id: 1,
      title: "Sprite Website Redesign",
      desc: "A refreshing and modern redesign of the Sprite drink website. This high-performance landing page features dynamic GSAP animations and a crisp, responsive layout that captures the brand's energetic vibe.",
      tags: ["HTML", "CSS", "JavaScript", "GSAP"],
      video: "/project1.mp4"
    },
    {
      id: 2,
      title: "Pixel-Perfect Landing Page",
      desc: "A faithful conversion of a complex Figma design into a fully functional web landing page. Optimized for performance and responsiveness, showcasing precise attention to detail and clean code structure.",
      tags: ["HTML", "CSS", "JavaScript", "GSAP"],
      video: "/project2.mp4"
    }
  ]

  return (
    <div className='bg-black pt-10 pb-40 min-h-screen relative overflow-x-hidden'>
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black opacity-70"></div>

      {/* Title Section */}
      <div className='w-full mb-16 z-40 flex flex-col items-center gap-0 px-6 relative'>
        <div className="relative w-full max-w-6xl h-[200px] sm:h-[300px]">
          <TextPressure
            text="PROJECTS"
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
      </div>

      {/* Projects Grid */}
      <div className='max-w-7xl mx-auto px-6 relative z-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12'>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, index }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const cardRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);

  // Motion values for drag tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Update card width for wire centering
  React.useEffect(() => {
    if (cardRef.current) {
      setCardWidth(cardRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (cardRef.current) setCardWidth(cardRef.current.offsetWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Physics-based rotation for the "hanging" feel - slightly slower and weightier
  const rotateZ = useSpring(useTransform(x, [-300, 300], [-25, 25]), { stiffness: 80, damping: 10 });

  // Transform for the wire path
  const wirePath = useTransform([x, y], ([latestX, latestY]) => {
    // Anchor points offset based on index to align with letters in "PROJECTS"
    const isLeft = index % 2 === 0;
    const anchorX = isLeft ? cardWidth * 0.8 : cardWidth * 0.2;
    const anchorY = -420; // Anchored behind the PROJECTS text
    const targetX = (cardWidth / 2) + latestX;
    const targetY = latestY;

    // Fluid wire curve with a bit more "slack" feel
    return `M ${anchorX} ${anchorY} Q ${anchorX + (targetX - anchorX) * 0.3} ${anchorY + (targetY - anchorY) * 0.4} ${targetX} ${targetY}`;
  });

  return (
    <motion.div
      ref={cardRef}
      className='project-card-wrapper h-full perspective-[2000px] relative'
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
    >
      {/* The Hanging Wire - Moved behind text with lower z-index */}
      <svg
        className="absolute inset-x-0 pointer-events-none overflow-visible z-[-1]"
        style={{ top: 0, height: '100px' }}
      >
        <motion.path
          d={wirePath}
          stroke="#0047AB"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          className="drop-shadow-[0_0_10px_rgba(249,212,35,0.3)] opacity-50"
        />
        {/* Fixed Hook Anchor hidden behind the text */}
        <circle
          cx={index % 2 === 0 ? cardWidth * 0.8 : cardWidth * 0.2}
          cy="-420"
          r="3"
          fill="#0047AB"
          className="opacity-40"
        />
      </svg>

      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={1.5}
        dragTransition={{ bounceStiffness: 100, bounceDamping: 8 }}
        whileDrag={{ scale: 1.02, zIndex: 50 }}
        onMouseEnter={() => setIsPlaying(true)}
        onMouseLeave={() => setIsPlaying(false)}
        className='project-card group cursor-grab active:cursor-grabbing relative z-10'
        style={{
          x,
          y,
          rotateZ,
          transformOrigin: "top center", // Pivots from the hook
          transformStyle: "preserve-3d"
        }}
      >
        {/* Video Section */}
        <div className='project-video-container' style={{ transform: "translateZ(30px)", pointerEvents: "none" }}>
          <video
            className='project-video'
            muted
            loop
            playsInline
            ref={el => {
              if (el) {
                isPlaying ? el.play().catch(e => { }) : el.pause();
                if (!isPlaying) el.currentTime = 0;
              }
            }}
          >
            <source src={project.video} type="video/mp4" />
          </video>
          <div className='project-overlay'></div>

          {/* Large Number Background */}
          <div className='project-number text-[#0047AB]/20'>0{project.id}</div>
        </div>

        {/* Content Section */}
        <div className='project-content' style={{ transform: "translateZ(50px)", pointerEvents: "none" }}>
          <div className='project-header'>
            <h3 className='project-title'>{project.title}</h3>
          </div>

          <div className='tech-stack'>
            {project.tags.map((tag, i) => (
              <span key={i} className='tech-tag'>{tag}</span>
            ))}
          </div>

          <p className='project-description'>
            {project.desc}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Projects
