import React from 'react';

interface DateInputProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    error?: boolean | string;
}

const DateInput: React.FC<DateInputProps> = ({
                                                 placeholder = 'Выберите дату',
                                                 value,
                                                 onChange,
                                                 className = '',
                                                 error
                                             }) => {
    return (
        <div className={`relative flex flex-col gap-1 ${className}`}>
            {/* Label */}
            <label className={`text-sm font-medium ${error ? 'text-red-500' : 'text-gray-700'}`}>
                {placeholder}
            </label>

            <input
                type="date"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className={`w-full px-3 py-2 text-base text-gray-900 bg-white border rounded-lg outline-none transition-colors ${
                    error ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-500'
                }`}
            />
            
            {error && (
                <span className="text-xs text-red-500">
                    {typeof error === 'string' ? error : 'Это поле обязательно'}
                </span>
            )}
        </div>
    );
};

export default DateInput;
