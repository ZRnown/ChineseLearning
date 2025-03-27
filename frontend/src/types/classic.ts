export interface Classic {
    id: number;
    title: string;
    author: string;
    dynasty: string;
    content: string;
    translation?: string;
    created_at: string;
    updated_at?: string;
    is_favorite?: boolean;
    is_liked?: boolean;
}

export interface Translation {
    id: number;
    classic_id: number;
    content: string;
    language: string;
    created_at: string;
} 