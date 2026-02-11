import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = "px-8 py-4 rounded-xl font-medium transition-all duration-300 transform active:scale-95 border border-dark text-lg";

    const variants = {
        primary: "bg-[#0047AB] text-white hover:bg-white hover:text-black",
        dark: "bg-black text-white hover:bg-[#0047AB] hover:text-white",
        outline: "bg-transparent text-black border-black hover:bg-[#0047AB] hover:text-white",
    };

    // Adjusted colors to match user's theme (Blue #0047AB)

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
