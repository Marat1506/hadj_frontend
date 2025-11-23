import React, {useState} from 'react';

import http from '../services/http';

interface TestimonialFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({onClose, onSuccess}) => {
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const maxCharLimit = 195;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        if (!message.trim()) {
            setError('Пожалуйста, введите ваше сообщение.');
            setSubmitting(false);
            return;
        }
        if (message.length > maxCharLimit) {
            setError(`Сообщение не должно превышать ${maxCharLimit} символов.`);
            setSubmitting(false);
            return;
        }
        if (rating < 1 || rating > 5) {
            setError('Пожалуйста, выберите рейтинг от 1 до 5 звезд.');
            setSubmitting(false);
            return;
        }

        try {
            await http.post('/testimonials', {message, rating});
            onSuccess();
            onClose();
        } catch (err: any) {
            if (err.response && err.response.status === 401) {
                setError('Вы не авторизованы. Пожалуйста, войдите в систему.');
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Не удалось отправить отзыв. Пожалуйста, попробуйте еще раз.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= maxCharLimit) {
            setMessage(value);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-xl  mb-4">Оставить отзыв</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="message" className="block text-gray-700 text-sm  mb-2">
                            Ваш отзыв:
                            <span className={`text-xs font-normal ml-2 ${message.length > maxCharLimit ? 'text-red-500' : 'text-gray-500'}`}>
                {message.length}/{maxCharLimit}
              </span>
                        </label>
                        <textarea
                            id="message"
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none ${
                                message.length > maxCharLimit ? 'border-red-500' : ''
                            }`}
                            rows={4}
                            value={message}
                            onChange={handleMessageChange}
                            placeholder="Напишите ваш отзыв здесь (максимум 195 символов)..."
                            required
                        ></textarea>
                        {message.length > maxCharLimit * 0.7 && (
                            <p className={`text-xs mt-1 ${
                                message.length >= maxCharLimit ? 'text-red-500' :
                                    message.length > maxCharLimit * 0.9 ? 'text-amber-600' : 'text-gray-500'
                            }`}>
                                {maxCharLimit - message.length} символов осталось
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm  mb-2">Рейтинг:</label>
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`cursor-pointer text-2xl ${rating >= star ? 'text-amber-400' : 'text-gray-300'}`}
                                    onClick={() => setRating(star)}
                                >
                  ★
                </span>
                            ))}
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800  py-2 px-4 rounded"
                            disabled={submitting}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="brand-bg text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors hover:opacity-90"
                            disabled={submitting || message.length > maxCharLimit}
                        >
                            {submitting ? 'Отправка...' : 'Отправить отзыв'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TestimonialForm;
