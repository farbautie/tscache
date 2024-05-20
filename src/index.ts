export type CacheValue = string | number | boolean | object

export type CacheData = {
    value: CacheValue
    expiration: number
}

export class Cache {
    private store: Map<string, CacheData>
    private minHeap: Array<{ key: string; expiration: number }>
    private ttlCheckInterval: NodeJS.Timeout

    /**
     * Creates an instance of Cache.
     * @param ttlCheckInterval - Interval (in milliseconds) at which the cache checks for expired items.
     */
    constructor(ttlCheckInterval: number = 10000) {
        this.store = new Map<string, CacheData>()
        this.minHeap = []
        this.ttlCheckInterval = setInterval(this.checkTTL.bind(this), ttlCheckInterval)
    }

    /**
     * Periodically checks for expired items in the cache and removes them.
     */
    private checkTTL(): void {
        const now = Date.now()
        while (this.minHeap.length > 0 && this.minHeap[0].expiration <= now) {
            const { key } = this.minHeap.shift()!
            this.store.delete(key)
        }
    }

    /**
     * Adds an item to the cache.
     * @param key - The key under which the value is stored.
     * @param value - The value to be stored.
     * @param ttl - Time-to-live (TTL) in milliseconds. If not provided, the item does not expire.
     */
    set(key: string, value: CacheValue, ttl?: number): void {
        const now = Date.now()
        const expiration = ttl ? now + ttl : Number.POSITIVE_INFINITY
        const data: CacheData = { value, expiration }
        this.store.set(key, data)
        this.minHeap.push({ key, expiration })
        this.minHeap.sort((a, b) => a.expiration - b.expiration)
    }

    /**
     * Retrieves an item from the cache.
     * @param key - The key of the item to retrieve.
     * @returns The value associated with the key, or null if the item is not found or has expired.
     */
    get(key: string): CacheValue | null {
        const data = this.store.get(key)
        if (data && (data.expiration === Number.POSITIVE_INFINITY || Date.now() <= data.expiration)) {
            return data.value
        }
        this.store.delete(key)
        return null
    }

    /**
     * Updates an existing item in the cache.
     * @param key - The key of the item to update.
     * @param value - The new value to be stored.
     * @param ttl - New time-to-live (TTL) in milliseconds. If not provided, retains the original TTL.
     * @returns True if the item was updated, false if the item does not exist.
     */
    update(key: string, value: CacheValue, ttl?: number): boolean {
        const data = this.store.get(key)
        if (!data) {
            return false
        }

        const now = Date.now()
        const expiration = ttl ? now + ttl : data.expiration
        const newData: CacheData = { value, expiration }
        this.store.set(key, newData)

        // Remove old expiration from minHeap and insert new one
        this.minHeap = this.minHeap.filter((item) => item.key !== key)
        this.minHeap.push({ key, expiration })
        this.minHeap.sort((a, b) => a.expiration - b.expiration)

        return true
    }

    /**
     * Deletes an item from the cache.
     * @param key - The key of the item to delete.
     */
    delete(key: string): void {
        this.store.delete(key)
    }

    /**
     * Clears all items from the cache.
     */
    clear(): void {
        this.store.clear()
        this.minHeap = []
    }

    /**
     * Stops the TTL check interval, useful for cleaning up resources.
     */
    disconnect(): void {
        clearInterval(this.ttlCheckInterval)
    }
}

export default Cache
