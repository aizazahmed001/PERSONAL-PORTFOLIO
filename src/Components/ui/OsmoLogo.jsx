import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OsmoLogo = ({ isOpen }) => {
    const scrollContainerRef = useRef(null);
    const textRef = useRef(null);
    const starRef = useRef(null);

    const staticContainerRef = useRef(null);

    // Scroll Animation
    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "100px top",
                    scrub: 1,
                }
            });

            // Text Fade Out
            tl.to(textRef.current, { opacity: 0, display: 'none', duration: 0.2 });

            // Star Fade In
            tl.fromTo(starRef.current,
                { opacity: 0, display: 'none' },
                { opacity: 1, display: 'block', duration: 0.2 },
                ">"
            );

        }, scrollContainerRef);
        return () => ctx.revert();
    }, []);

    // Toggle Wrapper Visibility based on isOpen
    useLayoutEffect(() => {
        if (isOpen) {
            gsap.to(staticContainerRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" });
            gsap.to(scrollContainerRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
        } else {
            gsap.to(staticContainerRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
            gsap.to(scrollContainerRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" });
        }
    }, [isOpen]);

    return (
        <div className="relative flex items-center justify-center h-8">
            {/* Ghost Element to define width based on text content */}
            <div className='font-bold uppercase tracking-wider text-xl opacity-0 select-none'>
                <span className=''>PORT</span>FOLIO
            </div>

            {/* 1. Scroll-Driven Container (Active when Closed) */}
            <div ref={scrollContainerRef} className="absolute inset-0 flex items-center justify-center">

                {/* Text Logo */}
                <div ref={textRef} className="absolute inset-0 flex items-center justify-center">
                    <div className='font-bold uppercase tracking-wider text-xl text-white'>
                        <span className='text-[#F9D423]'>PORT</span>FOLIO
                    </div>
                </div>

                {/* Star Icon (Animated on Scroll) */}
                <div ref={starRef} className="absolute inset-0 flex items-center pl-10 justify-center hidden">
                    <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                        {/* Changed fill to Yellow to match theme #F9D423 */}
                        <path d="M14.5 0L17.8647 11.1353L29 14.5L17.8647 17.8647L14.5 29L11.1353 17.8647L0 14.5L11.1353 11.1353L14.5 0Z" fill="#F9D423" />
                    </svg>
                </div>
            </div>

            {/* 2. Static Open Container (Active when Open) */}
            <div
                ref={staticContainerRef}
                className="absolute inset-0 flex items-center justify-center opacity-0"
                style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
            >
                <div className='font-bold uppercase tracking-wider text-xl text-white'>
                    <span className='text-[#F9D423]'>PORT</span>FOLIO
                </div>
            </div>

        </div>
    );
};

export default OsmoLogo;
