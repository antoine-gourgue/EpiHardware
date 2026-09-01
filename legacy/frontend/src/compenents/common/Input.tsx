import React from 'react';

interface InputProps {
    type: 'text' | 'password' | 'email' | 'number';
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

const Input: React.FC<InputProps> = ({ type, placeholder, value, onChange, className }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`border rounded py-2 px-3 text-grey-darker ${className}`}
        />
    );
};

export default Input;
