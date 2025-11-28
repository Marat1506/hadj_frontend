import React from 'react';
import { useRouter } from 'next/navigation';
import { FaChevronLeft } from 'react-icons/fa';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  onBack, 
  showBackButton = true 
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/');
    }
  };

  return (
    <header className="flex items-center pb-4 mb-6 border-b border-gray-200">
      <div className="flex items-center">
        {showBackButton && (
          <button
            className="mr-3 text-blue-800 hover:text-blue-600 text-xl p-2 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center w-10 h-10"
            onClick={handleBack}
            aria-label="Назад"
          >
            <FaChevronLeft />
          </button>
        )}
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      </div>
    </header>
  );
};

export default PageHeader;
