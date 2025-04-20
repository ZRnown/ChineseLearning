interface Category {
    id: number;
    name: string;
    count: number;
}

interface FavoriteCategoryProps {
    categories: Category[];
    selectedCategory: number | null;
    onSelectCategory: (categoryId: number | null) => void;
}

export default function FavoriteCategory({
    categories,
    selectedCategory,
    onSelectCategory,
}: FavoriteCategoryProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">收藏分类</h3>
            <div className="space-y-2">
                <button
                    onClick={() => onSelectCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${selectedCategory === null
                            ? 'bg-green-50 text-green-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    全部收藏 ({categories.reduce((acc, cat) => acc + cat.count, 0)})
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onSelectCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                            ${selectedCategory === category.id
                                ? 'bg-green-50 text-green-600'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {category.name} ({category.count})
                    </button>
                ))}
            </div>
        </div>
    );
}