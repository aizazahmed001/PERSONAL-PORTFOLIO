import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { NavLink } from 'react-router-dom';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import MenuButton from './ui/MenuButton';
import OsmoLogo from './ui/OsmoLogo';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);

  // Links data
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Certificates', href: '/certificates' },
    { name: 'Projects', href: '/projects' },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // GSAP for opening/closing height and width animation
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Define animations for Desktop (> 768px) where width change is most effective
      mm.add("(min-width: 768px)", () => {
        if (isOpen) {
          gsap.to(navRef.current, {
            width: "100%", // Expands to fill the max-w-4xl container
            maxWidth: "896px", // Ensure it respects the max-width
            height: "auto",
            backgroundColor: "#000000", // Black background
            borderRadius: "30px",
            duration: 0.8,
            ease: "power4.inOut"
          });
        } else {
          gsap.to(navRef.current, {
            width: "600px", // Constrained width when closed
            height: "64px",
            backgroundColor: "#000000",
            duration: 0.8,
            ease: "power4.inOut"
          });
        }
      });

      // Mobile fallback
      mm.add("(max-width: 767px)", () => {
        if (isOpen) {
          gsap.to(navRef.current, {
            height: "auto",
            backgroundColor: "#000000",
            width: "90%",
            duration: 0.8,
            ease: "power4.inOut"
          });
        } else {
          gsap.to(navRef.current, {
            height: "64px",
            backgroundColor: "#000000",
            width: "90%",
            duration: 0.8,
            ease: "power4.inOut"
          });
        }
      });

    }, navRef);

    return () => ctx.revert();
  }, [isOpen]);

  return (
    <nav className="fixed top-6 left-0 right-0 z-[999] flex justify-center pointer-events-none">
      <div
        ref={navRef}
        className="pointer-events-auto relative w-[90%] max-w-4xl bg-black backdrop-blur-xl border-2 border-white rounded-[30px] overflow-hidden flex flex-col transition-shadow shadow-2xl"
        style={{ height: '64px' }} // Initial height
      >

        {/* Top Bar (Always Visible) */}
        <div className="relative flex items-center justify-between px-6 h-[64px] flex-shrink-0 w-full">
          {/* Left: Menu Toggle */}
          <MenuButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

          {/* Center: Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <OsmoLogo isOpen={isOpen} />
          </div>

          {/* Right: Join / CTA - Optional/Hidden if not needed, or "Contact" */}
          {/* Right: Empty spacer to balance layout or remove entirely */}
          <div className='hidden sm:block w-[75px]'></div>
        </div>

        {/* Expanded Menu Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0, transition: { duration: 0.4 } },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.2
                  }
                }
              }}
              className="flex flex-col p-6 pt-2 pb-8 border-t border-white/10"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link, linkIndex) => (
                  <NavLink
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `group relative text-4xl sm:text-5xl font-bold py-4 transition-all duration-300 ${isActive ? 'text-[#0047AB]' : 'text-white'}`
                    }
                  >
                    <motion.div
                      variants={{
                        hidden: { x: -50, opacity: 0, rotateY: -15 },
                        visible: {
                          x: 0,
                          opacity: 1,
                          rotateY: 0,
                          transition: {
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                            delay: linkIndex * 0.1
                          }
                        }
                      }}
                      whileHover={{
                        x: 10,
                        scale: 1.05,
                        transition: { duration: 0.3 }
                      }}
                      className="relative"
                      style={{ perspective: "1000px" }}
                    >
                      {/* Gradient background on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#0047AB] to-[#002966] opacity-0 group-hover:opacity-10 rounded-lg -z-10"
                        initial={{ scaleX: 0, originX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.4 }}
                      />

                      {/* Character-by-character reveal */}
                      <div className="flex">
                        {link.name.split('').map((char, charIndex) => (
                          <motion.span
                            key={charIndex}
                            className="inline-block"
                            initial={{ y: 50, opacity: 0, rotateX: -90 }}
                            animate={{
                              y: 0,
                              opacity: 1,
                              rotateX: 0,
                              transition: {
                                delay: 0.3 + (linkIndex * 0.1) + (charIndex * 0.03),
                                type: "spring",
                                stiffness: 200,
                                damping: 15
                              }
                            }}
                            whileHover={{
                              y: -5,
                              color: '#0047AB',
                              scale: 1.1,
                              transition: { duration: 0.2 }
                            }}
                            style={{
                              display: 'inline-block',
                              transformStyle: 'preserve-3d'
                            }}
                          >
                            {char === ' ' ? '\u00A0' : char}
                          </motion.span>
                        ))}
                      </div>

                      {/* Animated underline */}
                      <motion.div
                        className="absolute bottom-2 left-0 h-[3px] bg-gradient-to-r from-[#0047AB] to-[#002966]"
                        initial={{ width: 0 }}
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      />
                    </motion.div>
                  </NavLink>
                ))}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </nav>
  );
};

export default Header;