import React from 'react';
import { motion } from 'framer-motion';

const MenuButton = ({ isOpen, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 text-white focus:outline-none group"
        >
            <div className="flex flex-col gap-1.5 w-6 relative justify-center items-center h-4">
                {/* Top Line */}
                <motion.span
                    animate={isOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
                    className="w-6 h-0.5 bg-white origin-center"
                />
                {/* Bottom Line */}
                <motion.span
                    animate={isOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
                    className="w-6 h-0.5 bg-white origin-center"
                />
            </div>
            <span className="text-sm font-medium uppercase tracking-wider group-hover:text-[#F9D423] transition-colors">
                {isOpen ? 'Close' : 'Menu'}
            </span>
        </button>
    );
};

export default MenuButton;
