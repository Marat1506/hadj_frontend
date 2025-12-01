'use client';

import React from 'react';

export default function Terms() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Условия использования</h1>
            
            <div className="prose prose-gray max-w-none space-y-6">
                <section>
                    <h2 className="text-2xl font-semibold mb-4">1. Общие положения</h2>
                    <p className="text-gray-700">
                        Настоящие Условия использования регулируют отношения между ООО «Национальная Хадж Компания» 
                        (далее — «Компания») и пользователями сайта (далее — «Пользователи»).
                    </p>
                    <p className="text-gray-700">
                        Используя наш сайт, вы соглашаетесь с настоящими Условиями использования.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">2. Услуги</h2>
                    <p className="text-gray-700">
                        Компания предоставляет услуги по организации паломнических туров (Умра и Хадж), 
                        включая бронирование, оформление документов и сопровождение.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">3. Регистрация и учетная запись</h2>
                    <p className="text-gray-700">
                        Для использования некоторых функций сайта требуется регистрация. 
                        Вы обязуетесь предоставлять точную и актуальную информацию.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">4. Ответственность</h2>
                    <p className="text-gray-700">
                        Компания не несет ответственности за действия третьих лиц, 
                        включая авиакомпании, отели и другие сервисы.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">5. Контактная информация</h2>
                    <p className="text-gray-700">
                        ООО «Национальная Хадж Компания»<br />
                        ИНН: 9710000000<br />
                        ОГРН: 5555<br />
                        Email: NXK@mail.com<br />
                        Телефон: +7(928) 100 100 1
                    </p>
                </section>
            </div>
        </div>
    );
}
