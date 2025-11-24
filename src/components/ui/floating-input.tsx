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
        <div className="relative w-full">
            <input
                type={type}
                value={value}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`peer w-full bg-transparent text-sm font-medium outline-none transition-all pb-1
					${error ? 'border-b-2 border-red-500' : 'border-b border-gray-300 focus:border-b-2 focus:border-amber-500'}`}
                {...rest}
            />
            <label
                className={`
                    absolute left-0 text-sm transition-all duration-200 
					${isActive ? '-top-4 text-xs' : 'top-1/2 -translate-y-1/2'}
					${error ? 'text-red-500' : isActive ? 'text-amber-600' : 'text-gray-400'}
					pointer-events-none
				`}
            >
                {label}
            </label>
            {error && (
                <span className="absolute -bottom-5 left-0 text-xs text-red-500">Это поле обязательно</span>
            )}
        </div>
    );
};

export default FloatingInput;
