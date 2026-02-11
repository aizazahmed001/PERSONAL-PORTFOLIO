import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const words = ["Hello", "Bonjour", "Ciao", "Olà", "やあ", "Hallå", "Guten tag", "Assalam O Alaikom"];

const Preloader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [dimension, setDimension] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setDimension({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    useEffect(() => {
        // Counter simulation
        const timer = setInterval(() => {
            setProgress(old => {
                if (old >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                // Faster counting
                const increment = Math.floor(Math.random() * 5) + 2;
                return Math.min(old + increment, 100);
            });
        }, 50);

        return () => clearInterval(timer);
    }, []);

    // Trigger complete when progress hits 100
    useEffect(() => {
        if (progress === 100) {
            // Snappier exit
            const delay = setTimeout(() => {
                onComplete();
            }, 200);
            return () => clearTimeout(delay);
        }
    }, [progress, onComplete]);

    const index = Math.min(words.length - 1, Math.floor((progress / 100) * words.length));

    const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height}  L0 0`;
    const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} 0 Q${dimension.width / 2} 0 0 0 L0 0`;

    const slideUp = {
        initial: {
            top: 0
        },
        exit: {
            top: "-100vh",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }
        }
    }

    const curve = {
        initial: {
            d: initialPath,
        },
        exit: {
            d: targetPath,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }
        }
    }

    const opacity = {
        initial: { opacity: 0 },
        enter: { opacity: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, transition: { duration: 0.5 } }
    }

    const counterAnimation = {
        initial: { opacity: 0, scale: 0.8 },
        enter: { opacity: 1, scale: 1 },
        completed: {
            scale: [1, 1.5, 0],
            opacity: [1, 1, 0],
            transition: { duration: 0.4, ease: "backIn" }
        }
    }

    return (
        <motion.div
            variants={slideUp}
            initial="initial"
            exit="exit"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-[#F9D423] overflow-hidden cursor-wait"
        >
            {/* Center Greeting */}
            <motion.div
                variants={opacity}
                initial="initial"
                animate="enter"
                exit="exit"
                className="flex items-center justify-center text-4xl md:text-6xl font-bold z-10"
            >
                <div className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-[#F9D423] rounded-full inline-block animate-pulse"></span>
                    <span className="font-['Bebas_Neue'] tracking-wider">{words[index]}</span>
                </div>
            </motion.div>

            {/* Percentage Counter */}
            <motion.p
                variants={counterAnimation}
                initial="initial"
                animate={progress === 100 ? "completed" : "enter"}
                className="absolute bottom-10 right-10 text-6xl md:text-8xl font-black text-white"
            >
                {progress}%
            </motion.p>

            {/* SVG Curve for Slide Effect */}
            <svg className="absolute top-0 w-full h-[calc(100%+300px)] pointer-events-none fill-black">
                <motion.path
                    variants={curve}
                    initial="initial"
                    exit="exit"
                />
            </svg>
        </motion.div>
    );
};

export default Preloader;
