enum CacheType {
  Local,
  Session
}

class Cache {
  storage: Storage | null = null

  constructor(type: CacheType) {
    if (typeof window !== 'undefined') {
      this.storage = type === CacheType.Local ? window.localStorage : window.sessionStorage
    }
  }

  setCache(key: string, value: unknown) {
    if (value) {
      this.storage?.setItem(key, JSON.stringify(value))
    }
  }

  getCache(key: string) {
    const value = this.storage?.getItem(key)
    if (value) {
      return JSON.parse(value)
    }
  }

  removeCache(key: string) {
    this.storage?.removeItem(key)
  }

  clear() {
    this.storage?.clear()
  }
}

const localCache = new Cache(CacheType.Local)

const sessionCache = new Cache(CacheType.Session)

export { localCache, sessionCache }
