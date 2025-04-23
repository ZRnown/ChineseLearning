import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
import { useAuth } from '../contexts/AuthContext';

interface Classic {
    id: number;
    title: string;
    author: string;
    dynasty: string;
    category: string;
    description: string;
    cover_image?: string;
    is_favorite?: boolean;
}

export default function Favorites() {
    const { user, favorites, toggleFavorite, getFavorites, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // 只有当AuthContext加载完成后再判断用户状态
        if (!authLoading) {
            if (!user) {
                // 如果未登录，重定向到登录页面
                navigate('/login');
                return;
            }
            fetchFavorites();
        }
    }, [user, navigate, authLoading]);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            await getFavorites();
        } catch (err) {
            setError(err instanceof Error ? err.message : '获取收藏列表失败');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = async (classic: Classic) => {
        try {
            await toggleFavorite(classic);
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
        }
    };

    // 显示全局加载状态 - 包括Auth加载和数据加载
    if (authLoading || loading) {
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
                            className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                        >
                            <div className="p-6 flex-grow flex flex-col relative">
                                <div className="absolute top-4 right-4">
                                    <FavoriteButton
                                        isFavorite={true}
                                        onToggle={() => handleToggleFavorite(classic)}
                                    />
                                </div>
                                
                                <Link to={`/classics/${classic.id}`} className="mb-4">
                                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors break-words leading-relaxed">
                                        {classic.title}
                                    </h3>
                                </Link>
                                
                                <div className="flex-grow">
                                    <p className="text-sm text-gray-600 mb-4">
                                        <span className="mr-1">{classic.dynasty}</span> · 
                                        <span className="ml-1 font-medium">{classic.author}</span>
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">
                                        {classic.description}
                                    </p>
                                </div>
                                
                                <div className="mt-auto">
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