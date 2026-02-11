import { useRef, useEffect } from 'react';
import { motion, useAnimationFrame, useMotionValue, useSpring, useTransform } from 'framer-motion';

const wrap = (min, max, v) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export default function Marquee({ children, baseVelocity = 5, className }) {
    const baseX = useMotionValue(0);
    const scrollRef = useRef(null);
    const directionFactor = useRef(1); // 1 = left, -1 = right (logic depends on moveBy sign)
    const speedRef = useRef(baseVelocity);

    // We want default: moves LEFT.
    // In typical translation, moving left means x is decreasing (negative).
    // So default directionFactor should be 1, and we subtract moveBy? 
    // Or directionFactor -1 and we add?
    // Let's say: x -= speed * delta.

    // Requirement: 
    // Default: Goes Left (x decreases). Speed = High.
    // Hover: Goes Right (x increases). Speed = Low.

    // We wrap between -25% and 0% because we have 4 copies of children.
    // One cycle is 1/4th of the total width = 25%.

    const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
    // Note: The wrap range depends heavily on content width. 
    // A safer generic way for arbitrary content width is hard without measuring.
    // But for a simple list of tags, we can just render them many times and wrap 0 to -50%.

    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * speedRef.current * (delta / 1000);

        // Default: directionFactor = 1. We want Left.
        // If we do: baseX.set(baseX.get() + moveBy)
        // Then if moveBy is pos, it goes right. If neg, left.
        // So for Left, we need negative change.

        // Let's set directionFactor to -1 for Left.
        // baseVelocity is positive magnitude.

        // Current setup in logic below:
        baseX.set(baseX.get() + moveBy);
    });

    const handleMouseEnter = () => {
        directionFactor.current = 1; // Move Right (positive)
        speedRef.current = baseVelocity * 0.2; // Slow down
    };

    const handleMouseLeave = () => {
        directionFactor.current = -1; // Move Left (negative)
        speedRef.current = baseVelocity; // Normal speed (Fast)
    };

    useEffect(() => {
        // Initialize defaults
        directionFactor.current = -1; // Start moving Left
        speedRef.current = baseVelocity;
    }, [baseVelocity]);

    return (
        <div
            className={`overflow-hidden whitespace-nowrap flex flex-nowrap ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={scrollRef}
        >
            <motion.div className="flex flex-nowrap gap-16" style={{ x }}>
                {children}
                {children}
                {children}
                {children}
            </motion.div>
        </div>
    );
}
