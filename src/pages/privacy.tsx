import React from 'react';

export default function Privacy() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Политика конфиденциальности</h1>
            
            <div className="prose prose-gray max-w-none space-y-6">
                <section>
                    <h2 className="text-2xl font-semibold mb-4">1. Общие положения</h2>
                    <p className="text-gray-700">
                        Настоящая Политика конфиденциальности определяет порядок обработки и защиты 
                        персональных данных пользователей сайта ООО «Национальная Хадж Компания».
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">2. Собираемая информация</h2>
                    <p className="text-gray-700">
                        Мы собираем следующую информацию:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>ФИО и контактные данные</li>
                        <li>Паспортные данные</li>
                        <li>Медицинская информация</li>
                        <li>Платежная информация</li>
                        <li>История бронирований</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">3. Использование информации</h2>
                    <p className="text-gray-700">
                        Собранная информация используется для:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Оформления виз и документов</li>
                        <li>Бронирования туров</li>
                        <li>Связи с клиентами</li>
                        <li>Улучшения качества услуг</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">4. Защита данных</h2>
                    <p className="text-gray-700">
                        Мы применяем современные технологии защиты данных, включая шифрование 
                        и безопасное хранение информации.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">5. Права пользователей</h2>
                    <p className="text-gray-700">
                        Вы имеете право на доступ, исправление и удаление своих персональных данных. 
                        Для этого свяжитесь с нами по email: NXK@mail.com
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
                    <p className="text-gray-700">
                        Мы используем cookies для улучшения работы сайта и персонализации контента.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">7. Контактная информация</h2>
                    <p className="text-gray-700">
                        По вопросам обработки персональных данных обращайтесь:<br />
                        Email: NXK@mail.com<br />
                        Телефон: +7(928) 100 100 1
                    </p>
                </section>
            </div>
        </div>
    );
}
