import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';

interface Classic {
    id: number;
    title: string;
    author: string;
    dynasty: string;
    category: string;
    description: string;
    cover_image?: string;
    is_favorite: boolean;
}

export default function Favorites() {
    const [favorites, setFavorites] = useState<Classic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/favorites', {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('获取收藏列表失败');
            }
            const data = await response.json();
            setFavorites(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : '获取收藏列表失败');
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (classicId: number) => {
        try {
            const response = await fetch(`http://localhost:8000/api/classics/${classicId}/favorite`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('操作失败');
            }
            // 从收藏列表中移除
            setFavorites(favorites.filter(classic => classic.id !== classicId));
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-600 text-center">
                    <p className="text-lg font-medium">{error}</p>
                    <button
                        onClick={fetchFavorites}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        重试
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">我的收藏</h1>
                <p className="text-gray-600">
                    共收藏 {favorites.length} 本古籍
                </p>
            </div>

            {favorites.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">您还没有收藏任何古籍</p>
                    <Link
                        to="/classics"
                        className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        浏览古籍
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((classic) => (
                        <div
                            key={classic.id}
                            className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                            <Link to={`/classics/${classic.id}`} className="block">
                                <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative">
                                    {classic.cover_image ? (
                                        <img
                                            src={classic.cover_image}
                                            alt={classic.title}
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full bg-gray-100">
                                            <span className="text-gray-400 text-4xl">
                                                {classic.title[0]}
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <FavoriteButton
                                            isFavorite={true}
                                            onToggle={() => toggleFavorite(classic.id)}
                                        />
                                    </div>
                                </div>
                            </Link>
                            <div className="p-4">
                                <Link to={`/classics/${classic.id}`}>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                                        {classic.title}
                                    </h3>
                                </Link>
                                <p className="text-sm text-gray-600 mb-2">
                                    {classic.dynasty} · {classic.author}
                                </p>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {classic.description}
                                </p>
                                <div className="mt-4">
                                    <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                        {classic.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 