import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

export default function GlobalCursor() {
  const [enabled, setEnabled] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const smoothX = useSpring(mouseX, { stiffness: 340, damping: 30, mass: 0.2 });
  const smoothY = useSpring(mouseY, { stiffness: 340, damping: 30, mass: 0.2 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const check = () => {
      const finePointer = window.matchMedia("(pointer: fine)").matches;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setEnabled(finePointer && !reducedMotion && window.innerWidth > 768);
    };

    const handleMove = (event) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    const handleLeave = () => {
      mouseX.set(-100);
      mouseY.set(-100);
    };

    check();
    window.addEventListener("resize", check);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseout", handleLeave);

    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseout", handleLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <AnimatePresence>
      {enabled && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[10000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute w-14 h-14 rounded-full"
            style={{
              x: smoothX,
              y: smoothY,
              translateX: "-50%",
              translateY: "-50%",
              background:
                "radial-gradient(circle, rgba(0,115,230,0.34) 0%, rgba(0,71,171,0.15) 58%, rgba(0,71,171,0) 100%)",
              boxShadow: "0 0 28px rgba(0,71,171,0.34)",
            }}
          />
          <motion.div
            className="absolute w-2.5 h-2.5 rounded-full"
            style={{
              x: smoothX,
              y: smoothY,
              translateX: "-50%",
              translateY: "-50%",
              background: "linear-gradient(135deg, #60a5fa, #0047AB)",
              boxShadow: "0 0 12px rgba(0,115,230,0.62)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
