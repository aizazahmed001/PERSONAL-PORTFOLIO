import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Instagram, Send, Mail, Phone } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const Footer = () => {
  const textRef = useRef(null);
  const [formData, setFormData] = useState({
    email: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);

  // Mouse tracking for interactive text
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = textRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Map mouse coordinates to text movement
  const x = useTransform(mouseX, [-200, 200], [-20, 20]);
  const y = useTransform(mouseY, [-200, 200], [-20, 20]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);

    const { email, message } = formData;
    const subject = `Contact from Portfolio - ${email}`;
    const body = `From: ${email}\n\nMessage:\n${message}`;

    // Simulate sending time for animation
    setTimeout(() => {
      // Construct mailto link
      const mailtoLink = `mailto:aizazahmed098@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Open default email client
      window.location.href = mailtoLink;

      setIsSending(false);
      setFormData({ email: '', message: '' });
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <footer className="bg-black text-white rounded-t-[45px] mx-4 sm:mx-6 lg:mx-8 mb-8 pb-8 pt-12 sm:pt-16 px-6 sm:px-12 lg:px-16 mt-20 overflow-hidden relative">
      {/* Big Typography Reveal */}
      <div
        className="w-full mb-12 overflow-visible flex justify-center pb-0 cursor-default"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative inline-block">
          {'GET IN TOUCH'.split('').map((char, index) => {
            const isSpace = char === ' ';
            return (
              <motion.span
                key={index}
                className="inline-block text-[13vw] leading-[0.8] font-bold text-center select-none"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  letterSpacing: '0.05em',
                  color: '#ffffff',
                  opacity: 0.2,
                }}
                animate={{
                  y: mouseY.get() !== 0 ? Math.sin((index * 0.5) + (mouseX.get() * 0.01)) * 15 : 0,
                  scale: mouseY.get() !== 0 ? 1 + (Math.abs(Math.sin((index * 0.3) + (mouseX.get() * 0.008))) * 0.15) : 1,
                  rotateZ: mouseY.get() !== 0 ? Math.sin((index * 0.4) + (mouseX.get() * 0.01)) * 5 : 0,
                  opacity: mouseY.get() !== 0 ? 0.2 + (Math.abs(Math.sin((index * 0.3) + (mouseX.get() * 0.008))) * 0.2) : 0.2,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  mass: 0.5,
                }}
                whileHover={{
                  scale: 1.2,
                  opacity: 0.5,
                  color: '#F9D423',
                  transition: { duration: 0.2 }
                }}
              >
                {isSpace ? '\u00A0' : char}
              </motion.span>
            );
          })}
        </div>
      </div>

      {/* Top Part: Logo & Nav */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12 sm:mb-16">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#F9D423] to-[#aacc00] animate-gradient bg-clip-text text-transparent">Aizaz Ahmed</span>
        </div>

        <nav className="flex flex-wrap justify-center gap-6 sm:gap-10">
          {['Home', 'About', 'Certificates', 'Projects'].map((item) => (
            <Link
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              className="text-lg relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-[#aacc00] after:transition-all after:duration-300 hover:after:w-full"
            >
              {item}
            </Link>
          ))}
        </nav>
      </div>

      {/* Middle Part: Contact & Form */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-12">
        <div className="flex flex-col gap-4 text-center lg:text-left w-full lg:w-1/3">
          <h4 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">Contact Me</h4>
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-10 h-10 rounded-full bg-[#191919] flex items-center justify-center text-[#F9D423]">
                <Mail size={20} />
              </div>
              <p className="text-lg">aizazahmed098@gmail.com</p>
            </div>
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-10 h-10 rounded-full bg-[#191919] flex items-center justify-center text-[#F9D423]">
                <Phone size={20} />
              </div>
              <p className="text-lg">+92-300-8925097</p>
            </div>

            <div className="flex gap-4 justify-center lg:justify-start mt-2">
              <a href="https://www.linkedin.com/in/aizazahmed098" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white text-[#0077B5] rounded-full flex items-center justify-center hover:bg-[#0077B5] hover:text-white transition-all transform hover:scale-110 active:scale-95 duration-300">
                <Linkedin size={20} fill="currentColor" className="opacity-90" />
              </a>
              <a href="https://wa.me/923008925097" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white text-[#25D366] rounded-full flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all transform hover:scale-110 active:scale-95 duration-300">
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/aizazofficial_01/" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white text-[#E1306C] rounded-full flex items-center justify-center hover:bg-[#E1306C] hover:text-white transition-all transform hover:scale-110 active:scale-95 duration-300">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full lg:w-2/3 flex flex-col gap-4">
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-4 rounded-xl border border-white/20 bg-transparent text-white placeholder-white/60 focus:outline-none focus:border-[#aacc00] transition-colors"
          />
          <textarea
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="Type Your Message"
            rows="4"
            className="w-full p-4 rounded-xl border border-white/20 bg-transparent text-white placeholder-white/60 focus:outline-none focus:border-[#aacc00] transition-colors resize-none"
          />
          <button
            type="submit"
            disabled={isSending}
            className="w-full relative group flex items-center justify-center gap-3 py-4 rounded-full text-lg font-bold border-2 border-transparent hover:border-[#F9D423] text-black hover:text-[#F9D423] transition-all duration-300 shadow-[0_0_20px_rgba(170,204,0,0.3)] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
          >
            {/* Animated Gradient Background */}
            <span className="absolute inset-0 bg-gradient-to-r from-[#F9D423] to-[#aacc00] animate-gradient opacity-100 group-hover:opacity-0 transition-opacity duration-300"></span>

            {/* Button Content */}
            <span className="relative z-10 flex items-center gap-3">
              {isSending ? 'Sending...' : 'Submit'}
              <Send
                size={20}
                className={`transition-all duration-500 ${isSending ? 'translate-x-[50px] -translate-y-[50px] opacity-0' : 'group-hover:translate-x-1'}`}
              />
            </span>
          </button>
        </form>
      </div>

      {/* Bottom Part: Copyright */}
      <div className="border-t border-white/20 pt-8 flex flex-col sm:flex-row gap-8 items-center justify-between text-white/50 z-10 relative">
        <p>© 2026 Aizaz Ahmed. All Rights Reserved.</p>
        <div className="flex gap-4">
          <span className="hover:text-white transition-colors">Designed & Developed by Aizaz Ahmed</span>
        </div>
      </div>


    </footer>
  );
};

export default Footer;
