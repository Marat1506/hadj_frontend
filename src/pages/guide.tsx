import React, { useState, useEffect } from 'react';
import Head from 'next/head';

interface Category {
  id: number;
  title: string;
  iconUrl?: string;
}

interface Subcategory {
  id: number;
  title: string;
  description?: string;
  image?: string;
  categoryId: number;
}

interface GuideContent {
  id: number;
  title: string;
  description: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video';
  categoryId: number;
  subcategoryId: number;
  category: Category;
  subcategory: Subcategory;
}

const GuidePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [content, setContent] = useState<GuideContent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
      setSelectedSubcategory(null);
      setContent([]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSubcategory) {
      fetchContent(selectedSubcategory);
    }
  }, [selectedSubcategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/guide/categories`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async (categoryId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/guide/categories/${categoryId}/subcategories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSubcategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ошибка при загрузке подкатегорий:', error);
      setSubcategories([]);
    }
  };

  const fetchContent = async (subcategoryId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/guide/subcategories/${subcategoryId}/content`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setContent(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ошибка при загрузке контента:', error);
      setContent([]);
    }
  };

  const getMediaUrl = (url?: string) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Гид паломника - NHK</title>
        <meta name="description" content="Полезная информация для паломников" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Гид паломника
          </h1>

          {/* Навигация */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubcategory(null);
                  setContent([]);
                }}
                className="hover:text-blue-600 transition-colors"
              >
                Главная
              </button>
              {selectedCategory && (
                <>
                  <span>→</span>
                  <button
                    onClick={() => {
                      setSelectedSubcategory(null);
                      setContent([]);
                    }}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {categories.find(c => c.id === selectedCategory)?.title}
                  </button>
                </>
              )}
              {selectedSubcategory && (
                <>
                  <span>→</span>
                  <span className="text-gray-800">
                    {subcategories.find(s => s.id === selectedSubcategory)?.title}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Категории - показываем только если ничего не выбрано */}
          {!selectedCategory && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Выберите категорию</h2>
              {!Array.isArray(categories) || categories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Категории не найдены или загружаются...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className="p-6 rounded-lg border-2 border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-200 min-h-[120px]"
                    >
                      <div className="flex flex-col items-center space-y-3">
                        {category.iconUrl && (
                          <img
                            src={getMediaUrl(category.iconUrl) || ''}
                            alt={category.title}
                            className="w-16 h-16 object-contain"
                          />
                        )}
                        <span className="text-base font-medium text-center leading-relaxed">{category.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Подкатегории - показываем только если выбрана категория, но не выбрана подкатегория */}
          {selectedCategory && !selectedSubcategory && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Выберите подкатегорию</h2>
              {subcategories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">В этой категории пока нет подкатегорий</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.isArray(subcategories) && subcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => setSelectedSubcategory(subcategory.id)}
                      className="p-6 rounded-lg border-2 border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg text-left transition-all duration-200"
                    >
                      <div className="space-y-3">
                        {subcategory.image && (
                          <img
                            src={getMediaUrl(subcategory.image) || ''}
                            alt={subcategory.title}
                            className="w-full h-40 object-cover rounded"
                          />
                        )}
                        <h3 className="font-semibold text-gray-800 text-lg">{subcategory.title}</h3>
                        {subcategory.description && (
                          <p className="text-sm text-gray-600 leading-relaxed">{subcategory.description}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Контент - показываем только если выбрана подкатегория */}
          {selectedSubcategory && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Материалы</h2>
              {content.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">В этой подкатегории пока нет материалов</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.isArray(content) && content.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      {item.mediaUrl && (
                        <div className="aspect-video bg-gray-100">
                          {item.mediaType === 'image' ? (
                            <img
                              src={getMediaUrl(item.mediaUrl) || ''}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={getMediaUrl(item.mediaUrl) || ''}
                              controls
                              className="w-full h-full"
                            >
                              Ваш браузер не поддерживает видео.
                            </video>
                          )}
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">{item.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}


        </div>
      </main>
    </>
  );
};

export default GuidePage;