import React, { useRef, useState } from 'react'
import ProgressBar from '@ramonak/react-progress-bar'
import TextPressure from './ui/TextPressure'
import { motion, useMotionValue } from 'framer-motion'

const AnimatedHeading = ({ text }) => (
    <div className="relative w-full max-w-3xl h-24 sm:h-32 lg:h-36">
        <TextPressure
            text={text}
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#ffffff"
            minFontSize={28}
            className="tracking-tight"
        />
    </div>
)

const AnimatedTitle = ({ text, className, noHover = false }) => (
    <motion.h1
        className={`${!noHover ? 'cursor-pointer' : 'cursor-default'} ${className}`}
        initial="hidden"
        whileInView="visible"
        whileHover={!noHover ? "hovered" : undefined}
        viewport={{ once: true }}
    >
        {text.split("").map((char, index) => (
            <motion.span
                key={index}
                className="inline-block"
                variants={{
                    hidden: { y: 20, opacity: 0, filter: 'blur(10px)', scale: 1.2 },
                    visible: {
                        y: 0,
                        opacity: 1,
                        filter: 'blur(0px)',
                        scale: 1,
                        transition: {
                            delay: index * 0.05,
                            duration: 0.4
                        }
                    },
                    hovered: {
                        y: [0, -20, 0],
                        scale: [1, 1.5, 1],
                        rotate: [0, 15, -10, 0],
                        color: ['#F9D423', '#ffffff', '#F9D423'],
                        textShadow: [
                            '0 0 0px rgba(249, 212, 35, 0)',
                            '0 0 20px rgba(249, 212, 35, 1)',
                            '0 0 0px rgba(249, 212, 35, 0)'
                        ],
                        transition: {
                            delay: index * 0.04,
                            duration: 0.5,
                            ease: "easeInOut"
                        }
                    }
                }}
            >
                {char === " " ? "\u00A0" : char}
            </motion.span>
        ))}
    </motion.h1>
)

const MagnifiedText = ({ text, className, variants }) => {
    const containerRef = useRef(null);
    const words = text.split(" ");
    const wordRefs = useRef([]);
    const [mvs] = useState(() => words.map(() => useMotionValue(1)));

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        wordRefs.current.forEach((span, i) => {
            if (!span) return;
            const rect = span.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate distance from mouse to word center
            const distance = Math.hypot(mouseX - centerX, mouseY - centerY);

            // Magnification settings
            const maxDist = 125; // Focused radius
            const maxScale = 2.2; // Stronger zoom

            let s = 1;
            if (distance < maxDist) {
                // Sharper curve
                s = 1 + (maxScale - 1) * Math.pow(1 - distance / maxDist, 4);
            }
            mvs[i].set(s);
        });
    };

    const handleMouseLeave = () => {
        mvs.forEach(mv => {
            mv.set(1);
        });
    };

    return (
        <motion.p
            ref={containerRef}
            className={className}
            variants={variants}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    ref={el => wordRefs.current[i] = el}
                    style={{ scale: mvs[i], display: 'inline-block', marginRight: '0.25em', verticalAlign: 'middle', transformOrigin: 'center bottom' }}
                >
                    {word}
                </motion.span>
            ))}
        </motion.p>
    );
};

