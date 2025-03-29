import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AIDuide from '../components/AIDuide';

const BookDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [language, setLanguage] = useState<string>('中文'); // 假设默认语言为中文

    useEffect(() => {
        const fetchBookDetail = async () => {
            // ...existing code...
        };

        fetchBookDetail();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h2>{book.title}</h2>
            <p>作者: {book.author}</p>
            <p>内容: {book.content}</p>

            {/* AI导读组件 */}
            <AIDuide text={book.content} language={language} />
        </div>
    );
};

export default BookDetail;
