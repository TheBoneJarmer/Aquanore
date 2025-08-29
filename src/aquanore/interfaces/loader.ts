export interface ILoader<T> {
    load(path: string): Promise<T>;
}