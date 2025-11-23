import React, {useState} from 'react';

import {Button} from './ui/button';
import {Calendar} from './ui/calendar';
import {Select, SelectTrigger, SelectContent, SelectItem, SelectValue} from './ui/select';
import {Switch} from './ui/switch';

interface FilterPanelProps {
  onApply: (filters: any) => void;
}

const cities = ['Москва', 'Махачкала', 'Медина', 'Дубай'];
const classes = ['Эконом', 'Стандарт', 'Люкс'];
const leaders = [
  'Макс Басин',
  'Юсупов Шамиль',
  'Зуфар Халитдинов',
  'Мухаммад-Саидов А.',
];

const FilterPanel: React.FC<FilterPanelProps> = ({onApply}) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [dateRange, setDateRange] = useState<any>({from: undefined, to: undefined});
  const [direct, setDirect] = useState(false);
  const [flightClass, setFlightClass] = useState('');
  const [leader, setLeader] = useState('');
  const [promo, setPromo] = useState(false);

  return (
      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl p-6 mb-8">
        <h2 className="text-2xl mb-4">Фильтр</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Откуда вылет</label>
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger>
                <SelectValue placeholder="Выбрать"/>
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Куда</label>
            <Select value={to} onValueChange={setTo}>
              <SelectTrigger>
                <SelectValue placeholder="Выбрать"/>
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Дата вылета</label>
            <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
            />
            {dateRange.from && dateRange.to && (
                <div className="text-xs text-gray-500 mt-1">
                  {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Только прямой рейс</span>
            <Switch checked={direct} onCheckedChange={setDirect}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Класс</label>
            <Select value={flightClass} onValueChange={setFlightClass}>
              <SelectTrigger>
                <SelectValue placeholder="Выбрать"/>
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Руководитель</label>
            <Select value={leader} onValueChange={setLeader}>
              <SelectTrigger>
                <SelectValue placeholder="Выбрать"/>
              </SelectTrigger>
              <SelectContent>
                {leaders.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">На акции</span>
            <Switch checked={promo} onCheckedChange={setPromo}/>
          </div>
        </div>
        <Button
            className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white text-base py-3"
            onClick={() => onApply({from, to, dateRange, direct, flightClass, leader, promo})}
        >
          Применить фильтр
        </Button>
      </div>
  );
};

export default FilterPanel;