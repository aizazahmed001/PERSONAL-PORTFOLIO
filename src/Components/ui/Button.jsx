import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = "px-8 py-4 rounded-xl font-medium transition-all duration-300 transform active:scale-95 border border-dark text-lg";

    const variants = {
        primary: "bg-[#F9D423] text-black hover:bg-white",
        dark: "bg-black text-white hover:bg-[#F9D423] hover:text-black",
        outline: "bg-transparent text-black border-black hover:bg-[#F9D423]",
    };

    // Adjusted colors to match user's theme (Yellow #F9D423)

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
