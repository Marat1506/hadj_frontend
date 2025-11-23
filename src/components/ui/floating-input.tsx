'use client';
import React, {FocusEvent, useState} from 'react';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: boolean;
}

const FloatingInput: React.FC<FloatingInputProps> = ({label, error, value, onChange, type = 'text', ...rest}) => {
    const [focused, setFocused] = useState(false);

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => setFocused(true);
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => setFocused(false);

    const isActive = focused || (value && String(value).trim() !== '');

    return (
        <div className="relative w-full max-w-[60%]">
            <input
                type={type}
                value={value}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`peer w-full bg-transparent text-sm font-medium outline-none transition-all
					${error ? 'border-red-400' : 'focus:border-amber-500'}`}
                {...rest}
            />
            <label
                className={`
                    absolute left-0 text-gray-400 text-sm transition-all duration-200 
					${isActive ? '-top-3 text-xs text-amber-600' : 'top-1/2 -translate-y-1/2 text-gray-400'}
					${error ? 'text-red-400' : ''}
					pointer-events-none
				`}
            >
                {label}
            </label>
        </div>
    );
};

export default FloatingInput;
