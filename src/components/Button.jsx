import React from "react";

const Button = ({ className, icon, onClick, text }) => {
    return (
        <button
            onClick={onClick}
            className={`h-10 flex items-center gap-2 text-white px-4 py-2 rounded-md shadow hover:opacity-80 transition justify-center ${className}`}
        >
            {icon}
            {text && <span>{text}</span>}
        </button>
    );
};

export default Button;
