import { LRUCache } from "lru-cache";

const DEFAULT_MAX = 500;

type CachedArtifact = { html: string };

let _cache: LRUCache<string, CachedArtifact> | null = null;

function resolveMaxSize() {
  const raw = process.env.ARTIFACT_CACHE_MAX;
  if (!raw) {
    return DEFAULT_MAX;
  }

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MAX;
}

export function getArtifactCache() {
  if (!_cache) {
    _cache = new LRUCache<string, CachedArtifact>({
      max: resolveMaxSize(),
    });
  }

  return _cache;
}

export function getCachedArtifact(uniquecode: string) {
  return getArtifactCache().get(uniquecode);
}

export function setCachedArtifact(uniquecode: string, html: string) {
  getArtifactCache().set(uniquecode, { html });
}

export function deleteCachedArtifact(uniquecode: string) {
  getArtifactCache().delete(uniquecode);
}
