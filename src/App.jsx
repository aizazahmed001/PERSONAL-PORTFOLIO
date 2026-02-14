import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import Header from './Components/Header'
import Footer from './Components/Footer'
import Preloader from './Components/Preloader'
import FloatingAIButton from './Components/FloatingAIButton'

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Ensure we are at the top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <FloatingAIButton />
      <AnimatePresence mode='wait'>
        {isLoading ? (
          <Preloader key="preloader" onComplete={() => setIsLoading(false)} />
        ) : (
          <div key="content" className="w-full">
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="fixed top-0 left-0 right-0 z-[999]"
            >
              <Header />
            </motion.div>

            <div className="pt-32">
              <Outlet />
            </div>
            <Footer />
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
