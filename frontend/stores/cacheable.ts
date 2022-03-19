const CACHE_NAME = 'crm-cache';

export async function cacheable<T>(
    fn: () => Promise<T>,
    key: string,
    defaultValue: T,
) {
    let result;
    try {
        result = await fn();
        const cache = getCache();
        cache[key] = result;
        localStorage.setItem(CACHE_NAME, JSON.stringify(cache));
    } catch {
        const cache = getCache();
        const cached = cache[key];
        result = result = cached === undefined ? defaultValue : cached;
    }

    return result;
}

function getCache(): any {
    const cache = localStorage.getItem(CACHE_NAME) || '{}';
    return JSON.parse(cache);
}

export function clearCache() {
    localStorage.removeItem(CACHE_NAME);
}