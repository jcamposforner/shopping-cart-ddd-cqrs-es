export default class HashMap<K, V> extends Map<K, V> {
    getOrElse(key: K, defaultValue: V): V {
        if (this.has(key)) {
            return this.get(key);
        }

        return defaultValue;
    }

    getOrThrow(key: K, exception: Error): V {
        if (this.has(key)) {
            return this.get(key);
        }

        throw exception;
    }
}