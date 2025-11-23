'use client';

import { useRouter } from 'next/navigation';

const NotFoundPage = () => {
  const router = useRouter();

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl  mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Упс! Страница не найдена</p>
          <button
              onClick={() => router.push('/')}
              className="text-blue-500 hover:text-blue-700 underline"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
  );
};

export default NotFoundPage;