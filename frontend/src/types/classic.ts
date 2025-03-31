export interface Tag {
    id: number;
    name: string;
}

export interface Translation {
    id: number;
    classic_id: number;
    content: string;
    translator?: string;
    language: string;
    created_at: string;
}

export interface Classic {
    id: number;
    title: string;
    content: string;
    author?: string;
    dynasty?: string;
    category?: string;
    source?: string;
    created_at: string;
    updated_at: string;
    translations: Translation[];
    tags: Tag[];
} 