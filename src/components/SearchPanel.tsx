'use client';

import React, {useState} from 'react';
import {Button} from './ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from './ui/select';
import {Calendar} from '@/components/ui/calendar';
import {Input} from '@/components/ui/input';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';
import clsx from 'clsx';

const cities = ['Москва, Россия', 'Махачкала, Россия', 'Медина, Саудовская Аравия', 'Дубай, ОАЭ', 'Каир, Египет', 'Стамбул, Турция', 'Баку, Азербайджан'];
const classes = ['Эконом', 'Стандарт', 'Люкс'];

interface Props {
    onApply: (f: any) => void;
    dates: any;
    hideDate?: boolean;
}

const SearchPanel: React.FC<Props> = ({onApply, dates, hideDate}) => {
    const [from, setFrom] = useState('');
    const [search, setSearch] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
    const [flightClass, setFlightClass] = useState('');

    const formattedRange =
        dateRange?.from && dateRange?.to
            ? `${format(dateRange.from, 'dd-MM-yyyy')} - ${format(dateRange.to, 'dd-MM-yyyy')}`
            : '';

    // фильтруем города
    const filteredCities =
        search.trim() === ''
            ? cities.slice(0, 5) // первые 5 городов при пустом вводе
            : cities.filter((city) => city.toLowerCase().includes(search.toLowerCase()));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        setShowSuggestions(true);
    };

    const handleSelectCity = (city: string) => {
        setFrom(city);
        setSearch(city);
        setShowSuggestions(false);
    };

    const handleFocus = () => {
        setShowSuggestions(true);
    };

    const handleBlur = () => {
        // задержка, чтобы успел сработать клик по элементу списка
        setTimeout(() => setShowSuggestions(false), 150);
    };

    return (
        <div className="flex justify-center w-full">
            <div className="bg-white rounded-2xl flex flex-col md:flex-row gap-3 w-full md:w-auto p-3 items-end">
                {/* Город отправления */}
                <div className="relative w-full md:w-[200px]">
                    <Input
                        value={search}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder="Москва"
                        className="h-14 rounded-xl border border-gray-300 font-medium text-gray-700 text-base focus-visible:outline-none"
                    />

                    {showSuggestions && (
                        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-xl mt-1 shadow-md z-10 max-h-48 overflow-y-auto">
                            {filteredCities.length > 0 ? (
                                filteredCities.map((city) => (
                                    <div
                                        key={city}
                                        onMouseDown={() => handleSelectCity(city)} // важно: onMouseDown вместо onClick
                                        className="px-3 py-2 hover:bg-[#04225310] cursor-pointer transition-colors rounded-lg"
                                    >
                                        {city}
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-400 text-sm text-center py-2">Город не найден</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Календарь выбора диапазона дат */}
                {!hideDate && (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full md:w-[200px] h-14 hover:bg-[#042253] focus:bg-[#042253] rounded-xl border border-gray-300 text-base font-medium text-gray-700 justify-start text-left font-normal"
                            >
                                {formattedRange || 'Выбрать даты'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-auto p-0 shadow-lg rounded-xl border border-gray-200"
                            align="start"
                        >
                            <Calendar
                                mode="range"
                                // @ts-ignore
                                selected={dateRange}
                                onSelect={(range: any) => setDateRange(range)}
                                locale={ru}
                                numberOfMonths={2}
                                classNames={{
                                    months: 'flex flex-col sm:flex-row gap-4 p-4',
                                    month: 'space-y-4',
                                    table: 'w-full border-collapse space-y-1',
                                    head_row: 'flex justify-between mb-1',
                                    head_cell: 'text-gray-500 font-medium text-sm w-9 text-center',
                                    row: 'flex justify-between w-full mt-1',
                                    nav: 'absolute top-2 flex justify-between w-full px-6',
                                    nav_button: clsx(
                                        'w-8 h-8 flex items-center justify-center rounded-full border border-[#04225330] text-[#042253]',
                                        'hover:bg-[#04225310] hover:text-[#042253] transition-colors'
                                    ),
                                    cell: clsx(
                                        'relative p-0 text-center w-9 h-9 text-sm rounded-lg transition-colors duration-150 cursor-pointer select-none',
                                        'hover:bg-[#04225310] focus:bg-[#04225320]'
                                    ),
                                    day: 'flex items-center justify-center w-9 h-9 rounded-lg',
                                    day_selected: 'bg-[#042253] text-white hover:bg-[#042253] hover:text-white',
                                    day_range_start: 'bg-[#042253] text-white rounded-l-lg',
                                    day_range_middle: 'bg-[#04225320] text-[#042253] rounded-none',
                                    day_range_end: 'bg-[#042253] text-white rounded-r-lg',
                                    day_today: 'border border-[#042253]',
                                    day_outside: 'text-gray-300 opacity-50',
                                    day_disabled: 'text-gray-400 opacity-40 cursor-not-allowed',
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                )}

                {/* Класс перелёта */}
                <Select value={flightClass} onValueChange={setFlightClass}>
                    <SelectTrigger className="w-full md:w-[160px] h-14 rounded-xl border border-gray-300 text-base font-medium text-gray-700 bg-white">
                        <SelectValue placeholder="Люкс"/>
                    </SelectTrigger>
                    <SelectContent>
                        {classes.map((cls) => (
                            <SelectItem key={cls} value={cls} className="hover:bg-[#04225310] cursor-pointer">
                                {cls}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Кнопка */}
                <Button
                    onClick={() => onApply({
                        from,
                        dateRange: formattedRange,
                        flightClass,
                        // @ts-ignore
                        date: dateRange?.from && dateRange?.to 
                            ? [format(dateRange.from, 'yyyy-MM-dd'), format(dateRange.to, 'yyyy-MM-dd')]
                            : [null, null]
                    })}
                    className="w-full md:w-[180px] h-14 rounded-full text-base font-semibold"
                    style={{backgroundColor: '#042253', color: 'white'}}
                    type="button"
                >
                    Найти
                </Button>
            </div>
        </div>
    );
};

export default SearchPanel;
