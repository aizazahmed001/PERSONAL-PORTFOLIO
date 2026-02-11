import React, { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'
import TextPressure from './ui/TextPressure'

const skillsData = [
    { src: "/html.png", alt: "HTML" },
    { src: "/css.png", alt: "CSS" },
    { src: "/js.png", alt: "JavaScript" },
    { src: "/react1.png", alt: "React" },
    { src: "/tailwind.png", alt: "Tailwind" },
    { src: "/gsap.webp", alt: "GSAP" },
    { src: "/mongodb.svg", alt: "MongoDB" },
    { src: "/jira.png", alt: "JIRA" },
    { src: "/node.png", alt: "NODEJS" },
    { src: "/mysql.webp", alt: "MYSQL" },
    { src: "/python.png", alt: "PYTHON" },
    { src: "/bootstrap.svg", alt: "BOOTSTRAP" },
    { src: "/c++.png", alt: "C++" },
]

function Skills() {
    const containerRef = useRef(null)
    const [isLoaded, setIsLoaded] = useState(false)
    // We keep track of bodies to sync them with DOM elements
    const bodiesRef = useRef({})
    const engineRef = useRef(null)
    const runnerRef = useRef(null)

    useEffect(() => {
        if (!containerRef.current) return

        const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint, Composite, Events } = Matter

        // 1. Setup Engine
        const engine = Engine.create()
        engineRef.current = engine
        const world = engine.world

        // 2. Dimensions
        const width = containerRef.current.clientWidth
        const height = containerRef.current.clientHeight

        // 3. Create Walls (Floor, Left, Right)
        // Invisible boundaries to keep items inside
        const wallOptions = {
            isStatic: true,
            render: { visible: false },
            friction: 0.5
        }

        const floor = Bodies.rectangle(width / 2, height + 50, width, 100, wallOptions)
        const leftWall = Bodies.rectangle(-50, height / 2, 100, height, wallOptions)
        const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height, wallOptions)
        const ceiling = Bodies.rectangle(width / 2, -50, width, 100, wallOptions)

        Composite.add(world, [floor, leftWall, rightWall, ceiling])

        // 4. Create Skill Bodies
        // We calculate roughly the size of the cards (w=80+32=112? approx 120px)
        // Let's assume the cards are roughly 100x100 for physics collision
        const skillBodies = skillsData.map((skill, index) => {
            const x = Math.random() * (width - 100) + 50
            const y = Math.random() * (height / 2) // Start inside top half

            const body = Bodies.rectangle(x, y, 100, 100, {
                restitution: 0.8, // Bouncy
                friction: 0.1,
                render: { visible: false }, // We handle rendering via React
                label: `skill-${index}`
            })

            bodiesRef.current[index] = body
            return body
        })

        Composite.add(world, skillBodies)

        // 5. Mouse Interaction
        const mouse = Mouse.create(containerRef.current)

        // Allow page scrolling by removing Matter.js wheel capture
        mouse.element.removeEventListener("wheel", mouse.mousewheel)
        mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel)

        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 1, // Tighter control (1:1 movement)
                render: { visible: false }
            }
        })

        Composite.add(world, mouseConstraint)

        // Add a global listener to handle mouse leaving the window
        // This prevents items from getting "stuck" if you drag them out of the browser
        const handleWindowMouseLeave = () => {
            mouseConstraint.mouse.button = -1
        }
        document.body.addEventListener('mouseleave', handleWindowMouseLeave)

        // 6. Runner
        const runner = Runner.create()
        runnerRef.current = runner
        Runner.run(runner, engine)

        // 7. Sync Loop
        // We use an internal loop or Matter's update event to trigger a React render? 
        // No, forcing React render on every frame is bad. 
        // We will update the DOM elements directly via ref in a requestAnimationFrame loop.

        let animationFrameId

        const updateLoop = () => {
            skillsData.forEach((_, index) => {
                const body = bodiesRef.current[index]
                const element = document.getElementById(`skill-item-${index}`)

                if (body && element) {
                    const { x, y } = body.position
                    const angle = body.angle

                    // Update DOM position
                    // We need to offset by center because Matter.js positions are center-based, 
                    // but standard absolute positioning is top-left.
                    // However, we can use translate3d(-50%, -50%, 0) in CSS to handle center origin.
                    element.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`
                }
            })
            animationFrameId = requestAnimationFrame(updateLoop)
        }

        updateLoop()
        setIsLoaded(true)

        // Cleanup
        return () => {
            document.body.removeEventListener('mouseleave', handleWindowMouseLeave)
            if (runnerRef.current) Runner.stop(runnerRef.current)
            if (engineRef.current) Engine.clear(engineRef.current)
            if (animationFrameId) cancelAnimationFrame(animationFrameId)
            Composite.clear(world)
            Engine.clear(engine)
        }
    }, [])

    return (
        <div className='w-full bg-black relative pb-10'>
            <div className='relative h-[300px] sm:h-[400px] lg:h-[600px] w-full my-24 px-10 py-12 z-20'>
                <TextPressure
                    text="SKILL SET"
                    flex={true}
                    alpha={false}
                    stroke={false}
                    width={true}
                    weight={true}
                    italic={true}
                    textColor="#ffffff"
                    minFontSize={36}
                />
            </div>

            {/* Canvas Container for Physics */}
            <div
                ref={containerRef}
                className='relative w-full h-[600px] overflow-hidden bg-black/50 cursor-grab active:cursor-grabbing border-t border-white/10'
            >
                {/* Instruction Text Removed */}

                {isLoaded && skillsData.map((skill, index) => (
                    <div
                        key={index}
                        id={`skill-item-${index}`}
                        className='absolute top-0 left-0 w-[100px] h-[100px] rounded-xl bg-gray-900 border border-white/10 shadow-[0_0_15px_rgba(249,212,35,0.1)] flex items-center justify-center select-none will-change-transform pointer-events-none'
                        style={{
                            // Initial transform to hide until physics kicks in
                            transform: 'translate(-999px, -999px)',
                            // Crucial: center the origin so physics rotation works
                            marginTop: '-50px',
                            marginLeft: '-50px'
                        }}
                    >
                        <img
                            src={skill.src}
                            alt={skill.alt}
                            className='w-16 h-16 object-contain'
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Skills
