import { CacheTTL, CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";


@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    async get(key: string) {
        return await this.cacheManager.get(key);
    }

    async set(key: string, value: any) {
        return await this.cacheManager.set(key, value, { ttl: 0 });
    }

    async del(key: string) {
        return await this.cacheManager.del(key);
    }
}
