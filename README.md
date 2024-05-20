# TScache

TScache is a simple in-memory caching library for Node.js, implemented in TypeScript. It supports setting time-to-live (TTL) for cache items, automatic expiration of items, and provides methods to add, retrieve, update, delete, and clear cache items.

## Features

-   In-memory caching
-   TTL support for automatic expiration of items
-   Periodic TTL checks for item expiration
-   Simple and easy-to-use API

## Installation

```bash
npm install @farbautie/tscache
```

## API

`constructor(ttlCheckInterval: number = 10000)` Creates an instance of Cache.

-   `ttlCheckInterval`: Interval (in milliseconds) at which the cache checks for expired items.

`set(key: string, value: CacheValue, ttl?: number): void`
Adds an item to the cache.

-   `key`: The key under which the value is stored.
-   `value`: The value to be stored.
-   `ttl`: Time-to-live (TTL) in milliseconds. If not provided, the item does not expire.

`get(key: string): CacheValue | null`
Retrieves an item from the cache.

-   `key`: The key of the item to retrieve.
    Returns the value associated with the key, or null if the item is not found or has expired.

`update(key: string, value: CacheValue, ttl?: number): boolean`
Updates an existing item in the cache.

-   `key`: The key of the item to update.
-   `value`: The new value to be stored.
-   `ttl`: New time-to-live (TTL) in milliseconds. If not provided, retains the original TTL.
-   Returns true if the item was updated, false if the item does not exist

`delete(key: string): void`
Deletes an item from the cache.

-   `key`: The key of the item to delete.

`clear(): void`
Clears all items from the cache.

`disconnect(): void`
Stops the TTL check interval, useful for cleaning up resources.

## Example

```typescript
/** const Cache = require('tscache) */
import Cache from 'tscache'

const cache = new Cache()

// Set data with a TTL of 5 seconds
cache.set('key1', { data: 'value1' }, 5000)

// Retrieve data before it expires
console.log(cache.get('key1')) // { data: 'value1' }

// Update data and extend TTL by another 5 seconds
cache.update('key1', { data: 'updatedValue1' }, 5000)
console.log(cache.get('key1')) // { data: 'updatedValue1' };

setTimeout(() => {
    // Attempt to retrieve data after it has expired
    console.log(cache.get('key1')) // null, data has been automatically deleted
    // Disconnect when cache is no longer needed
    cache.disconnect()
}, 11000)
```

License [MIT](https://github.com/farbautie/tscache/blob/main/LICENSE)