const ModernProgressBar = ({ label, percentage, color }) => (
    <div className='flex flex-col gap-2 w-full max-w-4xl px-10 mb-8'>
        <div className='flex justify-between items-end'>
            <span className='text-sm font-black tracking-[0.2em] uppercase text-white/50'>{label}</span>
            <span className='text-sm font-bold text-[#F9D423]'>{percentage}%</span>
        </div>
        <div className='h-[6px] w-full bg-white/5 rounded-full overflow-hidden relative border border-white/5'>
            {/* The active progress fill */}
            <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${percentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                style={{
                    background: `linear-gradient(90deg, ${color}88, ${color})`,
                    boxShadow: `0 0 20px ${color}33`
                }}
                className='h-full relative rounded-full'
            >
                {/* Shine/Shimmer Effect */}
                <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className='absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]'
                />
            </motion.div>
        </div>
    </div>
)

function About() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {/* Introduction Section */}
            <div className='flex place-items-center flex-col gap-5 bg-black w-full py-10 px-10'>
                <motion.div variants={itemVariants} className="w-full flex justify-center">
                    <AnimatedHeading text='Short Intro' />
                </motion.div>

                <div className='md:flex'>
                    <div className='flex flex-col md:w-1/2 pb-20 gap-3 md:gap-10 px-10'>
                        <motion.div variants={itemVariants}>
                            <AnimatedTitle
                                text="Objective:"
                                className='text-[#F9D423] text-2xl font-bold'
                                noHover={true}
                            />
                        </motion.div>
                        <MagnifiedText
                            variants={itemVariants}
                            className='text-justify text-lg text-white/50 cursor-default leading-normal'
                            text='Driven Software Engineering student at Bahria University with expertise in data structures, algorithms, and full-stack development using JavaScript, React, and Node.js. Experienced in building production-ready applications with modern frontend frameworks and cloud technologies, while actively expanding knowledge in AI and machine learning systems. Passionate about leveraging data-driven insights and intelligent solutions to solve real-world problems through scalable software development.'
                        />
                    </div>

                    <div className='flex flex-col px-10 md:w-1/2 gap-3 md:gap-10 pb-20'>
                        <motion.div variants={itemVariants}>
                            <AnimatedTitle
                                text="Education and skills:"
                                className='text-[#F9D423] text-2xl font-bold'
                                noHover={true}
                            />
                        </motion.div>
                        <MagnifiedText
                            variants={itemVariants}
                            className='text-justify text-lg text-white/50 cursor-default leading-normal'
                            text='Currently pursuing Bachelor of Science in Software Engineering at Bahria University Islamabad, with focus on software design, data structures, and AI/ML foundations. Proficient in modern web technologies including React.js, Tailwind CSS, and Node.js, with hands-on experience in cloud computing, CI/CD pipelines, and agile development methodologies through industry internships.'
                        />
                    </div>
                </div>
            </div>

            {/* Education Section */}
            <div className='flex flex-col gap-16 text-white px-10 py-10 bg-black w-full'>
                <div className='flex flex-col place-items-center'>
                    <motion.p variants={itemVariants} className='text-center text-xl text-[#F9D423]'>{'( 2018-2027 )'}</motion.p>
                    <motion.div variants={itemVariants} className="w-full flex justify-center">
                        <AnimatedHeading text='Education Quality' />
                    </motion.div>
                </div>

                <div className="flex flex-col gap-10">
                    <motion.div variants={itemVariants}>
                        <div className='flex flex-wrap justify-between items-start gap-2 mb-2'>
                            <AnimatedTitle
                                text="BS Software Engineering"
                                className='md:text-4xl sm:text-2xl text-lg pl-1 font-bold text-[#F9D423]'
                                noHover={true}
                            />
                            <span className='rounded-md px-3 py-1 font-bold text-black bg-[#aacc00] text-sm md:text-base'>In Progress</span>
                        </div>
                        <p className='md:text-lg font-semibold pt-2 pl-1 text-[#aacc00]'>
                            Bahria University Islamabad {'(2023-2027)'}
                        </p>
                        <MagnifiedText
                            className='md:text-lg w-full md:w-[80%] mt-5 text-white/75 cursor-default'
                            text='Currently pursuing my Bachelor of Science in Software Engineering at Bahria University Islamabad, where I am building a strong foundation in software design, data structures, algorithms, and AI/ML systems. My coursework focuses on full-stack web development, machine learning, algorithm optimization, and intelligent systems, preparing me for impactful contributions in the software industry. The university environment has been instrumental in developing both my technical expertise and professional soft skills through hands-on projects and collaborative learning.'
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <div className='flex flex-wrap justify-between items-start gap-2 mb-2'>
                            <AnimatedTitle
                                text="FSc Pre-Engineering"
                                className='md:text-4xl sm:text-2xl text-lg font-bold text-[#F9D423]'
                                noHover={true}
                            />
                            <span className='rounded-md px-3 py-1 font-bold text-black bg-[#aacc00] text-sm md:text-base'>840/1100</span>
                        </div>
                        <p className='md:text-lg text-[#aacc00] pt-2'>
                            Bahria College Karsaz Karachi {'(2021-2023)'}
                        </p>
                        <MagnifiedText
                            className='md:text-lg mt-5 w-full md:w-[80%] text-white/75 cursor-default leading-normal'
                            text='Completed my FSc Pre-Engineering from Bahria College Karsaz Karachi with emphasis on mathematics and physics fundamentals. During this period, I built strong analytical thinking and problem-solving capabilities through practical engineering projects and teamwork exercises, which laid the groundwork for my software engineering journey.'
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <div className='flex flex-wrap justify-between items-start gap-2 mb-2'>
                            <AnimatedTitle
                                text="Metric in Science"
                                className='md:text-4xl sm:text-2xl text-lg font-bold text-[#F9D423]'
                                noHover={true}
                            />
                            <span className='rounded-md px-3 py-1 font-bold text-black bg-[#aacc00] text-sm md:text-base'>953/1100</span>
                        </div>
                        <p className='md:text-lg text-[#aacc00] pt-2'>
                            Bahria College Karsaz Karachi {'(2018-2021)'}
                        </p>
                        <MagnifiedText
                            className='md:text-lg mt-5 w-full md:w-[80%] text-white/75 cursor-default leading-normal'
                            text='Completed my Matriculation in Science from Bahria College Karsaz Karachi with exceptional academic performance. During this foundational period, I developed strong problem-solving abilities and technical aptitude through science exhibitions and collaborative team projects. These early experiences fostered my passion for technology and established my commitment to academic excellence and teamwork.'
                        />
                    </motion.div>
                </div>
            </div>

            {/* Skills Section */}
            <div className='bg-black'>
                <div className='flex flex-col place-items-center py-10 px-10 gap-3'>
                    <motion.p variants={itemVariants} className='text-[#F9D423] text-xl'>Technical Proficiency</motion.p>
                    <motion.div variants={itemVariants} className="w-full flex justify-center">
                        <AnimatedHeading text='Development Skills' />
                    </motion.div>
                </div>

                <motion.div
                    className='flex flex-col items-center gap-2 pb-20'
                    variants={containerVariants}
                >
                    <motion.div className="w-full flex justify-center" variants={itemVariants}><ModernProgressBar label="JavaScript" percentage={90} color="#F7DF1E" /></motion.div>
                    <motion.div className="w-full flex justify-center" variants={itemVariants}><ModernProgressBar label="React.js" percentage={85} color="#61DAFB" /></motion.div>
                    <motion.div className="w-full flex justify-center" variants={itemVariants}><ModernProgressBar label="HTML 5" percentage={95} color="#FF5733" /></motion.div>
                    <motion.div className="w-full flex justify-center" variants={itemVariants}><ModernProgressBar label="CSS 3" percentage={95} color="#1572B6" /></motion.div>
                    <motion.div className="w-full flex justify-center" variants={itemVariants}><ModernProgressBar label="Tailwind CSS" percentage={90} color="#38BDF8" /></motion.div>
                    <motion.div className="w-full flex justify-center" variants={itemVariants}><ModernProgressBar label="Node.js" percentage={80} color="#339933" /></motion.div>
                    <motion.div className="w-full flex justify-center" variants={itemVariants}><ModernProgressBar label="C++" percentage={85} color="#00599C" /></motion.div>
                    <motion.div className="w-full flex justify-center" variants={itemVariants}><ModernProgressBar label="Java" percentage={80} color="#007396" /></motion.div>
                    <motion.div className="w-full flex justify-center" variants={itemVariants}><ModernProgressBar label="Python" percentage={75} color="#3776AB" /></motion.div>
                    <motion.div className="w-full flex justify-center" variants={itemVariants}><ModernProgressBar label="MySQL" percentage={85} color="#4479A1" /></motion.div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default About