import Cache from '../src/index'

describe('Cache', () => {
    let cache: Cache

    beforeEach(() => {
        cache = new Cache(1000) // Check TTL every second for tests
    })

    afterEach(() => {
        cache.disconnect()
    })

    test('should set and get an item', () => {
        cache.set('key1', 'value1', 5000)
        expect(cache.get('key1')).toBe('value1')
    })

    test('should return null for expired item', (done) => {
        cache.set('key2', 'value2', 100)
        setTimeout(() => {
            expect(cache.get('key2')).toBeNull()
            done()
        }, 200)
    })

    test('should delete an item', () => {
        cache.set('key3', 'value3')
        cache.delete('key3')
        expect(cache.get('key3')).toBeNull()
    })

    test('should clear all items', () => {
        cache.set('key4', 'value4')
        cache.set('key5', 'value5')
        cache.clear()
        expect(cache.get('key4')).toBeNull()
        expect(cache.get('key5')).toBeNull()
    })

    test('should update an item and reset TTL', () => {
        cache.set('key6', 'value6', 5000)
        expect(cache.update('key6', 'newValue6', 10000)).toBe(true)
        expect(cache.get('key6')).toBe('newValue6')
    })

    test('should not update non-existent item', () => {
        expect(cache.update('nonExistentKey', 'value')).toBe(false)
    })
})
