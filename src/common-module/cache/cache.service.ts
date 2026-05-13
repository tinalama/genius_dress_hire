import { Injectable, Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  /**
   * Generate dynamic cache key from prefix and params
   */
  generateKey(prefix: string, params: Record<string, unknown>): string {
    const sortedParams = Object.keys(params)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => `${key}:${JSON.stringify(params[key])}`)
      .join(':');
    return `${prefix}:${sortedParams}`;
  }

  /**
   * Get cached data
   */
  async get<T>(key: string): Promise<T | undefined> {
    try {
      const data = await this.redisClient.get(key);
      if (data !== null) {
        this.logger.debug(`Cache hit for key: ${key}`);
        return JSON.parse(data) as T;
      }
      this.logger.debug(`Cache miss for key: ${key}`);
      return undefined;
    } catch (error) {
      this.logger.error(`Error getting cache for key ${key}:`, error);
      return undefined;
    }
  }

  /**
   * Set cached data with TTL (in seconds)
   */
  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      const ttlSeconds = ttl ?? 300;
      await this.redisClient.setex(key, ttlSeconds, serializedValue);
      this.logger.debug(`Cache set for key: ${key}, TTL: ${ttlSeconds}s`);
    } catch (error) {
      this.logger.error(`Error setting cache for key ${key}:`, error);
    }
  }

  /**
   * Delete cache by key
   */
  async del(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
      this.logger.debug(`Cache deleted for key: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting cache for key: ${key}`, error);
    }
  }

  /**
   * Delete all cache keys matching a pattern (e.g. "companies:find-all:list:*").
   * Uses Redis KEYS command to find matching keys, then deletes them.
   */
  async delByPattern(pattern: string): Promise<number> {
    try {
      const keys = await this.redisClient.keys(pattern);
      if (keys.length === 0) return 0;

      await this.redisClient.del(...keys);
      this.logger.debug(
        `Cache deleted ${keys.length} keys matching pattern: ${pattern}`
      );
      return keys.length;
    } catch (error) {
      this.logger.error(`Error deleting cache by pattern ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * Get current version for a namespace
   * Returns 0 if not exists
   */
  async getCurrentVersion(namespace: string): Promise<number> {
    try {
      const versionKey = `cache:version:${namespace}`;
      const version = await this.redisClient.get(versionKey);
      return version ? Number.parseInt(version) : 0;
    } catch (error) {
      this.logger.error(
        `Error getting version for namespace ${namespace}:`,
        error
      );
      return 0;
    }
  }

  /**
   * Increment version for a namespace using Redis INCR
   * This is atomic and thread-safe
   * Returns the new version number
   */
  async incrementVersion(namespace: string): Promise<number> {
    try {
      const versionKey = `cache:version:${namespace}`;
      const newVersion = await this.redisClient.incr(versionKey);
      this.logger.debug(
        `Version incremented for namespace ${namespace}: ${newVersion}`
      );
      return newVersion;
    } catch (error) {
      this.logger.error(
        `Error incrementing version for namespace ${namespace}:`,
        error
      );
      return 0;
    }
  }

  /**
   * Build a versioned cache key
   * Format: namespace_identifier:version
   * Example: permission_role_1:v3
   */
  async buildVersionedKey(
    namespace: string,
    identifier: string
  ): Promise<string> {
    const currentVersion = await this.getCurrentVersion(namespace);
    return `${namespace}_${identifier}:v${currentVersion}`;
  }

  /**
   * Get versioned cached data
   * Automatically builds versioned key and retrieves data
   */
  async getVersioned<T>(
    namespace: string,
    identifier: string
  ): Promise<T | undefined> {
    const versionedKey = await this.buildVersionedKey(namespace, identifier);
    return this.get<T>(versionedKey);
  }

  /**
   * Set versioned cached data with TTL (in seconds)
   * Automatically builds versioned key and stores data
   */
  async setVersioned(
    namespace: string,
    identifier: string,
    value: unknown,
    ttl?: number
  ): Promise<void> {
    const versionedKey = await this.buildVersionedKey(namespace, identifier);
    await this.set(versionedKey, value, ttl);
  }

  /**
   * Get all keys for a namespace (across all versions)
   * Pattern:	namespace_*:v*
   */
  async getAllKeysForNamespace(namespace: string): Promise<string[]> {
    try {
      const pattern = `${namespace}_*:v*`;
      return await this.redisClient.keys(pattern);
    } catch (error) {
      this.logger.error(
        `Error getting keys for namespace ${namespace}:`,
        error
      );
      return [];
    }
  }

  /**
   * Clean up old cache keys for a namespace
   * Keeps only the current version
   */
  async cleanOldVersions(namespace: string): Promise<number> {
    try {
      const currentVersion = await this.getCurrentVersion(namespace);
      const keys = await this.getAllKeysForNamespace(namespace);

      let deletedCount = 0;

      for (const key of keys) {
        const keyVersion = this.extractVersionFromKey(key);
        if (keyVersion !== null && keyVersion < currentVersion) {
          await this.del(key);
          deletedCount++;
        }
      }

      if (deletedCount > 0) {
        this.logger.debug(
          `Cleaned up ${deletedCount} old version keys for namespace ${namespace}`
        );
      }

      return deletedCount;
    } catch (error) {
      this.logger.error(
        `Error cleaning old versions for namespace ${namespace}:`,
        error
      );
      return 0;
    }
  }

  /**
   * Extract version number from versioned key
   */
  private extractVersionFromKey(key: string): number | null {
    const versionPattern = /v(\d+)$/;
    const match = versionPattern.exec(key);
    return match ? Number.parseInt(match[1]) : null;
  }
}
