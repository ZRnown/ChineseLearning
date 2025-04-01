import React from 'react';
import { Link } from 'react-router-dom';
import { Classic } from '../types/classic';

interface ClassicCardProps {
    classic: Classic;
}

export const ClassicCard: React.FC<ClassicCardProps> = ({ classic }) => {
    return (
        <Link
            to={`/classics/${classic.id}`}
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
            <h2 className="text-2xl font-bold mb-3 text-black tracking-wide hover:text-gray-800 transition-colors">
                {classic.title}
            </h2>
            <p className="text-gray-600 mb-2">
                {classic.author} · {classic.dynasty}
            </p>
            <p className="text-gray-700 line-clamp-3">{classic.content}</p>
            {classic.tags && classic.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {classic.tags.map((tag) => (
                        <span
                            key={tag.id}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>
            )}
        </Link>
    );
}; 