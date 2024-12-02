import { FC, MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
    className?: string;
    icon?: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    text?: string;
    disabled?: boolean;
}

const Button: FC<ButtonProps> = ({ className = "", icon, onClick, text, disabled = false }) => {
    return (
        <button
            onClick={disabled ? undefined : onClick}
            className={`h-10 flex items-center gap-2 text-white px-4 py-2 rounded-md shadow ${
                disabled ? "" : "hover:opacity-80"
            } transition justify-center ${disabled ? "bg-gray-500 opacity-50 cursor-not-allowed" : ""} ${className}`}
            disabled={disabled}
        >
            {icon}
            {text && <span>{text}</span>}
        </button>
    );
};

export default Button;
