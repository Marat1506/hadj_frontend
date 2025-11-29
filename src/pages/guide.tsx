import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PageHeader from '@/components/PageHeader';
import { GridSkeleton } from '@/components/ui/loading-skeletons';

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
  article?: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video';
  categoryId: number;
  subcategoryId: number;
  category: Category;
  subcategory: Subcategory;
}

const GuidePage: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [content, setContent] = useState<GuideContent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  const [selectedContent, setSelectedContent] = useState<GuideContent | null>(null);
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

  const handleBackClick = () => {
    if (selectedContent) {
      setSelectedContent(null);
    } else if (selectedSubcategory) {
      setSelectedSubcategory(null);
      setContent([]);
    } else if (selectedCategory) {
      setSelectedCategory(null);
      setSubcategories([]);
    } else {
      router.push('/');
    }
  };

  const handleContentClick = (item: GuideContent) => {
    setSelectedContent(item);
  };

  return (
    <>
      <Head>
        <title>Гид паломника - NHK</title>
        <meta name="description" content="Полезная информация для паломников" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div>
          <PageHeader title="Гид паломника" onBack={handleBackClick} />

          {loading && <GridSkeleton count={8} />}

          {/* Категории - показываем только если ничего не выбрано */}
          {!selectedCategory && !loading && (
            <div className="mb-8">
              {!Array.isArray(categories) || categories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Категории не найдены</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className="p-6 rounded-lg hover:shadow-lg transition-all duration-200 min-h-[120px] relative"
                      style={{
                        background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #052E70 0%, #042253 100%) border-box',
                        border: '1px solid transparent'
                      }}
                    >
                      <div 
                        className="absolute inset-0 rounded-lg pointer-events-none"
                        style={{
                          background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), linear-gradient(0deg, rgba(0, 91, 254, 0.07), rgba(0, 91, 254, 0.07)), linear-gradient(0deg, rgba(14, 54, 98, 0.01), rgba(14, 54, 98, 0.01))'
                        }}
                      />
                      <div className="flex flex-col items-center space-y-3 relative z-10">
                        <img
                          src={category.iconUrl ? (getMediaUrl(category.iconUrl) || '') : '/umolch.svg'}
                          alt={category.title}
                          className="w-16 h-16 object-contain"
                        />
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
              {subcategories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">В этой категории пока нет подкатегорий</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.isArray(subcategories) && subcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => setSelectedSubcategory(subcategory.id)}
                      className="p-6 rounded-lg hover:shadow-lg transition-all duration-200 min-h-[120px] relative"
                      style={{
                        background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #052E70 0%, #042253 100%) border-box',
                        border: '1px solid transparent'
                      }}
                    >
                      <div 
                        className="absolute inset-0 rounded-lg pointer-events-none"
                        style={{
                          background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), linear-gradient(0deg, rgba(0, 91, 254, 0.07), rgba(0, 91, 254, 0.07)), linear-gradient(0deg, rgba(14, 54, 98, 0.01), rgba(14, 54, 98, 0.01))'
                        }}
                      />
                      <div className="flex flex-col items-center space-y-3 relative z-10">
                        <img
                          src={subcategory.image ? (getMediaUrl(subcategory.image) || '') : '/umolch.svg'}
                          alt={subcategory.title}
                          className="w-16 h-16 object-contain"
                        />
                        <span className="text-base font-medium text-center leading-relaxed">{subcategory.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Контент - показываем только если выбрана подкатегория и не выбран конкретный контент */}
          {selectedSubcategory && !selectedContent && (
            <div className="mb-8">
              {content.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">В этой подкатегории пока нет материалов</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.isArray(content) && content.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleContentClick(item)}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200 text-left"
                    >
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
                              className="w-full h-full object-cover pointer-events-none"
                            >
                              Ваш браузер не поддерживает видео.
                            </video>
                          )}
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">{item.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                        {item.article && (
                          <span className="text-blue-600 text-sm mt-2 inline-block">Читать далее →</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Полная статья - показываем когда выбран конкретный контент */}
          {selectedContent && (
            <div className="mb-8">
              <article className="bg-white rounded-lg shadow-md overflow-hidden">
                {selectedContent.mediaUrl && (
                  <div className="aspect-video bg-gray-100">
                    {selectedContent.mediaType === 'image' ? (
                      <img
                        src={getMediaUrl(selectedContent.mediaUrl) || ''}
                        alt={selectedContent.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={getMediaUrl(selectedContent.mediaUrl) || ''}
                        controls
                        className="w-full h-full"
                      >
                        Ваш браузер не поддерживает видео.
                      </video>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4 text-gray-900">{selectedContent.title}</h1>
                  <div className="prose prose-lg max-w-none">
                    {selectedContent.article ? (
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedContent.article}
                      </div>
                    ) : (
                      <p className="text-gray-600 leading-relaxed">{selectedContent.description}</p>
                    )}
                  </div>
                </div>
              </article>
            </div>
          )}


        </div>
      </main>
    </>
  );
};

export default GuidePage;