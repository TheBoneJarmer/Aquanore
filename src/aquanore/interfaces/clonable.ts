export interface IClonable<T> {
    /**
     * Generates a deep clone of this object
     */
    clone(): T;
}