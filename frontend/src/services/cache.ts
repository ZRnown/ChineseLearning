interface CacheItem<T> {
    data: T;
    timestamp: number;
}

class Cache {
    private static instance: Cache;
    private cache: Map<string, CacheItem<any>>;
    private defaultTTL: number = 5 * 60 * 1000; // 5 minutes

    private constructor() {
        this.cache = new Map();
    }

    static getInstance(): Cache {
        if (!Cache.instance) {
            Cache.instance = new Cache();
        }
        return Cache.instance;
    }

    set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now() + ttl,
        });
    }

    get<T>(key: string): T | null {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() > item.timestamp) {
            this.cache.delete(key);
            return null;
        }

        return item.data as T;
    }

    clear(): void {
        this.cache.clear();
    }

    remove(key: string): void {
        this.cache.delete(key);
    }
}

export default Cache.getInstance(); 