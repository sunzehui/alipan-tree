interface IStorage {
  set<T>(key: string, value: T): void;
  get<T>(key: string): T | null;
  remove(key: string): void;
  clear(): void;
}

export const Storage: IStorage = {
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  remove(key: string): void {
    localStorage.removeItem(key);
  },
  clear(): void {
    localStorage.clear();
  }
};
