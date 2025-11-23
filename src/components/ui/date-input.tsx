import React from 'react';

interface DateInputProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    error?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({
                                                 placeholder = 'Выберите дату',
                                                 value,
                                                 onChange,
                                                 className = '',
                                                 error
                                             }) => {
    return (
        <div className={`relative ${className}`}>
            {/* Кастомный placeholder */}
            {!value && (
                <span className={`w-[120px] pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 bg-[#fff] text-[14px] ${error ? 'text-red-500' : ''}`}>
          {placeholder}
        </span>
            )}

            <input
                type="date"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className="w-full text-base text-gray-900 bg-[#fff] outline-0"
            />
        </div>
    );
};

export default DateInput;
