export interface Classic {
    id: string;
    title: string;
    author: string;
    dynasty: string;
    content: string;
    likes?: number;
    category?: string;
    explanation?: string;
    translation?: string;
}

export interface Translation {
    id: string;
    classicId: string;
    content: string;
    language: string;
    translator: string;
    createdAt: string;
} 